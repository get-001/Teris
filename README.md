# 俄罗斯方块游戏

## 概述

<!-- react-native -- 移动端 -->

使用的技术：webpack + jQuery + TypeScript + 面向对象开发

项目目的：

- 学习 TS 如何结合 webpack 做开发
- 巩固 TS 的知识
- 锻炼逻辑思维
- 体验面向对象编程的思想

插件安装

- yarn add -D webpack webpack-cli
- yarn add -D html-webpack--plugin
- yarn add -D clean-webpack-plugin
- yarn add -D webpack-dev-server
- yarn add -D typescript ts-loader
- yarn add jquery
- yarn add -D @types/jquery

单一职能原则：每个类只做跟它相关的一件事情。
开闭原则：系统中的类，应该对扩展开放，对修改关闭。
开发模式：数据·界面分离模式。

## 开发路线

- 创建小方块类(Square)
- 创建显示类(SquarePageViewer)
- 创建形状类(SquareGroup)
- 创建俄罗斯方块的生产者(Teris)
- 创建规则类(TerisRule)
- 开发旋转类
  旋转的本质：根据当前形状 => 新的形状
  异议 有些方块是不旋转的、有些方块旋转时只有两种状态
  希望 rotate 方法有一种通用的实现方式，不同的情况下会有不同的实现。
  解决方案 将`SquareGroup`作为父类，其他的方块都是它的子类，子类可以重写(覆盖)父类的方法 (继承)
- 开发游戏类(Game)
- 触底处理
  - 切换方块
  - 保存已下落的小方块
  - 消除方块的处理
  - 判断游戏是否已经结束
- 界面完善以及积分机制

## 项目总结

为什么要学习面向对象的编程方式？

1. 面向对象带来了新的开发方式
2. 面向对象开发已经非常成熟，特别善于解决复杂问题。
3. TypeScript 的某些语法是专门为面向对象准备的。
4. 学习一些设计模式
5. 游戏特别容易使用面向对象的思维
