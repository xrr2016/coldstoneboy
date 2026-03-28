---
title: 让 Hugo 博客支持 PWA
tags:
  - PWA
date: 2019-07-24T13:34:17+08:00
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2021/05/14/21/50/elephant-6254558_960_720.jpg
---

让用 Hugo 搭建的博客支持 PWA 很简单，只需 2 个步骤即可

<!--more-->

让用 Hugo 搭建的博客支持 PWA 很简单，只需 2 个步骤即可：

## 添加一个 manifest.json 文件

使用 https://app-manifest.firebaseapp.com 来生成博客的 manifest.json 文件，然后将生成出来的文件和图片放到博客的 static 目录，然后在 layout/index.html 的 `<head>` 标签内引用这个文件

```html
<head>
  ...
  <link rel="manifest" href="/manifest.json" />
  ...
</head>
```

这样你的博客就可以安装到桌面了

## 使用 Workbox 工具注册 ServiceWorker

在 static 新建一个 `sw.js` 文件，在文件添加以下内容用来为网络请求添加缓存；主要是缓存静态资源 js，css，图片以及字体等文件，
详细文档可以查看 [Workbox 文档](https://developers.google.cn/web/tools/workbox)

```js
importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn/workbox/workbox-sw.js')

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`)

  workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources'
    })
  )

  workbox.routing.registerRoute(
    /\.(?:png|jpg|jpeg|svg|gif)$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60
        })
      ]
    })
  )

  workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets'
    })
  )

  workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
      cacheName: 'google-fonts-webfonts',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30
        })
      ]
    })
  )
} else {
  console.log(`Boo! Workbox didn't load 😬`)
}
```

基本完成了，可以用 Chrome 的 Audits 的工具跑了一下分，看看还有什么地方要修改的。
