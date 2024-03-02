import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH_SECRET: z.string().min(1),
    PG_URL: z.string().min(1),
    PUBLIC_FILE_URL: z.string().min(1),
    ODATA_API_URL: z.string().min(1),
    ODATA_API_AUTH_HEADER: z.string().min(1),
    MAIN_WAREHOUSE_UUID: z.string().min(1),
    MAIN_PRICE_TYPE_UUID: z.string().min(1),
    KILOGRAM_UUID: z.string().min(1),
    ITEM_UUID: z.string().min(1),
    MINIMUM_WEIGHT_PARAM_UUID: z.string().min(1),
    SHOW_USER_ON_WEBSITE_PARAM_UUID: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    PG_URL: process.env.PG_URL,
    PUBLIC_FILE_URL: process.env.PUBLIC_FILE_URL,
    ODATA_API_URL: process.env.ODATA_API_URL,
    ODATA_API_AUTH_HEADER: process.env.ODATA_API_AUTH_HEADER,
    MAIN_WAREHOUSE_UUID: process.env.MAIN_WAREHOUSE_UUID,
    MAIN_PRICE_TYPE_UUID: process.env.MAIN_PRICE_TYPE_UUID,
    KILOGRAM_UUID: process.env.KILOGRAM_UUID,
    ITEM_UUID: process.env.ITEM_UUID,
    MINIMUM_WEIGHT_PARAM_UUID: process.env.MINIMUM_WEIGHT_PARAM_UUID,
    SHOW_USER_ON_WEBSITE_PARAM_UUID:
      process.env.SHOW_USER_ON_WEBSITE_PARAM_UUID,
  },
});
