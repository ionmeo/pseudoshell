const FILE_COLORS = {
  // Images - Magenta
  ".jpg": "\x1b[0;35m",
  ".jpeg": "\x1b[0;35m",
  ".png": "\x1b[0;35m",
  ".gif": "\x1b[0;35m",
  ".bmp": "\x1b[0;35m",
  ".webp": "\x1b[0;35m",

  // Documents - Green
  ".txt": "\x1b[0;32m",
  ".md": "\x1b[0;32m",
  ".doc": "\x1b[0;32m",
  ".docx": "\x1b[0;32m",
  ".pdf": "\x1b[0;32m",
  ".epub": "\x1b[0;32m",

  // Code files - Cyan
  ".js": "\x1b[0;36m",
  ".jsx": "\x1b[0;36m",
  ".ts": "\x1b[0;36m",
  ".tsx": "\x1b[0;36m",
  ".py": "\x1b[0;36m",
  ".java": "\x1b[0;36m",
  ".cpp": "\x1b[0;36m",
  ".c": "\x1b[0;36m",
  ".html": "\x1b[0;36m",
  ".css": "\x1b[0;36m",

  // Archives - Red
  ".zip": "\x1b[0;31m",
  ".tar": "\x1b[0;31m",
  ".gz": "\x1b[0;31m",
  ".rar": "\x1b[0;31m",
  ".7z": "\x1b[0;31m",

  // Media - Yellow
  ".mp3": "\x1b[0;33m",
  ".opus": "\x1b[0;33m",
  ".ogg": "\x1b[0;33m",
  ".mp4": "\x1b[0;33m",
  ".avi": "\x1b[0;33m",
  ".mov": "\x1b[0;33m",
};

const DEFAULT_COLOR = "\x1b[0m"; // White
const DIR_COLOR = "\x1b[0;34m"; // Blue

const DEFAULT_FILESYSTEM = {
  "/": {
    type: "directory",
    children: {
      Audiobooks: {
        type: "directory",

        children: {
          "my_shadow.mp3": {
            type: "file",
            publicPath: "/fileSystem/Audiobooks/my_shadow.mp3",
          },
          "sonnet_23.ogg": {
            type: "file",
            publicPath: "/fileSystem/Audiobooks/sonnet_23.ogg",
          },
          "the_raven.opus": {
            type: "file",
            publicPath: "/fileSystem/Audiobooks/the_raven.opus",
          },
        },
      },
      Pictures: {
        type: "directory",

        children: {
          "cosmic_cliffs.jpg": {
            type: "file",
            publicPath: "/fileSystem/Pictures/cosmic_cliffs.jpg",
          },
          "jupiter_clouds.jpg": {
            type: "file",
            publicPath: "/fileSystem/Pictures/jupiter_clouds.jpg",
          },
          "kanagawa_wave.webp": {
            type: "file",
            publicPath: "/fileSystem/Pictures/kanagawa_wave.webp",
          },
          "saturn.png": {
            type: "file",
            publicPath: "/fileSystem/Pictures/saturn.png",
          },
          "starry_night.webp": {
            type: "file",
            publicPath: "/fileSystem/Pictures/starry_night.webp",
          },
          "webb_first_deep_field.jpg": {
            type: "file",
            publicPath: "/fileSystem/Pictures/webb_first_deep_field.jpg",
          },
          "CREDITS.md": {
            type: "file",
            publicPath: "/fileSystem/Pictures/CREDITS.md",
          },
        },
      },
      Documents: {
        type: "directory",

        children: {
          "frankenstein.epub": {
            type: "file",
            publicPath: "/fileSystem/Documents/frankenstein.epub",
          },
          "robinson_crusoe.pdf": {
            type: "file",
            publicPath: "/fileSystem/Documents/robinson_crusoe.pdf",
          },
          "the_yellow_wallpaper.docx": {
            type: "file",
            publicPath: "/fileSystem/Documents/the_yellow_wallpaper.docx",
          },
          "sonnet.txt": {
            type: "file",
            publicPath: "/fileSystem/Documents/sonnet.txt",
          },
        },
      },
      Videos: {
        type: "directory",

        children: {
          "mountain.mp4": {
            type: "file",
            publicPath: "/fileSystem/Videos/mountain.mp4",
          },
          "voyager_1_approaching_jupiter.gif": {
            type: "file",
            publicPath: "/fileSystem/Videos/voyager_1_approaching_jupiter.gif",
          },
          "CREDITS.md" : {
            type: "file",
            publicPath: "/fileSystem/Videos/CREDITS.md",
          }
        },
      },
      Downloads: {
        type: "directory",

        children: {
          "kevin_macleod.7z": {
            type: "file",
            publicPath: "/fileSystem/Downloads/kevin_macleod.7z",
          },
          "shakespeare_sonnets.zip": {
            type: "file",
            publicPath: "/fileSystem/Downloads/shakespeare_sonnets.zip",
          },
          "illustrations.tar": {
            type: "file",
            publicPath: "/fileSystem/Downloads/illustrations.tar",
          },
        },
      },
    },
  },
};

// Add access time and modification time property to all files and dirs
const applyTimestamps = (obj) => {
  const now = Date.now();
  if (obj.type === "directory") {
    obj.atime = now;
    obj.mtime = now;
    for (const child of Object.values(obj.children)) {
      applyTimestamps(child);
    }
  } else if (obj.type === "file") {
    obj.atime = now;
    obj.mtime = now;
  }
  return obj;
};

let fileSystem = applyTimestamps(JSON.parse(JSON.stringify(DEFAULT_FILESYSTEM)));
let currentPath = "/";
let isInitialized = false;
let db = null;
let lastUpdateTime = Date.now();

const DB_NAME = "filesystem_db";
const DB_VERSION = 1;
const STORE_NAME = "filesystem_store";

const updateTimestamps = (item, updateMod = false, updateAccess = true) => {
  if (updateAccess) {
    item.atime = Date.now();
  }
  if (updateMod) {
    item.mtime = Date.now();
  }
};

const findPublicFiles = (node, path = "") => {
  const files = [];
  if (node.type === "file" && node.publicPath && !node.content) {
    files.push({ path, ...node });
  } else if (node.type === "directory") {
    for (const [name, child] of Object.entries(node.children)) {
      const childPath = path ? `${path}/${name}` : name;
      files.push(...findPublicFiles(child, childPath));
    }
  }
  return files;
};

const fetchFileContent = async (publicPath) => {
  try {
    const response = await fetch(publicPath);
    const blob = await response.blob();
    return {
      blob,
      size: blob.size,
      textContent: await blob.text(), // text content for cat command
    };
  } catch (error) {
    console.error(`Error fetching file content from ${publicPath}:`, error);
    return null;
  }
};

const updateFileContent = (path, content) => {
  const segments = path.split("/").filter(Boolean);
  let current = fileSystem["/"];

  for (let i = 0; i < segments.length - 1; i++) {
    current = current.children[segments[i]];
  }

  const fileName = segments[segments.length - 1];
  if (current.children[fileName]) {
    current.children[fileName].blob = content.blob;
    current.children[fileName].size = content.size;
    current.children[fileName].content = content.textContent;
  }
};

const fetchMissingContent = async () => {
  const filesToFetch = findPublicFiles(fileSystem["/"]);

  for (const file of filesToFetch) {
    const content = await fetchFileContent(file.publicPath);
    if (content !== null) {
      updateFileContent(file.path, content);
    }
  }
};

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("Error opening IndexedDB");
      reject(request.error);
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME);
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
  });
};

