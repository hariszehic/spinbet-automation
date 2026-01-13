import { apiCalledCheck, makeApiCallWithClick } from '../utils/apiHelpers';

export class RegistrationPage {
    
    constructor(page) {
        this.page = page;

        this.usernameField = page.getByPlaceholder('e.g. John Doe');
        this.emailField = page.getByPlaceholder('your@email.address');
        this.passwordField = page.getByRole('textbox', { name: 'Min 6 characters' });
        this.dialCodeDropdown = page.locator("[role='combobox'][id^='dial_code']");
        this.dialCodeDropdownText = page.locator("[id^='dial_code'] span");
        this.phoneNumberField = page.getByTestId('phone_number');
        this.referralCodeField = page.getByPlaceholder('Type it here');
        this.nextButton = page.getByTestId('next-button');
        this.revealPasswordButton = page.locator("[aria-label*='Toggle Password']");
        
        this.welcomeOffer = page.getByText('Welcome Offer 1: 100% Deposit bonus up to $2000 Test');
        this.bonusSelectedRadioButton = page.locator('.Mui-checked.MuiRadio-root');
        this.promoCodeField = page.locator("[name='promo_code']");
        this.exclusiveOffersCheckBox = page.getByRole('checkbox', { name: 'Get Exclusive Updates' });
        this.termsOfConditionsLink = page.getByRole('link', { name: 'Terms of Conditions' });
        this.termsOfConditionsCheckBox = page.getByRole('checkbox', { name: 'I agree and understand the' });
        this.submitNextButton = page.getByRole('button', { name: 'Next' });
        this.iDontWantABonusButton = page.getByRole('button', { name: "I don't want a bonus" });

        this.invalidPromotionCodeMessage = page.getByText('Invalid promotion code.');
        this.firstNameField = page.getByRole('textbox', { name: 'First Name' });
        this.lastNameField = page.getByRole('textbox', { name: 'Last Name' });
        this.dateOfBirthField = page.getByRole('textbox', { name: 'DD/MM/YYYY' });
        this.minorAgeMessage = page.getByText("You must be at least 18 years old.");

        this.addressField = page.getByRole('textbox', { name: 'Address' });
        this.cityField = page.getByRole('textbox', { name: 'City' });
        this.regionDropdown = page.getByRole('combobox', { name: 'Region' });
        this.zipCodeField = page.getByRole('textbox', { name: 'Zip Code' });
        this.backButton = page.getByTestId('back-button-id');

        this.creditCardOption = page.getByText('Credit Card');
        this.showLessPaymentsButton = page.getByText('Show Less Payments');
        this.showMorePaymentsButton = page.getByText('Show More Payments');
        this.cashierFrame = page.frameLocator('#cashierIframe');
        this.cardFieldsFrame = this.cashierFrame.frameLocator('#hosted-field-single-iframe');
        this.amountField = this.cashierFrame.locator("[name='setAmount']");
        this.creditCardNameField = this.cardFieldsFrame.getByRole('textbox', { name: "Name" });
        this.cardNumberField = this.cardFieldsFrame.getByRole('textbox', { name: "Card number" });
        this.expirationField = this.cardFieldsFrame.locator("[name='cc-exp']");
        this.securityCodeField = this.cardFieldsFrame.getByRole('textbox', { name: "Security Code" });
        this.depositButton = this.cashierFrame.getByRole('button', { name: 'Deposit' });
    }

    getDialCodeOption(dialCode) {
        return this.page.getByRole('option', { name: `flag ${dialCode}` })
    }

    getRegionOption(regionName) {
        return this.page.getByRole('option', { name: regionName })
    }

    async isDialCodeVisible(dialCode) {
        const text = await this.dialCodeDropdownText.textContent();
        return text?.trim() === dialCode;
    }

    async clickRevealPasswordButton() {
        await this.revealPasswordButton.click();
    }

    async clickNextButton() {
        await this.nextButton.click();
    }

    async changeExclusiveOffersCheckBox() {
        await this.exclusiveOffersCheckBox.click();
    }

    async changeTermsOfConditionsCheckBox() {
        await this.termsOfConditionsCheckBox.click();
    }

