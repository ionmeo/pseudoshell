import { handleBasicCommand } from "./basics";
import { handleNeofetchCommand } from "./neofetch";
import { applyTheme, themes } from "./themes";
import { handlePeriodicTableData } from "./periodic-table-data";
import { elements } from "../../public/elementData";
import SteamLocomotive from "./steam-locomotive";
import { displayHelp } from "./displayHelp";
import { ls, cd, mkdir, resetFileSystem, rmdir, mv, cp, rm, cat, touch, stat, pwd } from "./filesystem";

let currentTheme = "default";

export const executeCommand = async (input, terminal) => {
  if (!input) {
    return true;
  }
  const args = parseArguments(input);
  const command = args[0];
  const commandArgs = args.slice(1);

  switch (command) {
    case "ls":
      if (commandArgs[0] === "--help") {
        return displayHelp(command, terminal);
      }
      const lsResult = await ls(commandArgs, terminal.term);
      if (lsResult.trim() != "") {
        terminal.write(lsResult);
        return true;
      }
      return false;
    case "mkdir":
      if (commandArgs[0] === "--help") {
        return displayHelp(command, terminal);
      }
      const mkdirResult = await mkdir(commandArgs);
      if (mkdirResult != "") {
        terminal.write(mkdirResult);
        return true;
      }
      return false;
    case "stat":
      const statResult = await stat(commandArgs);
      terminal.write(statResult);
      return true;

    case "mv":
      if (commandArgs[0] === "--help") {
        return displayHelp(command, terminal);
      }
      const mvResult = await mv(commandArgs, terminal);
      if (mvResult) {
        terminal.write(mvResult);
        return true;
      }
      return false;
    case "cd":
      const cdResult = await cd(commandArgs[0]);
      if (cdResult.output) {
        terminal.write(cdResult.output + "\r\n");
      }
      return { newline: false, currentPath: cdResult.currentPath };
    case "reset-files":
      const resetResult = await resetFileSystem();
      terminal.write(resetResult);
      return { newline: true, currentPath: "~" };
    case "rmdir":
      if (commandArgs[0] === "--help") {
        return displayHelp(command, terminal);
      }
      const rmdirResult = await rmdir(commandArgs);
      if (rmdirResult != "") {
        terminal.write(rmdirResult);
        return true;
      }
      return false;
    case "cp":
      if (commandArgs[0] === "--help") {
        return displayHelp(command, terminal);
      }
      const cpResult = await cp(commandArgs, terminal);
      if (cpResult) {
        terminal.write(cpResult);
        return true;
      }
      return false;
    case "rm":
      if (commandArgs[0] === "--help") {
        return displayHelp(command, terminal);
      }
      const rmResult = await rm(commandArgs, terminal);
      if (rmResult) {
        terminal.write(rmResult);
        return true;
      }
      return false;
    case "cat":
      if (commandArgs[0] === "--help") {
        return displayHelp(command, terminal);
      }
      const catResult = await cat(commandArgs, terminal.term);
      terminal.write(catResult);
      return true;
    case "touch":
      if (commandArgs[0] === "--help") {
        return displayHelp(command, terminal);
      }
      const touchResult = await touch(commandArgs);
      if (touchResult.trim() != "") {
        terminal.write(touchResult);
        return true;
      }
      return false;
    case "binary-clock":
      if (commandArgs[0] === "--help") {
        const clockHelpLines = ["Usage: binary-clock [options]", "Display current time in binary format", "", "Options:", "  --alt      Displays horizontal version of the clock"];
        terminal.write(clockHelpLines.join("\r\n"));
        return true;
      }
      const { output: clock } = handleBasicCommand(command, commandArgs);
      terminal.write(`${clock}`);
      return true;
    case "cal":
      if (commandArgs[0] === "--help") {
        return displayHelp(command, terminal);
      }
      const { output: calendar } = handleBasicCommand(command, commandArgs, terminal.term);
      terminal.write(`${calendar}`);
      return true;
    case "daktilo":
      if (commandArgs[0] === "--help") {
        return displayHelp(command, terminal);
      }
      const { output: presets } = handleBasicCommand(command, commandArgs);
      terminal.write(`${presets}`);
      return true;
    case "date":
      if (commandArgs[0] === "--help") {
        return displayHelp(command, terminal);
      }
      const { output: dateOut } = handleBasicCommand(command, commandArgs);
      terminal.write(`${dateOut}`);
      return true;
    case "echo":
      if (commandArgs[0] === "--help") {
        return displayHelp(command, terminal);
      }
      const { output: echoOut, noNewline } = handleBasicCommand(command, commandArgs);
      terminal.write(`${echoOut}`);
      return !noNewline;
    case "exit":
      window.close();
      setTimeout(() => {
        window.location.href = "about:blank";
      }, 1000);
      break;
    case "factor":
      const { output: factor } = handleBasicCommand(command, commandArgs);
      terminal.write(`${factor}`);
      return true;
    case "fortune": {
      try {
        const { output: fortuneOutput } = await handleBasicCommand(command, null, terminal.term);
        terminal.write(fortuneOutput);
      } catch (error) {
        terminal.write("Error displaying fortune\r\n");
      }
      return true;
    }
    case "help":
      return displayHelp(command, terminal);
    case "neofetch":
      if (commandArgs[0] === "--help") {
        return displayHelp(command, terminal);
      }
      try {
        const { output: neofetchOutput } = await handleNeofetchCommand(commandArgs, terminal.username, terminal.firstRun, terminal.term, currentTheme, terminal.pageLoadTime);
        terminal.write(neofetchOutput);
      } catch (error) {
        terminal.write(`Error running neofetch: ${error.message}\r\n`);
      }
      return true;
    case "periodic-table-cli":
      if (commandArgs[0] === "--help") {
        return displayHelp(command, terminal);
      }
      const content = handlePeriodicTableData(input, terminal, elements);
      if (content != false) {
        terminal.write(content);
        return true;
      }
      return false;
    case "pwd":
      terminal.write(await pwd(`/home/${terminal.username.split("@")[0]}`));
      return true;
    case "sl":
      if (commandArgs[0] === "--help") {
        const steamHelpLines = ["Usage: sl [OPTIONS]", "Displays steam locomotive to cure your mistyping", "", "Options:", "  -a      An accident is occurring. People will cry for help.", "  -l      Little version", "  -c      Displays alternate steam locomotive"];
        terminal.write(steamHelpLines.join("\r\n"));
        return true;
      }
      terminal.showOverlay(<SteamLocomotive input={commandArgs} onClose={() => terminal.hideOverlay()} />);
      return false;
    case "theme":
      if (commandArgs[0] === "--help" || commandArgs.length === 0) {
        return displayHelp(command, terminal);
      } else {
        const themeName = commandArgs[0].toLowerCase();
        if (themes[themeName]) {
          applyTheme(terminal.term, themeName);
          currentTheme = themeName; // Update current theme
          terminal.write(`Theme changed to ${themeName}`);
        } else {
          terminal.write(`Theme '${themeName}' not found`);
        }
      }
      return true;
    case "weather":
      try {
        const { output: weatherOutput } = await handleBasicCommand(command, commandArgs, terminal.term);
        terminal.write(`${weatherOutput}`);
      } catch (error) {
        terminal.write("Error fetching weather data\r\n");
      }
      return true;
    case "whoami":
      terminal.write(terminal.username.split("@")[0]);
      return true;
    case "yes": {
      if (commandArgs.length === 0 || commandArgs[0] === "--help") {
        terminal.writeln("Usage: yes [text] - Prints the input text repeatedly");
        return false;
      }
      const text = commandArgs.join(" ");
      let isRunning = true;

      // Event listener for Ctrl+C
      terminal.term.onData((data) => {
        if (data.charCodeAt(0) === 3) {
          isRunning = false;
        }
      });

      while (isRunning) {
        terminal.write(text + "\r\n");
        await new Promise((resolve) => setTimeout(resolve, 40));
      }
      return false;
    }

    default:
      terminal.write(`Command not found: ${command}`);
      return true; // Always return true for unknown commands
  }
};

export const parseArguments = (input) => {
  const regex = /--[a-zA-Z]+="([^"]+)"|--[a-zA-Z]+=(\S+)|"([^"]+)"|'([^']+)'|(\S+)/g;
  const args = [];
  let match;

  while ((match = regex.exec(input)) !== null) {
    // Find the first not undefined capture group
    const value = match.slice(1).find((x) => x !== undefined);

    if (match[0].includes("--date=")) {
      args.push(`--date=${value}`);
    } else {
      args.push(value);
    }
  }
  return args;
};