// Save state to IndexedDB with timestamp
const saveToIndexedDB = async (key, value) => {
  if (!db) return;

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const timestamp = Date.now();
    const request = store.put({ value, timestamp }, key);

    request.onsuccess = () => {
      lastUpdateTime = timestamp;
      resolve();
    };

    request.onerror = () => reject(request.error);
  });
};

// Get state from IndexedDB
const getFromIndexedDB = async (key) => {
  if (!db) return null;

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onsuccess = () => {
      const data = request.result;
      resolve(data ? data.value : null);
    };
    request.onerror = () => reject(request.error);
  });
};

// Check for updates in IndexedDB
const checkForUpdates = async () => {
  if (!db || !isInitialized) return;

  try {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get("filesystem");

    const result = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (result && result.timestamp > lastUpdateTime) {
      fileSystem = result.value;
      lastUpdateTime = result.timestamp;
      return true; // indicates that an update was found
    }
    return false; // no update needed
  } catch (error) {
    console.error("Error checking for updates:", error);
    return false;
  }
};

export const initFileSystem = async () => {
  if (isInitialized || typeof window === "undefined") return;

  try {
    await initDB();
    const savedFS = await getFromIndexedDB("filesystem");

    if (savedFS) {
      fileSystem = savedFS;
      currentPath = "/";
      await saveToIndexedDB("currentPath", currentPath);
    } else {
      await fetchMissingContent();
      await saveToIndexedDB("filesystem", fileSystem);
      await saveToIndexedDB("currentPath", currentPath);
    }

    isInitialized = true;
  } catch (error) {
    console.error("Error initializing filesystem:", error);
    resetFileSystem();
  }
};

// Save current state
const saveFileSystem = async () => {
  if (typeof window === "undefined" || !db) return;

  try {
    await saveToIndexedDB("filesystem", fileSystem);
    await saveToIndexedDB("currentPath", currentPath);
  } catch (error) {
    console.error("Error saving filesystem:", error);
  }
};

const updateAllTimestamps = (node) => {
  const currentTime = Date.now();
  node.atime = currentTime;
  node.mtime = currentTime;

  if (node.type === "directory" && node.children) {
    Object.values(node.children).forEach((child) => {
      updateAllTimestamps(child);
    });
  }
};

export const resetFileSystem = async () => {
  fileSystem = applyTimestamps(JSON.parse(JSON.stringify(DEFAULT_FILESYSTEM)));
  currentPath = "/";

  // Update all timestamps in the newly reset filesystem
  updateAllTimestamps(fileSystem["/"]);

  await fetchMissingContent();
  await saveFileSystem();
  return "Filesystem has been reset to default state";
};

initFileSystem();

const resolvePath = (path) => {
  if (!path) return currentPath;

  if (path === "~") return "/";

  if (path.startsWith("~/")) {
    return "/" + path.substring(2);
  }

  if (path.startsWith("/")) {
    return path;
  }

  // Relative path
  const segments = path.split("/");
  const currentSegments = currentPath.split("/").filter(Boolean);

  for (const segment of segments) {
    if (segment === "..") {
      if (currentSegments.length > 0) {
        currentSegments.pop();
      }
    } else if (segment !== "." && segment !== "") {
      currentSegments.push(segment);
    }
  }

  return "/" + currentSegments.join("/");
};

// Get directory contents at path
const getDirectory = (path) => {
  if (path === "/") return fileSystem["/"];

  const segments = path.split("/").filter(Boolean);
  let current = fileSystem["/"];

  for (const segment of segments) {
    if (!current.children || !current.children[segment]) {
      return null;
    }
    current = current.children[segment];
  }

  return current;
};

// Get color for a file based on its extension
const getFileColor = (filename) => {
  const ext = "." + filename.split(".").pop().toLowerCase();
  return FILE_COLORS[ext] || DEFAULT_COLOR;
};

