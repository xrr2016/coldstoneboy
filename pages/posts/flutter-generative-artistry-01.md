---
title: Flutter 绘制瓷砖线 Tiled Lines
categories:
  - 教程
tags:
  - Flutter
  - Generative artistry
date: 2020-07-07 16:20:50
cover: /images/flutter-generative-artistry-01/cover.png
---


前几天发现了一个使用 `<canvas>` 绘制图形的教程 generative artistry 感觉很有意思，尝试用 Flutter 实现。本文实现第一篇教程的图形 Tiled Lines 效果如下。

<!--more-->

## 前言

前几天发现了一个使用 `<canvas>` 绘制图形的教程 [generative artistry
](https://generativeartistry.com/tutorials/) 感觉很有意思，尝试用 Flutter 实现。本文实现第一篇教程的图形 Tiled Lines 效果如下。

<img src="/images/flutter-generative-artistry-01/tiled-lines.png" width="580" style="width: 290px">

## 创建画布

首先使用一个 `Container` 控件创建一个 `320*320` 大小的绘制区域，添加 `CustomPaint` 画布和一个继承 `CustomPainter`
的画笔 `TiledLinesPainter`。关于 `CustomPaint` 和 `CustomPainter` 的知识可以查阅这篇文章 [使用 Flutter 绘制图表（一）柱状图 📊](https://coldstone.fun/post/2020/05/31/flutter-bar-chart)。

```dart
import 'package:flutter/material.dart';

class TiledLines extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          width: 320.0,
          height: 320.0,
          decoration: BoxDecoration(
            border: Border.all(
              color: Colors.black,
              width: 1.0,
            ),
          ),
          child: CustomPaint(
            painter: TiledLinesPainter(),
          ),
        ),
      ),
    );
  }
}

class TiledLinesPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {}

  bool shouldRepaint(TiledLinesPainter oldDelegate) => false;
}

```

<img src="/images/flutter-generative-artistry-01/container.png" width="580" style="width: 290px">

## 绘制线条

创建好画布后在 `TiledLinesPainter` 的 `paint` 方法里进行绘制。添加一个 `_drawLine` 方法用来绘制线条，绘制线条需要起始点和终止点，通过参数将数值传入。

```dart
class TiledLinesPainter extends CustomPainter {
  void _drawLine(
    Canvas canvas,
    double x,
    double y,
    double width,
    double height,
  ) {
    final Paint paint = Paint()
      ..strokeCap = StrokeCap.square
      ..strokeWidth = 2;

    Offset p1 = Offset(x, y);
    Offset p2 = Offset(x + width, y + height);

    canvas.drawLine(p1, p2, paint);
  }

  @override
  void paint(Canvas canvas, Size size) {
    _drawLine(canvas, 0, 0, size.width, size.height);
  }

  bool shouldRepaint(TiledLinesPainter oldDelegate) => false;
}
```

<img src="/images/flutter-generative-artistry-01/line.png" width="580" style="width: 290px">

## 加入随机性

使用 `Random().nextBool()` 方法创建一个随机的布尔值，在绘制线条之前改变起始点和终止点的坐标，这样 `_drawLine` 方法就有了绘制不同方向的线条的能力。

```dart
void _drawLine(
    Canvas canvas,
    double x,
    double y,
    double width,
    double height,
  ) {
  final bool isLeftToRight = Random().nextBool();

  final Paint paint = Paint()
    ..strokeCap = StrokeCap.square
    ..strokeWidth = 2;

  Offset p1;
  Offset p2;

  if (isLeftToRight) {
    p1 = Offset(x, y);
    p2 = Offset(x + width, y + height);
  } else {
    p1 = Offset(x + width, y);
    p2 = Offset(x, y + height);
  }

  canvas.drawLine(p1, p2, paint);
}
```

<img src="/images/flutter-generative-artistry-01/line2.png" width="580" style="width: 290px">

## 绘制更多的线条

可以绘制更多的线条喽！给 `TiledLinesPainter` 添加一个 `step` 属性，表示在画布上每隔多长距离绘制一条线。使用 `step` 将画布分割为多个小的方格，在每个小的方格里面绘制线条。

```dart
class TiledLinesPainter extends CustomPainter {
  final double step;

  TiledLinesPainter(this.step);

  void _drawLine(
    Canvas canvas,
    double x,
    double y,
    double width,
    double height,
  ) {
    final bool isLeftToRight = Random().nextBool();

    final Paint paint = Paint()
      ..strokeCap = StrokeCap.square
      ..strokeWidth = 2;

    Offset p1;
    Offset p2;

    if (isLeftToRight) {
      p1 = Offset(x, y);
      p2 = Offset(x + width, y + height);
    } else {
      p1 = Offset(x + width, y);
      p2 = Offset(x, y + height);
    }

    canvas.drawLine(p1, p2, paint);
  }

  @override
  void paint(Canvas canvas, Size size) {
    for (double x = 0; x < size.width; x += step) {
      for (double y = 0; y < size.height; y += step) {
        _drawLine(canvas, x, y, step, step);
      }
    }
  }

  bool shouldRepaint(TiledLinesPainter oldDelegate) => false;
}

//...

TiledLinesPainter(20)
```

<img src="/images/flutter-generative-artistry-01/step.png" width="580" style="width: 290px">

## 绘制边框和阴影

最后给画布添加边框和阴影效果，大功告成！👏 感谢阅读。

```dart
import 'dart:math';
import 'package:flutter/material.dart';

class TiledLines extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    List<BoxShadow> shadows = [];
    double opacity = 0.1;

    // 添加画布阴影
    for (double i = 1; i <= 16; i++) {
      opacity -= 0.01;
      opacity = opacity > 0.01 ? opacity : 0.01;

      shadows.add(
        BoxShadow(
          offset: Offset(-i, i),
          color: Color.fromRGBO(0, 0, 0, opacity),
          blurRadius: 2,
          spreadRadius: 1,
        ),
      );
    }

    return Scaffold(
      body: Center(
        child: Container(
          width: 320.0,
          height: 320.0,
          decoration: BoxDecoration(
            // 添加画布边框
            border: Border.all(
              color: Colors.black,
              width: 20.0,
            ),
            boxShadow: shadows,
          ),
          child: Container(
            color: Colors.white,
            padding: const EdgeInsets.all(20.0),
            child: CustomPaint(
              painter: TiledLinesPainter(20),
            ),
          ),
        ),
      ),
    );
  }
}

class TiledLinesPainter extends CustomPainter {
  final double step;

  TiledLinesPainter(this.step);

  void _drawLine(
    Canvas canvas,
    double x,
    double y,
    double width,
    double height,
  ) {
    // 创建随机性
    final bool isLeftToRight = Random().nextBool();

    final Paint paint = Paint()
      ..strokeCap = StrokeCap.square
      ..strokeWidth = 2;

    Offset p1;
    Offset p2;

    // 设置线条的起始点和终止点
    if (isLeftToRight) {
      p1 = Offset(x, y);
      p2 = Offset(x + width, y + height);
    } else {
      p1 = Offset(x + width, y);
      p2 = Offset(x, y + height);
    }

    canvas.drawLine(p1, p2, paint);
  }

  @override
  void paint(Canvas canvas, Size size) {
    // 使用 step 分割画布，创建小的绘制方格
    for (double x = 0; x < size.width; x += step) {
      for (double y = 0; y < size.height; y += step) {
        _drawLine(canvas, x, y, step, step);
      }
    }
  }

  bool shouldRepaint(TiledLinesPainter oldDelegate) => false;
}

```

<img src="/images/flutter-generative-artistry-01/tiled-lines.png" width="580" style="width: 290px">

## 参考

[Tiled Lines](https://generativeartistry.com/tutorials/tiled-lines/)
