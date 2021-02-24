// Jest is weird about ESM modules, this was the easiest way to get things working, though it breaks the convention
// of test files being named *.test.js. 

const esmImport = require('esm')(module);
esmImport('./move.assert')