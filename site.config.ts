import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  timezone: 'Asia/Shanghai',
  url: 'https://coldstoneboy.cn/',
  lang: 'zh-CN',
  title: '冷石Boy的小站',
  subtitle: '',
  author: {
    name: '冷石Boy',
    // intro: '相当图书馆管理员',
    avatar: 'https://pic1.afdiancdn.com/user/38e009c6c79d11eca3b352540025c377/avatar/f58e628c4a847dcec83707f8736f3a6a_w720_h618_s53.jpeg?imageView2/1/w/240/h/240',
  },
  description: '',
  social: [
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      color: 'orange',
    },
    {
      name: 'QQ 群 1050458482',
      link: 'https://qm.qq.com/cgi-bin/qm/qr?k=kZJzggTTCf4SpvEQ8lXWoi5ZjhAx0ILZ&jump_from=webapi',
      icon: 'i-ri-qq-line',
      color: '#12B7F5',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/YunYouJun',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: '哔哩哔哩',
      link: 'https://space.bilibili.com/1579790',
      icon: 'i-ri-bilibili-line',
      color: '#FF8EB3',
    },
    {
      name: 'E-Mail',
      link: 'mailto:me@yunyoujun.cn',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
  ],

  search: {
    enable: false,
  },

  // sponsor: {
  //   enable: true,
  //   title: '我很可爱，请给我钱！',
  //   methods: [
  //     {
  //       name: '支付宝',
  //       url: 'https://cdn.yunyoujun.cn/img/donate/alipay-qrcode.jpg',
  //       color: '#00A3EE',
  //       icon: 'i-ri-alipay-line',
  //     },
  //     {
  //       name: 'QQ 支付',
  //       url: 'https://cdn.yunyoujun.cn/img/donate/qqpay-qrcode.png',
  //       color: '#12B7F5',
  //       icon: 'i-ri-qq-line',
  //     },
  //     {
  //       name: '微信支付',
  //       url: 'https://cdn.yunyoujun.cn/img/donate/wechatpay-qrcode.jpg',
  //       color: '#2DC100',
  //       icon: 'i-ri-wechat-pay-line',
  //     },
  //   ],
  // },
})
