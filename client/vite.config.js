import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0", // allow external access
    port: 5173, // match your dev port
    strictPort: true,
    allowedHosts: true, // allow all hosts (Vite 5+)
  },
});
