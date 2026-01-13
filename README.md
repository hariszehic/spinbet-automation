# Spinbet QA Automation Challenge

## Project Overview
This repository contains an automated end-to-end test solution created as part of a QA coding challenge. The goal of the project is to validate critical user flows on the Spinbet staging platform with a strong focus on reliability, maintainability and production-ready approach. 

The framework itself is structured in a way to support long-term maintenance, scalability and best practices which are commonly used in real-world production environments.

## Problem Description
The focus of this challenge is on implementing automated tests that validate key user-facing functionalities on the Spinbet website.

Specifically, the following areas require coverage:
   - Verification of the user registration process, to ensure that new users can sign up successfully and that invalid input is handled correctly
   - Verification of the platform's game search functionality, which ensures that users can find expected games via search, open them, and confirm that the game loads as expected

These areas are covered because of their critical role in user satisfaction, as they represent the main entry point and one of the core functionalities of the platform.

## Solution Overview
The solution is based on automated end-to-end tests that simulate real user interactions with the platform. The focus is on validating complete user journeys rather than specific components, ensuring that entire flows behave as expected from a user perspective.

For scenarios that require an authenticated user, test users are created via API before continuing with UI-based validation. This helps reduce test flakiness and keeps the tests
focused on the functionality being verified.

For each feature, there are positive and negative scenarios covered. While positive scenarios validate the whole user journey when they register or search for a game, negative scenarios were chosen as one of the most important negative scenarios to be covered. The test suite is intentionally kept focused and maintainable, prioritizing reliability and
clarity over excessive test coverage.

## Reasoning Behind Technical Choices
- **Playwright** was chosen over Cypress because it provides better support for multiple browser contexts, reliable cross-browser testing, and easier handling of modern web applications. Its built-in support for both UI and API testing made it a better fit for scenarios where we wanted to combine API-assisted user creation with UI validation.
- **API-assisted user creation** is used to set up test users quickly, reducing repetitive UI steps and as a scalable solution for user creation.  
- **Positive and negative scenarios** were included to cover both the expected flows and important negative cases.  
- **Page Object Model (POM)** was used to separate UI interactions from test logic, making tests easier to read and maintain.  
- **Utility functions** are used to centralize common operations like API calls, test data generation, and user creation, keeping the tests clean, reusable, and easy to maintain.
- **Assertions on both UI and API** ensure that operations, especially crucial operations like deposits, succeed both on backend and the UI. 
- **Focused test coverage** was prioritized over testing everything, to keep the suite stable, maintainable, and production-ready.

## How to Use This Repository
1. Install Git if not already installed: https://git-scm.com/install/  
2. Install Node.js LTS version if not already installed: https://nodejs.org/en/download/  
3. Clone the repository: git clone https://github.com/hariszehic/spinbet-automation.git
4. Navigate to the project folder: cd spinbet-automation
5. Install dependencies: npm install
6. Install Playwright browsers (needed for UI tests): npx playwright install
7. Run all tests: npx playwright test
8. (Optional) Run tests on only one browser: npx playwright test --project=chromium
9. (Optional) Run a single test file: npx playwright test ./tests/userRegistration.spec.js

## Test Scope and Coverage

### Registration Flow
Positive scenario:
  - Full multi-step registration for new users via UI
  - Terms & Conditions acceptance
  - Personal info and address submission
  - API verification for user creation and personal information
  - Credit card deposit validation

Negative scenario:
  - Invalid promo code triggers proper validation message
  - Underage date of birth blocks registration
  - Registration API is not called for invalid submissions

### Casino Game Search
Positive scenario:
  - API user creation
  - Login and acceptance of Terms and Conditions
  - Search for a specific game (e.g., Sweet Bonanza)
  - Verify game is not in Favorites initially, then add to Favorites
  - Validate search results and UI elements (buttons), clear search validation
  - Start game and confirm correct game loads (API response, URL, game frame visibility)

Negative scenario:
  - Search with invalid text returns no results message
  - No game tiles are displayed when search returns no matches

### Out of Scope
- Email verification after registration
- Payment flows beyond credit card deposit
- Load or performance testing
- Full regression of all visible UI elements, and their states (blank required fields etc.)
