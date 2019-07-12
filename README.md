# Webpack Index Generator

Using webpack to generatr `index.js` make all files under folder have only one entrance.


## Development

```bash
npm start
```

## Test result
```bash
npm run test-plugin
```
See the example files change

## Usage
```js

const IndexGenerator = require('./dist');

// webpack config
plugins: [
  new IndexGenerator({
    dir: [
      './dirPath'
    ]
  }),
],
```

### Options of Generator
```ts
interface IndexGeneratorOptions {
  // the path of watch dir
  dir?: string[] | string;
}
```
