import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  srcDir: 'src/',
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
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Audiowide&family=Courier+Prime&family=Roboto:wght@700&display=swap' },
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
