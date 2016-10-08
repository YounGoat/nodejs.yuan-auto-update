var MODULE_REQUIRE
	, child_process = require('child_process')
	, path = require('path')
	, semver = require('semver')
	;

// 同步执行命令，并以字符串数组方式，按行返回标准输出。
var execSync = function(cmd) {
	var response = child_process.execSync(cmd).toString();
	var EOL = response.endsWith('\r\n') ? '\r\n' : '\n';
	var lines = response.split(EOL).slice(0, -1);
	return lines;
}

var ME = function(moduleName, options) {
	if (!options) {
		options = {
			// 是否执行全局安装
			// 是否全局安装，将影响依赖模块的安装方式和模块自身命令的安装与否。
			global: undefined,

			// 模块安装路径
			// 仅当 global 参数非真时有效（否则必须安装在全局 node_modules 目录下）。
			path: undefined,

			// 指定当前版本
			version: undefined,

			// 指定仓库地址
			registry: undefined
		};
	}

	if (options.global || !options.path) {
		try {
			options.path = execSync('npm root -g')[0];
		} catch(ex) {
			// ...
		}

		if (!options.path) {
			throw 'Failed to determine npm global root';
		}
	}

	if (!options.version) {
		try {
			var pkgJson = require(path.join(options.path, moduleName, 'package.json'));
			options.version = pkgJson.version;
		} catch(ex) {
			// ...
		}
		if (!options.version) {
			console.error('Failed to determine current version of "' + moduleName + '"');
			return 'error';
		}
	}

	var version;
	try {
		var cmd = 'npm view ' + moduleName + ' version';
		if (options.registry) {
			cmd += ' --registry=' + options.registry;
		}
		version = execSync(cmd)[0];
	} catch(ex) {
		// ...
	}
	if (!version) {
		console.error('Failed to get latest version of "' + moduleName + '"');
		return 'error';
	}

	if (semver.gt(version, options.version)) {
		var cmd = 'npm install ' + moduleName;
		if (options.global) {
			cmd += ' -g';
		}
		try {
			child_process.execSync(cmd, { cwd: options.path, stdio: [ null, process.stdout, process.stderr ] });
		} catch (ex) {
			console.error('Failed to operate update of module "' + moduleName + '"');
			return 'error';
		}
		return 'updated';
	}
	else {
		return 'latest';
	}
}

module.exports = ME;
