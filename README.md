# Graasp App: collaborative ideation

![GitHub release (with filter)](https://img.shields.io/github/v/release/graasp/graasp-app-collaborative-ideation)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.13862315.svg)](https://doi.org/10.5281/zenodo.13862315)

[![Deploy to development environment](https://github.com/graasp/graasp-app-collaborative-ideation/actions/workflows/deploy-dev.yml/badge.svg)](https://github.com/graasp/graasp-app-collaborative-ideation/actions/workflows/deploy-dev.yml)
[![Deploy to staging environment](https://github.com/graasp/graasp-app-collaborative-ideation/actions/workflows/deploy-stage.yml/badge.svg)](https://github.com/graasp/graasp-app-collaborative-ideation/actions/workflows/deploy-stage.yml)
[![Deploy to production environment](https://github.com/graasp/graasp-app-collaborative-ideation/actions/workflows/deploy-prod.yml/badge.svg)](https://github.com/graasp/graasp-app-collaborative-ideation/actions/workflows/deploy-prod.yml)


[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=graasp_graasp-app-collaborative-ideation&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=graasp_graasp-app-collaborative-ideation)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=graasp_graasp-app-collaborative-ideation&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=graasp_graasp-app-collaborative-ideation)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=graasp_graasp-app-collaborative-ideation&metric=bugs)](https://sonarcloud.io/summary/new_code?id=graasp_graasp-app-collaborative-ideation)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=graasp_graasp-app-collaborative-ideation&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=graasp_graasp-app-collaborative-ideation)

![typescript version](https://img.shields.io/github/package-json/dependency-version/graasp/graasp-app-collaborative-ideation/typescript)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

## About

The **Collaborative Ideation** app in Graasp was made to organize blended and online activities where participants can share their inputs and react on them in real time. This app was designed and implemented inside the [Graasp](https://graasp.org) platform and is not independent from it.

### Citation

If you use this software or take inspiration from it, please, cite it as below:

> La Scala, J. (2025). Collaborative Ideation (v3.4.0). Zenodo. 

For citing the latest version, use the permanent DOI: [10.5281/zenodo.13862314](https://doi.org/10.5281/zenodo.13862314)

### Related publications

This app was presented or used in the following publications:

- La Scala, J., Bartłomiejczyk, N., Gillet, D., & Holzer, A. (2025). Fostering Innovation with Generative AI: A Study on Human-AI Collaborative Ideation and User Anonymity. Proceedings of the 58th Hawaii International Conference on System Sciences, 337–351. DOI: http://dx.doi.org/10.24251/HICSS.2025.041
- La Scala, J. A., Sahli, S., & Gillet, D. (2025, April). Stimulating Brainstorming Activities with Generative AI in Higher Education. 2025 IEEE Global Engineering Education Conference. DOI: https://doi.org/10.1109/EDUCON62633.2025.11016340
- Farah, J. C., La Scala, J., Ingram, S., & Gillet, D. (2025, April). Supporting Brainstorming Activities with Bots in Software Engineering Education. 2025 IEEE/ACM 6th International Workshop on Bots in Software Engineering (BotSE). 2025 IEEE/ACM 6th International Workshop on Bots in Software Engineering (BotSE), Ottawa, Canada.


## Development

This app being currently part of the general Graasp platform, you will find the most up-to-date general informations on the development of Graasp apps in [the official Graasp technical documentation](https://graasp.github.io/docs/developer/apps/).

### Installation

Clone this repository. To use and test the collaboration mechanism, we recommend to also install [the full Graasp stack](https://github.com/graasp/graasp/blob/main/README.md).

### Running the app

Create a `.env.development` file with the following content:

```bash
VITE_PORT=3333
VITE_API_HOST=http://localhost:3000
VITE_ENABLE_MOCK_API=false
VITE_GRAASP_APP_KEY=02052cf4-cc45-45c6-b0b8-61102244ed11
VITE_VERSION=latest
VITE_WS_HOST=ws://localhost:3000/ws
```

To serve the app with the _full Graasp stack_, use `yarn dev`. If you want to try the app without the stack, use `yarn dev:mock`.

> ⚠️ If you don't use the full Graasp stack, please note that you won't be able to save the state of the application and use the collaboration.

### Running the tests

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

## Contributors

This app was designed, implemented, and is currently maintained by [Jérémy La Scala](https://people.epfl.ch/jeremy.lascala) (@swouf) from École Polytechnique Fédérale de Lausanne.
