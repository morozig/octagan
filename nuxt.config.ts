import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  srcDir: 'src/',
  meta: {
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Save Princess Attention From 8 Discriminators' },
      { property: 'og:image', content: '/octagan/banner.png' },
      { property: 'og:description', content: 'Save Princess Attention From 8 Discriminators' },
      { property: 'og:title', content: 'OctaGAN' },
    ],
    link: [
      { rel: 'icon', href: '/octagan/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/octagan/logo192.png' },
      { rel: 'stylesheet', href: '/octagan/fonts/fonts.css' },
    ],
    title: 'OctaGAN',
    script: [
      { src: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.13.0/dist/tf.min.js' }
    ],
  },
  app: {
    baseURL: '/octagan/'
  },
})
