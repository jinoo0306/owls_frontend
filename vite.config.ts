import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  define: {
    "import.meta.env.VITE_BACKEND_URL": JSON.stringify(
      "https://owls-backend.onrender.com"
    ),
  },
});
