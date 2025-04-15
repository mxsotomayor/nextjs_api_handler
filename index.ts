#!/usr/bin/env node

import inquirer from "inquirer";
import fs, { exists } from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import { files, baseDispatchSettings } from "./base/files";

(async () => {
  console.log(
    chalk.blue(`

    ███╗░░██╗███████╗██╗░░██╗████████╗░█████╗░██████╗░██╗
    ████╗░██║██╔════╝╚██╗██╔╝╚══██╔══╝██╔══██╗██╔══██╗██║
    ██╔██╗██║█████╗░░░╚███╔╝░░░░██║░░░███████║██████╔╝██║
    ██║╚████║██╔══╝░░░██╔██╗░░░░██║░░░██╔══██║██╔═══╝░██║
    ██║░╚███║███████╗██╔╝╚██╗░░░██║░░░██║░░██║██║░░░░░██║
    ╚═╝░░╚══╝╚══════╝╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░░░░╚═╝
    \nv.0.0.1456\nby maxwellsr.com\n`)
  );

  const exists = await fs.exists("init.json");

  const apiPath = "./src/app/(web_api/api)";

  if (!exists) {
    const { dispatcher_base } = await inquirer.prompt([
      {
        type: "input",
        name: "dispatcher_base",
        message:
          "Initializing routers. Where we should created the dispatcher?",
        default: exists,
      },
    ]);

    console.log("output", dispatcher_base + "/dispatch");

    fs.mkdir(dispatcher_base, {
      recursive: true,
    });

    fs.mkdir("./src/server_routes", {
      recursive: true,
    });

    fs.outputFile(
      "init.json",
      JSON.stringify(
        { init: "done", dispatcher_base: dispatcher_base },
        null,
        " "
      )
    );

    fs.outputFile(
      path.join(
        dispatcher_base,
        baseDispatchSettings.path,
        baseDispatchSettings.fileName
      ),
      baseDispatchSettings.content
    );

    return;
  }

  for (const file of files) {
    fs.mkdir(file.path, {
      recursive: true,
    });
    fs.outputFile(path.join(file.path, file.fileName), file.content);
  }

  const { type } = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "What do you want to generate?",
      choices: ["New Route", "Component"],
    },
  ]);

  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: `Enter ${type.toLowerCase()} name (e.g. About):`,
    },
  ]);

  const targetDir =
    type === "Page"
      ? `./pages/${name.toLowerCase()}.tsx`
      : `./components/${name}.tsx`;

  const template =
    type === "Page"
      ? `export default function ${name}() {
  return <div>${name} Page</div>;
}
`
      : `export const ${name} = () => {
  return <div>${name} Component</div>;
};
`;

  await fs.outputFile(targetDir, template);

  console.log(chalk.green(`✅ ${type} created at ${targetDir}`));
})();
