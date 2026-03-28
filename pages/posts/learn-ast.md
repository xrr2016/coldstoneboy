---
title: 学习抽象语法树 AST
categories:
  - 技术
tags:
  - AST
  - Babel
  - ESLint
date: 2021-04-26 15:40:51
cover: /images/learn-ast/ast-cover.jpg
---

作为一个前端切图仔，工作中少不了用上 Babel，ESLint，Prettier 这些工具，但是这些工具背后的工作原理却不求甚解😅 

<!--more-->

## 前言

作为一个前端切图仔，工作中少不了用上 Babel，ESLint，Prettier 这些工具，但是这些工具背后的工作原理却不求甚解😅 ，最近才尝试去了解一番，没想到发现一个全新的世界，那就是 `AST` 中文名抽象语法树。

## 初识

> 在计算机科学中，抽象语法树（Abstract Syntax Tree，AST），或简称语法树（Syntax tree），是源代码语法架构的一种抽象表示。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。之所以说语法是“抽象”的，是因为这里的语法并不会表示出真是语法中出现的每个细节。比如嵌套括号被隐含在树的结构中，并没有以节点的形式呈现；二类似于 `if-condition-then`这样的条件跳转语句，可以使用带有三个分支的节点来表示。
> 和抽象语法树相对的是具体语法树（通常称作分析树）。一般的，在源代码的翻译和编译过程中，语法分析器创建出分析树，然后从分析树生成AST。一旦AST被创建出来，在后续的处理过程中，比如语义分析阶段，会添加一些信息。

