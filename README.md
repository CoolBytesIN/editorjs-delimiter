# Delimiter block tool for Editor.js

This [Editor.js](https://editorjs.io/) block tool extends [@editorjs/delimiter](https://github.com/editor-js/delimiter) to include more styles - `dash` and `line`. For line style, more options are also available under block settings menu (see [Preview](https://github.com/CoolBytesIN/editorjs-delimiter?tab=readme-ov-file#preview)).

## Preview

#### Block Tool
![delimiter](https://api.coolbytes.in/media/handle/view/image/296/)

#### Block Settings
![settings](https://api.coolbytes.in/media/handle/view/image/297/)

## Installation

**Using `npm`**

```sh
npm install @coolbytes/editorjs-delimiter
```

**Using `yarn`**

```sh
yarn add @coolbytes/editorjs-delimiter
```

## Usage

Include it in the `tools` property of Editor.js config:

```js
const editor = new EditorJS({
  tools: {
    delimiter: Delimiter
  }
});
```

## Config Params

|Field|Type|Optional|Default|Description|
|---|---|---|---|---|
|styleOptions|`string[]`|`Yes`|['star', 'dash', 'line']|All supported delimiter styles|
|defaultStyle|`string`|`Yes`|'star'|Preferred delimiter style|
|lineWidthOptions|`number[]`|`Yes`|[8, 15, 25, 35, 50, 60, 100]|All supported line width options (%). Applicable for 'line' style only|
|defaultLineWidth|`number`|`Yes`|25|Preferred line width. Applicable for 'line' style only|
|lineThicknessOptions|`string[]`|`Yes`|['0.5px', '1px', '1.5px', '2px', '2.5px', '3px']|All supported line thickness options (px). Applicable for 'line' style only|
|defaultLineThickness|`string`|`Yes`|'1px'|Preferred line thickness. Applicable for 'line' style only|

&nbsp;

```js
const editor = EditorJS({
  tools: {
    delimiter: {
      class: Delimiter,
      config: {
        styleOptions: ['star', 'dash', 'line'],
        defaultStyle: 'star',
        lineWidthOptions: [8, 15, 25, 35, 50, 60, 100],
        defaultLineWidth: 25,
        lineThicknessOptions: ['0.5px', '1px', '1.5px', '2px', '2.5px', '3px'],
        defaultLineThickness: '1px',
      }
    }
  }
});
```

## Output data

|Field|Type|Availability|Description|
|---|---|---|---|
|style|`string`|**All Styles**|Delimiter Style|
|lineWidth|`number`|`line`|Width of line style delimiter|
|lineThickness|`string`|`line`|Thickness of line style delimiter|

&nbsp;

Example:

```json
{
  "time": 1715969561758,
  "blocks": [
    {
      "id": "_K5QcJHHuK",
      "type": "delimiter",
      "data": {
        "style": "line",
        "lineWidth": 15,
        "lineThickness": "2px"
      }
    }
  ],
  "version": "2.29.1"
}
```