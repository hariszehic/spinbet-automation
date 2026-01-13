export class TermsAndConditionsPage{
    
    constructor(page) {
        this.page = page;
        
        this.termsAndConditionsHeader = page.getByRole('heading', { name: 'Policies & Info' });
        this.downloadPdfLink = page.getByRole('link', { name: 'Download PDF' });
        this.termsAndConditionsContainer = page.locator('.scrollbar.css-cx87ru');
        this.acceptButton = page.getByRole('button', { name: 'Accept' });
    }

    async clickAcceptButton() {
        await this.acceptButton.click();
    }

    async scrollTermsAndConditions() {
        await this.termsAndConditionsContainer.evaluate(el => {
            el.scrollTop = el.scrollHeight;
        });
    }
}