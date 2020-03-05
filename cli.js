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

async function checkIfConfigurationDirIsCreated() {
  try {
    const isExist = await fs.accessSync(
      `${homedir}/.vimConfiguration`,
      fs.constants.F_OK
    );
  } catch (e) {
    await createConfigurationDir();
  }
}

async function createConfigurationDir() {
  try {
    await fs.mkdirSync(`${homedir}/.vimConfiguration`);
    console.log("dossier de configuration crée");
  } catch (e) {
    console.log(e);
  }
}

function checkNameExist() {
  return args[1];
}

// async function checkIfBackupDirIsCreated() {
//   try {
//     const isExist = await fs.accessSync(
//       `${homedir}/.vimConfiguration/oldConfig`,
//       fs.constants.F_OK
//     );
//   } catch (e) {
//     await createBackupDir();
//   }
// }

// async function createBackupDir() {
//   try {
//     await fs.mkdirSync(`${homedir}/.vimConfiguration/oldConfig`);
//     console.log("dossier de backup crée");
//   } catch (e) {
//     console.log(e);
//   }
// }

// async function updateBackupDir() {
//   try {
//     const pluggedDirExist = await fs.accessSync(
//       `${homedir}/.vimConfiguration/oldConfig/plugged`,
//       fs.constants.F_OK
//     );
//     const vimrcExist = await fs.accessSync(
//       `${homedir}/.vimConfiguration/oldConfig/.vimrc`,
//       fs.constants.F_OK
//     );

//     console.log(pluggedDirExist);
//     console.log(vimrcExist);

//     if (pluggedDirExist) {
//       await fs.rmdirSync(`${homedir}/.vimConfiguration/oldConfig/plugged`);
//     }
//     if (vimrcExist) {
//       await fs.unlinkSync(`${homedir}/.vimConfiguration/oldConfig/.vimrc`);
//     }

//     await fs.copyFileSync(
//       `${homedir}/.vimrc`,
//       `${homedir}/.vimConfiguration/oldConfig/.vimrc`
//     );

//     // boucle pour copier tout ce qu'il ya dans .vim/plugged
//   } catch (e) {
//     console.log(e);
//   }
// }

////////////////////////////////////////////////////////////////////////
//                           create section                           //
////////////////////////////////////////////////////////////////////////

async function createVimConfiguation() {
  if (checkNameExist()) {
    await checkIfConfigurationDirIsCreated();

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
  } else {
    console.log(`

      Veuillez ajouter un nom à la configuration

      `);
  }
}

////////////////////////////////////////////////////////////////////////
//                           switch section                           //
////////////////////////////////////////////////////////////////////////

async function switchVimConfiguation() {
  await checkIfConfigurationDirIsCreated();
  try {
    console.log("switch");
  } catch (e) {
    console.log(e);
  }
}

////////////////////////////////////////////////////////////////////////
//                           remove section                           //
////////////////////////////////////////////////////////////////////////

async function removeVimConfiguation() {
  await checkIfConfigurationDirIsCreated();
  try {
    await fs.rmdirSync(`${homedir}/.vimConfiguration/${args[1]}/plugged`);
    await fs.unlinkSync(`${homedir}/.vimConfiguration/${args[1]}/.vimrc`);
    await fs.rmdirSync(`${homedir}/.vimConfiguration/${args[1]}`);
    console.log(`

      La configuration ${args[1]} a bien été supprimée

      `);
  } catch (e) {
    console.log("La configuration que vous voulez effacer n'existe pas");
  }
}

////////////////////////////////////////////////////////////////////////
//                            list section                            //
////////////////////////////////////////////////////////////////////////

async function listVimConfiguration() {
  await checkIfConfigurationDirIsCreated();
  try {
    const allConfig = await fs.readdirSync(`${homedir}/.vimConfiguration`);
    console.log(`
    Configurations actuel:
    `);
    allConfig.forEach(element => {
      console.log(`    - ${element} `);
    });
    console.log(` `);
  } catch (e) {
    console.log("Vos configurations n'ont pas pu être listé");
  }
}

////////////////////////////////////////////////////////////////////////
//                            Help section                            //
////////////////////////////////////////////////////////////////////////

const helpString = `
      vimSwitch <command> [args] [options]

      Commands: 
        create <name> - (create new configuration named $name)
        list - (list all configurations)
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

switch (args[0]) {
  case "create":
    createVimConfiguation();
    break;
  case "switch":
    switchVimConfiguation();
    break;
  case "remove":
    removeVimConfiguation();
    break;
  case "list":
    listVimConfiguration();
    break;
  case "-h":
  case "--help":
    console.log(helpString);
    break;
}
