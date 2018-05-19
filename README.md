# CMDjs

A very simple and strict argv parser for nodejs cli applications.

> Note: This may not suit your application. CMDjs is _very minimal_ and was written for use in my other apps at [@codefeathers](https://github.com/codefeathers) and elsewhere. It was mostly an experiment of "how difficult could it be". If you feel like the minimal interface of CMDjs is for you, then go full steam ahead!

## Usage

This module is best explained with an example. (This is also available in this repo: [test](./test))

```JavaScript
#!/usr/bin/node

const CMDjs = require('@codefeathers/cmd-js');
const { log } = console;

const cmd = new CMDjs(
	CMDjs.source(process.argv), // slices the actual args we need
	{ forceExit: true } // Makes program exit after executing matched function
);

const members = [ 'Okabe Rintaro', 'Shiina Mayuri', 'Hashida Itaru' ];

cmd
	.use(['-h', '--help'], _ => log('Usage:\n list\n  list all future gadget laboratory members'))
	.use(['ls', 'list'], _ => log(members.join('\n')))
	.use('password', _ => log('El psy kongroo.'))
	.default(_ => log('Command not found.\nUse --help for help'));
```

Save this with any file name. For example, `sg-cli` (`.js` extension is optional).

Make this file executable by doing `chmod a+x s-g`. And then you can do this:

```shell
[mkr@codefeathers]$ ./sg-cli -h
Usage:
 list
   list all future gadget laboratory members

[mkr@codefeathers]$ ./sg-cli list
Okabe Rintaro
Shiina Mayuri
Hashida Itaru
```

You can add your file to `PATH` and also invoke `sg-cli` directly without specifying path.

## Continuation pattern

Two arguments are passed to the callback when a command matches. An array of the remaining cli args, and the currently matched arg.

```JavaScript
cmd.use('new', (rest, cur) => ...);
```

Because of this, you can use the rest array to create a new `CMDjs` instance in the callback. You could also choose to split this function out and pass its reference.

## Drawbacks

CMDjs does not do smart magic like say, [tj/commander](https://github.com/tj/commander). It does one thing and returns. It doesn't care if what you matched was an option or a command. It's up to you to handle it. Is this a good thing or a bad thing? It's up to you. Works for me.
