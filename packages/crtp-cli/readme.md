# `crtp-cli`

## overview
> 目标是前端项目工程化工具。

### feature
- 初始化项目
- 初始化文件
    + 添加自定义基础文件
    + 列出自定义基础文件
    + 查询自定义基础文件
    + 删除自定义基础文件

## install
`npm i crtp-cli -g`

## usage
```
// 在指定目录初始化一个指定项目。可在选项中修改packag.json的一部分字段。
crtp initProj projName --path ./first --packageName 'pn'
// 在指定目录创建一个指定的基础文件
crtp ininFile readme.md --file ./first/projName
// 添加自定义的基础文件
crtp addFile first.json --file ./first/projName/package.json
```

## configuration
默认配置文件：`<root>/crtp.config.json`

## api
```
// 创建项目
crtp initProj <projName> [--path <projPath>]
// 创建基本文件
crtp initFile <fileType> [--file file...] [--packageName]
// 安装基本文件
crtp addFile <filename> <file>
// 列出已经安装的基本文件
crtp listFile
// 列出已经安装的基本文件
crtp lsFile
// 检查是否安装指定基本文件
crtp isExistFile <filename>
// 删除指定的已安装基本文件
crtp delFile <filename>
```

## basc file
用于初始化文件。
已内置的基础文件：
- readme.md
- demo.md
- .gitignore

## principle
- 基本文件应该由脚本生成。
- 应该由脚本控制项目结构变化。

### 初始化项目
使用`child_process`调用`npm init -y`。现修改package.json。

### 操作基础文件
在此包的`<root>/assets/`中保存着基础文件。初始化时从此读取再写入指定位置。添加时从指定位置读取再写入此目录。

### uml
```
暂无
```

## todo
> 未来迭代计划。
> 创建配置文件。crtp-cli中的配置从配置文件中得到后与用户设置的配置合并后再使用。
> 使用loadFile引入文件（包括配置文件）。它是generator方法。
> 解决配置文件太多的问题
> 控制安装配置文件是否独立配置文件
> 配置文件
    > 在配置文件中为指定的基本文件设置插件列表。
    > 为指定的基本设置插件。pluginFn(content) -> contentOther
> 可开发插件。
> 本项目中基于各开发类框架开发。为它们提供配置文件。或在一个目录中统一管理配置文件，或……
> 当前无法对initFile做插件扩展。
> 开发模块的顺序
> 生成文档
> 生成change log