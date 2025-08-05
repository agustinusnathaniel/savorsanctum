import { defineConfig } from "@julr/vite-plugin-validate-env";
import z from "zod";

export default defineConfig({
  validator: "standard",
  schema: {
    VITE_NOTION_TOKEN: z.string().min(1),
    VITE_NOTION_DATABASE_ID: z.string().min(1),
  },
});
