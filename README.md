![npm](https://img.shields.io/npm/dw/@quachhengtony/climan)

# Climan

Climan is an npm package that automates long and tedious commands for you by allowing you to create, store, and manage CLI commands that can be executed using Climan's `cm` shorthand.

## Description

Climan provides a simple way to automate CLI commands that are often lengthy and repetitive. With Climan, you can create and save custom CLI commands with arguments, making it easy to recall and execute them later. Climan's `cm` shorthand lets you execute these commands quickly and efficiently. Commands with required arguments will prompt you to enter the corresponding arguments before execution.

## Installation

You can install Climan using npm:

```
npm i -g @quachhengtony/climan
```

## Usage

Run `cm` anywhere to invoke Climan:

```
cm
CLIMAN running...
Hit CTRL-C to quit.
> git
> docker
> kubectl
```

```
cm
CLIMAN running...
Hit CTRL-C to quit.
No commands found.
Please run 'cm repo' to initialize a command repository
```

To execute saved commands, simply run:

```
cm
CLIMAN running...
Hit CTRL-C to quit.
> git

> git pull origin dev
```

For commands that required arguments, Climan will prompt you to enter the corresponding arguments before executing:

```
cm
CLIMAN running...
Hit CTRL-C to quit.
> docker

> docker exec -it <containerName> /bin/bash
Please enter <containerName>: my-container
```

To get started with Climan, create a command repository by running:

```
cm repo
> Create a new command
```

You will then be prompted to enter a CLI name and a command to execute for the CLI. If the command requires arguments, you can specify placeholders using "<" and ">", such as <argumentName1>, <ArgumentName2>, <argument_name3> etc. These arguments will be prompted when executing the command.

To create commands with no arguments, run:

```
cm repo
> Create a new command
Please enter the CLI name: git
Please enter the command for docker CLI (excluding the CLI name): pull origin dev
```

To create commands with arguments, run:

```
cm repo
> Create a new command
Please enter the CLI name: docker
Please enter the command for docker CLI (excluding the CLI name): exec -it <containerName> /bin/bash
```

To edit saved commands, run:

```
cm repo
> Update existing commands
```

To delete saved commands, run:

```
cm repo
> Delete commands
```

## Technologies

Climan is built using [Node.js](https://nodejs.org/en/about/).

## Contributing

Contributions to Climan are welcome. Please open an issue or submit a pull request for any changes you would like to make.

## License

Climan is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).
