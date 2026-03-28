---
title: 关于新拟物设计 Neumorphism
categories:
  - 技术
  - 设计
tags:
  - Flutter
date: 2021-09-23 20:30:19
cover: /images/about-neumorphism/cover.jpg
---

前段时间发现了一种叫新拟物的 UI 设计 Neumorphism，感觉很新鲜。于是研究的一番，本文将分享新拟物设计的相关知识。

<!--more-->

## 前言

前段时间发现了一种叫新拟物的 UI 设计 Neumorphism，感觉很新鲜。于是研究的一番，本文将分享新拟物设计的相关知识。

## 新拟物设计是什么

新拟物的前身是 Skeuomorphism（拟物设计），或叫拟物化，即在界面中模仿现实物纹理材质的设计，让人们在使用界面时联想到现实物体的使用方式，由 Apple 公司最先提出。新拟物设计是拟物设计的一种新的思路，它的关注点不在于对现实世界和数字世界的对比和模拟，而关键点在于色调，新拟物设计关注于整个屏幕的颜色，并为用户提供一个完全独特的体验。

![demo2.jpg](/images/about-neumorphism/demo2.jpg)


比如你有一个音乐播放器界面，使用新拟物设计，这个界面的 UI 元素不是放置在背景之上而是在它后面。它给人的感觉是，像按钮或卡片这样的组件实际上是在背景里面的，只是因为它们是从里面突出来的，所以才可以看到。

![uisdc-nw-20200630-8.jpeg](/images/about-neumorphism/uisdc-nw-20200630-8.jpeg)

新拟物设计风格的结构由背景色+高光色+阴影色组成，掌握了基本规律，就可以通过改变按钮、卡片的参数进行调整变换。总体来说就是纯色、低对比度以及适当的阴影效果，风格偏柔和。

## 新拟物设计的对比

新拟物设计是一种介于拟物与扁平之间的风格，简化了拟物设计中不必要的效果。

![neumorphism-skeuomorphism-flat-compared.png.webp](/images/about-neumorphism/neumorphism-skeuomorphism-flat-compared.png.webp)

## 谁在使用新拟物设计

几个使用了新拟物设计的应用

### 谜底时钟

<img src="/images/about-neumorphism/sz1.PNG" width="207" alt="sz1" style="display: inline;" />
<img src="/images/about-neumorphism/sz2.PNG" width="207" alt="sz2" style="display: inline;" />
<img src="/images/about-neumorphism/sz3.PNG" width="207" alt="sz3" style="display: inline;"  />

### 氢时钟

<img src="/images/about-neumorphism/qsz2.PNG" width="207" alt="qsz2" style="display: inline;"  />
<img src="/images/about-neumorphism/qsz1.PNG" width="207" alt="qsz1" style="display: inline;" />
<img src="/images/about-neumorphism/qsz3.PNG" width="207" alt="qsz3" style="display: inline;"  />

### Skailer

![GitHubPreview.png](/images/about-neumorphism/GitHubPreview.png)

<img src="/images/about-neumorphism/home-dark.png" width="280" alt="home-dark" style="display: inline;"  />

<img src="/images/about-neumorphism/player-light.png" width="280" alt="player-light" style="display: inline;"  />


### 分贝大师

<img src="/images/about-neumorphism/fb1.PNG" width="280" alt="fb1" style="display: inline;"  />
<img src="/images/about-neumorphism/fb2.PNG" width="280" alt="fb2" style="display: inline;"  />

## 新拟物设计的实现原理

新拟物设计通过应用两种不同的阴影实现，一个高亮色，一个阴影色，元素的背景颜色不能是全黑或全白，需要使用一种中间色调，这样可以使阴影效果显示出来。

![neumorphic-cards.png.jpg](/images/about-neumorphism/neumorphic-cards.png.jpg)
![6c9cb8deabc71b3bb158f6ab7ca653ff.webp](/images/about-neumorphism/6c9cb8deabc71b3bb158f6ab7ca653ff.webp)
![f9f1ad497f9778d196bae05e8122efb7.webp](/images/about-neumorphism/f9f1ad497f9778d196bae05e8122efb7.webp)

