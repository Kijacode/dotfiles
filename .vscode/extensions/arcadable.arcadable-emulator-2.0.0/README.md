WIP Arcadable script extension.

All values are global.
Implemented value types:
```
// Regular number value
// Truthy if value != 0
varName: Number = 1;
varName: Number = 0.5;

// Input values, will update automatically to mirror to user input.
// Truthy if value != 0
varName: Analog = 1;
varName: Digital = 0.5;

// Evaluation, will be evaluated every time the value is used.
// Unless it is a "static" evaluation, which will only be evaluated the first time this value is used.
// Available evaluations: +, -, *, /, %, &, |, ^, <<, >>, pow, ==, !=, >, <, >=, <=
// Truthy if evaluation resolves to != 0
varName: Eval = 2 * otherVarName;
varName: Eval = static 2 * otherVarName;

// Pixel value, represents the color value of the pixel at the defined location.
// When set, the color at that position will change.
// Reading this value will return the color of the pixel at the defined location.
// Truthy if color at defined pixel position != 0
varName: Pixel = [5, 5];
varName: Pixel = [pixelPosXVar, pixelPosYVar];

// System config value, represents system information.
// Available values: ScreenHeight, ScreenWidth, CurrentMillis, IsZigZag
// Truthy if value resolves to != 0
varName: Config = ScreenHeight;

// Text value, thus far only used in draw.drawText instruction.
// Truthy if length != 0
varName: String = "my text";
varName: String = 'my text';

// List value. Fixed size. Can be used with any data type, except for List<..> type (multidimensional arrays are not supported).
// Always truthy.
varName: List<Number> = [otherVarName, 2, 2.5];

// List value pointer. Points to a specific value of a list.
// Truthy if value at list position is truthy.
varName: ListValue = myList[1];
varName: ListValue = myList[otherVarName];

// Image value. Represents image data.
// the asset should be raw rgb values. In gimp, export the image as "Raw Image Data", in the "Export as.." dialog file type selection.
// Image with/height/color are all number values.
varName: Image = ['assets/myImage.data', imageWidth, imageHeight, imageColor];

```

Implemented instructions: 
```
// Drawing
draw.drawPixel(color, x, y);
draw.drawLine(color, x1, y1, x2, y2);
draw.drawRect(color, tlX, tlY, brX, brY);
draw.fillRect(color, tlX, tlY, brX, brY);
draw.drawCircle(color, radius, x, y);
draw.fillCircle(color, radius, x, y);
draw.drawTriangle(color, x1, y1, x2, y2, x3, y3);
draw.fillTriangle(color, x1, y1, x2, y2, x3, y3);
draw.drawText(color, size, text, x, y);
draw.drawImage(myImage, x, y);
draw.clear;
draw.setRotation(rotation);

// Writing to console
log(value);

// Conditionals
if (varName) {

} else {

}

// Executing functions
execute(myFunction);

// await an async function
await execute(myAsyncFunction);

// wait for an amount of milliseconds
wait(myNumber);

// Mutating values
// Mutatable values: Number, ListValue (pointing to a mutable value), Pixel, String
varName = otherVarName * 2;
varName = 5; 
```

All functions are global.
Functions: 
```
// Compiler requires three default functions to be present at all times.

// The setup function is called once when the code is started
setup: Function {

}


// The main function is called as often as possible
main: Function {

}

// The render function is called before led color values are pushed to the leds
render: Function {

}


// Any other functions can be defined in the same way.
myFunction: Function {

}

// Async functions are also supported
// Render and Main cannot be async
myFunction: AsyncFunction {

}

```

All values and functions defined in any imported file are accessible in any file of the program (all values and functions are global, also across files).
Files must have .arc extension.
Imports:
```
import "myFile.arc";
import "dir/myFile.arc";
import "../myFile.arc";
import "../dir/myFile.arc";
```

arcadable.config.json
```
{
    "project": {
        "name": "Test",
        "version": "0.0.1",
        "main": "/src/main.arc",
        "export": "/out"
    },
    "system": {
        "screenWidth": 42,
        "screenHeight": 42,
        "mainsPerSecond": 120,
        "rendersPerSecond": 60,
        "digitalInputAmount": 16,
        "analogInputAmount": 8
    }
}
```