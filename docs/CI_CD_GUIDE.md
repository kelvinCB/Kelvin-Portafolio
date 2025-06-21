# CI/CD Pipeline Documentation with GitHub Actions

This document outlines the Continuous Integration (CI) pipeline implemented for this project using GitHub Actions. The goal of this pipeline is to automate the testing process to ensure code quality and stability, with a focus on reliable Playwright end-to-end (E2E) testing.

## 1. Overview

The CI pipeline automatically runs a series of checks and tests every time code is pushed to the `main` branch or a pull request is created against it. This helps catch bugs early and ensures that new changes don't break existing functionality.

We chose **GitHub Actions** for its seamless integration with the GitHub repository, ease of setup, and generous free tier for public and private projects.

## 2. Workflow Configuration

The CI/CD pipeline is defined in two YAML files located at:

- **`.github/workflows/ci.yml`** - Main CI pipeline with unit tests and conditional E2E tests
- **`.github/workflows/playwright.yml`** - Dedicated Playwright E2E test workflow

These files are the "source of truth" for our CI process.

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

This job is crucial for testing the application from end to end. It runs automatically on every commit after **both `backend-tests` and `frontend-tests` complete successfully**.

By including E2E tests in every CI run, we ensure all code changes are thoroughly validated against real application behavior.

- **Environment:** Runs on an `ubuntu-latest` virtual machine.
- **Port Configuration:**
  - Frontend runs on port `3000`
  - Backend runs on port `5000` (Using `BACKEND_PORT` environment variable)

- **Steps:**
    1. Checks out the latest version of the repository code.
    2. Sets up Node.js (version 18.x).
    3. Installs frontend dependencies using `npm ci`.
    4. Installs backend dependencies using `npm ci --no-optional` in the `./backend` directory.
    5. Verifies critical dependencies like `bcryptjs` are installed correctly.
    6. Installs the Playwright browsers and their system dependencies using `npx playwright install --with-deps`.
    7. Runs the end-to-end tests using `npx playwright test --project=chromium` in headless mode.

## 5. Environment Variables & Secrets

For the tests to run correctly in the automated GitHub Actions environment, certain environment variables and secrets must be configured. These are defined at the job level to ensure all processes (including backend server) have access to them.

Navigate to your repository's **Settings > Secrets and variables > Actions** to configure the following:

- **`MONGODB_URI_TEST`**: The connection string for a test database.
- **`JWT_SECRET_TEST`**: A string used for signing JSON Web Tokens during tests.
- **`STRIPE_SECRET_KEY_TEST`**: Test API key for Stripe integration.
- **`ENCRYPTION_KEY_TEST`**: Key used for encryption in test environment.
- **`EMAIL_USER_TEST`** & **`EMAIL_PASS_TEST`**: Credentials for email testing.
- **`ADMIN_EMAIL_TEST`** & **`ADMIN_PASSWORD_TEST`**: Admin login credentials for tests.

Additionally, the following non-secret environment variables are configured:

- **`NODE_ENV`**: Set to 'test' for testing environments.
- **`PORT`**: Set to 3000 for the frontend server.
- **`BACKEND_PORT`**: Set to 5000 for the backend server.

These variables are injected into the jobs as environment variables, as defined in both workflow files.

## 6. How to Use and Monitor

1. **Development Workflow:**
   ```bash
   git commit -m "feat: add new feature"
   git push origin branch-name
   ```
   This will trigger the complete CI pipeline including unit tests and E2E tests.

2. **Monitor CI Results:**
   After pushing your changes, the CI pipeline will automatically run backend tests, frontend tests, and E2E tests in sequence.

3. **Check Status:** Go to the **"Actions"** tab in your GitHub repository to monitor your workflows.

## 7. Backend Server Configuration

The backend server is configured to start only when directly executed, not when imported by tests:

```javascript
// backend/index.js
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
    console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
  });
}
```

This pattern prevents the server from starting during Jest tests (avoiding open handle warnings), while still allowing it to start during Playwright E2E tests.

## 8. Troubleshooting

Common issues and solutions:

1. **Port conflicts**:
   - Frontend uses port 3000 (`PORT=3000`)
   - Backend uses port 5000 (`BACKEND_PORT=5000`)
   - Ensure these ports don't conflict with other services

2. **Missing dependencies**:
   - Ensure backend dependencies are installed with `npm ci` in the `./backend` directory
   - Critical dependencies like `bcryptjs` must be available

3. **Environment variables**:
   - All environment variables must be defined at the job level in GitHub Actions
   - This ensures they're available to all processes, including the backend server

4. **Timeouts in Playwright**:
   - Ensure backend server is listening on the correct port
   - Configure appropriate timeouts in `playwright.config.js`

---
*This documentation helps maintain a clear understanding of the project's automated testing strategy and supports future developers in maintaining the CI/CD pipeline.*