export const ls = async (args = [], term) => {
  await checkForUpdates();
  let showDetails = false;
  let verticalDisplay = false;
  let sortByTime = false;
  let humanReadable = false;
  let reverseSort = false;
  let directoryAsFile = false;
  const paths = [];

  let timeStyle = "locale"; // Default time style

  // Parse arguments
  for (const arg of args) {
    if (arg === "-l") {
      showDetails = true;
    } else if (arg === "-1") {
      verticalDisplay = true;
    } else if (arg === "-t") {
      sortByTime = true;
    } else if (arg === "-h") {
      humanReadable = true;
    } else if (arg === "-r") {
      reverseSort = true;
    } else if (arg === "-d") {
      directoryAsFile = true;
    } else if (arg.startsWith("--time-style=")) {
      timeStyle = arg.split("=")[1];
    } else if (!arg.startsWith("-")) {
      paths.push(arg);
    }
  }

  // If no paths provided, use current directory
  if (paths.length === 0) {
    paths.push(".");
  }

  const formatTimestamp = (timestamp, style = "locale") => {
    const date = new Date(timestamp);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // Get time components with leading zeros
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const year = date.getFullYear();
    const monthNum = (date.getMonth() + 1).toString().padStart(2, "0");

    switch (style) {
      case "long-iso":
        return `${year}-${monthNum}-${day} ${hours}:${minutes}`;
      case "iso":
        return `${monthNum}-${day} ${hours}:${minutes}`;
      case "locale":
      default:
        return `${months[date.getMonth()]} ${day} ${hours}:${minutes}`;
    }
  };

  const getTimeLength = (style) => {
    switch (style) {
      case "long-iso":
        return 16; // "2025-01-01 22:56"
      case "iso":
        return 11; // "01-01 22:56"
      case "locale":
      default:
        return 12; // "Jan 01 22:56"
    }
  };

  const formatSize = (bytes) => {
    if (!humanReadable || bytes < 1024) {
      return String(bytes);
    }

    const units = ["", "K", "M", "G", "T"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    const roundedSize = Math.floor(size * 10) / 10;
    const formattedSize = roundedSize % 1 === 0 ? String(Math.floor(roundedSize)) : roundedSize.toFixed(1);

    return `${formattedSize}${units[unitIndex]}`;
  };

  // Get item information (either file or directory)
  const getItem = (path) => {
    const resolvedPath = resolvePath(path);
    if (resolvedPath === "/") {
      return { item: fileSystem["/"], name: ".", path: ".", isRoot: true };
    }

    const segments = resolvedPath.split("/").filter(Boolean);
    const name = segments[segments.length - 1] || ".";
    let current = fileSystem["/"];

    for (let i = 0; i < segments.length - 1; i++) {
      if (!current.children || !current.children[segments[i]]) {
        return null;
      }
      current = current.children[segments[i]];
    }

    const item = segments.length ? current.children[segments[segments.length - 1]] : current;
    return item ? { item, name, path } : null;
  };

  // Format a single directory's contents
  const formatDirContents = (entries, dirPath, termWidth, useFullPath = false) => {
    if (showDetails) {
      // Check if directory contains only dirs
      const hasOnlyDirs = entries.every(([_, item]) => item.type === "directory");
      const typeColWidth = hasOnlyDirs ? 3 : 4;

      // In detailed view, show columns based on available width
      const entryInfo = entries.map(([name, item, fullPath]) => {
        const size = calculateSize(item);
        const sizeStr = formatSize(size);
        const displayName = useFullPath ? fullPath : name;
        const type = item.type === "directory" ? (hasOnlyDirs ? "dir" : " dir") : "file";
        return {
          name: displayName,
          item,
          sizeStr,
          type,
          sizeLength: sizeStr.length,
          lengths: {
            nameOnly: displayName.length,
            nameAndTime: displayName.length + 2 + getTimeLength(timeStyle),
            nameTimeSize: displayName.length + 4 + getTimeLength(timeStyle) + sizeStr.length,
            nameTimeSizeType: displayName.length + 6 + getTimeLength(timeStyle) + sizeStr.length + typeColWidth,
            full: displayName.length + 8 + getTimeLength(timeStyle) + sizeStr.length + typeColWidth + 10,
          },
        };
      });

      // Calculate max lengths for formatting
      const maxLengths = {
        nameOnly: Math.max(...entryInfo.map((info) => info.lengths.nameOnly)),
        nameAndTime: Math.max(...entryInfo.map((info) => info.lengths.nameAndTime)),
        nameTimeSize: Math.max(...entryInfo.map((info) => info.lengths.nameTimeSize)),
        nameTimeSizeType: Math.max(...entryInfo.map((info) => info.lengths.nameTimeSizeType)),
        full: Math.max(...entryInfo.map((info) => info.lengths.full)),
      };

      const showComponents = {
        permissions: maxLengths.full <= termWidth,
        type: maxLengths.nameTimeSizeType <= termWidth,
        size: maxLengths.nameTimeSize <= termWidth,
        time: maxLengths.nameAndTime <= termWidth,
      };

      const maxSizeLength = showComponents.size ? Math.max(...entryInfo.map((info) => info.sizeLength)) : 0;

      return entryInfo
        .map((info) => {
          const color = info.item.type === "directory" ? DIR_COLOR : getFileColor(info.name);
          const timeStr = formatTimestamp(info.item.mtime, timeStyle);
          const sizeStr = showComponents.size ? info.sizeStr.padStart(maxSizeLength, " ") : "";
          const perms = info.item.type === "directory" ? "drwxr-xr-x" : "-rw-r--r--";

          const parts = [];
          if (showComponents.permissions) parts.push(perms);
          if (showComponents.type) parts.push(info.type);
          if (showComponents.size) parts.push(sizeStr);
          if (showComponents.time) parts.push(timeStr);
          parts.push(info.name);

          return `${color}${parts.join("  ")}${DEFAULT_COLOR}`;
        })
        .join("\r\n");
    }

    const formattedEntries = entries.map(([name, item, fullPath]) => ({
      display: item.type === "directory" ? `${DIR_COLOR}${useFullPath ? fullPath : name}${DEFAULT_COLOR}` : `${getFileColor(name)}${useFullPath ? fullPath : name}${DEFAULT_COLOR}`,
      length: (useFullPath ? fullPath : name).length,
    }));

    if (verticalDisplay) {
      return formattedEntries.map((e) => e.display).join("\r\n");
    }

    const doesConfigFit = (entries, numCols) => {
      if (numCols === 1) return true;
      const colWidths = new Array(numCols).fill(0);
      for (let i = 0; i < entries.length; i++) {
        const colIndex = i % numCols;
        colWidths[colIndex] = Math.max(colWidths[colIndex], entries[i].length);
      }
      const totalWidth = colWidths.reduce((sum, width) => sum + width, 0) + (numCols - 1) * 3;
      return totalWidth <= termWidth;
    };

    let optimalCols = 1;
    for (let cols = 5; cols >= 1; cols--) {
      if (doesConfigFit(formattedEntries, cols)) {
        optimalCols = cols;
        break;
      }
    }

    const colWidths = new Array(optimalCols).fill(0);
    for (let i = 0; i < formattedEntries.length; i++) {
      const colIndex = i % optimalCols;
      colWidths[colIndex] = Math.max(colWidths[colIndex], formattedEntries[i].length);
    }

    const numRows = Math.ceil(formattedEntries.length / optimalCols);
    const rows = [];

    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      const row = [];
      for (let colIndex = 0; colIndex < optimalCols; colIndex++) {
        const entryIndex = rowIndex * optimalCols + colIndex;
        if (entryIndex >= formattedEntries.length) break;

        const entry = formattedEntries[entryIndex];
        const padding = colIndex < optimalCols - 1 ? " ".repeat(colWidths[colIndex] - entry.length + 3) : "";
        row.push(entry.display + padding);
      }
      rows.push(row.join(""));
    }

    return rows.join("\r\n");
  };

  // Handle multiple directories
  const results = [];
  const termWidth = term.cols;

  if (directoryAsFile) {
    const entries = [];
    for (const path of paths) {
      const itemInfo = getItem(path);
      if (!itemInfo) {
        results.push(`ls: cannot access '${path}': No such file or directory`);
        continue;
      }
      updateTimestamps(itemInfo.item);
      entries.push([itemInfo.name, itemInfo.item, path]);
    }
    if (entries.length > 0) {
      results.push(formatDirContents(entries, ".", termWidth, directoryAsFile));
    }
    return results.join("\r\n");
  }

  // Regular processing for non-d flag cases
  for (const path of paths) {
    const itemInfo = getItem(path);

    if (!itemInfo) {
      results.push(`ls: cannot access '${path}': No such file or directory`);
      continue;
    }

    // When item is a file
    if (itemInfo.item.type !== "directory") {
      const formattedContent = formatDirContents([[itemInfo.name, itemInfo.item, path]], path, termWidth, false);
      results.push(formattedContent);
      continue;
    }

    // For directories
    const dir = itemInfo.item;
    updateTimestamps(dir);
    const entries = Object.entries(dir.children);

    // Sort entries
    const sortedEntries = entries.sort(([nameA, itemA], [nameB, itemB]) => {
      let comparison = 0;
      if (sortByTime) {
        comparison = itemB.mtime - itemA.mtime;
        if (comparison === 0) {
          comparison = nameA.toLowerCase().localeCompare(nameB.toLowerCase());
        }
      } else {
        comparison = nameA.toLowerCase().localeCompare(nameB.toLowerCase());
      }
      return reverseSort ? -comparison : comparison;
    });

    const formattedContent = formatDirContents(sortedEntries, path, termWidth);

    // Add directory label if we are listing multiple paths and not using -d
    if (paths.length > 1 && !directoryAsFile) {
      results.push(`${path}:\n${formattedContent}`);
    } else {
      results.push(formattedContent);
    }
  }

  return results.join("\r\n");
};

