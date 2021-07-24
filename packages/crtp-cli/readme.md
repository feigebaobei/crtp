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
默认配置文件：`path/to/file.json`。

## api
```
crtp initProj <projName> [--path <projPath>]
crtp initFile <fileType> [--file file...] [--packageName]
crtp addFile <filename> <file>
crtp listFile
crtp lsFile
crtp isExistFile <filename>
crtp delFile <filename>
```

## basc file
用于初始化文件。
已内置的基础文件：
- readme.md
- demo.mdd
- .gitignore

## principle
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
> 未来迭代计划。
> 未来迭代计划。
> 未来迭代计划。
> 未来迭代计划。
> 未来迭代计划。