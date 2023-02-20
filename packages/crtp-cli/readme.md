# `crtp-cli`

## overview
> 管理模板文件/目录的工具。  
> 目标：根据模板快速创建文件。  

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
# crtp init
# 在指定目录创建一个指定的模板文件
crtp initFile readme.md --file ./first/readme.md
# 添加自定义的模板文件
crtp addFile first.json --file ./first/projName/package.json
```

## configuration
默认配置文件：`<root>/crtp.config.js`

## api
`<>`为必填项  
`[]`为选填项  

|command|options|value|说明|demo||version|
|-|-|-|-|-|-|-|
||-v, --Version||列出当前版本||||
|init|||生成配置文件||||
|initFile |||以指定模板文件为模板创建文件。||||
||`<fileType>`||模板文件名||||
||--file [file...]||目标文件路径||||
||-st, --[macroSubstitution] [macroSubstitution...]||用于宏替换。用空格分开源与目标，多对替换之间用空格分割。若源与目标不成对，则忽略。|crtp initFile a.md --macroSubstitution a b c d e --   表示：把a替换为b，把c替换为d，忽略e。||v0.0.6|
||--registry [registry]|npm(default), yarn, tencent, cnpm, taobao, npmMirror, guazi|.npmrc的注册器|`crtp initFile .npmrc --registry cnpm`||0.0.9|
|addFile|||把指定文件设置为模板文件||||
||`<filename>`||模板文件名||||
||`--[file] <file>`||要成为模板文件的路径||||
|initDir|||按指定模板目录生成目录||||
||`<dirName>`||模板目录名||||
||`--dir [dir...]`||目标目录名||||
|addDir|||把指定目录设置为模板目录||||
||`<dirName>`||模板目录名||||
||`--dir <dir>`||要成为模板目录的路径||||
|list / ls|||列出所有模板文件||||
|isExistFile|||查询指定模板文件是否存在||||
||`<filename>`||模板文件名||||
|delFile|||删除指定模板文件||||
||`<filename>`||模板文件名||||
|delDir|||删除指定模板目录|||待开发|
|initProj||||||待完善|
||`<projName>`||||||
||--path|||||||
||--packageName|||||||
||--packageVersion|||||||
||--packageMain|||||||
||--lernaInit|||||||
||--readme|||||||
||--no|||||||
||--gitignore|||||||
||--no|||||||
|ip|||在当前目录中执行若干工程化命令|||||
||--npmrc|boolean 默认为true|是否生成 .npmrc 文件|||||
||--prettier|boolean 默认为true|是否生成.prettierignore .prettierrc.json|||||
||--readme|boolean 默认为true|是否生成 readme.md|||||

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
> crtp-cli中的配置从配置文件中得到后与用户设置的配置合并后再使用。
> 使用loadFile引入文件（包括配置文件）。它是generator方法。
> 配置文件  
    > 在配置文件中为指定的模板文件设置插件列表。  
    > 为指定的基本设置插件。pluginFn(content) -> contentOther  
    > 使用配置文件中指定的包管理工具  
> 可开发插件。
> 接入测试工具  
> 本项目中基于各开发类框架开发。为它们提供配置文件。或在一个目录中统一管理配置文件，或……
> 开发模块的顺序
> 优先级 cli > crtp.config.js > 默认配置
> 支持 cli / js
> 验证配置文件是否正确  