export const mkdir = async (args) => {
  await checkForUpdates();

  let verbose = false;
  let createParents = false;
  const dirNames = [];

  for (const arg of args) {
    if (arg === "-v" || arg === "--verbose") {
      verbose = true;
    } else if (arg === "-p" || arg === "--parents") {
      createParents = true;
    } else {
      dirNames.push(arg);
    }
  }

  if (dirNames.length === 0) {
    return "mkdir: missing operand. Try 'mkdir <directory>'";
  }

  const results = [];
  for (const dirName of dirNames) {
    const fullPath = resolvePath(dirName);
    const existing = getDirectory(fullPath);
    if (existing) {
      results.push(`mkdir: cannot create '${dirName}': Directory already exists`);
      continue;
    }

    try {
      const segments = fullPath.split("/").filter(Boolean);
      let currentPath = "";
      let currentNode = fileSystem["/"];
      let created = false;

      // If -p is not used, check if all parent directories exist first
      if (!createParents) {
        let parentExists = true;
        for (let i = 0; i < segments.length - 1; i++) {
          const segment = segments[i];
          if (!currentNode.children[segment]) {
            results.push(`mkdir: cannot create '${dirName}': Parent directory doesn't exist`);
            parentExists = false;
            break;
          } else if (currentNode.children[segment].type !== "directory") {
            results.push(`mkdir: cannot create directory '${dirName}': Not a directory`);
            parentExists = false;
            break;
          }
          currentNode = currentNode.children[segment];
        }
        if (!parentExists) continue;
      }

      // Reset for actual directory creation
      currentNode = fileSystem["/"];

      for (const segment of segments) {
        currentPath += "/" + segment;
        // Possible errors when -p is not used is already taken care of. So, we can
        // create create segments as we go regardless of whether -p is used or not.
        if (!currentNode.children[segment]) {
          currentNode.children[segment] = {
            type: "directory",
            children: {},
            atime: Date.now(),
            mtime: Date.now(),
          };
          // Update parent directory's modification time
          updateTimestamps(currentNode, true, false);
          created = true;
        } else if (currentNode.children[segment].type !== "directory") {
          results.push(`mkdir: cannot create directory '${dirName}': Not a directory`);
          break;
        }
        currentNode = currentNode.children[segment];
      }

      if (verbose && created) {
        results.push(`mkdir: created directory '${dirName}'`);
      }

      await saveFileSystem();
    } catch (error) {
      results.push(`mkdir: cannot create directory '${dirName}': ${error.message}`);
    }
  }
  return results.length > 0 ? results.join("\r\n") : "";
};

// Convert absolute path to display path (with ~)
const getDisplayPath = (path) => {
  if (path === "/") return "~";
  return "~" + path;
};

export const cd = async (path = "") => {
  await checkForUpdates();
  if (!path || path === "~") {
    currentPath = "/";
    await saveFileSystem();
    return {
      currentPath: "~",
    };
  }

  const newPath = resolvePath(path);
  const dir = getDirectory(newPath);

  if (!dir || dir.type !== "directory") {
    return {
      output: `cd: no such directory: ${path}`,
      currentPath: getDisplayPath(currentPath),
    };
  }

  currentPath = newPath;
  await saveFileSystem();
  return {
    currentPath: getDisplayPath(newPath),
  };
};

export const rmdir = async (args) => {
  await checkForUpdates();

  let verbose = false;
  let removeParents = false;
  let ignoreNonEmpty = false;
  const patterns = [];

  for (const arg of args) {
    if (arg === "-v" || arg === "--verbose") {
      verbose = true;
    } else if (arg === "-p" || arg === "--parents") {
      removeParents = true;
    } else if (arg === "--ignore-fail-on-non-empty") {
      ignoreNonEmpty = true;
    } else {
      patterns.push(arg);
    }
  }

  if (patterns.length === 0) {
    return "rmdir: missing operand. Try 'rmdir <directory>";
  }

  // Convert glob pattern to regex
  const patternToRegex = (pattern) => {
    return new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
  };

  // Get matching directories for a pattern
  const getMatchingDirectories = (pattern) => {
    // Split the pattern into path and name parts
    const segments = pattern.split("/");
    const namePattern = segments.pop();
    const parentPath = segments.length > 0 ? "/" + segments.join("/") : "/";

    const parent = getDirectory(parentPath);
    if (!parent) return [];

    // Create regex for matching
    const regex = patternToRegex(namePattern);

    // Find all matching directories
    return Object.entries(parent.children)
      .filter(([name, item]) => {
        return item.type === "directory" && regex.test(name);
      })
      .map(([name]) => {
        return segments.length > 0 ? segments.join("/") + "/" + name : name;
      });
  };

  const results = [];

  // Collect all directories to remove
  const dirPaths = [];
  for (const pattern of patterns) {
    if (pattern.includes("*")) {
      const matches = getMatchingDirectories(pattern);
      if (matches.length === 0) {
        results.push(`rmdir: no matching directories for pattern '${pattern}'`);
      } else {
        dirPaths.push(...matches);
      }
    } else {
      dirPaths.push(pattern);
    }
  }
  for (const dirPath of dirPaths) {
    const fullPath = resolvePath(dirPath);
    if (fullPath === "/") {
      results.push("rmdir: cannot remove root directory '~'");
      continue;
    }

    const segments = fullPath.split("/").filter(Boolean);

    if (removeParents) {
      // When -p is used, verify the entire path can be removed
      let currentPath = "";
      let currentNode = fileSystem["/"];
      let isValid = true;
      const dirsToRemove = [];

      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        currentPath += (currentPath ? "/" : "") + segment;

        if (!currentNode.children[segment]) {
          results.push(`rmdir: failed to remove '${dirPath}': No such file or directory`);
          isValid = false;
          break;
        }

        const targetDir = currentNode.children[segment];
        if (targetDir.type !== "directory") {
          results.push(`rmdir: failed to remove '${currentPath}': Not a directory`);
          isValid = false;
          break;
        }

        const childrenKeys = Object.keys(targetDir.children);
        if (i < segments.length - 1) {
          // If running dir1/dir2/dir3 -p, dir2 should have nothing but dir3
          if (childrenKeys.length !== 1 || childrenKeys[0] !== segments[i + 1]) {
            if (!ignoreNonEmpty) {
              results.push(`rmdir: failed to remove '${currentPath}': Directory not empty`);
            }
            isValid = false;
            break;
          }
        } else {
          if (childrenKeys.length > 0) {
            if (!ignoreNonEmpty) {
              results.push(`rmdir: failed to remove '${currentPath}': Directory not empty`);
            }
            isValid = false;
            break;
          }
        }

        dirsToRemove.push({
          name: segment,
          parent: currentNode,
          path: currentPath,
        });
        currentNode = targetDir;
      }

      if (isValid) {
        for (let i = dirsToRemove.length - 1; i >= 0; i--) {
          const { name, parent, path } = dirsToRemove[i];
          delete parent.children[name];
          parent.mtime = Date.now();
          if (verbose) {
            results.push(`rmdir: removing directory '${path}'`);
          }
        }
        await saveFileSystem();
      }
    } else {
      const dirName = segments[segments.length - 1];
      const parentPath = segments.slice(0, -1).join("/");
      const parent = getDirectory("/" + parentPath);

      if (!parent || !parent.children[dirName]) {
        results.push(`rmdir: failed to remove '${dirPath}': No such file or directory`);
        continue;
      }

      const targetDir = parent.children[dirName];
      if (targetDir.type !== "directory") {
        results.push(`rmdir: failed to remove '${dirPath}': Not a directory`);
        continue;
      }

      if (Object.keys(targetDir.children).length > 0) {
        if (!ignoreNonEmpty) {
          results.push(`rmdir: failed to remove '${dirPath}': Directory not empty`);
        }
        continue;
      }

      delete parent.children[dirName];
      parent.mtime = Date.now();
      await saveFileSystem();

      if (verbose) {
        results.push(`rmdir: removing directory '${dirPath}'`);
      }
    }
  }
  return results.length > 0 ? results.join("\r\n") : "";
};

const getParentAndName = (path) => {
  if (path === "/") {
    return { parentPath: "/", name: "" };
  }
  const segments = path.split("/").filter(Boolean);
  const name = segments.pop();
  const parentPath = "/" + segments.join("/");
  return { parentPath, name };
};

