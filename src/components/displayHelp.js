import { themes } from "./themes";
const calendarLines = [
  "",
  "Usage: cal [options] [[[day] month] year]",
  "Display a calendar, or some part of it.",
  "Without any arguments, display he current month.",
  "",
  "Options:",
  "  -n, --months <num>     Show num months starting with date's month",
  "  -S, --span             Span the date when displaying multiple months",
  "  -m, --monday           Monday as first day of week",
  "  -v, --vertical         Show day vertically instead of line",

  "Examples:",
  "  cal 2012               Show full year 2012",
  "  cal 14 3 2016          Show March 2016, highlight the 14th",
  "  cal 6 1988 -n 6 -S -v  Show Mar - Aug 1988 in vertical layout",
  "  cal -m                 Show current month with Monday as first day",
  "",
];

const catLines = [
  "",
  "Usage: cat [OPTION]... [FILE]...",
  "Concatenate FILE(s) to standard output",
  "",
  "Options:",
  "  -E, --show-ends      display $ at the end of each line",
  "  -n, --number         number all output lines",
  "  -s, --squeeze-blank  suppress repeated empty output lines",
  "",
  "Redirection:",
  "  >         create new file or overwrite existing file with the output",
  "  >>        append the output to a file",
  "",
  "Examples:",
  "  cat file1                   Display contents of file1",
  "  cat file1 file2 -n -E -s    Display contents of both files with line numbers",
  "                              and line endings, removing extra blank lines",
  "  cat file1 file2 > merged    Merge file 1 & 2 into a new file",
  "  cat file1 file2 >> current  Append file 1 & 2 to existing file",
  "",
];

const cpLines = [
  "",
  "Usage: cp [OPTION]... SOURCE DEST",
  "   or: cp [OPTION]... SOURCE... DIRECTORY",
  "Copy SOURCE to DEST, or multiple SOURCE(s) to DIRECTORY.",
  "",
  "Options:",
  "  -b, --backup           make a backup of each existing destination file",
  "  -i, --interactive      ask for confirmation before overwriting",
  "  -r, -R, --recursive    copy directories recursively",
  "",
  "Examples:",
  "  cp file1 file2         Copy file1 to file2 (overwrite file2 if already exist)",
  "  cp file1 file2 Docs    Copy multiple files to Docs directory",
  "  cp dir2 dir1 -r        Copy dir2 to dir1 if dir1 doesn't exist. Otherwise,",
  "                         copy the contents of dir2 inside dir1/dir2",
  "  cp dir2 dir1 -i -r     Same as above, but ask before overwriting any existing files",
  "  cp dir2 dir1 -i -r -b  Same as above, but make backups with ~ suffix if overwriting",
  "  cp file1 file2 -b      Copy file1 to file2, backup file2 if it exists",
  "",
];

const daktiloLines = [
  "",
  "Usage: daktilo [options]",
  "Display a calendar, or some part of it.",
  "Turn your keyboard into a typewriter!",
  "",
  "Options:",
  "  --preset           Sets the name of the sound preset to use",
  "  --list-presets     Lists the available presets",
  "  --close            Closes daktilo and stops the sound",
  "",
];

const dateLines = [
  "",
  "Usage: date [OPTION]... [+FORMAT]",
  "Display the time in the given FORMAT.",
  "",
  "Options:",
  "  -u                       Output in UTC/GMT timezone",
  "  --date=STRING            Display date described by STRING",
  "",
  "FORMAT Options:",
  "  %Y        year",
  "  %y        last two digits of year",
  "  %m        month",
  "  %d        day of month",
  "  %H        hour",
  "  %M        minute",
  "  %S        second",
  "  %A        full weekday name",
  "  %B        full month name",
  "",
  "Special FORMAT sequences:",
  "  %D        date; same as %m/%d/%y",
  "  %T        time; same as %H:%M:%S",
  "",
  "Supported date STRING formats:",
  "  'N years ago'          N years before current date",
  "  'N months ago'         N months before current date",
  "  'N days ago'           N days before current date",
  "  'N hours ago'          N hours before current date",
  "  'N minutes/min ago'    N minutes before current date",
  "  'N seconds/sec ago'    N seconds before current date",
  "  'yesterday'            Previous day",
  "  'tomorrow'             Next day",
  "  'next sun/mon/tue...'  Next occurrence of specified weekday",
  "",
  "Examples:",
  '  date "+%D %T"                           Display date and time in MM/DD/YY HH:MM:SS format',
  '  date -u --date="1 year" "+%Y/%m/%d"     Display date of 1 year ago in UTC using YYYY/MM/DD format',
  "",
];

