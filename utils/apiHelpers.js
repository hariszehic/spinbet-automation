import { request } from '@playwright/test';

export async function makeApiCallWithClick(endpoint, method, statusCode, clickElement, page) {
const [response] = await Promise.all([
        page.waitForResponse(response => 
            response.url().includes(endpoint) &&
            response.request().method() === method &&
            response.status() === statusCode
        ),
        clickElement.click(),
    ]);
    return response;
}

export function waitForApiCall(endpoint, method, statusCode, page) {
    return page.waitForResponse(response => 
            response.url().includes(endpoint) &&
            response.request().method() === method &&
            response.status() === statusCode
        );
}

export async function apiCalledCheck(endpoint, method, page) {
    try {
        await page.waitForResponse(
            response =>
                response.url().includes(endpoint) &&
                response.request().method() === method,
            { timeout: 10_000 }
        );
        return true; 
    } catch {
        return false; 
    }
}

export async function signUpUserViaApi(user) { //Hard-coded fields may be converted to be more flexible for future use
    const apiContext = await request.newContext({
        baseURL: 'https://spinbet-staging-api.sgldemo.xyz'
    });
    const payload = {
        email: user.email,
        username: user.userName,
        password: user.password,
        terms: 1,
        language: 'en-NZ',
        query_string: 'affiliateId=471',
        signup_url: 'https://stage.spinbet.com/en-nz/?overlay=account-details',
        referrer: 'https://stage.spinbet.com/en-nz/?overlay=terms-and-conditions',
        promo_code: 'WO1DB',
        welcome_promo_code: 'WO1DB',
        country_id: '158',
        phone_number: `+1${user.phoneNumber}`,
        preferred_currency: 'NZD',
        subscribe_promotion_campaign: false,
    };

    const response = await apiContext.post('/player/api/v1/signup', { data: payload });

    if (!response.ok()) {
        const text = await response.text();
        throw new Error(`Signup API failed with status ${response.status} - ${text}`);
    }

    const responseBody = await response.json();
    user.token = responseBody.token;

    return user;
}