export const mv = async (args, term) => {
  await checkForUpdates();

  let interactive = false;
  let noClobber = false;
  let backup = false;
  const paths = [];

  for (const arg of args) {
    if (arg === "-i" || arg === "--interactive") {
      interactive = true;
    } else if (arg === "-n" || arg === "--no-clobber") {
      noClobber = true;
    } else if (arg === "-b" || arg === "--backup") {
      backup = true;
    } else {
      paths.push(arg);
    }
  }

  if (backup && noClobber) {
    return "mv: options --backup and --no-clobber are mutually exclusive";
  }

  if (paths.length < 2) {
    return "mv: missing file operand. Try 'mv [-i] [-n] [-b] <source>... <destination>'";
  }

  // Last argument is the destination
  const destPath = paths[paths.length - 1];
  const sourcePaths = paths.slice(0, -1);
  const resolvedDest = resolvePath(destPath);

  // Get destination directory
  const destPN = getParentAndName(resolvedDest);
  const destParent = getDirectory(destPN.parentPath);
  const destItem = destParent?.children?.[destPN.name];

  // If we have multiple sources, the destination must be a directory
  if (sourcePaths.length > 1 && (!destItem || destItem.type !== "directory")) {
    return `mv: target '${destPath}' is not a directory`;
  }

  const createBackup = (parent, itemName, item) => {
    if (backup && item) {
      parent.children[`${itemName}~`] = { ...item };
      updateTimestamps(parent, true, false);
    }
  };

  // Helper function to perform single move operation
  const moveItem = async (sourcePath) => {
    const resolvedSource = resolvePath(sourcePath);

    if (resolvedSource === "/") {
      return `mv: cannot move root directory '~'`;
    }

    // Get source item and its parent
    const sourcePN = getParentAndName(resolvedSource);
    const sourceParent = getDirectory(sourcePN.parentPath);
    const sourceItem = sourceParent?.children?.[sourcePN.name];

    if (!sourceItem) {
      return `mv: cannot stat '${sourcePath}': No such file or directory`;
    }

    // Check if source and destination are the same file
    let finalDestPath;
    if (resolvedDest === "/") {
      finalDestPath = "/" + sourcePN.name;
    } else {
      finalDestPath = resolvedDest;
    }

    if (resolvedSource === finalDestPath) {
      if (resolvedDest === "/") {
        return `mv: '${sourcePath}' and '${destPath}${destPath.endsWith("/") ? "" : "/"}${sourcePN.name}' are the same file/directory`;
      } else {
        return `mv: '${sourcePath}' and '${finalDestPath}' are the same file/directory`;
      }
    }

    if (!destParent) {
      return `mv: cannot move '${sourcePath}' to '${destPath}': No such directory`;
    }

    if (destItem && destItem.type !== "directory" && sourceItem.type === "directory") {
      return `mv: cannot overwrite non-directory '${destPath}' with directory '${sourcePath}'`;
    }

    // Determine final destination path and parent
    let finalDestParent = destParent;
    let finalDestName = destPN.name;

    const destItemCheck = destItem && destItem.type === "directory";
    if (destItemCheck) {
      finalDestParent = destItem;
      finalDestName = sourcePN.name;
    }
    if (resolvedDest === "/") {
      finalDestParent = fileSystem["/"];
      finalDestName = sourcePN.name;
    }

    const testPath = finalDestParent === fileSystem["/"] ? "/" : resolvedDest;
    if (sourceItem.type === "directory") {
      if (testPath.startsWith(resolvedSource + "/") || testPath === resolvedSource) {
        return `cp: cannot move '${sourcePath}' to a subdirectory of itself, '${destPath}${resolvedSource}'`;
      }
    }

    // Check if destination exists
    const existingItem = finalDestParent.children[finalDestName];
    if (existingItem) {
      // No-clobber check (-n flag) takes effect unless -i is also present
      if (noClobber && !interactive) {
        return `mv: not replacing '${destPath}${destItemCheck ? "/" + sourcePN.name : ""}'`;
      }

      // If it's a non-empty directory and not in interactive mode, show error
      if (existingItem.type === "directory" && Object.keys(existingItem.children).length > 0 && !interactive) {
        return `mv: cannot overwrite '${destPath}${destItemCheck ? "/" + sourcePN.name : ""}': Directory not empty. Use -i to move to a non-empty directory.`;
      }

      if (interactive) {
        const message = `mv: overwrite '${destPath}${destItemCheck ? "/" + sourcePN.name : ""}'? (y/n) `;
        term.write(message);

        const userResponse = await new Promise((resolve) => {
          const handleResponse = async (e) => {
            const response = e.key.toLowerCase();
            term.term.onKey(() => {});
            resolve(response === "y" ? "y" : "n");
          };
          term.term.onKey(handleResponse);
        });

        term.write("\r\n");

        if (userResponse === "n") {
          return "";
        }
        createBackup(finalDestParent, finalDestName, existingItem);
      } else {
        // Create backup before overwriting
        createBackup(finalDestParent, finalDestName, existingItem);
      }
    }

    // Perform the move
    finalDestParent.children[finalDestName] = sourceItem;
    const isOverwriting = existingItem !== undefined;
    if (isOverwriting) {
      finalDestParent.children[finalDestName].mtime = Date.now();
    }
    delete sourceParent.children[sourcePN.name];
    updateTimestamps(sourceParent, true, false);
    updateTimestamps(finalDestParent, true, false);

    return "";
  };

  // Process all source paths sequentially
  for (const sourcePath of sourcePaths) {
    const result = await moveItem(sourcePath);

    if (typeof result === "object" && result.type === "prompt") {
      return result;
    } else if (result) {
      term.write(result + "\r\n");
    }
  }

  await saveFileSystem();
  return "";
};

const cloneItem = (item, existingItem = null) => {
  const clone = {
    type: item.type,
    mtime: Date.now(),
    // If we're overwriting, preserve the atime
    atime: existingItem ? existingItem.atime : Date.now(),
  };

  if (item.type === "file") {
    // Currently, we don't need the undefined check but it might be useful
    // when we add the option to drag and drop files to the term filesystem
    if (item.content !== undefined) clone.content = item.content;
    if (item.blob !== undefined) clone.blob = item.blob;
    if (item.size !== undefined) clone.size = item.size;
    if (item.publicPath !== undefined) clone.publicPath = item.publicPath;
  }

  if (item.type === "directory") {
    clone.children = {};
    for (const [childName, childItem] of Object.entries(item.children)) {
      // For directory contents, pass the existing child if it exists
      const existingChild = existingItem?.children?.[childName];
      clone.children[childName] = cloneItem(childItem, existingChild);
    }
  }
  return clone;
};

// Merge directories for copy (copy contents of source to target)
const mergeDirectories = async (source, target, interactive, backup, term, currentPath = "") => {
  let modified = false;

  for (const [childName, sourceChild] of Object.entries(source.children)) {
    const targetChild = target.children[childName];
    const fullPath = currentPath ? `${currentPath}/${childName}` : childName;

    if (!targetChild) {
      // If item doesn't exist in target, simply copy it
      target.children[childName] = cloneItem(sourceChild);
      modified = true;
    } else if (sourceChild.type === "file") {
      if (interactive) {
        const message = `cp: overwrite '${fullPath}'? (y/n) `;
        term.write(message);

        const userResponse = await new Promise((resolve) => {
          const handleResponse = async (e) => {
            const response = e.key.toLowerCase();
            term.term.onKey(() => {});
            resolve(response === "y" ? "y" : "n");
          };
          term.term.onKey(handleResponse);
        });

        term.write("\r\n");

        if (userResponse === "y") {
          if (backup) {
            target.children[`${childName}~`] = cloneItem(targetChild);
          }
          target.children[childName] = cloneItem(sourceChild, targetChild);
          modified = true;
        }
      } else {
        // Non-interactive mode
        if (backup) {
          target.children[`${childName}~`] = cloneItem(targetChild);
        }
        target.children[childName] = cloneItem(sourceChild, targetChild);
        modified = true;
      }
    } else if (sourceChild.type === "directory" && targetChild.type === "directory") {
      // Recursively merge directories, passing the current path
      const subDirModified = await mergeDirectories(sourceChild, targetChild, interactive, backup, term, fullPath);
      if (subDirModified) {
        modified = true;
      }
    }
  }

  if (modified) {
    target.mtime = Date.now();
  }

  return modified;
};

