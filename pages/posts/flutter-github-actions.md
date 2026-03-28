---
title: 使用 Github Actions 持续发布 Flutter 应用
categories:
  - 技术
tags:
  - Flutter
  - Github Actions
date: 2020-02-27 01:59:06
cover: /images/flutter-action-sm.jpg
---

本文讲解如何使用 Github Actions 构建并发布 Flutter 应用

<!--more-->

## 前言

[Github Actions](https://help.github.com/en/actions) 是 Github 提供的一种 CI/CD 服务，如果你的 Flutter 应用代码放在 Github 上，那就可以使用这个服务自动化进行应用测试，构建，发布工作了。


先说下 Github Actions 几个核心概念，感觉还是挺易懂的，不得不说 Github Actions 的设计很厉害 😄

**`Workflow file`**

配置工作流程的文件，YAML 格式，放在项目根目录的 `.github/workflows` 目录内

**`Workflow`**

由配置文件定义的一个工作流程，由一系列的的任务组成

**`Job`**

工作流程中的一个任务，由一系列的步骤 Step 组成

**`Step`**

一个任务其中的一个执行步骤，执行一些命令或者 Action

**`Action`**

一个步骤中的具体要进行操作，如拉取代码，发送请求等，可以使用自己或社区共享的 Action

**`Event`**

触发工作流程运行的事件，比如推送代码到仓库 push，创建一个版本标签 tag 等

**`Artifact`**

工程流程执行时产生的东西

**`Runner`**

就是工作流程运行的地方，Github 提供的服务器


## 示例

下面用一个示例项目来说明如何使用 Github Actions 发布 Flutter 应用，先放成果 [地址](https://github.com/xrr2016/flutter-github-gitlab/releases)

![main.yml](/images/flutter-release.jpg)

1. 首先创建一个 Flutter 项目

```sh
flutter create flutter_github_actions
```

2. 添加一个配置文件 `.github/workflows/main.yml`

![main.yml](/images/main-yml.jpg)

3. 配置工作流程，将代码推送到 Github

```yml
# main.yml

# 工作流程的名字
name: Test, Build and Release apk

# 工作流程触发的时机，这里是当一个版本标签推送到仓库时触发
on:
  push:
    tags:
      - v*

# 这个工作流程需要执行的任务
jobs:
  process:
    name: all process
    runs-on: ubuntu-latest
    # 这个任务的步骤
    steps:
      # 拉取项目代码
      - uses: actions/checkout@v2
      # 建立 java 环境
      - name: Setup Java JDK
        uses: actions/setup-java@v1.3.0
        with:
          java-version: "12.x"
      # 建立 Flutter 环境
      - name: Flutter action
        uses: subosito/flutter-action@v1.1.1
        with:
          channel: "stable"
          flutter-version: "1.12.x"
      # 下载项目依赖
      - run: flutter pub get
      # 执行测试
      - run: flutter test
      # 打包 APK
      - run: flutter build apk --release
      # 发布到 Release
      - name: Release apk
        uses: ncipollo/release-action@v1.5.0
        with:
          artifacts: "build/app/outputs/apk/release/*.apk"
          token: ${{ secrets.GITHUB_RElEASE_TOKEN }}

```


4. 创建 Token

要把构建出来的 apk 发布到仓库的 Release，还需要创建一个  [Personal access token](https://github.com/settings/tokens) 提供发布 action 访问和操作代码仓库的权限，注意不要关闭浏览器标签，因为这个 token 只有在第一次创建的时候可见。

![token](/images/flutter-gtihub-token.jpg)

5. 添加环境变量

最后为了能在工作流程中创建的 token，需要在仓库的 secrets 里添加一个环境变量 `GITHUB_RElEASE_TOKEN` 来储存 token 值

![secrets](/images/github-secrets.jpg)

6. 触发构建

最后创建一个版本标签，推送到仓库触发工作流程

```sh
git tag v1.0.0

git push --tag
```

然后就可以在仓库的 Actions 里面看到正在运行的工作流程了

![workflow](/images/github-workflow.jpg)

## 总结

总结一下就是以下 4 个步骤

1. 创建一个工作流程的配置文件 `.github/workflows/main.yml`
2. 创建一个 Personnal access token
3. 在项目的 serect 里面添加一个环境变量 `GITHUB_RElEASE_TOKEN`
4. 推送一个版本标签🏷️，触发工作流程

之后就可以在每次发布标签后自动发布了

## 更新

构建 Web 应用，发布到 Gihub Pages


```yml
# 启用 Flutter web
- name: Enable flutter web
  run: flutter config --enable-web
# 构建 web 应用
- name: Build Web App
  run: flutter build web
# 部署到 Github Pages
- name: deploy
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.TOKEN }}
    publish_dir: ./build/web
```