[抽象語法樹](https://zh.wikipedia.org/wiki/%E6%8A%BD%E8%B1%A1%E8%AA%9E%E6%B3%95%E6%A8%B9)

让我们从一个全能的函数开始，它返回[生命、宇宙以及任何事情的终极答案](https://zh.wikipedia.org/wiki/%E7%94%9F%E5%91%BD%E3%80%81%E5%AE%87%E5%AE%99%E4%BB%A5%E5%8F%8A%E4%BB%BB%E4%BD%95%E4%BA%8B%E6%83%85%E7%9A%84%E7%B5%82%E6%A5%B5%E7%AD%94%E6%A1%88)

```javascript
function ask() {
  const answer = 42
  return answer
}
```

首先它是一个函数声明，函数名称为 `ask` ，函数体内定义了一个常量 answer 值为 42，最后返回 answer。把它输入到一个神奇的网站 [astexplorer](https://astexplorer.net/)，神秘的 `AST` 终于被揭开了面纱。

![ast](/images/learn-ast/ast.jpeg)

可以看出 `AST` 就是一个自上而下的树形结构，每一层有一个或多个节点组成，每个节点有一个 `type` 属性表示节点的类型，如 "FunctionDeclaration", "BlockStatement", "VariableDeclaration"，以及节点的其他属性。（节点的类型定义在 [ESTree](https://github.com/estree/estree) 这个仓库，它包括了 es5 到最新的 js 语法定义）。下图可以更清晰的看出这个函数 `AST` 的结构，至此我们对 `AST` 有了初步的认识。

![draw](/images/learn-ast/draw.jpeg)

## 解析

要得到代码的 `AST`，首先需要对代码进行解析。解析阶段接受源码并输出 `AST` ，它使用一个解析器对源码进行**词法分析**和**语法分析。** 词法分析将字符串形式的代码转换为一个语法片段数组 **Tokens** ，语法分析阶段把 **Tokens **转换成 `AST` 形式。

### 词法分析

**Tokens** 是一个数组，由代码语句的碎片组成，它们可以是数字、标签、标点符号、运算符，或者其它任何东西。

```javascript
// 源码
a + b

// Tokens
[
  { type: { ... }, value: "a", start: 0, end: 1, loc: { ... } },
  { type: { ... }, value: "+", start: 2, end: 3, loc: { ... } },
  { type: { ... }, value: "b", start: 4, end: 5, loc: { ... } },
]
```

### 语法分析

语法分析阶段把 **Tokens ** 数组转换成 `AST` 的形式便于后续操作，详细操作可以查看这里的[代码](https://github.com/starkwang/the-super-tiny-compiler-cn/blob/master/super-tiny-compiler-chinese.js#L446)。

## 遍历

有了 `AST` 就可以对这棵树进行从上到下的递归遍历，过程中访问树的节点，这里使用了一种设计模式 [访问者模式](https://zh.wikipedia.org/wiki/%E8%AE%BF%E9%97%AE%E8%80%85%E6%A8%A1%E5%BC%8F)，通过创建一个访问者 `visitor` 对象，这个对象中包括一些方法，在遍历 `AST` 过程中进行匹配，匹配成功就调用访问者的方法。

通过访问节点可以对源码进行语法检查，ESLint 就是基于此，以下是检测语法的规则示例（关于编写 ESLint 规则的详细内容可以查看此[链接](https://cn.eslint.org/docs/developer-guide/working-with-rules)）

#### 限制函数参数数量

思路是匹配类型为 `FunctionDeclaration` 的节点，`FunctionDeclaration` 表示这个节点为函数声明，如果函数的参数数量大于 3 个就进行提示。

```javascript
export default function (context) {
  return {
    // 访问 FunctionDeclaration 节点
    FunctionDeclaration: (node) => {
      // 判断函数参数个数
      if (node.params.length > 3) {
        context.report({
          node,
          message: "参数最多不能超过3个"
        });
      }
    }
  };
}
```

效果如下

![params](/images/learn-ast/params.png)

#### 限制嵌套的条件语句

匹配类型为 `IfStatement` 的节点，如果它的第一个子节点还是 `IfStatement` 就进行提示。

```javascript
export default function (context) {
  return {
    IfStatement(node) {
      const { consequent } = node;
      const { body } = consequent;

      // 判断第一个子节点类型是否是 IfStatement
      if (body[0] && body[0].type === "IfStatement") {
        context.report({
          node: body[0],
          message: "不允许嵌套的条件语句"
        });
      }
    }
  };
}

```

![if](/images/learn-ast/if.png)

## 修改

在遍历 `AST` 过程中可以对树的节点进行修改，如添加，移动，替换这些节点，也可以生成全新的 `AST`。

Babel 的作用就是修改 `AST` 上的节点，从而到达修改代码的效果。一个 Babel 插件是一个接收 `babel` 对象作为参数的函数，返回一个带有 `visitor` 属性的对象。`visitor` 对象中的每个函数接受 `path` 和 `state` 参数，以下是编写 Babel 插件示例，关于编写 Babel 插件可以查看此[链接](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-stages-of-babel)。

```javascript
// Babel 插件
export default function(babel) {
  return {
    visitor: {
      Identifier(path, state) {},
      // ...
    }
  };
}
```

### 将 `**` 语法转换为 `Math.pow`

```javascript
// Before
const a = 10 ** 2 
// After
const a = Math.pow(10, 2)
```

1. 找到 `**` 语法所在位置
2. 获取左右操作数
3. 创建 `Math.pow` 语句，替换原节点

```javascript
export default function (babel) {
  const { types: t } = babel;
  
  return {
    visitor: {
      // 访问二元表达式
      BinaryExpression(path) {
        const { node } = path
        // 如果操作符不是 ** 就退出
        if (node.operator !== '**') return
        const { left, right } = node
        // 创建调用语句
        const newNode = t.callExpression(
          t.memberExpression(t.identifier('Math'), t.identifier('pow')),
          [left, right]
        )
        // 替换原节点
        path.replaceWith(newNode)
      },
    }
  };
}

```

### 修改工具函数引入方式
```javascript
// Before
import { get, isFunction } from 'lodash'
// After
import get from "lodash/get";
import isFunction from "lodash/isFunction";
```

1. 找到 `lodash` 的 `import` 节点
2. 遍历所有的引入值，获取引用的 `name` 属性
3. 插入新生成的 `import` 节点
4. 删除原节点


```javascript
export default function (babel) {
  const { types: t } = babel;
  
  return {
    visitor: {
      // 访问导入声明
      ImportDeclaration(path) {
        let { node } = path
        if (node.source.value !== 'lodash') return
        const val = node.source.value

        node.specifiers.forEach((spec) => {
          if (t.isImportSpecifier(spec)) {
            const { local } = spec

            // 插入新的导入节点
            path.insertBefore(
              t.importDeclaration(
                [t.importDefaultSpecifier(local)],
                t.stringLiteral(`${val}/${local.name}`)
              )
            )
          }
        })
        // 删除原节点
        path.remove()
      },
    }
  };
}
```

## 生成

就是根据 `AST` 输出代码，下面通过两个工具说明。

### Jscodeshift

[jscodeshift](https://github.com/facebook/jscodeshift) 是一个 Facebook 开源的用来对 JavaScript 或者 TypeScript 文件运行转换的工具，它的目的是更方便的批量修改代码。它通过接受 **transformer **对源码进行转换，一个 **transformer **就是一个接受 `fileInfo`, `api`, `options` 参数并返回源码的函数。

```javascript
module.exports = function(fileInfo, api, options) {
  // transform `fileInfo.source` here
  // ...
  // return changed source
  return source;
};
```

示例，将 `<React.Fragment>` 转换成 `<>``</>` 语法，思路是找到 `name` 属性为 `Fragment` 的节点，然后将它的父节点清除。

```javascript
export default function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  root.find(j.JSXIdentifier).forEach((p) => {
    const { node } = p
    if (node.name !== 'Fragment') return

    j(p.parent).remove()
  })

  return root.toSource()
}

```

![header](/images/learn-ast/header.gif)

更多示例可查看这个[链接](https://github.com/cpojer/js-codemod/)

### Gogocode


[gogocode](https://github.com/thx/gogocode) 是最近发现的一个 `AST` 处理工具，号称全网最简单易上手，可读性最强，提供的示例提供类似于 jQuery 的 API。


一个替换变量名例子
```javascript
#!/usr/bin/env node

const $ = require('gogocode')
const code = `
  function ask() {
    const answer = 42
    return answer
  }
`
const newCode = $(code)
  .replace('ask', 'question')
  .replace('answer', 'result')
  .generate()

console.log(newCode)

// 输出
// function question() {
//   const result = 42
//   return result;
// }
```

![gogocode](/images/learn-ast/gogocode.gif)

## 总结

本文解释了什么是 `AST` 抽象语法树，如何获得代码的 `AST`，以及对 `AST` 进行遍历，修改和生成，利用 `AST` 我们可以开发的代码工具。

[本文代码地址](https://github.com/xrr2016/ast-learn)

## 相关链接

[Awesome AST](https://github.com/cowchimp/awesome-ast)
[The ESTree Spec](https://github.com/estree/estree)[ ](https://github.com/cowchimp/awesome-ast)
[Babel Handbook](https://github.com/jamiebuilds/babel-handbook)
[The Super Tiny Compiler](https://github.com/jamiebuilds/the-super-tiny-compiler)
[Working with Rules](https://cn.eslint.org/docs/developer-guide/working-with-rules)
[jscodeshift](https://github.com/facebook/jscodeshift)
[GOGOCODE](https://github.com/thx/gogocode)
