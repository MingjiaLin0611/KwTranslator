import { defineConfig } from "wxt";
import { fileURLToPath } from "node:url";

export default defineConfig({
  manifestVersion: 3,
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "KW Translator",
    description: "Inline technical keyword translation for English web pages.",
    version: "0.1.0",
    permissions: ["storage"],
    host_permissions: ["<all_urls>"],
    action: {
      default_title: "KW Translator"
    }
  },
  vite: () => ({
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    }
  })
});
