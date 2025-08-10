// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: set base to "/<YOUR_REPO_NAME>/"
export default defineConfig({
  plugins: [react()],
  base: "/react-tic-tac-toe/", // <-- change if your repo name is different
});
