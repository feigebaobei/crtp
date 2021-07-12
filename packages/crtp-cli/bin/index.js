#!/usr/bin/env node

// 依赖
const program = require('commander')
const fs = require('fs')
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

let pUtil = {
	pReadFile: util.promisify(fs.readFile),
	pWriteFile: util.promisify(fs.writeFile),
	pReaddir: util.promisify(fs.readdir),
	pRm: util.promisify(fs.rm)
}
let defaultOptions = {
	readme: {
		packageName: 'packageName',
		filename: 'readme.md'
	},
	demo: {
		filename: 'demo.md'
	},
	baseCars: {
		filename: 'baseCars.vue'
	},
	baseDemoPage: {
		filename: 'baseDemoPage.vue'
	}
}
let tip = (color, str) => {
	// 可以按级别显示提示
	log(chalk[color](str))
}

let initFile = (fileType, userOption) => {
	let {pReadFile, pWriteFile} = pUtil
	let fileList = userOption.file || [`./${fileType}`]
	let maxLen = fileList.reduce((r, c) => {
		return Math.max(r, c.length)
	}, 0)
	pReadFile(path.resolve(__dirname, `../assets/${fileType}`), 'utf-8').then((textContent) => {
		return fileList.map(item => {
			return mkdirp(path.resolve(process.cwd(), path.dirname(item))).then(() => {
				if (userOption.packageName) {
					textContent = textContent.replace(/\{\{packageName}}/, userOption.packageName)
				}
				return pWriteFile(path.resolve(process.cwd(), item), textContent, 'utf-8').then(() => {
					log(chalk.blue(`创建${utils.fillEmpty(item, maxLen)} - 完成`))
				})
			}).catch(() => {
				log(chalk.red(`创建${utils.fillEmpty(item, maxLen)} - 失败`))
			})

		})
	})
}
// crtp addFile abc.md --file ./path/to/file.md
let addFile = (filename, userOption) => {
	let {pReadFile, pWriteFile} = pUtil
	pReadFile(path.resolve(process.cwd(), userOption.file), 'utf-8').then((textContent) => {
		return pWriteFile(path.resolve(__dirname, '../assets', filename), textContent, 'utf-8')
	}).then(() => {
		log(chalk.blue(`添加基本文件${filename} - 完成`))
	}).catch(() => {
		log(chalk.red(`添加基本文件${filename} - 失败`))
	})
}
let listFiles = () => {
	let {pReaddir} = pUtil
	pReaddir(path.resolve(__dirname, '../assets')).then(files => {
		files.forEach(item => {
			log(chalk.blue(item))
		})
	}).catch(() => {
		log(chalk.red(`查询基本文件 - 失败`))
	})
}
let isexist = (file) => {
	let {pReaddir} = pUtil
	pReaddir(path.resolve(__dirname, '../assets')).then(files => {
		if (files.includes(file)) {
			log(chalk.blue('存在该基本文件'))
		} else {
			log(chalk.yellow('不存在该基本文件'))
		}
	}).catch(() => {
		log(chalk.red(`查询基本文件 - 失败`))
	})
}
let delFile = (filename) => {
	let {pRm} = pUtil
	pRm(path.resolve(__dirname, '../assets', filename)).then(() => {
		log(chalk.blue(`删除基本文件${filename} - 成功`))
	}).catch(() => {
		log(chalk.red(`删除基本文件${filename} - 失败`))
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

// crtp init <fileType> [--file ...]
// 在0.0.2版本删除此api
program
	.command('init <fileType>')
	// .option('-d, --debug', 'output extra debugging')
	// .option('--debug', 'output extra debugging')
	.option('--file [file...]', 'name and path of file')
	.option('--packageName [packageName]', 'please input packageName') // 设置替换项可优化
	.action((fileType, options) => {
		tip('yellow', 'init 已经更新为 initFile。请使用initFile完成初始化文件工作。init会在0.0.2版本删除。')
		initFile(fileType, options)
		// 2021.07.15后删除 start
		// // log('filename', filename)
		// // log('options', options)
		// let pDir = path.dirname(options.file) 
		// // log(chalk.red(pDir))
		// // log('pDir', pDir)
		// mkdirp(pDir).then((str) => {
		// 	// let f = options.file.split('/')
		// 	// f = f[f.length - 1]
		// 	// let result = ''
		// 	switch (fileType) {
		// 		// assets
		// 		// case '.gitignore':
		// 		// 	init['.gitignore'](filename)
		// 		// 	break;
		// 		// case 'commitlint.config.js':
		// 		// 	init['commitlint.config.js'](filename)
		// 		// 	break;
		// 		case 'README.md':
		// 		case 'readme.md':
		// 			init['readme.md'](options)
		// 			break;
		// 		case 'demo.md':
		// 			init['demo.md'](options)
		// 			break;
		// 		case 'baseCars.vue':
		// 			init['baseCars.vue'](options)
		// 			break;
		// 		case 'baseDemoPage.vue':
		// 			init['baseDemoPage.vue'](options)
		// 			break;
		// 		case 'compDoc.md':
		// 			init['compDoc.md'](options)
		// 			break;
		// 		default:
		// 			log(chalk.yellow('暂时不支持初始化该文件'))
		// 			break;
		// 	}
		// 	// return result
		// })
		// .catch(error => log('error in init:\n', chalk.red(error.message)))
		// 2021.07.15后删除 end
	})

program
	.command('initFile <fileType>')
	// .option('-d, --debug', 'output extra debugging')
	// .option('--debug', 'output extra debugging')
	.option('--file [file...]', 'name and path of file')
	.option('--packageName [packageName]', 'please input packageName') // 设置替换项可优化
	.action((fileType, options) => {
		initFile(fileType, options)
	})

// crtp init addFile <filename> --file <path/to/file.ext>
program
	.command('addFile <filename>')
	.option('--file <file>', 'path to file')
	.action((filename, options) => {
		addFile(filename, options)
	})

// crtp listFile
program
	.command('listFile')
	.action(() => {
		listFiles()
	})
// crtp lsFile
// 与crtp list功能相同。是list的别名。
program
	.command('lsFile')
	.action(() => {
		listFiles()
	})

// crtp isExistFile <filename>
program
	.command('isExistFile <filename>')
	.action((filename) => {
		isexist(filename)
	})

// crtp delFile <filename>
program
	.command('delFile <filename>')
	.action((filename) => {
		delFile(filename)
	})

// crtp initProj <projName> --path ./
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
program.parse(process.argv)
