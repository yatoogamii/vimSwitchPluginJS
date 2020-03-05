#!/usr/bin/env node

const readline = require("readline");
const homedir = require("os").homedir();
const fs = require("fs");
const [, , ...args] = process.argv;

////////////////////////////////////////////////////////////////////////
//                               start                                //
////////////////////////////////////////////////////////////////////////

(async function start() {
  await checkConfigurationDirExist();

  try {
    const allConfigName = await fs.readdirSync(`${homedir}/.vimConfiguration`);

    switch (args[0]) {
      case "create":
        await createVimConfiguration(allConfigName);
        break;
      case "switch":
        // switchVimConfiguration();
        break;
      case "remove":
        await removeVimConfiguration(allConfigName);
        break;
      case "list":
        await listVimConfiguration(allConfigName);
        break;
      case "-h":
      case "--help":
        console.log(helpString);
        break;
    }
  } catch (e) {
    console.log(e);
  }
})();

async function checkConfigurationDirExist() {
  try {
    await fs.readdirSync(`${homedir}/.vimConfiguration`);
  } catch (e) {
    await fs.mkdirSync(`${homedir}/.vimConfiguration`);
  }
}

////////////////////////////////////////////////////////////////////////
//                           create section                           //
////////////////////////////////////////////////////////////////////////

async function createVimConfiguration(allConfigName) {
  if (args[1] && !allConfigName.includes(args[1])) {
    try {
      await fs.mkdirSync(`${homedir}/.vimConfiguration/${args[1]}`);
      await fs.writeFileSync(
        `${homedir}/.vimConfiguration/${args[1]}/vimrc`,
        `" name of configuration : #${args[1]} (dont touch)`
      );
      console.log(`La configuration '${args[1]}' à bien été crée`);
    } catch (e) {
      console.log(e);
    }
  } else if (!args[1]) {
    console.log("Veuillez indiquer un nom pour la configuration");
  } else {
    console.log("Le nom indiqué est déjà utilisé");
  }
}

////////////////////////////////////////////////////////////////////////
//                           switch section                           //
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
//                           remove section                           //
////////////////////////////////////////////////////////////////////////

async function removeVimConfiguration(allConfigName) {
  if (allConfigName.includes(args[1])) {
    try {
      await fs.rmdirSync(`${homedir}/.vimConfiguration/${args[1]}`, {
        recursive: true
      });
      console.log(`La configuration '${args[1]}' à bien été supprimé`);
    } catch (e) {
      console.log(e);
    }
  } else if (args[1]) {
    console.log(`La configuration '${args[1]}' n'existe pas`);
  } else {
    console.log("Veuillez indiqué le nom de la configuration à supprimer");
  }
}
////////////////////////////////////////////////////////////////////////
//                            list section                            //
////////////////////////////////////////////////////////////////////////

async function listVimConfiguration(allConfigName) {
  if (allConfigName.length > 0) {
    console.log(`
    Configurations actuels: \n\t - ${allConfigName.join("\n\t - ")}
    `);
  } else {
    console.log(`
      Vous n'avez pas encore de configuration
      `);
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
