#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const util = require('util')
const chalk = require('chalk')
const {log} = console

program
	.command('init <filename>')
	.option('-d, --debug', 'output extra debugging')
	.option('--debug', 'output extra debugging')
	.action((filename, options) => {
		// log('filename', filename)
		// log('options', options)
		let pDir = path.dirname(filename) 
		mkdirp(pDir).then((str) => {
			let f = filename.split('/')
			f = f[f.length - 1]
			let result = ''
			switch (f) {
				// assets
				case '.gitignore':
					init['.gitignore'](filename)
					break;
				case 'commitlint.config.js':
					init['commitlint.config.js'](filename)
					break;
				case 'README.md':
				case 'readme.md':
					init['readme.md'](filename)
					break;
				default:
					log(chalk.yellow('暂时不支持初始化该文件'))
					break;
			}
			return result
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
		packageName: 'package-name'
	}
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
	'readme.md': (filename, option = defaultOptions.readme) => {
		let {pReadFile, pWriteFile} = pUtil
		pReadFile(path.resolve(__dirname, '../assets/readme.md'), 'utf-8').then((textContent) => {
			return pWriteFile(filename, textContent.replace(/\{\{package-name}}/g, option.packageName), 'utf-8')
		}).then(() => {
			log(chalk.blue(`创建${filename} - 完成`))
		}).catch(() => {
			log(chalk.red(`创建${filename} - 失败`))
		})
	}
}