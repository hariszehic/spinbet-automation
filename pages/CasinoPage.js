import { makeApiCallWithClick } from "../utils/apiHelpers";
import { GAMES } from "../utils/testData";

export class CasinoPage {
    constructor(page) {
        this.page = page;

        this.searchButton = page.getByTestId('search-button');
        this.searchField = page.getByRole('textbox', { name: 'Search' });
        this.closeSearchModalButton = page.locator('.popup-header-content button.css-lpstta');
        this.nextSlideButton = page.getByRole('button', { name: 'Next slide' });
        this.previousSlideButton = page.getByRole('button', { name: 'Previous slide' });
        this.demoButton = page.getByRole('link', { name: 'Demo' });
        this.playNowButton = page.getByRole('link', { name: 'Play now' });
        this.clearSearchFieldButton = page.locator('.input-container button.css-lpstta');
        this.gameFrame = page.frameLocator("iframe[name='game-launcher-by-url']").locator('canvas');
        this.noResultsFoundMessage = page.getByText('No results found');
        this.gameResultTile = page.locator('.slide-game-item');
    }

    gameInFavoritesSection(gameName) {
        return this.page.locator('#favorite-games-section').locator(`[aria-label="${gameName}"]`);
    }

    exactGame(gameName) {
        return this.page.getByRole('link', { name: gameName, exact: true })
    }

    favoriteGameButton(gameName) {
        return this.page.getByRole('link', { name: gameName, exact: true }).getByRole('button')
    }

    gameSearchResult(gameName) {
        return this.page.getByRole('link', { name: gameName, exact: true })
    }

    async navigate() {
        await this.page.goto('/casino');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickSearchButton() {
        await this.searchButton.click();
    }

    async clickCloseSearchModalButton() {
        await this.closeSearchModalButton.click();
    }

    async clearSearchField() {
        await this.clearSearchFieldButton.click();
    }

    async clickNextSlideButton() {
        await this.nextSlideButton.click();
    }

    async clickPreviousSlideButton() {
        await this.previousSlideButton.click();
    }

    async favoriteGame(gameName) {
        await this.hoverOnGame(gameName);
        await this.favoriteGameButton(gameName).click();
    }

    async enterGameInSearchField(gameName) {
        await this.searchField.fill(gameName);
    }

    async searchForText(text) {
        await this.clickSearchButton();
        await this.enterGameInSearchField(text);
    }

    async hoverOnGame(gameName) {
        await this.exactGame(gameName).hover();
    }

    async startGame(gameName) {
        return makeApiCallWithClick(`/player/api/v1/games/${gameName}/launch`, 'GET', 200, this.playNowButton, this.page)
    }
}