export const cp = async (args, term) => {
  await checkForUpdates();

  let recursive = false;
  let interactive = false;
  let backup = false;
  const paths = [];

  for (const arg of args) {
    if (arg === "-r" || arg === "-R" || arg === "--recursive") {
      recursive = true;
    } else if (arg === "-i" || arg === "--interactive") {
      interactive = true;
    } else if (arg === "-b" || arg === "--backup") {
      backup = true;
    } else {
      paths.push(arg);
    }
  }

  if (paths.length < 2) {
    return "cp: missing file operand. Try 'cp [-r] [-i] [-b] <source>... <destination>'";
  }

  // Last argument is the destination
  const destPath = paths[paths.length - 1];
  const sourcePaths = paths.slice(0, -1);
  const resolvedDest = resolvePath(destPath);

  // Get destination directory
  const destPN = getParentAndName(resolvedDest);
  const destParent = getDirectory(destPN.parentPath);
  const destItem = destParent?.children?.[destPN.name];

  // If we have multiple sources, the destination must be a directory
  if (sourcePaths.length > 1 && (!destItem || destItem.type !== "directory")) {
    return `cp: target '${destPath}' is not a directory`;
  }

  // Helper function to do a single copy operation
  const copyItem = async (sourcePath) => {
    const resolvedSource = resolvePath(sourcePath);

    if (resolvedSource === "/") {
      return "cp: cannot copy root directory '~'";
    }

    // Get source item and its parent
    const sourcePN = getParentAndName(resolvedSource);
    const sourceParent = getDirectory(sourcePN.parentPath);
    const sourceItem = sourceParent?.children?.[sourcePN.name];

    if (!sourceItem) {
      return `cp: cannot stat '${sourcePath}': No such file or directory`;
    }

    // Check if trying to copy directory without -r flag
    if (sourceItem.type === "directory" && !recursive) {
      return `cp: omitting directory '${sourcePath}': Use -r option to copy directories`;
    }

    if (!destParent) {
      return `cp: cannot copy to '${destPath}': No such directory`;
    }

    // If destination exists and is a file, show error if we are copying a directory
    if (destItem && destItem.type !== "directory" && sourceItem.type === "directory") {
      return `cp: cannot overwrite non-directory '${destPath}' with directory '${sourcePath}'`;
    }

    let finalDestParent = destParent;
    let finalDestName = destPN.name;

    const destItemCheck = destItem && destItem.type === "directory";
    if (destItemCheck) {
      finalDestParent = destItem;
      finalDestName = sourcePN.name;
    }
    if (resolvedDest === "/") {
      finalDestParent = fileSystem["/"];
      finalDestName = sourcePN.name;
    }

    // Prevent copying a directory into itself or its subdirectories
    const testPath = finalDestParent === fileSystem["/"] ? "/" + sourcePN.name : resolvedDest;
    if (sourceItem.type === "directory") {
      if (testPath.startsWith(resolvedSource + "/") || testPath === resolvedSource) {
        if (finalDestParent === fileSystem["/"]) {
          return `cp: cannot copy '${sourcePath}' to a subdirectory of itself, '${destPath}${destPath.endsWith("/") ? "" : "/"}${sourcePN.name}'`;
        }
        return `cp: cannot copy '${sourcePath}' to a subdirectory of itself, '${destPath}${resolvedSource}'`;
      }
    }

    const existingItem = finalDestParent.children[finalDestName];
    if (existingItem) {
      // If both source and destination are directories, merge them
      if (sourceItem.type === "directory" && existingItem.type === "directory") {
        await mergeDirectories(sourceItem, existingItem, interactive, backup, term, destPath + "/" + sourcePN.name);
        return "";
      }

      if (interactive) {
        const message = `cp: overwrite '${destPath}${destItemCheck ? "/" + sourcePN.name : ""}'? (y/n) `;
        term.write(message);

        const userResponse = await new Promise((resolve) => {
          const handleResponse = async (e) => {
            const response = e.key.toLowerCase();
            term.term.onKey(() => {});
            resolve(response === "y" ? "y" : "n");
          };
          term.term.onKey(handleResponse);
        });

        term.write("\r\n");

        if (userResponse === "n") {
          return "";
        }

        if (backup) {
          finalDestParent.children[`${finalDestName}~`] = cloneItem(existingItem);
        }
      } else if (backup) {
        // Create backup before overwriting
        finalDestParent.children[`${finalDestName}~`] = cloneItem(existingItem);
      }
    }

    // Perform the copy
    try {
      finalDestParent.children[finalDestName] = cloneItem(sourceItem, existingItem);
      updateTimestamps(finalDestParent, true, false);
      return "";
    } catch (error) {
      return `cp: error copying '${sourcePath}' to '${destPath}': ${error.message}`;
    }
  };

  // Process all source paths sequentially
  for (const sourcePath of sourcePaths) {
    const result = await copyItem(sourcePath);

    if (typeof result === "object" && result.type === "prompt") {
      return result;
    } else if (result) {
      term.write(result + "\r\n");
    }
  }

  await saveFileSystem();
  return "";
};

export const rm = async (args, term) => {
  await checkForUpdates();

  let recursive = false;
  let force = false;
  let interactive = false;
  const paths = [];

  for (const arg of args) {
    if (arg === "-r" || arg === "-R" || arg === "--recursive") {
      recursive = true;
    } else if (arg === "-f" || arg === "--force") {
      force = true;
    } else if (arg === "-i" || arg === "--interactive") {
      interactive = true;
    } else {
      paths.push(arg);
    }
  }

  if (paths.length === 0) {
    return "rm: missing operand. Try 'rm [-r] [-f] [-i] <file|directory>'";
  }

  const removeItem = async (path) => {
    const resolvedPath = resolvePath(path);

    // Prevent removing root
    if (resolvedPath === "/") {
      if (!force) {
        return "rm: cannot remove root directory '~'";
      }
      return "";
    }

    const { parentPath, name } = getParentAndName(resolvedPath);
    const parent = getDirectory(parentPath);
    const item = parent?.children?.[name];

    if (!item) {
      if (!force) {
        return `rm: cannot remove '${path}': No such file or directory`;
      }
      return "";
    }

    if (item.type === "directory") {
      if (!recursive) {
        return `rm: cannot remove '${path}': Is a directory`;
      }
    }

    if (interactive) {
      return {
        type: "prompt",
        message: `rm: remove ${item.type === "directory" ? "directory" : "file"} '${path}'?`,
        onYes: async () => {
          delete parent.children[name];
          updateTimestamps(parent, true, false);
          await saveFileSystem();
          return "";
        },
        onNo: () => "",
      };
    }

    // Remove the file
    try {
      delete parent.children[name];
      updateTimestamps(parent, true, false);
      await saveFileSystem();
      return "";
    } catch (error) {
      if (!force) {
        return `rm: error removing '${path}': ${error.message}`;
      }
      return "";
    }
  };

  for (const path of paths) {
    const result = await removeItem(path);

    if (typeof result === "object" && result.type === "prompt") {
      term.write(result.message + " (y/n) ");
      // Create a Promise that resolves when user responds
      const userResponse = await new Promise((resolve) => {
        const handleResponse = async (e) => {
          const response = e.key.toLowerCase();
          term.term.onKey(() => {}); // Remove the event handler
          resolve(response === "y" ? "y" : "n");
        };
        term.term.onKey(handleResponse);
      });

      if (userResponse === "y") {
        await result.onYes();
      } else {
        await result.onNo();
      }
      term.write("\r\n");
    } else if (result) {
      term.write(result + "\r\n");
    }
  }

  return "";
};

