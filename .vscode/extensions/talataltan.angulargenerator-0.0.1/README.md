# Angular Generator Alpha [WIP]

## Features

- Create new Angular app in Command Palette (CTRL + Shift + P or F1 => New Angular App)
- Generate following Angular Files within the explorer context menu:
    - class,
    - component
    - directive
    - enum
    - guard
    - interface
    - module
    - pipe
    - service

## Requirements

- Node.js
- Angular

## Known Issues

- When using --directory (or -dir) option in "New Angular App" the directory is not considered in the "cd"-command which is executed after app creation. You have to manually change to the directory.

## Release Notes

### 0.0.1

Initial release of alpha version