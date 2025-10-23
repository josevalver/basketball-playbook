import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwind from '@astrojs/tailwind'


export default defineConfig({
integrations: [mdx(), tailwind({ applyBaseStyles: true })],
output: 'static',
site: 'https://josevalver.github.io/basketball-playbook',
markdown: { shikiConfig: { theme: 'one-dark-pro' } },
})//