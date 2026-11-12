import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

const globalTopPath = fileURLToPath(new URL('./global-top.vue', import.meta.url))

// global-top.vue imports style.css and SectionProgress.vue. Slidev normally
// mounts that file through a cached scan, which stays empty across restarts.
// Attach the file directly.
function loadDeckAssets(): Plugin {
  return {
    name: 'load-deck-assets',
    enforce: 'post',
    transform(code, id) {
      const clean = id.split('?')[0]

      if (clean.includes('@slidev/global-layers')) {
        if (code.includes('__deckGlobalTop'))
          return null
        const imported = `import __deckGlobalTop from ${JSON.stringify(globalTopPath)}\n${code}`
        return imported.replace(
          'export const GlobalTop = { render: () => GlobalTopComponents.map(comp => h(comp)) }',
          'export const GlobalTop = { render: () => [__deckGlobalTop].map(comp => h(comp)) }',
        )
      }

      return null
    },
  }
}

export default {
  server: {
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  plugins: [loadDeckAssets()],
}
