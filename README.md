# Kratos

Purpose: Gateway for APIs that use Typescript language. Will be contain several modules for different APIs. Example: Calculator, ONM Suite, etc.

In production mode service running over Containers Google Kubernetes Engine, and ready for reproducible locally with docker composer.

Current project status are ready for deployment.

```
NodeJs:             >= 18.0.0
Version:            2.0.28
Coverage:           0%
Linter:             Biome
```

## Getting Started

Before we start, we make sure the master / main branch has been updated to the latest version, Please check [link on this repository](https://gitlab.com/xurya/kratos).
Git clone from this url using https or ssh.

```
# using ssh
git clone git@gitlab.com:xurya/kratos.git .

# using http
git clone https://gitlab.com/xurya/kratos.git .
```

## Built With

This stack is built with NodeJS version >= 18.0.0 wrapped in docker images `asia.gcr.io/xuryaeligibility/xurya-kratos:latest`.

NodeJS Library and Dependencies in `package.json`:

```
"dependencies": {
  "@elysiajs/bearer": "^1.0.2",
  "@elysiajs/cors": "^1.0.2",
  "@elysiajs/cron": "^1.0.3",
  "@elysiajs/jwt": "^1.0.2",
  "@elysiajs/swagger": "^1.0.5",
  "date-fns": "^3.6.0",
  "elysia": "latest",
  "elysia-rate-limit": "^4.1.0",
  "googleapis": "^137.1.0",
  "pino": "^9.2.0",
  "pino-pretty": "^11.2.0"
},
"devDependencies": {
  "@biomejs/biome": "1.7.2",
  "bun-types": "latest"
},
```

## Getting it (prequisites)

Credential file is not in the repository for security reasons, Here's a brief info about `service account` credential in google `kubernetes engine secret`:

## Setting up

Before going to this stage, make sure all the steps above have been done. and then open file `docker-compose.yml`.

Make sure the docker images used are pushed into the registry container `gcr.io/xuryaeligibility`

```
# using docker images:
image: asia.gcr.io/xuryaeligibility/xurya-kratos:latest
```

To make sure again whether docker images have been pushed, please check docker images using `gcloud`, if you haven't configured the gcloud sdk, please schedule the devops team to help with configuration

```
gcloud container images list
```

Or you can check by open container registry inside our GCP here: [link to open container registry](https://console.cloud.google.com/gcr/images/xuryaeligibility?project=xuryaeligibility)

### Running the program in docker compose

After all the processes in the settings have been done, please enter the following command line to run the program.

```
<!-- for production -->
docker build -t asia.gcr.io/xuryaeligibility/xurya-kratos:latest .

docker-compose -f docker-compose.yml up

<!-- for dev -->
docker build -t asia.gcr.io/xuryaeligibility/xurya-kratos:dev-latest .

docker-compose -f docker-compose-dev.yml up
```

Please check the log by running this command line in terminal.

```
docker logs --tail 20 --follow xurya-kratos
```

The log file will be dumped in the following directory `/app/log/` with file `debug.log`

## Limitation

## Building in production

## Deploying / Publishing

## Versioning

If you make the change to main branch, make sure to change the version number on `README.md` and `CHANGELOG.md`,
don't forget to write the update summary on `CHANGELOG.md`

More details about number versioning we use is on this [file](https://docs.google.com/presentation/d/106AQEh-pyGPo1vRx8Jz7SZROosg7cgqjBzmurvrKA0c/edit?usp=sharing).

## Tests

## Api Reference

### Modules

- Calculator
  - **GET** `/calculator/property-pln`
  - **GET** `/calculator/tariff-calc`
  - **POST** `/calculator/get-environment-impact`
  - **POST** `/calculator/get-lease`
  - **POST** `/calculator/join`
- ONM Suite
  - **GET** `/onm-suite/dashboard/waterfall-onm-corfin`

## Contributor

- Catur Bagaskara (maintainer)
- Septian Dwijoko Purnomo

## Here's what i've done

- [x] Init project
- [x] Dockerize Project
- [x] Improve documentation (readme, changelog, api reference) and inline comment
- [x] Improve logging (file generated log and console log)
- [x] Setup Linter (biome)
- [ ] Unittest with 3 testing scenarios in each function to be tested
- [ ] Test Coverage

## Licensing

maintainer: it@xurya.com

---

XURYA CONFIDENTIAL

---

Copyright © Xurya Pte. Ltd.
ALL RIGHTS RESERVED.

You should have received a copy of the license with this file. If not,
please write to: contact@xurya.com, or visit: www.xurya.com

All information contained herein is, and remains the property of Xurya Pte. Ltd.
and its suppliers, if any. The intellectual and technical concepts contained
herein are proprietary to Xurya Pte. Ltd and its suppliers and may be covered by
Indonesian, Singaporean, and Foreign Patents, patents in process, and are
protected by trade secret or copyright law. Dissemination of this information
or reproduction of this material is strictly forbidden unless prior written
permission is obtained from Xurya Pte. Ltd.

---

Hak cipta © Xurya Pte. Ltd.
HAK CIPTA DILINDUNGI UNDANG-UNDANG.

Anda seharusnya telah menerima salinan lisensi dengan file ini. Jika tidak,
silakan memohon kopi lisensi ke: contact@xurya.com, atau kunjungi: www.xurya.com

Semua informasi yang termuat di sini adalah, dan tetap milik Xurya Pte. Ltd.
dan pemasoknya, jika ada. Konsep intelektual dan teknis yang termuat di sini
adalah sepenuhnya milik Xurya Pte. Ltd dan pemasoknya, dan mungkin dilindungi
oleh Hak Paten Republik Indonesia, Singapura, dan Paten Asing, atau oleh hak paten
yang sedang diproses, dan dilindungi oleh rahasia dagang atau undang-undang hak
cipta. Dilarang keras untuk menyebar-luas kan informasi ini atau mereproduksi
materi ini kecuali dengan izin tertulis dari Xurya Pte. Ltd.

---
