# PhpWebStudy

<a>
  <img src="https://vip.xpfme.com/phpwebstudy/icon.png" width="256" alt="App Icon" />
</a>

[English](./README.md) | 简体中文

## mac下PHP和web开发环境管理工具

[![GitHub release](https://img.shields.io/github/release/xpf0000/PhpWebStudy.svg)](https://github.com/xpf0000/PhpWebStudy/releases) [![Build Status](https://travis-ci.org/xpf0000/PhpWebStudy.svg?branch=master)](https://travis-ci.org/xpf0000/PhpWebStudy) [![Build status](https://ci.appveyor.com/api/projects/status/l11d5h05xwwcvoux/branch/master?svg=true)](https://ci.appveyor.com/project/xpf0000/motrix/branch/master) [![Total Downloads](https://img.shields.io/github/downloads/xpf0000/PhpWebStudy/total.svg)](https://github.com/xpf0000/PhpWebStudy/releases)

PhpWebStudy 是一款mac下PHP和web开发环境管理工具,包含php,nginx,apache,msyql,memcached,redis以及host管理
## ✨ 特性

- 简洁明了的图形操作界面
- 版本切换 根据开发需要 选择对应的版本进行开发调试
- 各软件自定义配置
- 日志文件即时查看
- host管理

## 💽 安装稳定版

[GitHub](https://github.com/xpf0000/PhpWebStudy/releases) 提供了已经编译好的稳定版安装包，当然你也可以自己克隆代码编译打包。

## 🖥 应用界面

![scan.png](https://raw.githubusercontent.com/xpf0000/PhpWebStudy/master/screenshots/scan.jpg)

## ⌨️ 本地开发

### 克隆代码

```bash
git clone git@github.com:xpf0000/PhpWebStudy.git
```

### 安装依赖

```bash
cd PhpWebStudy
npm install
```

天朝大陆用户建议使用淘宝的 npm 源

```bash
npm config set registry 'https://registry.npm.taobao.org'
export ELECTRON_MIRROR='https://npm.taobao.org/mirrors/electron/'
export SASS_BINARY_SITE='https://npm.taobao.org/mirrors/node-sass'
```

如果喜欢 [Yarn](https://yarnpkg.com/)，也可以使用 `yarn` 安装依赖

### 开发模式

```bash
npm run dev
```

### 编译打包

```bash
npm run build
```

完成之后可以在项目的 `release` 目录看到编译打包好的应用文件

## 🛠 技术栈

- [Electron](https://electronjs.org/)
- [Vue](https://vuejs.org/) + [VueX](https://vuex.vuejs.org/) + [Element](https://element.eleme.io)

## 🤝 参与共建 [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)

如果你有兴趣参与共同开发，欢迎 FORK 和 PR。

## 📜 开源许可

基于 [MIT license](https://opensource.org/licenses/MIT) 许可进行开源。
