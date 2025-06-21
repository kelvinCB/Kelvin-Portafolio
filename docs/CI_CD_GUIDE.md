# CI/CD Pipeline Documentation with GitHub Actions

This document outlines the Continuous Integration (CI) pipeline implemented for this project using GitHub Actions. The goal of this pipeline is to automate the testing process to ensure code quality and stability.

## 1. Overview

The CI pipeline automatically runs a series of checks and tests every time code is pushed to the `main` branch or a pull request is created against it. This helps catch bugs early and ensures that new changes don't break existing functionality.

We chose **GitHub Actions** for its seamless integration with the GitHub repository, ease of setup, and generous free tier for public and private projects.

## 2. Workflow Configuration

The entire pipeline is defined in a single YAML file located at:

- **`.github/workflows/ci.yml`**

This file is the "source of truth" for our CI process.

## 3. Pipeline Triggers

The workflow is configured to run automatically on two specific events:

- **`push` to `main`:** Every time a commit is pushed to the `main` branch.
- **`pull_request` to `main`:** Every time a new pull request is opened that targets the `main` branch.

## 4. Pipeline Jobs

The workflow consists of three distinct jobs that run in a specific order.

### Job 1: `backend-tests`

This job is responsible for testing the backend application.

- **Environment:** Runs on an `ubuntu-latest` virtual machine.
- **Steps:**
    1.  Checks out the latest version of the repository code.
    2.  Sets up Node.js (version 18.x).
    3.  Navigates to the `/backend` directory.
    4.  Installs all necessary npm dependencies using `npm install`.
    5.  Runs the backend unit tests using the `npm test` command (which executes Jest).

### Job 2: `frontend-tests`

This job runs in parallel with the backend tests and is responsible for testing the frontend React application.

- **Environment:** Runs on an `ubuntu-latest` virtual machine.
- **Steps:**
    1.  Checks out the latest version of the repository code.
    2.  Sets up Node.js (version 18.x).
    3.  Installs all necessary npm dependencies from the root directory using `npm install`.
    4.  Runs the frontend unit tests using `npm test -- --watchAll=false`.

### Job 3: `e2e-tests`

This job is crucial for testing the application from end to end. It only runs if **both `backend-tests` and `frontend-tests` complete successfully**.

- **Environment:** Runs on an `ubuntu-latest` virtual machine.
- **Steps:**
    1.  Checks out the latest version of the repository code.
    2.  Sets up Node.js (version 18.x).
    3.  Installs all necessary npm dependencies.
    4.  Installs the Playwright browsers and their system dependencies using `npx playwright install --with-deps`.
    5.  Runs the end-to-end tests using `npx playwright test --headed --project=chromium`, respecting the preference for visual testing in Chromium.

## 5. Environment Variables & Secrets

For the tests to run correctly in the automated GitHub Actions environment, certain sensitive variables (secrets) must be configured. These are stored securely in GitHub and are not exposed in the code.

Navigate to your repository's **Settings > Secrets and variables > Actions** to configure the following:

- **`MONGODB_URI_TEST`**: The connection string for a **test database**. It is highly recommended to use a separate database for testing to avoid interfering with development or production data.
- **`JWT_SECRET_TEST`**: A long, random string used for signing JSON Web Tokens during tests.

These secrets are injected into the jobs as environment variables, as defined in the `ci.yml` file.

## 6. How to Use and Monitor

1.  **Commit and Push:** Simply `git push` your changes to the `main` branch or open a pull request.
2.  **Check Status:** Go to the **"Actions"** tab in your GitHub repository. You will see your workflow running.
3.  **Review Results:** You can click on the workflow run to see the detailed progress of each job. A green checkmark (✅) indicates success, while a red cross (❌) indicates a failure. If a job fails, you can inspect the logs to diagnose the error.

---
*This documentation helps maintain a clear understanding of the project's automated testing strategy.*