    async clickSubmitNextButton() {
        await this.submitNextButton.click();
    }

    async clickShowMorePaymentsButton() {
        await this.showMorePaymentsButton.click();
    }

    async clickDepositButton() {
        await this.depositButton.click();
    }

    async clickBackButton() {
        await this.backButton.click();
    }

    async clickPhoneNumberField() {
        await this.phoneNumberField.click({ delay: 1000 });
    }

    async fillUsername(username) {
        await this.usernameField.fill(username);
    }

    async fillEmail(email) {
        await this.emailField.fill(email);
    }

    async fillPassword(password) {
        await this.passwordField.fill(password);
    }

    async fillPromoCode(promoCode) {
        await this.promoCodeField.fill(promoCode);
    }

    async fillFirstName(firstName) {
        await this.firstNameField.fill(firstName);
    }

    async fillLastName(lastName) {
        await this.lastNameField.fill(lastName);
    }

    async fillAddressField(address) {
        await this.addressField.fill(address);
    }

    async fillCityField(city) {
        await this.cityField.fill(city);
    }

    async fillZipCodeField(zipCode) {
        await this.zipCodeField.fill(zipCode.toString());
    }

    async fillAmountField(amount) {
        await this.amountField.fill(amount.toString());
    }

    async fillCreditCardNameField(name) {
        await this.creditCardNameField.fill(name);
    }

    async fillCardNumberField(cardNumber) {
        await this.cardNumberField.fill(cardNumber);
    }

    async fillExpirationDateField(expirationDate) {
        await this.expirationField.fill(expirationDate);
    }

    async fillSecurityCodeField(securityCode) {
        await this.securityCodeField.fill(securityCode);
    }

    async fillDateOfBirthField(dateOfBirth) {
        let counter = 0;
        
        while(counter < 10) {
        const [day, month, year] = dateOfBirth.split('/');
        await this.dateOfBirthField.click({ clickCount: 3 }); 
        await this.dateOfBirthField.pressSequentially(day, { delay: 400 });
        await this.dateOfBirthField.pressSequentially(month, { delay: 400 });
        await this.dateOfBirthField.pressSequentially(year, { delay: 400 });

        const currentValue = await this.dateOfBirthField.inputValue();

            if(currentValue === dateOfBirth) {
                return;
            }

            counter++;
        }
        throw new Error(`Failed to fill date of birth correctly after ${counter} attempts`);
    }

    async fillPhoneNumberField(dialCode, phoneNumber) {
        let counter = 0;

        while(counter < 10) {
            if(!(await this.isDialCodeVisible(dialCode))) {
                await this.changeDialCode(dialCode);
            }

            await this.phoneNumberField.fill('');
            await this.phoneNumberField.pressSequentially(phoneNumber, { delay: 100 });

            const currentValue = (await this.phoneNumberField.inputValue()).replace(/\D/g, '');

            if(currentValue === phoneNumber) {
                return;
            }

            counter++;
        }
        throw new Error(`Failed to fill phone number correctly after ${counter} attempts`);
    }

    async changeDialCode(dialCode) { //the dial code dropdown has a lag when accessed through automation, the delay resolves it 
        await this.dialCodeDropdown.click({ delay: 2000 });
        await this.getDialCodeOption(dialCode).click({ delay: 1000 });
    }

    async openTermsAndConditions() {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.termsOfConditionsLink.click(),
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        return newPage;
    }

    async selectRegion(regionName) {
        await this.regionDropdown.click();
        await this.getRegionOption(regionName).click();
    }

    async submitRegistration() {
        return makeApiCallWithClick('/player/api/v1/signup', 'POST', 200, this.iDontWantABonusButton, this.page);
    }

    async submitPersonalInformation() {
        return makeApiCallWithClick('/player/api/v1/kyc-requests', 'POST', 200, this.submitNextButton, this.page);
    }

    async selectCreditCardPaymentOption() {
        return makeApiCallWithClick('/player/api/v1/kyc-levels-relation', 'GET', 200, this.creditCardOption, this.page);
    }

    async registrationCalledCheck() {
        return await apiCalledCheck('/player/api/v1/signup', 'POST', this.page);
    }
}