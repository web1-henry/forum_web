import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  srcDir: 'src/',
  modules: ['@nuxtjs/proxy'],
  port: 8080,
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
  components: true,
  build: {
    transpile: ['vant', '@vant'],
    babel: {
      plugins: [
        [
          'import',
          {
            libraryName: 'vant',
            style: (name: string) => {
              return `${name}/index.css`
            },
          },
          'vant',
        ],
      ],
    },
  },
})
