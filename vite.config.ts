import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Where `/api` requests are forwarded (must match your uvicorn host:port)
  const apiProxyTarget = env.VITE_PROXY_TARGET || 'http://127.0.0.1:8000'

  return {
    plugins: [
      react({
        // Exclude better-react-mathjax from Fast Refresh to avoid compatibility issues
        exclude: /node_modules\/better-react-mathjax/,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      include: ['better-react-mathjax'],
    },
    server: {
      // Locale JSON is eagerly imported via import.meta.glob in src/i18n/index.ts.
      // Batch i18n scripts rewrite these files frequently — without ignore, Vite HMR
      // full-reloads the app every few seconds while translation runs.
      watch: {
        ignored: ['**/src/locales/**'],
      },
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('error', (err) => {
              console.error(
                `[vite] /api proxy → ${apiProxyTarget} error:`,
                (err as Error).message,
                '(is FastAPI running on that port?)'
              )
            })
            proxy.on('proxyReq', (_proxyReq, req) => {
              if (process.env.DEBUG_VITE_PROXY === '1') {
                console.log('[vite] proxy', req.method, req.url, '→', apiProxyTarget)
              }
            })
          },
        },
      },
    },
  }
})

