String.isString = x => (typeof x === 'string');

const stringMatch = (c, x) => (String.isString(x) && x === c[0]);
const arrayMatch = (c, x) => (Array.isArray(x) && Boolean(x.find(y => y === c[0])));
const shouldNext = (options, globalOptions) => (
	(options && options.forceExit)
	|| (globalOptions && options &&
		(globalOptions.forceExit && !options.next))
);

module.exports = {
	stringMatch,
	arrayMatch,
	shouldNext
};