## 使用 Flutter 实现新拟物设计

对于开发来说，要实现这种效果，就是使用两层阴影，一层高亮阴影，一层暗色阴影，以及设置元素的背景颜色。凸的时候高亮影在左上，暗色在右下，凹时反过来。以下介绍如何使用 Flutter 框架实现这种效果，Web 端使用相同的原理实现。

1. 首先添加一个容器，用来放置具体的元素，设置背景颜色

```css
Container(
  width: 600.0,
  height: 600.0,
  color: Color(0xffefeeee),
)
```
​
2. 添加子元素，设置它的背景颜色以及阴影色和高亮色

```css
child: Container(
  width: 200,
  height: 200,
  decoration: BoxDecoration(
    // 背景色
    color: Color(0xffefeeee),
    borderRadius: BorderRadius.circular(12.0),
		boxShadow: const [
      // 高亮色
			BoxShadow(
				color: Colors.white.withOpacity(.5),
				offset: Offset(10.0, 10.0),
				blurRadius: 4.0,
			),
      // 阴影色
			BoxShadow(
				color: Color(0xffd1cdc7).withOpacity(.5),
				offset: Offset(-10.0, -10.0),
				blurRadius: 4.0,
			),
		],
	),
)
```

3. 给子元素添加圆角和边框配置

```css
decoration: BoxDecoration(
  // ...
  borderRadius: BorderRadius.circular(12.0),
  border: Border.all(
    color: Colors.white.withOpacity(.2),
  ),
  // ...
)
```

最终效果

![Xnip2021-09-23_17-24-55.jpg](https://cdn.nlark.com/yuque/0/2021/jpeg/224563/1632389119671-3ae397cb-0ff1-4c0c-8fc2-b8cfce12e90c.jpeg#clientId=u1367e7e7-fd10-4&from=drop&id=ue971c282&margin=%5Bobject%20Object%5D&name=Xnip2021-09-23_17-24-55.jpg&originHeight=500&originWidth=800&originalType=binary&ratio=1&size=19917&status=done&style=none&taskId=u61bd0d22-f78d-4f6d-8878-638e4a56afd)

这里可以使用一个便捷工具生成代码，以产生不同的效果

[https://neumorphism.coldstone.fun](https://neumorphism.coldstone.fun)

对于 Web 可以使用另一个工具

[https://neumorphism.io](https://neumorphism.io)
​
## 优点与缺点

主要优点在于这种效果给予用户带来的新鲜感，同时它可以与其他风格混合使用。

它的缺点在于

1. 层次结构弱

界面上缺少信息层级关系，会对用户的决策过程及思考过程产生重大影响。如存在多个可操作的内容，但是重点不突出，这会让用户在当前的流程上产生困惑，从而可能导致错误的判断和误操作，好的 UI/UX 不需要让用户思考。

2. 对比度低，可辨识性较差

新拟物仅通过柔和的阴影来区分元素，缺少对比度，因此对视力低下、失明、色盲的用户来说，可辨识性较差，不太友好。

3. 增加开发难度

这个风格的实现是对元素增加两个不同方向的投影，通过代码可以实现，但是需要对每个元素添加投影，加大工作量。

## 总结

新拟物设计诞生于拟物设计，它只是一种设计风格，使用场景受限，现实设计中还需要谨慎使用，可以逐渐的应用在细小的元素上。但是任然值得去尝试。

## 参考

[Neumorphism in user interfaces](https://uxdesign.cc/neumorphism-in-user-interfaces-b47cef3bf3a6)
[Neumorphism: why it’s all the hype in UI design](https://www.justinmind.com/blog/neumorphism-ui/)
[Neumorphism in Flutter](https://tonyowen.medium.com/neumorphism-in-flutter-f46fe25bf9d4)​
[新拟物风格，UI设计的新趋势还是昙花一现？](https://www.zcool.com.cn/article/ZMTEwNzMwMA==.html)
[完整梳理！上半年最热门的新拟物设计趋势是如何演变的？](https://www.uisdc.com/neumorphism-design-trends)​
