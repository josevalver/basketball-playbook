import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  site: 'https://josevalver.github.io',
  base: '/basketball-playbook/',   // remove this line if deploying to <user>.github.io root
  output: 'static',
  integrations: [mdx(), tailwind({ applyBaseStyles: true })],
})
