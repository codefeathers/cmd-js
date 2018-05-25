const fs = require('fs');

const Promise = require('bluebird');
const Fuse = require('@codefeathers/fuse');
const argvParser = require('minimist');
const requireAll = require('require-all');

const tryCatch = (fn, args) => {
	try {
		return fn(args);
	} catch (e) {
		return ['Failed', e];
	}
}

const Errors = [
	'Not a file or directory path',
	'Unprocessable entity'
]

const fileOrDir = path => {
	let stat = tryCatch(fs.lstatSync, path);
	if(stat[0] === 'Failed') stat = tryCatch(fs.lstatSync, path + '.js');
	if(stat[0] === 'Failed') return Errors[0];
	if(stat.isFile()) return 'file';
	if(stat.isDirectory()) return 'dir';
	return Errors[0];
}

const findActionType = action =>
	(typeof action === 'object' && !Array.isArray(action))
		? 'hash'
		: (typeof action === 'string')
			? fileOrDir(action)
			: Errors[1];

class CMDjs {
	constructor(hash, options) {
		this.hash = hash;
		// this.options = options;
	}

	use(action) {
		const type = findActionType(action);
		new Fuse(type)
			.on(x => Errors.find(y => y === x), _ => { throw new TypeError(action) })
			.is('hash', _ => { this.hash = { ...this.hash, ...action }})
			.is('file', _ => this.use(require(action)))
			.is('dir', _ => {
				const all = requireAll({ dirname: action, recursive: false });
				Object.keys(all).forEach(item => this.use(action + '/' + item)); })
			.resolve();
		return this;
	}

	start(proc) {
		const args = proc.argv.slice(2);
		this.args = argvParser(args);
		return this.args;
	}
}

module.exports = CMDjs;