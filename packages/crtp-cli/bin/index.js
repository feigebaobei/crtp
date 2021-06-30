#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const util = require('util')
const chalk = require('chalk')
const execa = require('execa')
const {log} = console
// const utils = require('../utils/index.js')
const assetsConfig = require('./config.js')

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
let resFn = () => {

}

// 2021.07.10后删除 start
// let init = {
// 	'.gitignore': (filename) => {
// 		let pathGit = path.resolve(__dirname, '../assets/.gitignore')
// 		let pReadFile = util.promisify(fs.readFile)
// 		let pWriteFile = util.promisify(fs.writeFile)
// 		pReadFile(pathGit, 'utf-8').then((textContent) => {
// 			return pWriteFile(filename, textContent, 'utf-8')
// 		}).then(() => {
// 			log(chalk.blue(`创建${filename} - 完成`))
// 		}).catch(() => {
// 			log(chalk.red(`创建${filename} - 失败`))
// 		})
// 	},
// 	'commitlint.config.js': (filename) => {
// 		let pathCommitlint = path.resolve(__dirname, '../assets/commitlint.config.js')
// 		let pReadFile = util.promisify(fs.readFile)
// 		let pWriteFile = util.promisify(fs.writeFile)
// 		pReadFile(pathCommitlint, 'utf-8').then((textContent) => {
// 			return pWriteFile(filename, textContent, 'utf-8')
// 		}).then(() => {
// 			log(chalk.blue(`创建${filename} - 完成`))
// 		}).catch(() => {
// 			log(chalk.red(`创建${filename} - 失败`))
// 		})

// 	},
// 	'readme.md': (userOption, defaultOption = defaultOptions.readme) => {
// 		let {pReadFile, pWriteFile} = pUtil
// 		let filename = userOption.file || defaultOption.filename
// 		let packageName = userOption.packageName || defaultOption.packageName
// 		pReadFile(path.resolve(__dirname, '../assets/readme.md'), 'utf-8').then((textContent) => {
// 			return pWriteFile(filename, textContent.replace(/\{\{packageName}}/g, packageName), 'utf-8')
// 		}).then(() => {
// 			log(chalk.blue(`创建${filename} - 完成`))
// 		}).catch(() => {
// 			log(chalk.red(`创建${filename} - 失败`))
// 		})
// 	},
// 	'demo.md': (userOption, defaultOption = defaultOptions.demo) => {
// 		let {pReadFile, pWriteFile} = pUtil
// 		let filename = userOption.file || defaultOption.filename
// 		pReadFile(path.resolve(__dirname, assetsConfig.ASSETSDEMOMD), 'utf-8').then((textContent) => {
// 			return pWriteFile(filename, textContent, 'utf-8')
// 		}).then(() => {
// 			log(chalk.blue(`创建${filename} - 完成`))
// 		}).catch(() => {
// 			log(chalk.red(`创建${filename} - 失败`))
// 		})
// 	},
// 	'baseCars.vue': (userOption, defaultOption = defaultOptions.baseCars) => {
// 		let {pReadFile, pWriteFile} = pUtil
// 		let filename = userOption.file || defaultOption.filename
// 		pReadFile(path.resolve(__dirname, assetsConfig.ASSETSBASECARS), 'utf-8').then((textContent) => {
// 			return pWriteFile(filename, textContent, 'utf-8')
// 		}).then(() => {
// 			log(chalk.blue(`创建${filename} - 完成`))
// 		}).catch(() => {
// 			log(chalk.red(`创建${filename} - 失败`))
// 		})
// 	},
// 	'baseDemoPage.vue': (userOption, defaultOption = defaultOptions.demo) => {
// 		let {pReadFile, pWriteFile} = pUtil
// 		let filename = userOption.file || defaultOption.filename
// 		pReadFile(path.resolve(__dirname, assetsConfig.ASSETSBASEDEMOPAGE), 'utf-8').then((textContent) => {
// 			return pWriteFile(filename, textContent, 'utf-8')
// 		}).then(() => {
// 			log(chalk.blue(`创建${filename} - 完成`))
// 		}).catch(() => {
// 			log(chalk.red(`创建${filename} - 失败`))
// 		})
// 	},
// 	'compDoc.md': (userOption, defaultOption = defaultOptions.demo) => {
// 		let {pReadFile, pWriteFile} = pUtil
// 		let filename = userOption.file || defaultOption.filename
// 		pReadFile(path.resolve(__dirname, assetsConfig.ASSETSCOMPDOC), 'utf-8').then((textContent) => {
// 			return pWriteFile(filename, textContent, 'utf-8')
// 		}).then(() => {
// 			log(chalk.blue(`创建${filename} - 完成`))
// 		}).catch(() => {
// 			log(chalk.red(`创建${filename} - 失败`))
// 		})
// 	}
// }
// 2021.07.10后删除 end

let initFile = (fileType, userOption) => {
	let {pReadFile, pWriteFile} = pUtil
	pReadFile(path.resolve(__dirname, `../assets/${fileType}`), 'utf-8').then((textContent) => {
		return mkdirp(path.resolve(process.cwd(), path.dirname(userOption.file))).then(() => {
			return textContent
		})
	}).then((textContent) => {
		if (userOption.packageName) {
			textContent = textContent.replace(/\{\{packageName}}/g, userOption.packageName)
		}
		return pWriteFile(path.resolve(process.cwd(), userOption.file), textContent, 'utf-8')
	}).then(() => {
		log(chalk.blue(`创建${userOption.file} - 完成`))
	}).catch(() => {
		log(chalk.red(`创建${userOption.file} - 失败`))
	})
}
// crtp add abc.md --file ./path/to/file.md
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

program
	.command('init <fileType>')
	.option('-d, --debug', 'output extra debugging')
	.option('--debug', 'output extra debugging')
	.option('--file [file]', 'name and path of file')
	.option('--packageName [packageName]', 'please input packageName') // 设置替换项可优化
	.action((fileType, options) => {
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

// crtp init add <filename> --file <path/to/file.ext>
program
	.command('add <filename>')
	.option('--file <file>', 'path to file')
	.action((filename, options) => {
		addFile(filename, options)
	})

// crtp list
program
	.command('list')
	.action(() => {
		listFiles()
	})
// crtp ls
// 与crtp list功能相同。是list的别名。
program
	.command('ls')
	.action(() => {
		listFiles()
	})

// crtp exist <filename>
program
	.command('exist <filename>')
	.action((filename) => {
		isexist(filename)
	})

// crtp del <filename>
program
	.command('del <filename>')
	.action((filename) => {
		delFile(filename)
	})

program.parse(process.argv)
