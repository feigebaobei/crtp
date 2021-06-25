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
module.exports = {
	tranvers
}
// export 
