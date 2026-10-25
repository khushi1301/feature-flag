import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Forward /api calls to the Express server, so the browser never hits CORS in dev.
    proxy: { "/api": "http://localhost:5000" },
  },
});
