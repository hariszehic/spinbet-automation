import { test, expect } from '@playwright/test';
import { MainViewPage } from '../pages/MainViewPage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { TermsAndConditionsPage } from '../pages/TermsAndConditionsPage';
import { generateUser } from '../utils/userGenerator';
import { generatePromoCode } from '../utils/promoCodeGenerator';
import { waitForApiCall } from "../utils/apiHelpers";
import { getNZPhoneNumber } from '../utils/userGenerator';

let mainViewPage;

test.beforeEach(async ({ page }) => {
    mainViewPage = new MainViewPage(page);

    await mainViewPage.navigate();
    await mainViewPage.clickSignUpButton();
});

// This test covers the full multi-step registration flow:
// 1. Fill registration details
// 2. Select welcome offer, check Terms & Conditions in a new page and accept them afterwards
// 3. API verification that the registration was successful
// 4. Fill personal info and DOB
// 5. Fill address info and submit personal information
// 6. API verification of personal information creation
// 7. Select credit card payment option
// 8. Fill deposit details, validate deposit via API, and verify success message
// End point: ensure the new Terms & Conditions modal is visible
test('Verification that a user can register successfully', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    const user = generateUser();

    //Registration Step: 1
    await expect(registrationPage.nextButton).toBeDisabled();

    await registrationPage.fillUsername(user.userName);
    await registrationPage.fillEmail(user.email);
    await registrationPage.fillPassword(user.password);
    await expect(registrationPage.passwordField).toHaveAttribute('type', 'password');
    await registrationPage.clickRevealPasswordButton();
    await expect(registrationPage.passwordField).toHaveAttribute('type', 'text');
    await registrationPage.fillPhoneNumberField('+1', user.phoneNumber);
    await expect(registrationPage.referralCodeField).toHaveValue("");
    console.log('Generated username and email:', user.userName, user.email);
    await registrationPage.clickNextButton();

    //Registration Step: 2
    await expect(registrationPage.welcomeOffer).toBeVisible();
    await expect(registrationPage.bonusSelectedRadioButton).toBeVisible();
    await expect(registrationPage.submitNextButton).toBeDisabled();
    await registrationPage.changeExclusiveOffersCheckBox();
    const newPage = await registrationPage.openTermsAndConditions();
    const termsAndConditionsPage = new TermsAndConditionsPage(newPage);
    await expect(termsAndConditionsPage.termsAndConditionsHeader).toBeVisible();
    await newPage.close();
    await registrationPage.changeTermsOfConditionsCheckBox();

    const registrationResponse = await registrationPage.submitRegistration();
    expect(registrationResponse.ok()).toBeTruthy();
    expect(await registrationResponse.json()).toHaveProperty('token');

    //Registration Step: 3
    await registrationPage.fillFirstName(user.firstName);
    await registrationPage.fillLastName(user.firstName);
    await registrationPage.fillDateOfBirthField(user.dateOfbirth);
    await registrationPage.clickSubmitNextButton();

    await registrationPage.clickBackButton();
    await registrationPage.fillLastName(user.lastName);
    await registrationPage.clickSubmitNextButton();

    //Registration Step: 4
    await registrationPage.fillAddressField(user.address);
    await registrationPage.fillCityField(user.city);
    await registrationPage.selectRegion(user.region);
    await registrationPage.fillZipCodeField(user.zipCode);

    const personalInformationResponse = await registrationPage.submitPersonalInformation();
    expect(personalInformationResponse.ok()).toBeTruthy();
    const infoResponseBody = await personalInformationResponse.json();
    expect(infoResponseBody.last_name).toBe(user.lastName);
    console.log('User id: ', infoResponseBody.id);

    //Registration Step: 5
    await expect(registrationPage.creditCardOption).toBeVisible();
    await expect(registrationPage.showLessPaymentsButton).toHaveCount(0);
    await expect(registrationPage.showMorePaymentsButton).toHaveCount(1);
    await registrationPage.clickShowMorePaymentsButton();
    await expect(registrationPage.showLessPaymentsButton).toHaveCount(1);
    await expect(registrationPage.showMorePaymentsButton).toHaveCount(0);

    const creditCardOptionResponse = await registrationPage.selectCreditCardPaymentOption();
    expect(creditCardOptionResponse.ok()).toBeTruthy();
    const cardResponseBody = await creditCardOptionResponse.json();
    expect(cardResponseBody).toHaveLength(4);

    const amountValue = Math.floor(Math.random() * 997) + 2;
    console.log('Deposited amount: ', amountValue);
    await registrationPage.fillAmountField(amountValue);
    await registrationPage.fillCreditCardNameField(user.cardName);
    await registrationPage.fillCardNumberField(user.cardNumber);
    await registrationPage.fillExpirationDateField(user.cardExpirationDate);
    await registrationPage.fillSecurityCodeField(user.cardCvv);

    const validateDeposit = waitForApiCall('/creditcard/deposit/validate', 'POST', 200, page);
    const deposits = waitForApiCall('/player/api/v1/deposits', 'GET', 200, page);
    await registrationPage.clickDepositButton()
    const [validateDepositResponse, depositsResponse] = await Promise.all([validateDeposit, deposits]);
    expect(validateDepositResponse.ok()).toBeTruthy();
    const depositsResponseBody = await depositsResponse.json();
    expect(Number(depositsResponseBody.data[0].amount)).toBe(amountValue);

    await expect(mainViewPage.depositSuccessMessage).toBeVisible();
    await expect(mainViewPage.newTermsAndConditionsModal).toBeVisible();
});

// This test verifies the negative registration scenarios:
// 1. User enters an invalid promotion code and receives the appropriate validation message.
// 2. User enters a date of birth indicating they are underage (minor)
// End point: 
//   - The registration API is NOT called.
//   - The minor age warning message is displayed.
//   - The 'Next' button remains disabled to prevent submission.
test('Verification of invalid promocode message and underage date of birth', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    const user = generateUser();

    await registrationPage.fillUsername(user.userName);
    await registrationPage.fillEmail(user.email);
    await registrationPage.fillPassword(user.password);
    
    await registrationPage.fillPhoneNumberField('+64', getNZPhoneNumber());
    console.log('Generated username and email:', user.userName, user.email);
    await registrationPage.clickNextButton();

    const promoCode = generatePromoCode();
    console.log('Generated promo code:', promoCode);
    await registrationPage.fillPromoCode(promoCode);
    await registrationPage.changeTermsOfConditionsCheckBox();
    await registrationPage.clickSubmitNextButton();

    await expect(registrationPage.invalidPromotionCodeMessage).toBeVisible({ timeout: 30_000 });
    await registrationPage.fillFirstName(user.firstName);
    const now = new Date();
    const currentYear = now.getFullYear(); 
    const minorDateOfBirth = `12/12/${currentYear - 15}`;
    await registrationPage.fillDateOfBirthField(minorDateOfBirth);
    await registrationPage.fillLastName(user.lastName);
    await expect(registrationPage.invalidPromotionCodeMessage).toHaveCount(0);
    const apiCalledCheck = await registrationPage.registrationCalledCheck();
    expect(apiCalledCheck).toBeFalsy();
    await expect(registrationPage.minorAgeMessage).toBeVisible();
    await expect(registrationPage.submitNextButton).toBeDisabled();
});