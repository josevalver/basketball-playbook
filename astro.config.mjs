// astro.config.mjs
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  site: 'https://josevalver.github.io',
  base: '/basketball-playbook/',
  output: 'static',
  integrations: [
    react(),          
    mdx(),
    tailwind({ applyBaseStyles: true }),
  ],
})
