import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  srcDir: 'src/',
  css: [
    '@/public/fonts/fonts.css',
  ],
  meta: {
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Save Princess Attention From 8 Discriminators' },
      { property: 'og:image', content: '/banner.png' },
      { property: 'og:description', content: 'Save Princess Attention From 8 Discriminators' },
      { property: 'og:title', content: 'OctaGAN' },
    ],
    link: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/logo192.png' },
    ],
    title: 'OctaGAN',
    script: [
      { src: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.13.0/dist/tf.min.js' }
    ],
  },
  nitro: {
    preset: 'browser'
  },
  app: {
    baseURL: '/octagan/'
  },
})
