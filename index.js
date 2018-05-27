const fs = require('fs');

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
	if (stat[0] === 'Failed') return Errors[0];
	if (stat.isFile()) return 'file';
	if (stat.isDirectory()) return 'dir';
	return Errors[0];
}

const findActionType = action =>
	(typeof action === 'object' && !Array.isArray(action)) ?
	'hash' :
	(typeof action === 'string') ?
	fileOrDir(action) :
	Errors[1];

class CMDjs {
	constructor(hash, options) {
		this.hash = hash;
	}

	use(action) {
		const type = findActionType(action);
		new Fuse(type)
			.on(x => Errors.find(y => y === x), _ => { throw new TypeError(`${action} : ${_}`) })
			.is('hash', _ => { this.hash = { ...this.hash, ...action } })
			.is('file', _ => this.use(require(action)))
			.is('dir', _ => {
				const all = requireAll({
					dirname: action,
					recursive: false
				});
				Object.keys(all).forEach(item => this.use(action + '/' + item + '.js'));
			})
			.resolve();
		return this;
	}

	start(proc) {
		const { log } = console;

		const args = proc.argv.slice(2);
		const argString = args.join(" ");

		// Only for consumer convenience
		const argmin = argvParser(args);

		const match = (keys, argString) => {
			const matched = keys.find(source => {
				const split = source.split(",").map(x => x.trim());
				return split.find(x => argString.startsWith(x)) !== undefined;
			});
			if (matched) {
				const distinct = matched.split(",").map(x => x.trim()).find(x => argString.startsWith(x));
				const rest = argString.slice(distinct.length).trim();
				return { key: matched, distinct, rest };
			}
		};

		const recurse = (hash, keys, argString) => {
			const matched = match(keys, argString);
			const unmatched = { unmatched: true, hash };
			if (matched === undefined) return unmatched;
			if (matched && matched.key) {
				if (matched.rest
					&& typeof hash[matched.key] !== 'object') return unmatched;
				if (typeof hash[matched.key] === 'function') return hash[matched.key](argmin);
				if (typeof hash[matched.key] === 'object') return recurse(
					hash[matched.key],
					Object.keys(hash[matched.key]),
					matched.rest
				)
			}
			return unmatched;
		};

		const keys = Object.keys(this.hash);
		const res = recurse(this.hash, keys, argString);
		if (res && res.unmatched && this.hash['@default']) {
			if(res.hash) res.hash['@default'](argmin);
			else this.hash['@default'](argmin);
			return { status: 'default' };
		}
		return { status: 'ok' };
	}
}

module.exports = CMDjs;