export const cat = async (args) => {
  await checkForUpdates();

  let showLineNumbers = false;
  let squeezeBlank = false;
  let showEnds = false;
  let outputPath = null;
  let appendMode = false;
  const filePaths = [];

  // Parse arguments and check for redirection
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "-n" || arg === "--number") {
      showLineNumbers = true;
    } else if (arg === "-s" || arg === "--squeeze-blank") {
      squeezeBlank = true;
    } else if (arg === "-E" || arg === "--show-ends") {
      showEnds = true;
    } else if (arg === ">" || arg === ">>") {
      if (i + 1 < args.length) {
        outputPath = args[i + 1];
        appendMode = arg === ">>";
        i++; // Skip the next argument since it's the output file
      } else {
        return `cat: syntax error: expected filename after '${arg}'`;
      }
    } else {
      filePaths.push(arg);
    }
  }

  if (filePaths.length === 0) {
    return "cat: missing operand. Try 'cat <file>'";
  }

  // Collect valid files and count total lines
  const validFiles = [];
  let totalLines = 0;
  let validFileCount = 0;
  for (const filePath of filePaths) {
    const resolvedPath = resolvePath(filePath);
    const { parentPath, name } = getParentAndName(resolvedPath);
    const parent = getDirectory(parentPath);
    const item = parent?.children?.[name];

    if (!item || item.type === "directory") {
      validFiles.push({ path: filePath, error: true, item });
      continue;
    }

    validFileCount++;
    const lineCount = item.content ? item.content.split("\n").length : 0;
    totalLines += lineCount;
    validFiles.push({ path: filePath, error: false, item, lineCount });
  }

  // Calculate number of digits in totalLines
  const lineNumDigits = totalLines.toString().length;

  const processContent = (content, startLineNum = 1) => {
    let lines = content.split("\n");

    if (squeezeBlank) {
      // Squeeze multiple empty lines into one
      const processedLines = [];
      let lastWasEmpty = false;

      for (const line of lines) {
        const isEmpty = line.trim() === "";
        if (!isEmpty || !lastWasEmpty) {
          processedLines.push(line);
        }
        lastWasEmpty = isEmpty;
      }
      lines = processedLines;
    }

    if (showEnds) {
      // Add $ before \r if it exists, otherwise just append $
      lines = lines.map((line) => {
        if (line.endsWith("\r")) {
          return line.slice(0, -1) + "$\r";
        }
        return line + "$";
      });
    }

    if (showLineNumbers) {
      // Add line numbers starting from the provided start line number
      return lines
        .map((line, index) => {
          const lineNum = (startLineNum + index).toString();
          const padding = " ".repeat(2 + (lineNumDigits - lineNum.length));
          return `${padding}${lineNum}  ${line}`;
        })
        .join("\n");
    }

    return lines.join("\n");
  };

  const results = [];
  let currentLineNumber = 1;

  for (const fileInfo of validFiles) {
    if (fileInfo.error) {
      if (!fileInfo.item) {
        results.push(`cat: ${fileInfo.path}: No such file or directory`);
      } else if (fileInfo.item.type === "directory") {
        results.push(`cat: ${fileInfo.path}: Is a directory`);
      }
      continue;
    }

    // Only update access time if not redirecting output
    if (!outputPath) {
      updateTimestamps(fileInfo.item);
      await saveFileSystem();
    }

    if (fileInfo.item.content !== undefined) {
      // Process content with continuous line numbering
      results.push(processContent(fileInfo.item.content, currentLineNumber));
      // Update the line number for the next file
      if (showLineNumbers) {
        currentLineNumber += fileInfo.item.content.split("\n").length;
      }
    } else {
      results.push("");
    }
  }

  const finalOutput = results.join("\n");

  // Handle output redirection
  if (outputPath) {
    try {
      const resolvedOutputPath = resolvePath(outputPath);
      const { parentPath, name } = getParentAndName(resolvedOutputPath);
      const parent = getDirectory(parentPath);

      if (!parent) {
        return `cat: ${outputPath}: No such file or directory`;
      }

      if (parent.children[name] && parent.children[name].type === "directory") {
        return `cat: ${outputPath}: Is a directory`;
      }

      // Create or update the output file
      const existingFile = parent.children[name];
      let newContent = finalOutput;

      // If appending and file exists, combine content
      if (appendMode && existingFile && existingFile.type === "file") {
        newContent = existingFile.content + "\n" + finalOutput;
      }

      parent.children[name] = {
        type: "file",
        content: newContent,
        // If file exists, keep its access time and only update modification time
        mtime: Date.now(),
        atime: existingFile ? existingFile.atime : Date.now(),
      };

      // Update parent directory's modification time
      parent.mtime = Date.now();

      await saveFileSystem();
      return "";
    } catch (error) {
      return `cat: ${outputPath}: ${error.message}`;
    }
  }

  return finalOutput + "\r\n";
};

const calculateSize = (item) => {
  if (item.type === "file") {
    return item.size;
  } else if (item.type === "directory") {
    let totalSize = 0;
    for (const child of Object.values(item.children)) {
      totalSize += calculateSize(child);
    }
    return totalSize;
  }
  return 0;
};

