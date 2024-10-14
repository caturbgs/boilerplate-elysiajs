2.0.28
- add new endpoint `/create-leads`
- update `ReportLeads` structure

2.0.27
- add new endpoint `/bill-illustration`
- fix cors origin config

2.0.26
- add new endpoint `/plts-contribution`
- add helpers endpoint `/helpers/*`

2.0.25
- add new endpoint `/lease-option`

2.0.24
- add new endpoint `/generate-calculator-data`
- update breaking change elysia
  - lifecycle handler
  - schema handler
  - better type suppor
- add cors origin config

2.0.23
- add new endpoint `/plts-system-size`
- update breaking change elysia
  - logger handler
  - error handler
- fix open api swagger plugin

2.0.22
- Update column name on daily to annual performance

2.0.20
- Add dataset config for prod daily to annual
- Update column config for prod daily to annual

2.0.19
- Fix CICD prod

2.0.18
    - Add additional checking for the response from the solargis Irradiance API

2.0.17
    - Add additional checking for the response from the solargis Irradiance API

2.0.16
    - Update payload for Solargis Irradiance API. Reversed the latitude and longitude coordinates
2.0.15
    - Update payload for Solargis Irradiance API
2.0.14
    - Update global config xurya calculator after IRR Tools v6.3.5
2.0.13
    - better error handling on preload functions
    - fill vault config kratos production
2.0.12
    - add `public` folder
2.0.11
    - Complete documentation
    - Add additional env vars from vault
    - Refactor global config vars
    - Update get irradiation model from apollo
    - Lock resource in docker compose
2.0.10
    - Fix API Response key

2.0.9
    - Change waterfall formula

2.0.8
    - Remove unused logger & improve logger readability

2.0.7
    - Add new endpoint for waterfall of losses ONM Dashboard

2.0.6
    - Reduce time for get environment impact endpoint

2.0.5
    - Add new mapping env vars vault for ONM suite

2.0.4
    -   create waterfall-onm-corfin function

2.0.3
Add config cors

2.0.1
Integration vault

2.0.0
Initial commit
