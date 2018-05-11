#!/usr/bin/env node

const ocko = require("./ocko");

const fs = require("fs");
const path = require("path");

const chalk = require('chalk');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'init', alias: 'i', type: String },
    { name: 'config', alias: 'c', type: String, defaultOption: true },
];
const options = commandLineArgs(optionDefinitions);

if (options.init) {
    // init

    if (typeof options.init !== "string") {
        console.log("You need write a file name *.js.");
    } else {
        fs.copyFileSync(path.resolve(__dirname, "defaultConfiguration.js"), path.resolve(process.cwd(), options.init));
        console.log(`The configuration file "${options.init}" was created. Open it and update!`)
    }
} else if (options.config) {
    // run ocko

    if (typeof options.config !== "string") {
        console.log("You need write a file name of configuration.");
    } else {
        const configurationPath = path.resolve(process.cwd(), options.config);
        if (!fs.existsSync(configurationPath)) {
            console.log(`The file with configuration "${options.config}" doesn't exist.`);
        } else {
            ocko(configurationPath);
        }
    }
} else {
    // help

    console.log(`${chalk.bold(`
  ____       _         
 / __ \\  \\/ | |        
| |  | | ___| | _____  
| |  | |/ __| |/ / _ \\ 
| |__| | (__|   < (_) |
 \\____/ \\___|_|\\_\\___/ 
`)}

Očko [otʃko] is a tool for checking your websites or http applications.

${chalk.bold('Options:')}

    -h, --help          Display this usage guide.
    -i, --init file     Create file with configuration.
    -c, --config file   Run Očko with configuration. (default) 
`)
} 