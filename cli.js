#!/usr/bin/env node

const readline = require("readline");
const homedir = require("os").homedir();
const fs = require("fs");

////////////////////////////////////////////////////////////////////////
//                               config                               //
////////////////////////////////////////////////////////////////////////

// process.stdin.setEncoding("utf-8");

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

////////////////////////////////////////////////////////////////////////
//                          global functions                          //
////////////////////////////////////////////////////////////////////////

async function checkIfConfigurationFolderIsCreated() {
  try {
    const isExist = await fs.accessSync(
      `${homedir}/.vimConfiguration`,
      fs.constants.F_OK
    );
  } catch (e) {
    await createConfigurationFolder();
  }
}

async function createConfigurationFolder() {
  try {
    await fs.mkdirSync(`${homedir}/.vimConfiguration`);
    console.log("dossier de configuration crée");
  } catch (e) {
    console.log(e);
  }
}

function checkArguments() {
  if (args[0]) {
    return args[1] !== undefined ? args[0] : false;
  } else {
    return false;
  }
}

////////////////////////////////////////////////////////////////////////
//                           create section                           //
////////////////////////////////////////////////////////////////////////

async function createVimConfiguation() {
  await checkIfConfigurationFolderIsCreated();

  try {
    await fs.mkdirSync(`${homedir}/.vimConfiguration/${args[1]}/plugged`, {
      recursive: true
    });
    await fs.writeFileSync(
      `${homedir}/.vimConfiguration/${args[1]}/.vimrc`,
      ""
    );
  } catch (e) {
    console.log(e);
  }

  console.log(`
    new configuration created with name: ${args[1]}

    now you can:
      - switch to her
      - remove her

    `);
}

////////////////////////////////////////////////////////////////////////
//                           switch section                           //
////////////////////////////////////////////////////////////////////////

async function switchVimConfiguation() {
  await checkIfConfigurationFolderIsCreated();
  console.log("switched");
}

////////////////////////////////////////////////////////////////////////
//                           remove section                           //
////////////////////////////////////////////////////////////////////////

async function removeVimConfiguation() {
  await checkIfConfigurationFolderIsCreated();
  try {
    await fs.rmdirSync(`${homedir}/.vimConfiguration/${args[1]}/plugged`);
    await fs.unlinkSync(`${homedir}/.vimConfiguration/${args[1]}/.vimrc`);
    await fs.rmdirSync(`${homedir}/.vimConfiguration/${args[1]}`);
    console.log(`La configuration ${args[1]} a bien été supprimée`);
  } catch (e) {
    console.log("La configuration que vous voulez effacer n'existe pas");
  }
}

////////////////////////////////////////////////////////////////////////
//                            Help section                            //
////////////////////////////////////////////////////////////////////////

const helpString = `
      vimSwitch <command> [args] [options]

      Commands: 
        create <name> - (create new configuration named $name)
        switch <name> - (switch current configuration with $name)
        remove <name> - (remove $name configuration)

      args:
        name - (name of configuration, alphabetic value or number)

      Options:
        -h, --help - (Show help)
  `;

////////////////////////////////////////////////////////////////////////
//                              general                               //
////////////////////////////////////////////////////////////////////////

const [, , ...args] = process.argv;

switch (checkArguments()) {
  case "create":
    createVimConfiguation();
    break;
  case "switch":
    switchVimConfiguation();
    break;
  case "remove":
    removeVimConfiguation();
    break;
  case "-h":
  case "--help":
  default:
    console.log(helpString);
}