const echoLines = [
  "",
  "Usage: echo [OPTION]... [STRING]...",
  "Echo the STRING(s) to terminal output.",
  "",
  "Options:",
  "  -e        Enable interpretation of backslash escapes",
  "",
  "If -e is in effect, the following sequences are recognized:",
  "  \\b        backspace",
  "  \\n        new line",
  "  \\r        carriage return",
  "  \\t        horizontal tab",
  "  \\v        vertical tab",
  "  \\c        produce no further output",
  "  \\e        escape character",
  "  \\\\        backslash",
  "",
  "Examples:",
  '  echo -e "\\e[1;37;41mThis is white text on red background\\e[0m"',
  '  echo -e "\\e[4mThis is underlined text\\e[0m"',
  '  echo -e "\\e[31mThis \\e[32mis \\e[33ma \\e[34mrainbow \\e[35mtext\\e[0m"',
  "",
];

const helpLines = [
  "",
  "  \x1b[92mbinary-clock \x1b[0m        Shows current time in binary",
  "  \x1b[92mcal\x1b[0m                  Displays calendar",
  "  \x1b[92mcat\x1b[0m                  Display file content",
  "  cd                   Change directory",
  "  clear                Clears the terminal",
  "  \x1b[92mcp\x1b[0m                   Copy files and directories",
  `  \x1b[92mdate\x1b[0m                 Shows current date and time`,
  `  \x1b[92mdaktilo\x1b[0m              Turn your keyboard into a typewriter`,
  `  \x1b[92mecho\x1b[0m                 Displays a line of text`,
  "  exit                 Closes the terminal",
  "  factor               Prints the prime factors of input",
  "  fortune              Displays random quotes",
  "  help                 Displays this help message",
  "  \x1b[92mls\x1b[0m                   List directory contents",
  "  \x1b[92mmkdir\x1b[0m                Make directories",
  "  \x1b[92mmv\x1b[0m                   Move files and directories",
  `  \x1b[92mneofetch\x1b[0m             Displays system information aesthetically`,
  `  \x1b[92mperiodic-table-cli\x1b[0m   Shows interactive periodic table`,
  "  pwd                  Prints the current working directory",
  "  reset-files          Reset the changes made to the filesystem",
  "  \x1b[92mrm\x1b[0m                   Remove files",
  "  \x1b[92mrmdir\x1b[0m                Remove empty directories",
  "  \x1b[92msl\x1b[0m                   Displays steam locomotive",
  "  stat                 Displays file details",
  `  \x1b[92mtheme\x1b[0m                Lists or changes terminal themes`,
  "  \x1b[92mtouch\x1b[0m                Create empty files",
  `  \x1b[92mweather\x1b[0m              Shows weather information`,
  "  whoami               Displays temporary username",
  "  yes [text]           Prints the input text repeatedly",
  "",
  "To learn more about the colored commands, type '[command] --help'",
  "",
];

const lsLines = [
  "",
  "Usage: ls [OPTION]... [FILE]...",
  "List information about the files (the current directory by default)",
  "",
  "Options:",
  "  -1                   list one file per line",
  "  -d                   list directories themselves, not their contents",
  "  -h                   with -l, print file sizes in readable format",
  "  -l                   use long listing format",
  "  -r                   reverse order while sorting",
  "  -t                   sort by time, newest first",
  "  --time-style=STYLE   list directories themselves, not their contents",
  "",
  "Available STYLES for --time-style: locale, iso, long-iso",
  "",
  "Examples:",
  "  ls                             List contents of current directory",
  "  ls <dir1> -l -d                Show details about <dir1>",
  "  ls <dir1> <dir2> -l -t         List contents of <dir1> and <dir2> sorted by time",
  "  ls <dir1> -l --time-style=iso  Show <dir1> contents with ISO-formatted timestamps",
  "",
];

