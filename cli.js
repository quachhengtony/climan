#!/usr/bin/env node
const { cliHelper, repositoryManager } = require("./index");
const term = require("terminal-kit").terminal;
const fs = require("fs");
var ARG = process.argv[2];
const path = require("path");
const PATH = path.resolve(__dirname, "climan.json");
const CWD = path.basename(path.resolve(process.cwd()));

switch (ARG) {
  case "repo":
    fs.readFile(PATH, (err, data) => {
      if (err) {
        term.red("No commands found.\n");
        term.yellow("Initializing a new empty repository...");
        fs.appendFile(
          path.resolve(__dirname, "climan.json"),
          JSON.stringify([]),
          (err) => {
            if (err) throw err;
            repositoryManager();
          }
        );
      }
      if (data) {
        repositoryManager();
      }
    });
    break;
  default:
    fs.readFile(PATH, (err, data) => {
      if (err) {
        term.red("No commands found.\n");
        term
          .red("Please run ")
          .white("'cm repo'")
          .red(" to initilize a command repository");
        return;
      }
      if (JSON.parse(data).length == 0 || JSON.parse(data) === undefined) {
        term.red("No commands found.\n");
        term
          .red("Please run ")
          .white("'cm repo'")
          .red(" to initilize a command repository");
        return;
      }
      cliHelper(data);
    });
    break;
}
