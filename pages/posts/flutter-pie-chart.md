---
title: Flutter 绘制图表（二）饼状图🍪
categories:
  - 技术
tags:
  - Flutter
date: 2020-06-09 14:08:00
cover: /images/flutter-pie-chart/cover.png
---

本文讲解如何使用 Flutter 绘制饼状图

<!--more-->

## 前言

接上文，本文讲解如何使用 Flutter 绘制饼状图，最终效果如图

<img src="/images/flutter-pie-chart/pie.gif" width="524" style="width: 260px">

[在线查看](https://dartpad.dartlang.org/b8a2b88647fa75df5d31445a93cb390f)

## 定义 PieChart & PiePart

第一步定义 `PieChart` 和 `PiePart` 类。`PieChart` 是整个饼状图控件，有 `datas` 和 `legends` 两个属性，表示饼图的数据和每部分的标识。
`PiePart` 表示饼图的一部分，有 `color`, `startAngle`, `sweepAngle` 三个属性，分别表示颜色，起始弧度值，占据圆形的弧度值。`PeiChartPainter` 类实现了具体的绘制方法。

```dart
class PiePart {
  double sweepAngle;
  final Color color;
  final double startAngle;

  PiePart(
    this.startAngle,
    this.sweepAngle,
    this.color,
  );
}

class PieChart extends StatefulWidget {
  final List<double> datas;
  final List<String> legends;

  const PieChart({
    @required this.datas,
    @required this.legends,
  });

  @override
  _PieChartState createState() => _PieChartState();
}

class _PieChartState extends State<PieChart> with TickerProviderStateMixin {
  double _total = 0.0;
  final List<PiePart> _parts = <PiePart>[];

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 300,
          height: 300,
          child: CustomPaint(
            painter: PeiChartPainter(
              total: _total,
              parts: _parts,
              datas: widget.datas,
              legends: widget.legends
            ),
          ),
        ),
      ],
    );
  }
}

class PeiChartPainter extends CustomPainter {
  final double total;
  final List<double> datas;
  final List<PiePart> parts;
  final List<String> legends;

  PeiChartPainter({
    @required this.total,
    @required this.datas,
    @required this.parts,
    @required this.legends,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // TODO
  }

  @override
  bool shouldRepaint(PeiChartPainter oldDelegate) => true;
}
```


## 绘制圆框

先绘制图表的圆框，在 `PeiChartPainter` 上添加 `drawCircle` 方法，以圆的中心点和圆的半径绘制一个空心圆形。

```dart
void drawCircle(Canvas canvas, Size size) {
  final sw = size.width;
  final sh = size.height;
  // 确定圆的半径
  final double radius = math.min(sw, sh) / 2;
  // 定义中心点
  final Offset center = Offset(sw / 2, sh / 2);

  // 定义圆形的绘制属性
  final paint = Paint()
    ..style = PaintingStyle.stroke
    ..color = Colors.grey
    ..strokeWidth = 1.0;

  // 使用 Canvas 的 drawCircle 绘制
  canvas.drawCircle(center, radius, paint);
}

@override
void paint(Canvas canvas, Size size) {
  drawCircle(canvas, size);
}
```

<img src="/images/flutter-pie-chart/circle.png" width="520" style="width: 260px">

## 绘制标识

这一步需要先在 `_PieChartState` 里面进行数据的初始化，然后绘制每个数据对应的标识，分以下几步进行

1. 计算出每个数据占总和的占比
2. 根据占比计算数据占据圆的弧度值
3. 根据之前数据占据圆形的弧度值计算出下一个数据的起始弧度值
4. 根据计算出的起始弧度值和占据弧度值创建 `PiePart` 对象
5. 使用 `PiePart` 对象绘制标识

```dart
class _PieChartState extends State<PieChart> with TickerProviderStateMixin {
  double _total = 0.0;
  final List<PiePart> _parts = <PiePart>[];

  @override
  void initState() {
    super.initState();

    List<double> datas = widget.datas;
    // 计算出数据总和
    _total = datas.reduce((a, b) => a + b);
    // 定义一个起始变量
    double startAngle = 0.0;

    for (int i = 0; i < datas.length; i++) {
      final data = datas[i];
      // 计算出每个数据所占的弧度值
      final angle = (data / _total) * -math.pi * 2;
      PiePart peiPart;

      if (i > 0) {
        // 下一个数据的起始弧度值等于之前的数据弧度值之和
        double lastSweepAngle = _parts[i - 1].sweepAngle;
        startAngle += lastSweepAngle;
        peiPart = PiePart(startAngle, angle, colors[i]);
      } else {
        // 第一个数据的起始弧度为 0.0
        peiPart = PiePart(0.0, angle, colors[i]);
      }
      // 添加到数组中
      _parts.add(peiPart);
    }
  }

    @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 300,
          height: 300,
          child: CustomPaint(
            // 将数据传给 PeiChartPainter
            painter: PeiChartPainter(
              total: _total,
              parts: _parts,
              datas: widget.datas,
              legends: widget.legends,
            ),
          ),
        ),
      ],
    );
  }
}
```
在 PeiChartPainter 上添加 `drawLegends` 方法，在圆框的外围绘制每部分对应的标识。

```dart
void drawLegends(Canvas canvas, Size size) {
  final sw = size.width;
  final sh = size.height;
  final double radius = math.min(sw, sh) / 2;
  final double fontSize = 12.0;

  for (int i = 0; i < datas.length; i++) {
    final PiePart part = parts[i];
    final String legend = legends[i];
    // 根据每部分的起始弧度加上自身弧度值的一半得到每部分的中间弧度值
    final radians = part.startAngle + part.sweepAngle / 2;
    // 根据三角函数计算中出标识文字的 x 和 y 位置，需要加上宽和高的一半适配 Canvas 的坐标
    double x = math.cos(radians) * (radius + 32) + sw / 2 - fontSize;
    double y = math.sin(radians) * (radius + 32) + sh / 2;
    final offset = Offset(x, y);

    // 使用 TextPainter 绘制文字标识
    TextPainter(
      textAlign: TextAlign.center,
      text: TextSpan(
        text: legend,
        style: TextStyle(
          fontSize: fontSize,
          color: Colors.black,
        ),
      ),
      textDirection: TextDirection.ltr,
    )
      ..layout(
        minWidth: 0,
        maxWidth: size.width,
      )
      ..paint(canvas, offset);
  }
}

@override
void paint(Canvas canvas, Size size) {
  drawCircle(canvas, size);
  drawLegends(canvas, size);
}

```

<img src="/images/flutter-pie-chart/legend.png" width="520" style="width: 260px">

计算文字位置用到的的三角函数是

![angle](/images/flutter-pie-chart/angle.png)

## 绘制数据对应的弧形

在 `PeiChartPainter` 上添加 `drawParts` 方法，绘制每个数据对应的弧形。

```dart
void drawParts(Canvas canvas, Size size) {
  final sw = size.width;
  final sh = size.height;
  final double fontSize = 10.0;
  final double radius = math.min(sw, sh) / 2;
  final Offset center = Offset(sw / 2, sh / 2);

  // 创建弧形依照的矩形
  final rect = Rect.fromCenter(
    center: center,
    width: radius * 2,
    height: radius * 2,
  );
  // 设置绘制属性
  final paint = Paint()
    ..strokeWidth = 0.0
    ..isAntiAlias = true
    ..style = PaintingStyle.fill;

  for (int i = 0; i < parts.length; i++) {
    final PiePart part = parts[i];
    // 设置每部分的颜色
    paint.color = part.color;
    // 使用 drawArc 方法画出弧形，参数依次是依照的矩形，起始弧度值，占据的弧度值，是否从中心点绘制，绘制属性
    canvas.drawArc(rect, part.startAngle, part.sweepAngle, true, paint);

    final double data = datas[i];
    // 计算每部分占比
    final String percent = (data / total * 100).toStringAsFixed(1);
    final double radians = part.startAngle + part.sweepAngle / 2;
    // 使用三角函数计算文字位置
    double x = math.cos(radians) * radius / 2 + sw / 2 - fontSize * 3;
    double y = math.sin(radians) * radius / 2 + sh / 2;
    final Offset offset = Offset(x, y);

    // 使用 TextPainter 绘制文字标识
    TextPainter(
      textAlign: TextAlign.start,
      text: TextSpan(
        text: '$data $percent%',
        style: TextStyle(
          fontSize: fontSize,
          color: Colors.white,
          fontWeight: FontWeight.bold,
        ),
      ),
      textDirection: TextDirection.ltr,
    )
      ..layout(
        minWidth: 0,
        maxWidth: size.width,
      )
      ..paint(canvas, offset);
  }
}

@override
void paint(Canvas canvas, Size size) {
  drawCircle(canvas, size);
  drawLegends(canvas, size);
  drawParts(canvas, size);
}
```

<img src="/images/flutter-pie-chart/part.png" width="520" style="width: 260px">

## 添加动画

最后给饼图添加一个数据不断增长的动画效果，在 `_PieChartState` 添加动画的控制器 `_controller` 和保存动画数据的 `_animateDatas` 数组。在 `initState` 中初始化动画控制器和填充 `_animateDatas` 数组。然后创建两个 `double` 类型的补间动画，将动画值传给 `PeiChartPainter` 使用即可。

```dart
class _PieChartState extends State<PieChart> with TickerProviderStateMixin {
  double _total = 0.0;
  AnimationController _controller;
  List<double> _animateDatas = [];
  final List<PiePart> _parts = <PiePart>[];

  @override
  void initState() {
    super.initState();
    // 初始化动画控制器
    _controller = AnimationController(
      duration: Duration(milliseconds: 3000),
      vsync: this,
    );

    List<double> datas = widget.datas;
    // 计算出数据总和
    _total = datas.reduce((a, b) => a + b);
    // 设置一个起始变量
    double startAngle = 0.0;

    for (int i = 0; i < datas.length; i++) {
      // 填充动画数组
      _animateDatas.add(0.0);
      final data = datas[i];
      // 计算出每个数据所占的弧度值
      final angle = (data / _total) * -math.pi * 2;
      PiePart peiPart;

      if (i > 0) {
        // 下一个数据的起始弧度值等于之前的弧度值相加
        double lastSweepAngle = _parts[i - 1].sweepAngle;
        startAngle += lastSweepAngle;
        peiPart = PiePart(startAngle, angle, colors[i]);
      } else {
        // 第一个数据的起始弧度为 0.0
        peiPart = PiePart(0.0, angle, colors[i]);
      }
      // 添加到数组中
      _parts.add(peiPart);

      CurvedAnimation curvedAnimation = CurvedAnimation(
        parent: _controller,
        curve: Curves.ease,
      );

      // 创建弧形的补间动画
      final partTween = Tween<double>(begin: 0.0, end: peiPart.sweepAngle);
      Animation<double> animation = partTween.animate(curvedAnimation);

      // 创建文字的补间动画
      final percentTween = Tween<double>(begin: 0.0, end: data);
      Animation<double> percentAnimation =
          percentTween.animate(curvedAnimation);

      // 在动画启动后不断改变数据值
      _controller.addListener(() {
        _parts[i].sweepAngle = animation.value;
        _animateDatas[i] =
            double.parse(percentAnimation.value.toStringAsFixed(1));
        setState(() {});
      });
      // 开始动画
      _controller.forward();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 300,
          height: 300,
          child: CustomPaint(
            // 将数据传给 PeiChartPainter
            painter: PeiChartPainter(
              total: _total,
              parts: _parts,
              datas: _animateDatas,
              legends: widget.legends,
            ),
          ),
        ),
        SizedBox(height: 80),
        Container(
          decoration: BoxDecoration(
            color: Colors.blue,
            shape: BoxShape.circle,
          ),
          child: IconButton(
            color: Colors.white,
            icon: Icon(Icons.refresh),
            onPressed: () {
              _controller.reset();
              _controller.forward();
            },
          ),
        ),
      ],
    );
  }
}
```

至此整个饼状图的绘制就完成了，传入数据即可使用 🎉🎉🎉

```dart
PieChart(
  datas: [60.0, 50.0, 40.0, 30.0, 90.0],
  legends: ['一月', '二月', '三月', '四月', '五月'],
);
```

完整代码地址：[pie_chart.dart](https://github.com/xrr2016/flutter-charts/blob/master/lib/charts/pie_chart.dart)

## 总结

本文说明了如何使用 Flutter 绘制一个饼状图，使用了一点三角函数，关键点在于计算出每个数据占据整个圆形的弧度值，以及数据的起始弧度值。
数值增长的动画效果使用一个 `AnimationController` 在开始动画后不断的更新绘制使用的数据，在将数据传递给 `PeiChartPainter` 使用即可实现。

## 附言

准备写一系列关于用 Flutter 画图表的文章，用来分享这方面的知识，这篇文章是这个系列的第二篇，预计 6 篇。

1. [Flutter 绘制图表（一）柱状图📊](https://coldstone.fun/post/2020/05/31/flutter-bar-chart/)
2. [Flutter 绘制图表（二）饼状图🍪](https://coldstone.fun/post/2020/06/09/flutter-pie-chart/)（本文）
3. Flutter 绘制图表（三）折线图📈
4. Flutter 绘制图表（四）雷达图🎯
5. Flutter 绘制图表（五）环状图🍩
6. Flutter 绘制图表（六）条形图📏
