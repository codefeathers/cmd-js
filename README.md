# CMDjs

Yet another CLI framework.

> Note: CMDjs is _very minimal_ and was written for use in my other apps at [@codefeathers](https://github.com/codefeathers) and elsewhere. It was mostly an experiment of "how difficult could it be", and I'm happy to see how it turned out. If you feel like the minimal, friendly interface of CMDjs is for you, then go full steam ahead!

## Usage

CMDjs accepts a logic tree of commands and functions and executes the function that matches your user's command.

This module is best explained with an example. (A slightly more elaborate example is available in this repo: [sample](./sg-cli)).

```JavaScript
#!/usr/bin/node

const CMDjs = require('@codefeathers/cmd-js');
const { log } = console;

const members = [ 'Okabe Rintaro', 'Shiina Mayuri', 'Hashida Itaru', 'Makise Kurisu' ];

const cmd = new CMDjs({
	'-h, --help': _ => log('Usage:\n list\n  list all future gadget laboratory members'),
	'ls, list': _ => log(members.join('\n')),
	'default': _ => log('Use --help to get help text'),
});

cmd.use({ 'password': _ => log('El psy kongroo.') }); // Add more commands!
cmd.use('/home/mkr/.plugins'); // Add paths!

cmd.start(process);
```

Save this with any file name, for example, `sg-cli` (extensions for executables are optional in Linux).

Make this file executable by doing `chmod a+x sg-cli`. And then you can do this:

```shell
[mkr@codefeathers]$ ./sg-cli -h
Usage:
 list
   list all future gadget laboratory members

[mkr@codefeathers]$ ./sg-cli list
Okabe Rintaro
Shiina Mayuri
Hashida Itaru
Makise Kurisu
```

You can add your file to `PATH` and also invoke `sg-cli` directly without specifying path.

## Nesting

Because args are parsed by minimist and passed as an object to callbacks, effectively you can nest and branch with plain JavaScript.

Additionally, CMDjs allows you to do this:

```JavaScript
'ls, list': {
	'-a, --all': // [Function],
	'-g, --good': // [Function],
	'-e, --evil': // [Function]
}
```

You can nest indefinitely in this pattern. If you need more flexibility, take things in your own hands and use the minimist object at any point in the tree!

## Issues and PRs

Issues and PRs are most welcome. If there are uncaught bugs, please report! Keep in mind that CMDjs is designed to be backwards-compatible henceforth. Any changes should not break previous versions.
