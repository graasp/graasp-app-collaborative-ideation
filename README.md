# Graasp App: collaborative ideation

![GitHub release (with filter)](https://img.shields.io/github/v/release/graasp/graasp-app-collaborative-ideation)

![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/graasp/graasp-app-collaborative-ideation/deploy-dev.yml?label=development)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/graasp/graasp-app-collaborative-ideation/deploy-stage.yml?label=staging)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/graasp/graasp-app-collaborative-ideation/deploy-prod.yml?label=production)

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

# Development

## Installation

Clone this repository.

## Running the app

Create a `.env.development` file with the following content:

```bash
VITE_PORT=3333
VITE_API_HOST=http://localhost:3000
VITE_MOCK_API=false
VITE_GRAASP_APP_KEY=02052cf4-cc45-45c6-b0b8-61102244ed11
VITE_VERSION=latest
VITE_WS_HOST=ws://localhost:3000/ws
```

## Running the tests

Create a `.env.test` file with the following content:

```bash
VITE_PORT=3333
VITE_API_HOST=http://localhost:3636
VITE_ENABLE_MOCK_API=true
VITE_GRAASP_APP_KEY=45678-677889
VITE_VERSION=latest

# dont open browser
BROWSER=none
```
