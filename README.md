# checkers-ui-tests

Checkers UI Tests
This project contains automated UI tests for the Checkers game at https://www.gamesforthebrain.com/game/checkers/, converted from Cypress to Playwright and Jest. The tests verify page navigation and gameplay interactions, including making five orange moves (only when "Make a move." is displayed), capturing a blue piece, and restarting. The project uses a Page Object Model (POM) for maintainability, supports multiple environments (dev, prod), website availability checks, and Azure DevOps reporting. Suggested test scenarios, including a Double King case, are documented in suggestions.csv.
Project Structure
checkers-ui-tests/
├── data/
│   ├── users.json              # User data (emails for authentication, if needed)
│   ├── checkers-moves.json     # Move data for gameplay tests with multiple scenarios
├── tests/
│   ├── ui-tests.spec.js        # UI tests converted from Cypress
├── pages/
│   ├── CheckersPage.js         # Page Object Model for Checkers UI
├── utils/
│   ├── auth.js                 # Helper for generating auth tokens (if needed)
├── .env.dev                    # Environment variables for dev
├── .env.prod                   # Environment variables for prod
├── .gitignore                  # Git ignore rules
├── azure-pipelines.yml         # Azure DevOps pipeline configuration
├── jest.config.js              # Jest configuration
├── package.json                # Project dependencies and scripts
├── playwright.config.js        # Playwright configuration
├── test-cases.csv              # Implemented test case documentation
├── suggestions.csv             # Suggested test scenarios
├── README.md                   # This file
├── checkers-ui-tests.code-workspace # Workspace settings

Prerequisites

Node.js: Version 18.x or higher
Git: For version control
Visual Studio Code: Recommended IDE
Excel/Google Sheets: To view test-cases.csv and suggestions.csv

Setup Instructions

Clone the Repository:
git clone https://github.com/your-username/checkers-ui-tests.git
cd checkers-ui-tests


Install Dependencies:
npm install


Install Playwright Browsers:
npx playwright install --with-deps


Configure Environment Variables:

Copy .env.dev and .env.prod to set up environment-specific configurations.
Update .env.prod with your actual production UI URLs and credentials if available.
Example .env.dev:HOST_URL=https://www.gamesforthebrain.com/game/checkers/
AUTH_URL=https://www.gamesforthebrain.com/login
USER1_PASSWORD=password123
USER2_PASSWORD=password456
JWT_SECRET=mock-secret




Import Test Cases and Suggestions:

Open test-cases.csv and suggestions.csv in Excel or Google Sheets.
Save as test-cases.xlsx or suggestions.xlsx if desired.



Running Tests
Tests are organized into dev and prod environments, with a website availability check to ensure HOST_URL is up before execution. Orange moves are only made when the UI displays "Make a move.".
Run All Tests

Dev Environment:
npm run test:dev

Or:
npx playwright test --project=dev


Prod Environment:
npm run test:prod

Or:
npx playwright test --project=prod



Website Availability Check
Before running tests, the project checks if the UI (HOST_URL) is up by sending a GET request to the base URL. If the website is down (non-200 status or network error), tests are skipped, and a message is logged:
Website https://www.gamesforthebrain.com/game/checkers/ is down, skipping tests

Test Case Documentation

test-cases.csv: Documents implemented test cases (UI1, UI2). Columns include:

Test ID: Unique identifier (e.g., UI1)
Collection: UI
Test Name: Test description
Description: Purpose of the test
Endpoint: N/A for UI
Method: N/A for UI
Expected Status: Expected HTTP status code
Assertions: Key assertions
Environment: Dev/prod compatibility
Automation Status: Automated or Not Automated


suggestions.csv: Documents suggested test scenarios (e.g., No Capture, Single Capture, Double King). Columns include:

Scenario ID: Unique identifier (e.g., double-king)
Scenario Name: Scenario description
Description: Detailed explanation
Purpose: Testing goal
Status: Implemented or Not Implemented



Import CSV files into Excel:

Open Excel, go to File > Open, select test-cases.csv or suggestions.csv.
Set delimiter to Comma and import.
Save as .xlsx if needed.

Page Object Model
The pages/CheckersPage.js file defines locators and methods for interacting with the Checkers UI, improving test maintainability. Locators include:

Title, header, game wrapper, board, message, restart/rules links, and game pieces.
Methods ensure moves are made only when "Make a move." is displayed and detect captures/king promotions.

Secure Password Handling
If UI tests require authentication (e.g., in prod), passwords for User 1 and User 2 are stored in .env.dev and .env.prod as USER1_PASSWORD and USER2_PASSWORD. The utils/auth.js script generates Bearer tokens by calling AUTH_URL or creating mock JWTs.
Multiple Environments

Dev: Uses https://www.gamesforthebrain.com/game/checkers/ (public UI, no auth required).
Prod: Configured for a hypothetical https://prod-checkers-ui.com with authentication.
Set the environment via ENV=dev or ENV=prod in scripts or use --project=dev/--project=prod with Playwright.

Azure DevOps Integration

Create Project:

In Azure DevOps, create a project (e.g., Checkers UI Tests).


Add Pipeline:

Go to Pipelines > New Pipeline, select GitHub, and choose azure-pipelines.yml.


Set Variables:

Add to pipeline variables:
HOST_URL_DEV: https://www.gamesforthebrain.com/game/checkers/
AUTH_URL_DEV: https://www.gamesforthebrain.com/login
USER1_PASSWORD_DEV: password123
USER2_PASSWORD_DEV: password456
JWT_SECRET_DEV: mock-secret
HOST_URL_PROD: https://prod-checkers-ui.com
AUTH_URL_PROD: https://prod-checkers-ui.com/login
USER1_PASSWORD_PROD: prod-password123
USER2_PASSWORD_PROD: prod-password456
JWT_SECRET_PROD: prod-mock-secret


Mark password and secret variables as secret.


Run Pipeline:

Run the pipeline and view JUnit reports in the Tests tab, with Test IDs (UI1, UI2) visible.



GitHub Integration

Create Repository:

Create a GitHub repository (e.g., checkers-ui-tests).


Push Code:
git remote add origin https://github.com/your-username/checkers-ui-tests.git
git push -u origin main



Notes

Move Scenarios: checkers-moves.json includes multiple scenarios (No Capture, Single Capture, Multiple Captures, Invalid Move, King Promotion, Double King). The UI2 test uses the Single Capture scenario; others can be tested by updating the scenarioId.
Move Condition: Orange moves are only made when the UI displays "Make a move.", ensured by the waitForMovePrompt method in CheckersPage.js.
Test Reports: JUnit reports are generated in test-results/junit.xml for Azure DevOps, with Test IDs (UI1, UI2) visible.
Website Down Handling: If HOST_URL is down, tests are skipped with a console message, ensuring CI/CD stability.
Screenshots/Videos: Captured on failure for debugging, stored in test-results/.

For issues or additional features, contact the project maintainer or open a GitHub issue.

