---
title: 使用 Github Action 发布 Flutter 插件
categories:
  - 技术
tags:
  - Flutter
  - Github
date: 2020-07-28 14:49:16
cover: https://cdn.pixabay.com/photo/2020/04/06/13/37/coffee-5009730_960_720.png
---

本文说明如何使用 Github Actions 自动发布 Flutter 插件到 pub.dev

<!--more-->

## 前言

笔者有发布过几个 Flutter 插件，一直在手动更新。手动更新插件有点麻烦且容易失败（需要科学上网），因此研究了下如何使用 [Github Actions](https://help.github.com/en/actions)（Github 提供的一种 CI/CD 服务）自动发布插件到 pub.dev，这样做的好处有

1. 避免手动发布，节约上传时间
2. 在 Github 合并别人提交的代码后也可以立即发布

以下说明如何进行

## 添加流程

首先在插件的 `.github/workflows` 目录内创建一个配置文件 `publish.yml`。

![publish](/images/github-action-publish-flutter-plugin/publish.png)

内容如下

```yml
name: Publish to Pub.dev

# 流程触发时机，当有标签创建时触发，如 v1.0.0。当然也可以选择别的触发时机，如 push，release 等
on: create

jobs:
  publishing:
    runs-on: ubuntu-latest
    steps:
      # 拉取仓库代码
      - name: "Checkout"
        uses: actions/checkout@v2
      # 发布插件
      - name: Dart and Flutter Package Publisher
        uses: k-paxian/dart-package-publisher@v1.2
        with:
          # 设置发布插件需要的 Token
          accessToken: ${{ secrets.OAUTH_ACCESS_TOKEN }}
          refreshToken: ${{ secrets.OAUTH_REFRESH_TOKEN }}
```

流程中需要设置 `OAUTH_ACCESS_TOKEN` 和 `OAUTH_REFRESH_TOKEN` 这两个 Token，他们在 `.pub-cache/credentials.json` 的文件内，这个文件是第一次手动发布插件成功后自动生成的，在用户的 home 目录或者是安装 Flutter SDK 目录内。

![credentials](/images/github-action-publish-flutter-plugin/credentials.png)

拿到 Token 后去插件仓库添加以上两个 Secret，至此配置工作已完成 🎉

![secrets](/images/github-action-publish-flutter-plugin/secrets.png)

## 发布插件

现在每次更新插件只需要新增标签然后推送到仓库，就可以自动更新插件啦！

```
git tag v1.0.1

git push --tags
```

![action](/images/github-action-publish-flutter-plugin/action.png)

## 参考

[Dart and Flutter Package Publisher](https://github.com/marketplace/actions/dart-and-flutter-package-publisher)

第一次发布插件看这里 [Publishing your package](https://flutter.cn/docs/development/packages-and-plugins/developing-packages)
