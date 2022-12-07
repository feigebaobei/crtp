#!/usr/bin/env node

// 依赖
const program = require('commander')
const fs = require('fs')
const fsPromises = require('fs/promises')
const mkdirp = require('mkdirp')
const path = require('path')
const util = require('util')
const chalk = require('chalk')
// const execa = require('execa')
const childProcess = require('child_process')

// 工具
const {log} = console
const utils = require('../utils/index.js')
// const assetsConfig = require('./config.js')
// const customConfig = require(path.resolve(process.cwd(), './crtp.config.js'))
let customConfig = {}
// let t = fs.statSync(path.resolve(process.cwd(), './crtp.confisg.js'))
// log('wertyt43', t)
const defaultConfig = require('../utils/defaultConfig.js')
// const { dirname } = require('path')
const config = Object.assign({}, defaultConfig, customConfig)
// console.log('config', config)

// 考虑删除它。使用fsPromises替换。
let pUtil = {
	pReadFile: util.promisify(fs.readFile),
	pWriteFile: util.promisify(fs.writeFile),
	pReaddir: util.promisify(fs.readdir),
	pRm: util.promisify(fs.rm),
	pFstat: util.promisify(fs.fstat),
}
// 考虑删除它。因默认配置项从配置文件中取得
// let defaultOptions = {
// 	readme: {
// 		packageName: 'packageName',
// 		filename: 'readme.md'
// 	},
// 	demo: {
// 		filename: 'demo.md'
// 	},
// 	baseCars: {
// 		filename: 'baseCars.vue'
// 	},
// 	baseDemoPage: {
// 		filename: 'baseDemoPage.vue'
// 	}
// }
let tip = (color, str) => {
	// 可以按级别显示提示
	log(chalk[color](str))
}
let createDir = (sourcePath, targetPath) => {
	fsPromises.stat(targetPath).then(stats => {
	}).catch(err => {
		// 若不存在，则创建
		return fsPromises.mkdir(targetPath)
	}).then(async function () {
		// log(res)
		// 已经创建目标目录
		let elementList = await fsPromises.readdir(sourcePath)
		elementList.forEach(async function(element) {
			let elementPath = path.resolve(sourcePath, `./${element}`)
			let stats = await fsPromises.stat(elementPath)
			if (stats.isDirectory()) {
				// log(`这是一个目录 ${elementPath}`)
				createDir(elementPath, path.resolve(targetPath, `./${element}`))
			} else {
				// log(`这是一个文件 ${elementPath}`)
				let cont = await fsPromises.readFile(elementPath, 'utf-8')
				let tp = path.resolve(targetPath, `./${element}`)
				let temp = await fsPromises.writeFile(tp, cont)
				if (!temp) {
					log(`创建成功 ${tp}`)
				}
			}
		})
	})
}

