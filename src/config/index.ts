import { createLoggerInstance } from "../libs/logger";

const moduleLogger = createLoggerInstance("config/index");

export default {
  envMode: Bun.env.NODE_ENV ?? "development",
  debugMode: (Bun.env.DEBUG ?? false) === "true",
  odoo: {
    odooUrl: Bun.env.ODOO_URL ?? "https://erp.xurya.com/",
    odooDb: Bun.env.ODOO_DB_NAME,
    odooPort: Bun.env.ODOO_DB_PORT,
    odooUsername: Bun.env.ODOO_XURYABOT_USERNAME,
    odooPassword: Bun.env.ODOO_XURYABOT_PASSWORD,
    pltsEstablishment: {
      apikey: Bun.env.APIKEY_PLTS_ESTABLISHMENT ?? "",
    },
  },
  apollo: {
    baseUrl: Bun.env.APOLLO_URL ?? "https://apollo.api.xurya.com",
    token: Bun.env.APOLLO_TOKEN ?? "",
    secret: Bun.env.APOLLO_SECRET ?? "",
    endpoints: {
      solargisIrradianceUrl: Bun.env.APOLLO_SOLARGIS_IRRADIANCE_URL ?? "/v1.0/solargis/insolation",
    },
  },
  // config redis
  redis: {
    host: Bun.env.REDIS_HOST ?? "redis-server",
    port: Bun.env.REDIS_PORT ? Number(Bun.env.REDIS_PORT) : 6379,
    username: Bun.env.REDIS_USERNAME ?? "",
    password: Bun.env.REDIS_PASSWORD ?? "",
    expired_time: Bun.env.REDIS_EXPIRED_CACHE ? Number(Bun.env.REDIS_EXPIRED_CACHE) : 60,
  },
  // TODO: Add more config modules here
};

moduleLogger.info("Config loaded!");