const mkdirLines = [
  "",
  "Usage: mkdir [OPTION]... [DIRECTORY]...",
  "Create the DIRECTORY(ies), if they do not already exist",
  "",
  "Options:",
  "  -p, --parents   make parent directories as needed (no error if existing)",
  "  -v, --verbose   print a message for each created directory",
  "",
  "Examples:",
  "  mkdir dir1 dir2      Create dir1 and dir2",
  "  mkdir dir1/dir2 -p   Equivalent to 'mkdir dir1 dir1/dir2'",
  "",
];

const mvLines = [
  "",
  "Usage: mv [OPTION]... SOURCE... DEST",
  "Rename SOURCE to DEST, or move SOURCE(s) to DIRECTORY.",
  "",
  "Options:",
  "  -b, --backup          make a backup of each existing destination file/directory",
  "  -i, --interactive     ask for confirmation before overwriting",
  "  -n, --no-clobber      do not overwrite an existing file",
  "",
  "Examples:",
  "  mv file1 file2        Rename file1 to file2 (overwrite file2 if already exist)",
  "  mv file1 file2 Docs   Move multiple files to Docs directory",
  "  mv dir2 dir1          Rename dir2 to dir1 if dir1 doesn't exist. Otherwise,",
  "                        move dir2 inside dir1 (error if dir1/dir2 is not empty)",
  "  mv dir2 dir1 -i       Same as above, but ask before overwriting dir1/dir2",
  "  mv dir2 dir1 -i -b    Same as above, but if confirmed, create backup",
  "                        dir1/dir2~ with original content before overwriting",
  "  mv file1 file2 -b     Rename file1 to file2, backup file2 if it exists",
  "",
];

const neofetchLines = [
  "",
  "Usage: neofetch [OPTIONS]",
  "View system information in an aesthetic way.",
  "",
  "Options:",
  "  --colors x x x x x x       Changes the text colors in this order:",
  "                             title, @, underline, subtitle, colon, info",
  "  --ascii_distro distro      Display the ascii art of the mentioned distro",
  "  --color_blocks on/off      Enable/disable the color blocks",
  "  --underline on/off         Enable/disable underline after title",
  "  --underline_char char      Character to use when underlining title",
  "  --separator string         Changes the default ':' separator to the specified string",
  "  --col_offset auto/num      Left padding of color blocks",
  "  --block_width num          Width of color blocks in spaces",
  "  --disable infoname         Allows you to disable an info line from appearing",
  "                             You can supply multiple args. eg. 'neofetch --disable cpu gpu'",
  "  --off                      Disable ASCII art",
  "  -L                         Hide the info text and only show the ascii logo",
  "  --stdout                   Output without ASCII art and colors",
  "",
  "Available fields to disable:",
  "  os, browser, engine, appearance, uptime, ip, region, resolution,",
  "  pixel-ratio, font, time, timezone, language, battery, weather, temperature",
  "",
  "Available ascii art for --ascii_distro:",
  "  mac, ubuntu, windows, linux, aix, alma, hash, alpine, alter, amazon,",
  "  anarchy, android, instant, antergos, aperture, apricity, archcraft, arco,",
  "  archbox, archlabs, arch_old, archstrike, archmerge, arch, artix, arya,",
  "  bedrock, blackarch, blag, blankon, bluelight, manjaro, xferience",
  "",
];

const periodicTableLines = [
  "",
  "Usage: periodic-table-cli [OPTIONS]",
  "Display and interact with the periodic table of elements.",
  "",
  "Options:",
  "  --mode=MODE            Set display mode",
  "                           app   - Interactive mode (default)",
  "                           data  - Display element data",
  "                           chart - Static table view",
  "  --atomic-number=NUM    Select element by atomic number",
  "  --symbol=SYMBOL        Select element by atomic symbol",
  "  --name=NAME            Select element by full name",
  "  --small                Display condensed periodic table",
  "  --verbose              Show extended element data",
  "",
  "Examples:",
  "  periodic-table-cli                         Launch interactive periodic table",
  "  periodic-table-cli --mode=data --symbol=H  Display hydrogen data",
  "  periodic-table-cli --mode=chart --small    Show condensed periodic table",
  "  periodic-table-cli --mode=data --verbose   Display complete element dataset",
  "",
];