// 考虑使用流处理
let initFile = (fileType, userOption) => {
	// console.log(userOption)
	let {pReadFile, pWriteFile} = pUtil
	let fileList = userOption.file || [`./${fileType}`]
	let maxLen = fileList.reduce((r, c) => {
		return Math.max(r, c.length)
	}, 0)
	pReadFile(path.resolve(__dirname, `../assets/${fileType}`), 'utf-8').then((textContent) => {
		return fileList.map(item => {
			return mkdirp(path.resolve(process.cwd(), path.dirname(item))).then(() => {
				// 替换
				if (userOption.macroSubstitution) {
					let arr = []
					for (let i = 0; i < userOption.macroSubstitution.length; i += 2) {
						if (userOption.macroSubstitution[i] && userOption.macroSubstitution[i + 1]) {
							arr.push([userOption.macroSubstitution[i], userOption.macroSubstitution[i + 1]])
						}
					}
					arr = arr.filter(item => item.length === 2)
					textContent = arr.reduce((r, [origin, target]) => {
						let reg = new RegExp(origin, 'g')
						r = r.replace(reg, target)
						return r
					}, textContent)
				}
				// 使用选项
				switch (fileType) {
					case '.npmrc':
						textContent = `registry = ${utils.npmRegistry[userOption.registry]}` // https://registry.npmjs.org
						break
				}
				// 写入
				return pWriteFile(path.resolve(process.cwd(), item), textContent, 'utf-8').then(() => {
					log(chalk.blue(`创建${utils.fillEmpty(item, maxLen)} - 完成`))
				})
			}).catch(() => {
				log(chalk.red(`创建${utils.fillEmpty(item, maxLen)} - 失败`))
			})

		})
	}).catch(e => {
		log(chalk.red(`创建${fileList} - 失败`))
		log(chalk.yellow('  不存在该模板文件'))
	})
}
// 创建目录
// 兼容创建文件
let initDir = (dirName, userOption) => {
	let resolvedPath = path.resolve(__dirname, `../assets/${dirName}`)
	fsPromises.stat(resolvedPath).then(stats => {
		userOption.dir.forEach(dir => {
			let targetPath = path.resolve(process.cwd(), dir)
			createDir(resolvedPath, targetPath)
		})
	}).catch(err => {
		log(`不存在该模板目录 ${resolvedPath}`)
	})
}
// crtp addFile abc.md --file ./path/to/file.md
let addFile = (filename, userOption) => {
	let {pReadFile, pWriteFile} = pUtil
	pReadFile(path.resolve(process.cwd(), userOption.file), 'utf-8').then((textContent) => {
		return pWriteFile(path.resolve(__dirname, '../assets', filename), textContent, 'utf-8')
	}).then(() => {
		log(chalk.blue(`添加模板文件${filename} - 完成`))
	}).catch(() => {
		log(chalk.red(`添加模板文件${filename} - 失败`))
	})
}
let addDir = (dirName, userOption) => {
	// 检查模析文件是否存在
	fsPromises.stat(path.resolve(__dirname, '../', config.asserts, `./${dirName}`)).then(stats => {
		log(chalk.red('该模板已经存在'))
		// 询问用户是否覆盖
	}).catch(() => {
		let sourcePath = path.resolve(process.cwd(), userOption.dir)
		let targetPath = path.resolve(__dirname, '../', config.asserts, `./${dirName}`)
		fsPromises.mkdir(targetPath).then(() => {
			createDir(sourcePath, targetPath)
		}).catch(err => {
			log(err)
		})
	})
}

let list = () => {
	fsPromises.readdir(path.resolve(__dirname, '../assets')).then(async function (elementList) {
		elementList.forEach(async function(ele) {
			let stats = await fsPromises.stat(path.resolve(__dirname, `../assets/${ele}`))
			isDir = stats.isDirectory()
			// 考虑对齐后输出
			log(`${chalk.blue(ele)}		${isDir ? 'directory' : 'file'}`)
		})
	})
}
// 是否存在
let isexist = (file) => {
	let {pReaddir} = pUtil
	// 可以使用fsPromises重写
	pReaddir(path.resolve(__dirname, '../assets')).then(files => {
		if (files.includes(file)) {
			log(chalk.blue('true'))
		} else {
			log(chalk.yellow('false'))
		}
	}).catch(() => {
		log(chalk.red(`查询模板文件 - 失败`))
	})
}
let delFile = (filename) => {
	let {pRm} = pUtil
	pRm(path.resolve(__dirname, '../assets', filename)).then(() => {
		log(chalk.blue(`删除模板文件${filename} - 成功`))
	}).catch(() => {
		log(chalk.red(`删除模板文件${filename} - 失败`))
	})
}

let	initProj = (projName, userOption) => {
	let projPath = path.resolve(process.cwd(), userOption.path || '', projName)
	mkdirp(projPath).then(() => {
		return new Promise((s, j) => {
			childProcess.exec('npm init -y', {
	            cwd: projPath
	        }, (err) => {
	        	if (err) {
	        		j(err)
	        	} else {
		        	s()
	        	}
	        })
		})
	})
	// 暂时没用于配置文件，所以不创建此文件
	// create crtp.config.json
	// .then(() => {
	// 	// 未来从`<root>/data/`目录下取。
	// 	let cfg = '{}'
	// 	let {pWriteFile} = pUtil
	// 	return pWriteFile(path.resolve(projPath, './crtp.config.json'), cfg, 'utf-8')
	// })
	// op package.json
	.then(() => {
		if (
			(userOption['packageName'] && userOption['packageName'] !== projName) ||
			(userOption['packageVersion'] && userOption['packageVersion'] !== '1.0.0') ||
			(userOption['packageMain'] && userOption['packageMain'] !== 'index.js')
		) {
			let {pReadFile, pWriteFile} = pUtil
			return pReadFile(path.resolve(projPath, './package.json'), 'utf-8').then((cont) => {
				let p = JSON.parse(cont)
				if (userOption['packageName'] && userOption['packageName'] !== projName) {
					p.name = userOption['packageName']
				}
				if (userOption['packageVersion'] && userOption['packageVersion'] !== projName) {
					p.version = userOption['packageVersion']
				}
				if (userOption['packageMain'] && userOption['packageMain'] !== projName) {
					p.main = userOption['packageMain']
				}
				return pWriteFile(path.resolve(projPath, './package.json'), JSON.stringify(p, null, 2), 'utf-8')
			}).then(() => {return}).catch((e) => {
				log(chalk.red(`修改packag.json - 失败`))
			})
		} else {
			return
		}
	})
	// lerna init
	.then(() => {
		if (userOption.lernaInit) {
			return new Promise((s, j) => {
				childProcess.exec('lerna init', {
					cwd: projPath
				}, e => e ? j(e) : s())
			})
		} else {
			return
		}
	})
	// op readme.md
	.then(() => {
		if (userOption.readme) {
			return new Promise((s, j) => {
				// 因在子进程中处理，所以不会在主进程输出日志。
				childProcess.exec('crtp initFile readme.md', {
					cwd: projPath
				}, err => {
					err ? j(err) : s()
				})
			})
		} else {
			return
		}
	})
	// op .gitignore
	.then(() => {
		if (userOption.gitignore) {
			return new Promise((s, j) => {
				childProcess.exec('crtp initFile .gitignore', {
					cwd: projPath
				}, err => {
					err ? j(err) : s()
				})
			})
		} else {
			return
		}
	})
	.then(() => {
		log(chalk.blue(`创建项目${projPath} - 成功`))
	}).catch(() => {
		log(chalk.red(`创建项目${projPath} - 失败`))
	})
}

