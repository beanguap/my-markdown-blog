import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // To exclude specific polyfills, add them to this list.
      exclude: [],
      // Whether to polyfill `global`.
      global: true,
      // Whether to polyfill `Buffer`.
      buffer: true,
      // Whether to polyfill `process`.
      process: true,
    }),
  ],
  resolve: {
    alias: {
      // Ensure this alias doesn't conflict with the polyfill plugin
      // buffer: 'buffer/' // This might be redundant now
    }
  },
  // define: { // These might be redundant or conflict with the plugin
  //   'global': 'globalThis',
  //   'process.env': {},
  // },
  optimizeDeps: {
    esbuildOptions: {
      // define: { // This might be redundant or conflict with the plugin
      //   global: 'globalThis',
      // },
      // Enable esbuild polyfill plugins
      plugins: [
        {
          name: 'node-polyfills',
          setup(build) {
            // You can add specific esbuild options here if needed later
          },
        },
      ],
    }
  }
})
