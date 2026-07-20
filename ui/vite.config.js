import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    // Fail if 8080 is taken instead of silently moving to 8081 — the backend's
    // CORS_ORIGIN is pinned to 8080, so a silent port bump here just turns
    // into a confusing CORS error at login instead of a clear "port in use".
    strictPort: true,
  },
});
