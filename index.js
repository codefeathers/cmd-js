const { stringMatch, arrayMatch, shouldNext } = require('./utils');

class CMD {
	constructor(argv, options) {
		this.args = argv;
		this.options = options;
		this.noFollow = false;
	}

	static source (argv) {
		return argv.slice(2);
	}

	default (fn, description) {
		const params = [ this.args.slice(1), this.args.slice(0, 1) ];
		if(this.noFollow) return this
		else return fn(...params);
	}

	use (cmds, fn, description, options) {

		if(this.noFollow) return this;
		let returns;

		if(stringMatch(this.args, cmds)) { this.noFollow = true; returns = true };
		if(arrayMatch(this.args, cmds)) { this.noFollow = true; returns = true };

		const next = shouldNext(options, this.options);
		const params = [ this.args.slice(1), this.args.slice(0, 1) ];

		if(returns && !next) { fn(...params); process.exit(0); }
		else if (returns) { fn(...params); return this; }
		else return this;
	}
}

module.exports = CMD;
