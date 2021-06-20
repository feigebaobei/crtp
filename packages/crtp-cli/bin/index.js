#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const util = require('util')
const chalk = require('chalk')
const {log} = console
// const utils = require('./utils/index.js')
const assetsConfig = require('./config.js')

program
	// .command('init <filename>')
	.command('init <fileType>')
	.option('-d, --debug', 'output extra debugging')
	.option('--debug', 'output extra debugging')
	.option('--file [file]', 'name and path of file')
	.option('--packageName [packageName]', 'please input packageName')
	.action((fileType, options) => {
		// log('filename', filename)
		// log('options', options)
		let pDir = path.dirname(options.file) 
		// log(chalk.red(pDir))
		// log('pDir', pDir)
		mkdirp(pDir).then((str) => {
			// let f = options.file.split('/')
			// f = f[f.length - 1]
			// let result = ''
			switch (fileType) {
				// assets
				// case '.gitignore':
				// 	init['.gitignore'](filename)
				// 	break;
				// case 'commitlint.config.js':
				// 	init['commitlint.config.js'](filename)
				// 	break;
				case 'README.md':
				case 'readme.md':
					init['readme.md'](options)
					break;
				case 'demo.md':
					init['demo.md'](options)
					break;
				default:
					log(chalk.yellow('暂时不支持初始化该文件'))
					break;
			}
			// return result
		})
		.catch(error => log('error in init:\n', chalk.red(error.message)))
	})
program.parse(process.argv)

let pUtil = {
	pReadFile: util.promisify(fs.readFile),
	pWriteFile: util.promisify(fs.writeFile)
}
let defaultOptions = {
	readme: {
		packageName: 'packageName',
		filename: 'readme.md'
	},
	demo: {
		filename: 'demo.md'
	}
}
let resFn = () => {

}

let init = {
	'.gitignore': (filename) => {
		let pathGit = path.resolve(__dirname, '../assets/.gitignore')
		let pReadFile = util.promisify(fs.readFile)
		let pWriteFile = util.promisify(fs.writeFile)
		pReadFile(pathGit, 'utf-8').then((textContent) => {
			return pWriteFile(filename, textContent, 'utf-8')
		}).then(() => {
			log(chalk.blue(`创建${filename} - 完成`))
		}).catch(() => {
			log(chalk.red(`创建${filename} - 失败`))
		})
	},
	'commitlint.config.js': (filename) => {
		let pathCommitlint = path.resolve(__dirname, '../assets/commitlint.config.js')
		let pReadFile = util.promisify(fs.readFile)
		let pWriteFile = util.promisify(fs.writeFile)
		pReadFile(pathCommitlint, 'utf-8').then((textContent) => {
			return pWriteFile(filename, textContent, 'utf-8')
		}).then(() => {
			log(chalk.blue(`创建${filename} - 完成`))
		}).catch(() => {
			log(chalk.red(`创建${filename} - 失败`))
		})

	},
	'readme.md': (userOption, defaultOption = defaultOptions.readme) => {
		let {pReadFile, pWriteFile} = pUtil
		let filename = userOption.file || defaultOption.filename
		let packageName = userOption.packageName || defaultOption.packageName
		pReadFile(path.resolve(__dirname, '../assets/readme.md'), 'utf-8').then((textContent) => {
			return pWriteFile(filename, textContent.replace(/\{\{packageName}}/g, packageName), 'utf-8')
		}).then(() => {
			log(chalk.blue(`创建${filename} - 完成`))
		}).catch(() => {
			log(chalk.red(`创建${filename} - 失败`))
		})
	},
	'demo.md': (userOption, defaultOption = defaultOptions.demo) => {
		let {pReadFile, pWriteFile} = pUtil
		let filename = userOption.file || defaultOption.filename
		pReadFile(path.resolve(__dirname, assetsConfig.ASSETSDEMOMD), 'utf-8').then((textContent) => {
			return pWriteFile(filename, textContent, 'utf-8')
		}).then(() => {
			log(chalk.blue(`创建${filename} - 完成`))
		}).catch(() => {
			log(chalk.red(`创建${filename} - 失败`))
		})
	}
}