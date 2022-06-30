const term = require("terminal-kit").terminal;
const fs = require("fs");
const { exec } = require("child_process");

const path = require("path");
const PATH = path.resolve(__dirname, "climan.json");

var repoMenu = [
  "> Create a new command",
  "> Update existing commands",
  "> Delete commands",
];
var history = [];

const checkFileExists = (path) => {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

const executeCommand = (command, execOptions = {}) => {
  return new Promise((resolve, reject) => {
    const childProcess = exec(command, execOptions);
    childProcess.stderr.on("data", (data) => {
      term("\n");
      data = data.split("\n");
      data.forEach((element) => {
        console.log(element);
      });
    });
    childProcess.stdout.on("data", (data) => {
      term("\n");
      data = data.split("\n");
      data.forEach((element) => {
        console.log(element);
      });
    });
    childProcess.on("exit", () => resolve());
    childProcess.on("close", () => resolve());
    childProcess.on("error", (error) => reject(error));
  });
};

const terminate = () => {
  // term.red("\nBYE!");
  term.grabInput(false);
  setTimeout(function () {
    process.exit();
  }, 100);
};

const deleted = (command) => {
  term.green(`\nDelete `)(`${command}`).green(` successfully!`);
  term.grabInput(false);
  setTimeout(function () {
    process.exit();
  }, 100);
};

function getCommandLine(password) {
  switch (process.platform) {
    case "darwin":
      return `echo ${password} | sudo -S open`;
    case "win32":
      return "start";
    case "win64":
      return "start";
    default:
      return `xdg-open`;
  }
}

const getCommandArgs = (args, argsValue, i, cb, cm, baseResponse) => {
  return new Promise((resolve, reject) => {
    if (i >= args.length) {
      var newCm = "";
      for (var j = 0; j < argsValue.length; j++) {
        newCm = cm.replace(`<${args[j]}>`, argsValue[j]);
        cm = cm.replace(`<${args[j]}>`, argsValue[j]);
      }
      cb(newCm.replace("> ", "")).then((response) => {
        return cliHelper(baseResponse);
      });
      resolve();
    } else {
      term(`\nPlease enter `).yellow(`<${args[i]}>: `);
      term.inputField(
        {
          history: history,
          // autoComplete: cliNames,
          // autoCompleteMenu: true,
        },
        (err, input) => {
          argsValue.push(input);
          getCommandArgs(args, argsValue, i + 1, cb, cm, baseResponse);
        }
      );
    }
  });
};

const cliHelper = (response) => {
  var baseResponse = response;
  var cli = JSON.parse(response);
  var cliMenu = [];
  cli.forEach((x) => {
    cliMenu.push("> " + x["repository"]);
  });
  term.singleColumnMenu(
    cliMenu,
    {
      style: term.white,
      selectedStyle: term.bold,
    },
    (err, response) => {
      if (err) throw err;
      var cliCommandMenu = [];
      cli[response.selectedIndex]["commands"].forEach((x) => {
        cliCommandMenu.push("> " + x);
      });

      if (
        cliCommandMenu.length == 0 ||
        cliCommandMenu === "" ||
        cliCommandMenu == undefined
      ) {
        term.bgRed("ERR").red(" No commands found.\n");
        return cliHelper(baseResponse);
      }
      term.singleColumnMenu(
        cliCommandMenu,
        {
          style: term.white,
          selectedStyle: term.bold,
        },
        (err, response) => {
          if (err) throw err;
          if (!response.selectedText.includes("<")) {
            executeCommand(response.selectedText.replace("> ", "")).then(
              (response) => {
                return cliHelper(baseResponse);
              }
            );
          } else {
            var arg = "";
            var args = [];
            for (var i = 0; i < response.selectedText.length; i++) {
              if (response.selectedText[i] === "<") {
                i++;
                for (var k = i; k < response.selectedText.length; k++) {
                  if (response.selectedText[k] === ">") {
                    args.push(arg);
                    arg = "";
                    break;
                  }
                  arg += response.selectedText[k];
                }
              }
            }
            var argsValue = new Array();
            getCommandArgs(
              args,
              argsValue,
              0,
              executeCommand,
              response.selectedText,
              baseResponse
            );
          }
        }
      );
    }
  );
};

const getHistory = () => {
  // var newHistory = history;
  // console.log("CLEAR HISTORY");
  return new Promise((resolve, reject) => {
    const repositories = require(PATH);
    repositories.forEach((repository) =>
      history.push(repository["repository"])
    );
    if (history.length != 0 || history !== undefined) {
      resolve(history);
    } else {
      reject();
    }
  });
};

const deleteCommand = (repositories, allCommands) => {
  term.singleColumnMenu(allCommands, (err, response) => {
    if (err) throw err;
    if (response) {
      const repoIndex = repositories.findIndex(
        (x) => x["repository"] === response.selectedText.split(" ")[0]
      );
      const commandIndex = repositories[repoIndex]["commands"].findIndex(
        (x) => x === response.selectedText
      );
      repositories[repoIndex]["commands"].splice(commandIndex, 1);
      fs.writeFile(PATH, JSON.stringify(repositories, null, 2), (err) => {
        if (err) throw new Error("Write file failed");
        return deleted(response.selectedText);
      });
    }
  });
};

const repositoryManager = async () => {
  await getHistory();
  term.singleColumnMenu(repoMenu, (err, response) => {
    if (err) throw err;
    if (response.selectedIndex === 0) {
      term("\nPlease enter the CLI name: ");
      term.inputField(
        {
          history: history,
          // autoComplete: cliNames,
          // autoCompleteMenu: true,
        },
        (err, input) => {
          if (err) throw err;
          var repoName = input.trim();
          term("\nPlease enter the command for ").cyan(`${repoName} CLI`)(
            " (excluding the CLI name): "
          );

          term.inputField(
            {
              history: history,
            },
            (err, input) => {
              if (err) throw err;
              var command = input.trim();

              var record = [
                {
                  repository: repoName,
                  commands: [`${repoName} ${command}`],
                },
              ];

              var data = JSON.stringify(record, null, 2);
              checkFileExists(PATH)
                .then((response) => {
                  fs.readFile(PATH, (err, data) => {
                    if (err) throw err;
                    const oldRepo = JSON.parse(data);
                    var exists = oldRepo.findIndex(
                      (x) => x["repository"] === repoName
                    );
                    if (exists >= 0) {
                      var duplicates = oldRepo[exists]["commands"].findIndex(
                        (x) => x.substring(x.indexOf(" ") + 1) === command
                      );

                      if (duplicates >= 0) {
                        term
                          .bgYellow("\nWARN")
                          .yellow(" Command already exists\n");

                        return repositoryManager();
                      }
                      oldRepo[exists] = {
                        ...oldRepo[exists],
                        commands: [
                          ...oldRepo[exists]["commands"],
                          `${repoName} ${command}`,
                        ],
                      };
                      var newRepo = oldRepo;
                    } else {
                      var newRepo = [
                        ...oldRepo,
                        {
                          repository: repoName,
                          commands: [`${repoName} ${command}`],
                        },
                      ];
                    }
                    var newRepoData = JSON.stringify(newRepo, null, 2);
                    fs.writeFile(PATH, newRepoData, (err) => {
                      if (err) throw new Error("Write file failed");
                      repositoryManager();
                    });
                  });
                })
                .catch((err) => {
                  fs.appendFile(PATH, data, (err) => {
                    if (err) throw new Error("Append file failed");
                    repositoryManager();
                  });
                });
            }
          );
        }
      );
    }
    if (response.selectedIndex === 1) {
      if (process.platform === "win32" || process.platform === "win64") {
        executeCommand(getCommandLine() + " " + PATH).then((response) => {
          terminate();
        });
      } else {
        term("\nPlease enter your password: ");
        term.inputField((err, input) => {
          executeCommand(getCommandLine(input) + " " + PATH).then(
            (response) => {
              terminate();
            }
          );
        });
      }
    }
    if (response.selectedIndex === 2) {
      fs.readFile(PATH, (err, data) => {
        if (err) {
          term.bgRed("ERR").red(" No commands found.\n");
          term
            .red("Please run ")
            .white("'cm repo'")
            .red(" to initilize a command repository");
          return repositoryManager();
        }
        if (JSON.parse(data).length == 0 || JSON.parse(data) === undefined) {
          term.bgRed("ERR").red(" No commands found.\n");
          term
            .red("Please run ")
            .white("'cm repo'")
            .red(" to initilize a command repository");
          return repositoryManager();
        }
        var allCommands = [];
        const repositories = JSON.parse(data);
        repositories.forEach((repository) =>
          repository["commands"].forEach((command) => {
            allCommands.push(command);
          })
        );
        deleteCommand(repositories, allCommands);
      });
    }
  });
};

term.bold.brightMagenta("CLIMAN running...\n");
term.bgCyan("INF").cyan(" Hit CTRL-C to quit.\n\n");
term.on("key", function (name, matches, data) {
  if (name === "CTRL_C") {
    term.clear();
    terminate();
  }
});

module.exports = { cliHelper, repositoryManager };
