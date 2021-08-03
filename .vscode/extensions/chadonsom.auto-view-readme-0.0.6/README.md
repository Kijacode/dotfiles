# Auto-View-Readme

![auto-view-readme icon](https://github.com/ChaDonSom/auto-view-readme/raw/master/images/icon-92.png)

Auto View Readme provides commands and default keybindings for automatically opening whatever readme file is in the current directory, or (with your permission) whatever readme is in the nearest higher directory.

## Features

### Provides these commands with default keybindings

#### Auto-View-Readme: View
**`auto-view-readme.view`**

`ctrl+shift+r ctrl+shift+d`

_Open the markdown preview of the readme file._

---
#### Auto-View-Readme: Open
**`auto-view-readme.open`**

`ctrl+shift+r ctrl+shift+o`

_Open the readme file in editor mode._

---
#### Auto-View-Readme: Open with preview
**`auto-view-readme.openWithPreview`**

`ctrl+shift+r ctrl+shift+p`

_Open the readme in an editor with the preview to the side._

---
## Requirements

VS Code `^1.50`

## Known Issues

Doesn't provide any way to _create_ a readme if no readme is found.

## Release Notes

### 0.0.6
- Fix `auto-view-readme.view` command - now simply opens the markdown preview without needing to open an editor
  first, open the preview, then close the editor.

### 0.0.5
- Add an icon

### 0.0.4 
- Ask if you want to search the next higher directory if no readme found
- Provide some default keybindings

### 0.0.3
- Show error message if no readme found

### 0.0.2
- Throw exception if no readme found

### 0.0.1 Initial release
