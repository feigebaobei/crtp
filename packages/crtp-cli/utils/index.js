// export * as pUtil from './pUtil.js'

var fs = require('fs');
var path = require('path');

var _traverse = function (mark, directory) {
    var parentDirectory = path.resolve(directory, '..');
    var files = fs.readdirSync(directory) || [];
    var found = files.some(function (file) {
        return file === mark;
    });

    if (found) {
        return directory;
    }
    else {
        if (directory === parentDirectory) {
            return false;
        }
        else {
            return _traverse(mark, parentDirectory);
        }
    }
};

// module.exports = {

// }

let tranvers = function (mark, directory) {
    directory = directory || process.cwd();
    
    return _traverse(mark, directory);
};
let fillEmpty = (s, n) => {
    if (s.length >= n) {
        return s
    } else {
        return `${s}${new Array(n - s.length).fill(' ').join('')}`
    }
}
let afterDay = (day) => {
    let date = new Date()
    date.setTime(date.getTime() - day * 24 * 60 * 60 * 1000)
    let [y, m, d] = [date.getFullYear(), date.getMonth(), date.getDate()]
    return `${y}-${m + 1}-${d}`
}
let npmRegistry = {
    npm: 'https://registry.npmjs.org/',
    yarn: 'https://registry.yarnpkg.com/',
    tencent: 'https://mirrors.cloud.tencent.com/npm/',
    cnpm: 'https://r.cnpmjs.org/',
    taobao: 'https://registry.npmmirror.com/',
    npmMirror: 'https://skimdb.npmjs.com/registry/',
    guazi: 'http://npm.guazi-corp.com/',
  
}
module.exports = {
	tranvers,
    fillEmpty,
    afterDay,
    npmRegistry
}
// export 
