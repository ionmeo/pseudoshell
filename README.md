![](public/pseudoshell.jpg)

<h1 align="center">
 Pseudoshell
</h1>

A feature-rich terminal simulator that runs entirely in your browser, providing a native-like command-line experience with common Unix/Linux commands.

## 🚀 Features

- **Native-like Experience**: 
  - Command history navigation (up/down arrows)
  - Cursor movement (left/right arrows or mouse click)
  - Multi-line command support
  - Copy/paste functionality
  - Undo/redo support
- **Themes**: Inclues 60+ popular terminal themes
- **Native-like Filesystem**: 
  - Supports popular commands like:
   cd, ls, mkdir, rmdir, rm, cp, mv, cat and touch
  - Cross-tab Synchronization
  - Keeps track of access and modification time of files and directories
- **Mobile-Friendly**: Responsive design with virtual keyboard support

## 📋 Available Commands

- [binary-clock](https://github.com/tom-on-the-internet/binary-clock) - Shows current time in binary
- [cal](https://github.com/skeeto/scratch/blob/master/windows/cal.c) - Displays calendar
- `cat` - Display file content
- `cd` - Change directory
- `clear` - Clears the terminal screen
- `cp` - Copy files and directories
- `date` - Displays current date and time with formatting options
- [daktilo](https://github.com/orhun/daktilo) - Plays typewriter sounds while typing
- `echo` - Displays text with support for escape sequences
- `exit` - Closes the terminal session
- `factor` - Prints the prime factors of input
- [fortune](https://github.com/bmc/fortunes) - Displays random quotes
- `help` - Shows available commands
- `ls` - List directory contents
- `mkdir` - Make directories
- `mv` - Move files and directories
- [neofetch](https://github.com/dylanaraps/neofetch) - Displays system information in an aesthetic way. Some ASCII art are from [fastfetch](https://github.com/fastfetch-cli/fastfetch). Weather and temperature information is fetched from [Open-Meteo](https://open-meteo.com/en/docs) using the approximate location collected from IP address via [GeoJS](https://www.geojs.io/)
- [periodic-table-cli](https://github.com/spirometaxas/periodic-table-cli) - Interactive periodic table explorer
- `pwd` - Prints the current working directory
- `reset-files` - Reset the changes made to the filesystem
- `rm` - Remove files
- `rmdir` - Remove empty directories
- [sl](https://github.com/mtoyoda/sl) - Displays steam locomotive
- `stat` - Displays file details
- [theme](https://gogh-co.github.io/Gogh/) - Changes terminal appearance
- `touch` - Create empty files
- [weather](https://wttr.in/) - Shows weather
- `whoami` - Displays temporary username
- `yes` - Prints the input text repeatedly

`binary-clock` `cal` `cat` `cp` `date` `daktilo`  `echo` `ls` `mkdir` `mv` `neofetch` `periodic-table-cli` `rm` `rmdir` `sl`  `theme` `touch` and `weather` has additional options available that can be found by running `[command] --help`

### More command support will be added in the future.

## 📦 Development

To get started with Pseudoshell, clone the repository and install the required dependencies:

```shell
git clone https://github.com/LunarEclipseCode/omni-tools
cd omni-tools
npm install
npm run dev
```

Once the application is running, navigate to `http://localhost:3000` in your browser.
