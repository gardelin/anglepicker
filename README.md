# Anglepicker
[![Anglepicker on NPM](https://img.shields.io/npm/v/@gardelin/anglepicker.svg?style=flat-square)](https://www.npmjs.com/package/@gardelin/anglepicker)
[![Standard JavaScript Style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

Vanilla anglepicker library

![Accordion](https://cdn-skill.splashmath.com/panel-uploads/GlossaryTerm/5f71a7e251ad4e02a4226b4277ef4ea3/1545205512_Angle-Naming-an-angle.png)

## Usage

    <input type="text" class="angle" />
    <script>
        let input = document.querySelector('input');
        let anglepicker = new Anglepicker(input, {
            parent: document.getElementsByTagName('body')[0],
            startOffset: 90,
            step: 45,
        });
    </script>

## Options

| Option  | Type | Default value | Description |
| ----- | ----- | ----- | ----- |
| parent | object | null | Element where anglepicker will be attached in DOM |
| step | number | 45 | Rounding number (andlepicker is moving while shift key is pressed) |
| startOffset | number | 0 | Zero point of anglepicker (default is 12 o'clock) |

## Events
| Name  | Description |
| ----- | ----- |
| anglepickerinit | Anglepicker is initialized |
| anglepickerchange | Anglepicker value is changed |
| anglepickerdragstart | User clicked on anglepicker to rotate widget |
| anglepickerdragmove | User is rotating anglepicker while cursor is inside widget |
| anglepickerdragend | User stopped rotating anglecpicker while cursor is inside widget |
| anglepickerdestroy | Anglepicker is destroyed |