# react-crop-selector

`react-crop-selector` helps users define crop boundaries in an image (or
technically just in any area). It does not actually do any cropping at all, but
rather it gives you the tools to build something like that yourself with it.


## Usage

`react-crop-selector` can be found on [npm](https://www.npmjs.com/):

```bash
npm install --save react-crop-selector
```

> protip: `npm install --save` `===` `npm i -S`

Once installed, you can use it like so:

```jsx
import React from 'react';
import CropSelector from 'react-crop-selector';

export default function MyComponent() {
    return (
        <CropSelector
            width={640} height={480}
            x1={5} y1={5} x2={95} y2={95}
        />
    );
}
```

> `react-crop-selector` uses css-modules so your build system will need to be
> able to handle those.


## API

Prop | Type | Description
---- | ---- | -----------
width | Number | width of the cropper. **Required**.
height | Number | height of the cropper. **Required**.
x1 | Number | `x`-coord (as a percentage) of top left corner of the crop. *Defaults to `0`*.
y1 | Number | `y`-coord (as a percentage) of top left corner of the crop. *Defaults to `0`*.
x2 | Number | `x`-coord (as a percentage) of bottom right corner of the crop. *Defaults to `100`*.
y2 | Number | `y`-coord (as a percentage) of bottom right corner of the crop. *Defaults to `100`*.
minWidth | Number | minimum width (as a percentage) of the cropped area
minHeight | Number | minimum width (as a percentage) of the cropped area
ratio | String | aspect ratio to lock to defined as `width:height`, e.g. `4:3`
guide | String | create guide lines inside the crop area, currently only supports `rule-of-thirds`
onChange | Function | called when the crop changes. Receives `x1`, `y1`, `x2` and `y2` (as percentages) as its arguments.


## License

MIT © [Poki BV](http://poki.com/company/)
