# `crtp-cli`

## overview
> 管理模板文件/目录的工具。

### feature
- 初始化项目
- 初始化文件
    + 添加自定义模板文件（或目录）
    + 列出自定义模板文件（或目录）
    + 查询自定义模板文件（或目录）
    + 删除自定义模板文件（或目录）

## install
`npm i crtp-cli -g`

## usage
```shell
# 在当前目录下生成配置文件
crtp init
# 在指定目录初始化一个指定项目。可在选项中修改packag.json的一部分字段。
crtp initProj projName --path ./first --packageName 'pn'
# 在指定目录创建一个指定的模板文件
crtp ininFile readme.md --file ./first/projName
# 添加自定义的模板文件
crtp addFile first.json --file ./first/projName/package.json
```

## configuration
默认配置文件：`<root>/crtp.config.js`

## api
`<>`为必填项  
`[]`为选填项  

|command|options|说明||||
|-|-|-|-|-|-|
||-v, --Version|列出当前版本||||
|init||生成配置文件||||
|initFile||以指定模板文件为模板创建文件。||||
||`<fileType>`|模板文件名||||
||--file|目标文件路径||||
||--packageName|用于替换'packageName'|||在v0.0.4时不再支持此选项|
|addFile||把指定文件设置为模板文件||||
||`<filename>`|模板文件名||||
||--file|要成为模板文件的路径||||
|initDir||按指定模板目录生成目录||||
||`<dirName>`|模板目录名||||
||--dir|目标目录名||||
|addDir||把指定目录设置为模板目录||||
||`<dirName>`|模板目录名||||
||--dir|要成为模板目录的路径||||
|listFile||列出所有模板文件|||在v0.0.4时不再支持此命令|
|lsFile||列出所有模板文件|||在v0.0.4时不再支持此命令|
|list / ls||列出所有模板文件||||
|isExistFile||查询指定模板文件是否存在||||
||`<filename>`|模板文件名||||
|delFile||删除指定模板文件||||
||`<filename>`|模板文件名||||
|delDir||删除指定模板目录|||待开发|
|initProj||||||
||`<projName>`|||||
||--path||||||
||--packageName||||||
||--packageVersion||||||
||--packageMain||||||
||--lernaInit||||||
||--readme||||||
||--no||||||
||--gitignore||||||
||--no||||||


## 模板文件（或目录）
用于初始化文件。
已内置的模板文件：
- readme.md
- demo.md
- .gitignore

## principle
- 模板文件应该由脚本生成。
- 应该由脚本控制项目结构变化。

### 初始化项目
使用`child_process`调用`npm init -y`。现修改package.json。

### 操作模板文件
在此包的`<root>/assets/`中保存着模板文件。初始化时从此读取再写入指定位置。添加时从指定位置读取再写入此目录。

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
    > 在配置文件中为指定的模板文件设置插件列表。
    > 为指定的基本设置插件。pluginFn(content) -> contentOther
> 可开发插件。
> 本项目中基于各开发类框架开发。为它们提供配置文件。或在一个目录中统一管理配置文件，或……
> 当前无法对initFile做插件扩展。
> 开发模块的顺序
> 生成文档
> 生成change log
> 优先级 cli > crtp.config.js > 默认配置
> 支持 cli / js
> 接入测试