const rmLines = [
  "",
  "Usage: rm [OPTION]... [FILE]...",
  "Remove the FILE(s)",
  "",
  "Options:",
  "  -f, --force           ignore nonexistent files and arguments, never prompt",
  "  -i, --interactive     Ask for confirmation before every removal",
  "  -r, -R, --recursive   remove directories and their contents recursively",
  "",
  "Examples:",
  "  rm file1 file2        Remove file1 and file2",
  "  rm -r dir1 dir2       Remove dir1 and dir2",
  "  rm -r dir1 file1 -i   Ask for confirmation before deleting dir1 & file1",
  "",
];

const rmdirLines = [
  "",
  "Usage: rmdir [OPTION]... [DIRECTORY]...",
  "Remove the DIRECTORY(ies), if they are empty",
  "",
  "Options:",
  "  --ignore-fail-on-non-empty  ignore failure to remove a non-empty directory",
  "  -p, --parents               remove DIRECTORY and its ancestors",
  "                              e.g. 'rmdir -p a/b' is similar to 'rmdir a/b a'",
  "  -v, --verbose               output a diagnostic for every directory processed",
  "",
  "Examples:",
  "  rmdir dir1                  Remove dir1 if its empty",
  "  rmdir dir1 dir2 -v          Show feedback while removing dir1 and dir2",
  "",
];

function themeLines(term) {
  const INDENT = "  ";
  const themeNames = Object.keys(themes);
  
  let currentLine = INDENT;
  const formattedLines = [];
  
  themeNames.forEach((theme, index) => {
    const isLast = index === themeNames.length - 1;
    
    // If this is first theme in the line
    if (currentLine === INDENT) {
      currentLine += theme;
    } else {
      // Calculate what would be added: ", theme"
      const addition = ", " + theme;
      
      // Check if it fits on current line
      if (currentLine.length + addition.length < term.cols) {
        currentLine += addition;
      } else {
        // Add comma to end of current line if it's not the final line
        if (!isLast) {
          currentLine += ",";
        }
        formattedLines.push(currentLine);
        currentLine = INDENT + theme;
      }
    }
    
    // If this is the last theme, push the final line
    if (isLast) {
      formattedLines.push(currentLine);
    }
  });
  
  // Construct the complete theme lines
  const themeLines = [
    "Usage: theme [THEME_NAME]",
    "",
    "Available themes:",
    ...formattedLines,
    "",
    "Examples:",
    `  theme onedark      Switches to the onedark theme`,
    ""
  ];
  
  return themeLines;
}

const touchLines = [
  "",
  "Usage: touch [OPTION]... [FILE]...",
  "Update the access and modification times of each FILE to the current time",
  " A FILE argument that doesn't exist is createdd empty, unless -c is supplied.",
  "",
  "Options:",
  "  -a                   change only the access time",
  "  -c                   do not create any files",
  "  -d STRING            parse STRING and use it instead of current time",
  "  -m                   change only the modification time",
  "  -r FILE              use this file's times insted of current time",
  "",
  "Examples:",
  "  touch -r file1 file2            Copy timestamps from file1 to file2",
  `  touch "4 Jan 1896 15:30" file1  Set file1's timestamps to specified date`,
  "  touch -c file1                  Update timestamps only if file1 exists",
  "",
];

export const displayHelp = (command, terminal) => {
  const helpMap = {
    cal: calendarLines,
    cat: catLines,
    cp: cpLines,
    daktilo: daktiloLines,
    date: dateLines,
    echo: echoLines,
    help: helpLines,
    ls: lsLines,
    mkdir: mkdirLines,
    mv: mvLines,
    neofetch: neofetchLines,
    'periodic-table-cli': periodicTableLines,
    rm: rmLines,
    rmdir: rmdirLines,
    theme: themeLines(terminal.term),
    touch: touchLines
  };

  if (command in helpMap) {
    terminal.write(helpMap[command].join("\r\n"));
    return true;
  }
  
  return false;
};
