import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts

  theme: 'yun',

  themeConfig: {
    banner: {
      enable: true,
      title: '冷石Boy的小站',
    },

    nav: [
      { text: '文章', link: '/posts/', icon: 'i-ri-article-line' },
      { text: '项目', link: '/projects/', icon: 'i-ri-gallery-view' },
    ],

    pages: [
      { name: '我的项目', url: '/projects/', color: 'var(--va-c-text)', icon: 'i-ri-gallery-view' },
    ],

    footer: {
      since: 2019,
    },
  },

  unocss: { safelist },
})
