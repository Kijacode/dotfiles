# AngularDoc for Visual Studio Code
This extension adds Angular development tooling.

## Features

- "Angular" view that lets you browse the Angular application's modules and components, and the top level constructs in the TypeScript file.
- "NgRx Explorer" view that lets you browse the NgRx stores, reducers, selectors, and effects.
- Invoking [schematics commands](https://blog.angular.io/version-6-of-angular-now-available-cc56b0efa7a4) from the explorer's context menu. The list of supported schematics is customizable (see the Usage section below).
- Integration with [Angular Copilot](https://angulardoc.github.io/#/products) for visualizing the architecture, classes, modules, routes, and imports.

## Screenshots

![Angular Explorer and Outline screenshot](https://user-images.githubusercontent.com/1360728/42260032-c19cc3a8-7f17-11e8-92f1-1abb45c3e04d.gif)

![Schematics command screenshot](https://user-images.githubusercontent.com/1360728/41449801-1e5cddd0-7018-11e8-8cea-06e1c35ccd11.gif)

![NgRx Explorer](https://user-images.githubusercontent.com/1360728/46576932-67dde580-c98c-11e8-86d0-b0b239c5ad5f.gif)


## Installation

Launch Visual Studio Code. In the command palette (`cmd-shift-p`) select `Install Extension` and choose `AngularDoc`.

## Usage

To use the Angular Explorer, click the "Angular" icon in the Activity bar on the far left-hand side. It may take a few seconds for the project to be analyzed and the modules to show up in the view. Select an element in Angular Explorer and the corresponding file will be previewed in the editor. The Outline view below Angular Explorer will display the top level constructs found in the source file.
_Note_: You have to be inside an angular-cli project in order to use the Angular Explorer view. Otherwise, the root directory must have a tsconfig.json file and the source code is in the "src" sub-directory. Icons for the Angular views were made by eclipse.org under Eclipse Public License.

To run the schematics commands, right click on a directory in File Explorer or a module in Angular Explorer, and select "Schematics". Then you will be asked to pick the schematics type and then enter the entity type/name in the input box. Press "Enter" to confirm. The following schematics are supported by default (and you can add your own schematics to the list in the User Settings):
- @schematics/angular
- @ngrx/schematics
- @angular/pwa
- @ng-bootstrap/schematics
- @angular/material
- @clr/angular
- @angular/elements

_Note_: Only the schematics that have been installed in the project will be available to pick.

To visuallize your Angular project's architecture, open the project in [Angular Copilot](https://angulardoc.github.io/#/products) in one of the following ways:
- Click on the status bar item "AngularDoc" (situated on the bottom left); or
- Choose `ngdoc` in the command palette (`cmd-shift-p`).

## About

For more information on our product suite, please visit our [web site](https://angulardoc.github.io). Follow us on Twitter [@angulardocio](https://twitter.com/angulardocio) to receive updates. Last but not the least, please [leave a review](https://marketplace.visualstudio.com/items?itemName=AngularDoc.angulardoc-vscode#review-details) if you like this extension!


