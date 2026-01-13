import { makeApiCallWithClick } from "../utils/apiHelpers";

export class MainViewPage {
    
    constructor(page) {
        this.page = page;

        this.signUpButton = page.getByRole('button', { name: 'Sign Up' });
        this.newTermsAndConditionsModal = page.getByText('New Terms and Conditions');
        this.depositSuccessMessage = page.getByText('Your deposit has been settled successfully. Enjoy the games.');

        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.usernameOrEmailField = page.getByPlaceholder('e.g. John Doe');
        this.passwordField = page.getByPlaceholder('Min 6 characters');
        this.signInButton = page.getByRole('button', { name: 'Sign In' });
    }
    
    async navigate() {
        await this.page.goto('/');
    }

    async clickSignUpButton() {
        await this.signUpButton.click();
    }

    async login(user) {
        await this.loginButton.click();
        await this.usernameOrEmailField.fill(user.email);
        await this.passwordField.fill(user.password);
        return makeApiCallWithClick('/player/api/v1/signin', 'POST', 200, this.signInButton, this.page);
    }
}