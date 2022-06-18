# Climan

Climan is a small npm package that automates long & boring commands for you.

## Description

Climan lets you create, store, and manage CLI commands, which will then be made available via Climan's `cm` shorthand for you to select. Command will be executed automatically, however, commands with required arguments will prompt you to enter the corresponding arguments before executing.

## Usage

Installation

```
npm i -g @quachhengtony/climan
```

Run `cm` anywhere to invoke Climan

```
cm
CLIMAN running...
Hit CTRL-C to quit.

No commands found.
Please run 'cm repo' to initialize a command repository
```

Create a repository

```
cm repo
> Create new command
> Update existing command
> Delete command
```

Create a command with no argument

```
cm repo
> Create new command
Please enter the CLI name: git
Please enter the command for docker CLI (excluding the CLI name): pull origin dev
```

Create a command with `containerName` as an argument

```
cm repo
> Create new command
Please enter the CLI name: docker
Please enter the command for docker CLI (excluding the CLI name): exec -it <containerName> /bin/bash
```

## Technologies

[Node.js](https://nodejs.org/en/about/)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
