# CMDjs

Yet another CLI framework.

> Note: CMDjs is _very minimal_ and was written for use in my other apps at [@codefeathers](https://github.com/codefeathers) and elsewhere. It was mostly an experiment of "how difficult could it be". If you feel like the minimal, friendly interface of CMDjs is for you, then go full steam ahead!

## Usage

This module is best explained with an example. (This file also available in this repo: [sample](./sg-cli))

```JavaScript
#!/usr/bin/node

const CMDjs = require('@codefeathers/cmd-js');
const { log } = console;

const members = [ 'Okabe Rintaro', 'Shiina Mayuri', 'Hashida Itaru', 'Makise Kurisu' ];

const cmd = new CMDjs({
	'-h, --help': options => log('Usage:\n list\n  list all future gadget laboratory members'),
	'ls, list': options => log(members.join('\n')),
	'default': log('Use --help to get help text'),
});

cmd.use({ 'password': _ => log('El psy kongroo.') }); // Add more commands!
cmd.use('/home/mkr/.plugins'); // Add paths!

cmd.start(process);
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