// for temp
let ipFn = (userOptions) => {
	// cwd
	let cmd = ''
	if (userOptions.npmrc) {
		cmd += 'crtp initFile .npmrc && '
	}
	if (userOptions.prettier) {
		cmd += 'crtp initFile .prettierignore && '
		cmd += 'crtp initFile .prettierrc.json && '
		cmd += 'npm i -E -D prettier && '
	}
	if (userOptions.readme) {
		cmd += 'crtp initFile readme.md && '
	}
	cmd = cmd.slice(0, -4)
	console.log('cmd:', cmd)
	// if (userOptions.npmrc) {
	// 	cmd = 'crtp initFile .npmrc && '
	// }
	// if (userOptions.npmrc) {
	// 	cmd = 'crtp initFile .npmrc && '
	// }
	cmd = cmd.slice(0, -4)
	new Promise((s, j) => {
		childProcess.exec(cmd, {
			// cwd: process.cwd()
		}, (err, data) => {
			err ? j(err) : s(data)
		})

	})
}

let changedFile = (userOption) => {
	let cmd = 'git log --name-only'
	if (userOption.after) {
		cmd += ` --after="${userOption.after}"`
	}
	if (userOption.before) {
		cmd += ` --before=${userOption.before}`
	}
	log(cmd)
	new Promise((s, j) => {
		childProcess.exec(cmd, {
			cwd: process.cwd()
		}, (err, data) => {
			err ? j(err) : s(data)
		})
	}).then(data => {
		let reg = /\n\S*\.md/g
		let res = data.match(reg)
		res = res.map(item => item.slice(1))
		res = [...new Set(res)]
		log(res)
	})
}

let configValidate = async (userOption) => {
	let configPath = path.resolve(process.cwd(), userOption.config)
	let cont = await fsPromises.readFile(configPath, 'utf-8')
	cont = JSON.parse(cont)
	if (typeof cont.assets !== 'string') {
		log(chalk.red(`配置项 assets - 错误`))
	} else if (!['npm', 'yarn', 'pnpm'].includes(cont.npmClient)) {
		log(chalk.red(`配置项 npmClient - 错误`))
	} else {
		log(chalk.blue(`配置文件 ${userOption.config} - 正确`))
	}
}

// crtp init
// 初始化配置文件
// 测试通过
program
	.command('init')
	.description('初始化配置文件')
	.action(async function () {
		let projPath = path.resolve(process.cwd())
		let cont = await fsPromises.readFile(path.resolve(__dirname, '../assets/crtp.config.js'), 'utf-8')
		fsPromises.writeFile(path.resolve(projPath, './crtp.config.js'), cont)
		log(chalk.blue('初始化完成'))
	})

// crtp initFile <fileType> [--file ...]
// 以指定模板文件为模板创建文件。
// 测试通过
program
	.command('initFile <fileType>')
	// .option('-d, --debug', 'output extra debugging')
	// .option('--debug', 'output extra debugging')
	.description('以指定模板文件为模板创建文件。')
	.option('--file [file...]', 'name and path of file')
	// Macro substitution
	.option('-st, --macroSubstitution [macroSubstitution...]', 'please input origin target') // 设置替换项可优化
	// 为所有模板文件开辟选项
	// .option('--config [configFilePath]', '指定配置文件的路径', './crtp.config.json')
	.option('--registry [registry]', '指定注册器。可选项: npm(default), yarn, tencent, cnpm, taobao, npmMirror, guazi', 'npm')
	.action((fileType, options) => {
		initFile(fileType, options)
	})