// Format size for stat output
const formatSize = (bytes) => {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

// Format date for stat output
const formatDate = (timestamp) => {
  const date = new Date(timestamp);

  const day = date.getDate().toString().padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const period = hours >= 12 ? "PM" : "AM";

  const hours12 = hours % 12 || 12;
  const hoursStr = hours12.toString().padStart(2, "0");

  return `${day} ${month} ${year}, ${hoursStr}:${minutes}:${seconds} ${period}`;
};

export const stat = async (args) => {
  await checkForUpdates();
  if (args.length === 0) {
    return "stat: missing operand. Try 'stat <file|directory>'";
  }
  const results = [];
  for (let i = 0; i < args.length; i++) {
    const path = args[i];
    const resolvedPath = resolvePath(path);
    let item;
    if (resolvedPath === "/") {
      item = fileSystem["/"];
    } else {
      const { parentPath, name } = getParentAndName(resolvedPath);
      const parent = getDirectory(parentPath);
      item = parent?.children?.[name];
    }
    if (!item) {
      results.push(`stat: cannot stat '${path}': No such file or directory`);
      if (i < args.length - 1) results.push("");
      continue;
    }
    const size = calculateSize(item);
    const displayPath = path === "/" ? "~" : path;
    results.push(`  File: ${displayPath}`);
    results.push(`  Type: ${item.type}`);
    results.push(`  Size: ${formatSize(size)}`);
    results.push(`Access: ${formatDate(item.atime)}`);
    results.push(`Modify: ${formatDate(item.mtime)}`);
    if (item.type === "directory") {
      results.push(` Items: ${Object.keys(item.children).length} entries`);
    }
    // Only add empty line if this isn't the last item
    if (i < args.length - 1) {
      results.push("");
    }
  }
  return results.join("\r\n");
};

function isValidDay(day, month, year) {
  if (day < 1) return false;

  const daysCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Check for February in leap year
  if (month === 1) {
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return day <= (isLeap ? 29 : 28);
  }

  return day <= daysCount[month];
}

function getMonthNumber(monthName) {
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  return months.indexOf(monthName.toLowerCase());
}

export const touch = async (args) => {
  await checkForUpdates();

  // Parse options
  let updateAtime = false;
  let updateMtime = false;
  let noCreate = false;
  let dateString = null;
  let refFile = null;
  const paths = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-a") {
      updateAtime = true;
    } else if (args[i] === "-m") {
      updateMtime = true;
    } else if (args[i] === "-c") {
      noCreate = true;
    } else if (args[i] === "-d") {
      if (i + 1 < args.length) {
        dateString = args[i + 1];
        i++; // Skip the next argument as it's the date string
      } else {
        return "touch: option requires an argument -- 'd'";
      }
    } else if (args[i] === "-r") {
      if (i + 1 < args.length) {
        refFile = args[i + 1];
        i++; // Skip the next argument as it's the reference file
      } else {
        return "touch: option requires an argument -- 'r'";
      }
    } else {
      paths.push(args[i]);
    }
  }

  // If neither -a nor -m is specified, update both timestamps
  if (!updateAtime && !updateMtime) {
    updateAtime = true;
    updateMtime = true;
  }

  if (paths.length === 0) {
    return "touch: missing file operand. Try 'touch [-a] [-m] [-c] [-d <date>] [-r <file>] <file>...'";
  }

  // Get reference file timestamps if -r flag is used
  let refAtime = null;
  let refMtime = null;
  if (refFile !== null) {
    const resolvedRef = resolvePath(refFile);
    if (resolvedRef === "/") {
      return "touch: cannot get reference time from '~': Is a directory";
    }

    const refPN = getParentAndName(resolvedRef);
    const refParent = getDirectory(refPN.parentPath);
    const refItem = refParent?.children?.[refPN.name];

    if (!refItem) {
      return `touch: cannot stat '${refFile}': No such file or directory`;
    }

    refAtime = refItem.atime;
    refMtime = refItem.mtime;
  }

  // Parse date string if provided
  let timestamp = Date.now();
  let refTimestamp = false;

  if (refFile !== null) {
    refTimestamp = true;
  } else if (dateString !== null) {
    const patterns = [
      {
        // "15" (hour)
        regex: /^(\d{1,2})$/,
        parse: (match) => {
          const hours = parseInt(match[1]);
          if (hours < 0 || hours > 23) return null;
          const date = new Date();
          date.setHours(hours, 0, 0, 0);
          return date;
        },
      },
      {
        // "15:36" (hour:minute)
        regex: /^(\d{1,2}):(\d{2})$/,
        parse: (match) => {
          const hours = parseInt(match[1]);
          const minutes = parseInt(match[2]);
          if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
          const date = new Date();
          date.setHours(hours, minutes, 0, 0);
          return date;
        },
      },
      {
        // "15:36:23" (hour:minute:second)
        regex: /^(\d{1,2}):(\d{2}):(\d{2})$/,
        parse: (match) => {
          const hours = parseInt(match[1]);
          const minutes = parseInt(match[2]);
          const seconds = parseInt(match[3]);
          if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) return null;
          const date = new Date();
          date.setHours(hours, minutes, seconds, 0);
          return date;
        },
      },
      {
        // "15 Mar"
        regex: /^(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/i,
        parse: (match) => {
          const day = parseInt(match[1]);
          const month = getMonthNumber(match[2]);
          const year = new Date().getFullYear();
          if (!isValidDay(day, month, year)) return null;
          const date = new Date(year, month, day);
          date.setHours(0, 0, 0, 0);
          return date;
        },
      },
      {
        // "15 Mar 2021"
        regex: /^(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})$/i,
        parse: (match) => {
          const day = parseInt(match[1]);
          const month = getMonthNumber(match[2]);
          const year = parseInt(match[3]);
          if (!isValidDay(day, month, year)) return null;
          const date = new Date(year, month, day);
          date.setHours(0, 0, 0, 0);
          return date;
        },
      },
      {
        // "15 Mar 2021 14"
        regex: /^(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\s+(\d{1,2})$/i,
        parse: (match) => {
          const day = parseInt(match[1]);
          const month = getMonthNumber(match[2]);
          const year = parseInt(match[3]);
          const hours = parseInt(match[4]);
          if (!isValidDay(day, month, year) || hours < 0 || hours > 23) return null;
          const date = new Date(year, month, day);
          date.setHours(hours, 0, 0, 0);
          return date;
        },
      },
      {
        // "15 Mar 2021 14:25"
        regex: /^(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\s+(\d{1,2}):(\d{2})$/i,
        parse: (match) => {
          const day = parseInt(match[1]);
          const month = getMonthNumber(match[2]);
          const year = parseInt(match[3]);
          const hours = parseInt(match[4]);
          const minutes = parseInt(match[5]);
          if (!isValidDay(day, month, year) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
          const date = new Date(year, month, day);
          date.setHours(hours, minutes, 0, 0);
          return date;
        },
      },
      {
        // "15 Mar 2021 14:25:19"
        regex: /^(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})$/i,
        parse: (match) => {
          const day = parseInt(match[1]);
          const month = getMonthNumber(match[2]);
          const year = parseInt(match[3]);
          const hours = parseInt(match[4]);
          const minutes = parseInt(match[5]);
          const seconds = parseInt(match[6]);
          if (!isValidDay(day, month, year) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) return null;
          const date = new Date(year, month, day);
          date.setHours(hours, minutes, seconds, 0);
          return date;
        },
      },
    ];

    let parsedDate = null;
    for (const pattern of patterns) {
      const match = dateString.match(pattern.regex);
      if (match) {
        parsedDate = pattern.parse(match);
        if (parsedDate !== null) {
          timestamp = parsedDate.getTime();
          break;
        }
      }
    }

    if (parsedDate === null) {
      return `touch: invalid date format '${dateString}'`;
    }
  }

  const results = [];
  for (const filePath of paths) {
    const resolvedPath = resolvePath(filePath);
    if (resolvedPath === "/") {
      results.push("touch: cannot touch '~': Is a directory");
      continue;
    }

    try {
      const { parentPath, name } = getParentAndName(resolvedPath);
      const parent = getDirectory(parentPath);

      if (!parent) {
        results.push(`touch: cannot touch '${filePath}': No such file or directory`);
        continue;
      }

      if (parent.type !== "directory") {
        results.push(`touch: cannot touch '${filePath}': Not a directory`);
        continue;
      }

      if (!parent.children[name]) {
        // File doesn't exist
        if (noCreate) {
          continue; // -c flag: skip creating file
        }

        // When creating a new file, both timestamps must be set regardless of flags
        parent.children[name] = {
          type: "file",
          content: "",
          size: 0,
          atime: refTimestamp ? refAtime : timestamp,
          mtime: refTimestamp ? refMtime : timestamp,
        };
        updateTimestamps(parent, true, false);
      } else {
        // File exists, update only the specified timestamps
        const file = parent.children[name];

        if (updateAtime) {
          file.atime = refTimestamp ? refAtime : timestamp;
        }
        if (updateMtime) {
          file.mtime = refTimestamp ? refMtime : timestamp;
        }
      }

      await saveFileSystem();
    } catch (error) {
      results.push(`touch: error touching '${filePath}': ${error.message}`);
    }
  }

  return results.join("\r\n");
};

export const pwd = async(basePath) => {
  await checkForUpdates();

  return basePath + currentPath;
}
