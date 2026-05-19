import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    basicSsl(),
    tsconfigPaths(),
    {
      name: 'xr-entry',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === '/') req.url = '/xr.html'
          next()
        })
      },
    },
  ],
  server: {
    port: 5175,
  },
  build: {
    outDir: 'dist-xr',
    rollupOptions: {
      input: resolve(__dirname, 'xr.html'),
    },
  },
})
