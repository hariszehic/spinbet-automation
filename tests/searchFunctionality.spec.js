import { test, expect } from '@playwright/test';
import { signUpUserViaApi } from '../utils/apiHelpers';
import { generateUser } from '../utils/userGenerator';
import { MainViewPage } from '../pages/MainViewPage';
import { CasinoPage } from '../pages/CasinoPage';
import { GAMES } from '../utils/testData';
import { TermsAndConditionsPage } from '../pages/TermsAndConditionsPage';

let user;

test.beforeEach(async () => {
    user = await signUpUserViaApi(generateUser());
    expect(user.token).not.toBe('');
    console.log('User email and password: ', user.email, user.password);
});

// This test verifies the full game-search functionality on the platform:
// 1. Sign up a new user via API and log in through the UI.
// 2. Navigate to the Casino page and accept terms and conditions.
// 3. Verify that a specific game (Sweet Bonanza) is initially not in the Favorites section.
// 4. Search for the game, add it to Favorites, and confirm it appears there.
// 5. Use the search field to find the game, verify search results, clear the search, and confirm results disappear.
// 6. Hover over the game to check demo button visibility.
// End point: Start the game and validate that the correct game loads by checking API response, URL, and game frame visibility.
test('Verification of platform search functionality', async ({ page }) => {
    const mainViewPage = new MainViewPage(page);
    const casinoPage = new CasinoPage(page);
    const termsAndConditionsPage = new TermsAndConditionsPage(page);

    await mainViewPage.navigate();
    const loginResponse = await mainViewPage.login(user);
    expect(loginResponse.ok()).toBeTruthy();
    expect(await loginResponse.json()).toHaveProperty('token');
    
    await casinoPage.navigate();
    await expect(termsAndConditionsPage.downloadPdfLink).toBeVisible({ timeout: 30_000 });
    await termsAndConditionsPage.scrollTermsAndConditions();
    await termsAndConditionsPage.clickAcceptButton();

    await expect(casinoPage.gameInFavoritesSection(GAMES.SWEET_BONANZA.name)).not.toBeVisible();
    await casinoPage.clickSearchButton();
    await casinoPage.enterGameInSearchField(GAMES.SWEET_BONANZA.name);
    await expect(casinoPage.previousSlideButton).toBeDisabled();
    await casinoPage.clickNextSlideButton();
    await casinoPage.clickPreviousSlideButton();
    await casinoPage.favoriteGame(GAMES.SWEET_BONANZA.name);
    await casinoPage.clickCloseSearchModalButton();
    await expect(casinoPage.searchField).not.toBeVisible();
    await expect(casinoPage.gameInFavoritesSection(GAMES.SWEET_BONANZA.name)).toBeVisible();

    await casinoPage.searchForText(GAMES.SWEET_BONANZA.name);
    await expect(casinoPage.gameSearchResult(GAMES.SWEET_BONANZA.name)).toBeVisible();
    await casinoPage.clearSearchField();
    await expect(casinoPage.gameSearchResult(GAMES.SWEET_BONANZA.name)).not.toBeVisible();
    await casinoPage.enterGameInSearchField(GAMES.SWEET_BONANZA.name);
    await expect(casinoPage.gameResultTile).not.toHaveCount(0);
    await casinoPage.hoverOnGame(GAMES.SWEET_BONANZA.name);
    await expect(casinoPage.demoButton).toBeVisible();

    const gameResponse = await casinoPage.startGame(GAMES.SWEET_BONANZA.slug);
    expect(gameResponse.ok()).toBeTruthy();
    const gameResponseBody = await gameResponse.json();
    expect(gameResponseBody.game_slug).toBe(GAMES.SWEET_BONANZA.slug);
    await expect(page).toHaveURL(`/casino-game/${GAMES.SWEET_BONANZA.slug}/`);
    await expect(await casinoPage.gameFrame).toBeVisible({ timeout: 30_000 });
});

// This test verifies the search functionality when invalid text is entered:
// 1. Sign up a new user via API and log in through the UI.
// 2. Navigate to the Casino page and accept terms and conditions.
// 4. Search for text that is not a game name
// End point: Verification that correct message is returned
test('Verification of no search results functionality', async ({ page }) => {
    const mainViewPage = new MainViewPage(page);
    const casinoPage = new CasinoPage(page);
    const termsAndConditionsPage = new TermsAndConditionsPage(page);

    await mainViewPage.navigate();
    const loginResponse = await mainViewPage.login(user);
    expect(loginResponse.ok()).toBeTruthy();
    expect(await loginResponse.json()).toHaveProperty('token');
    
    await casinoPage.navigate();
    await expect(termsAndConditionsPage.downloadPdfLink).toBeVisible({ timeout: 30_000 });
    await termsAndConditionsPage.scrollTermsAndConditions();
    await termsAndConditionsPage.clickAcceptButton();

    await casinoPage.searchForText('test123');
    await expect(casinoPage.noResultsFoundMessage).toBeVisible();
    await expect(casinoPage.gameResultTile).toHaveCount(0);
});