// crtp addFile <filename> --file <path/to/file.ext>
// 把指定文件设置为模板文件
// 测试通过
program
	.command('addFile <filename>')
	.description('把指定文件设置为模板文件')
	.option('--file <file>', 'path to file')
	.action((filename, options) => {
		addFile(filename, options)
	})

// crtp initDir <dirName> [--dir ...]
program
	.command('initDir <dirName>')
	.description('按指定模板目录生成目录')
	.option('--dir [dir...]', 'name and path of dir', [])
	.action((dirName, options) => {
		initDir(dirName, options)
	})

// crtp addDir <dirname> --dir <path/to/localDir>
// 把指定目录设置为模板目录
// 测试通过
program
	.command('addDir <dirName>')
	.description('把指定目录设置为模板目录')
	.option('--dir <dir>', 'path to local dir (绝对路径)')
	.action((dirName, options) => {
		addDir(dirName, options)
	})

// crtp list
// 列出所有模板文件
// 测试通过
// crtp ls
program
	.command('list')
	.alias('ls')
	.action(() => {
		list()
	})

// crtp -v
// crtp --Version
// 列出crtp-cli的版本号
// 测试通过
program
	// .command('-v')
	// .option('-v', 'list version of crtp-cli')
	// .option('--Version', 'list version of crtp-cli')
	.option('-v, --Version', 'list version of crtp-cli')
	.action(() => {
		pUtil.pReadFile(path.resolve(__dirname, '../package.json'), 'utf-8').then(res => {
			log(JSON.parse(res).version)
		})
	})

// crtp isExistFile <filename>
// 查询指定模板文件是否存在
// 测试通过
program
	.command('isExistFile <filename>')
	.description('查询指定模板文件是否存在')
	.action((filename) => {
		isexist(filename)
	})

// crtp delFile <filename>
// 删除指定模板文件
// 测试通过
program
	.command('delFile <filename>')
	.description('删除指定模板文件')
	.action((filename) => {
		delFile(filename)
	})

// crtp initProj <projName> --path ./
// 待完善
program
	.command('initProj <projName>')
	.option('--path [path]', 'input path of project')
	// 开发几个个性packag.json中字段的选项
	// 以package-开头
	// .option('--packageName [pacme]', 'input name of package.json')
	// 会把中划线命名法改为驼峰命名法。
	.option('--packageName [packageName]',         'input name of package.json')
	.option('--packageVersion [packageVersion]',   'input version of package.json')
	.option('--packageMain [packageMain]',         'input main of package.json')
	.option('--lernaInit [lernaInit]',             '是否使用lerna init初始化项目？')       // 如何限定为boolean
	.option('--readme [readme]',                   '是否生成初始化readme.md', true)
	.option('--no-readme [readme]',                '是否生成初始化readme.md')             // 此选项的默认值是false.
	.option('--gitignore [gitignore]',             '是否生成初始化.gitignore', true)
	.option('--no-gitignore [gitignore]',          '是否生成初始化.gitignore')
	.action((projName, options) => {
		initProj(projName, options)
	})

// 暂定为ip
// crtp ip
// 还有好多工程化的初始化文件
program
	// .command('ip <projName>')
	.command('ip')
	// .option('--path [path]', '项目所在的目录')
	.option('--npmrc [npmrc]', 'npmrc', true)
	.option('--prettier [prettier]', 'prettier', true)
	.option('--readme [readme]', 'readme', true)
	.action((options) => {
		ipFn(options)
	})

// 列出指定时间范围内有改变的文件
// crtp chengedFile <range>
program
	.command('changedFile')
	.description('列出指定时间范围内有改变的文件')
	.option('--after [after]', '开始时间', utils.afterDay(7))
	.option('--before [before]', '结束时间')
	.action((options) => {
		changedFile(options)
	})

// 验证配置文件是否正确
// crtp configValidate --config
// 测试通过
program
	.command('configValidate')
	.description('验证配置文件是否正确')
	// 设置了默认值
	.option('--config [configFilePath]', '指定配置文件的路径', './crtp.config.json')
	.action((options) => {
		configValidate(options)
	})



program.parse(process.argv)

