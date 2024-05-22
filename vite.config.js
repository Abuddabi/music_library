import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: resolve(__dirname, './src'),
  publicDir: 'public',
  base: "/music_library/",
  build: {
    outDir: resolve(__dirname, "src/dist"),
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        detail: resolve(__dirname, "src/detail.html")
      },
    },
  },
  envDir: resolve(__dirname),
}); 