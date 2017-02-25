# webpack-context-hmr

## tl;dr
This module makes it easy to setup dynamic imports of javascript modules using `require.context` and removes the need for the extra boilerplate that is needed to make HMR work with them.
To see this plugin in action, clone, download and run: [webpack-context-hmr-demo](https://github.com/presidenten/webpack-context-hmr-demo)

## Introduction
Some frameworks requires application modules to be imported into `main.js` and registered into the framework in some way. Example of this are Vuex modules.

This package uses Webpack's `require.context` to dynamically load all modules matching a regex and takes care of the necessary boilerplate to make HMR work with the dynamic context. The `hmrSetup` takes a callback function that should handle framework specific hot updates.

For vuex, there is a more specific version that makes things even easier: [Webpack-context-vuex-hmr](https://github.com/presidenten/webpack-context-vuex-hmr).

### Submodules:
When working with submodules/substores, this loader in needed: [hmr-auto-accept-loader](https://github.com/presidenten/hmr-auto-accept-loader)

## Usage
`Require.context` cannot handle runtime input. It can however be configured by using the `ContextReplacementPlugin`.
Configure the importer by adding the plugin to the webpack configuration:
```javascript
plugins: [
  new (require('webpack/lib/ContextReplacementPlugin'))(
    /webpack-context-hmr$/,                // [leave me] this file
    path.resolve(process.cwd(), './src'),  // [edit me]  context root path
    true,                                  // [edit me]  recursive search
    /-store.js|-substore.js$/              // [edit me]  regexp to find modules
    ),
],
```
In this example the importer will look in `<project-path>/src` using recursive search through folders, looking for files ending with `-store.js` and `-substore.js`. This should be edited to match the projects naming conventions.


Then in `main.js` (example with Vuex):
```javascript
// Import plugin
import contextHmr from 'webpack-context-hmr';
// Normal imports
import Vue from 'vue';
import Vuex from 'vuex';
import app from './app.vue';

// Get new importer instance
const importer = contextHmr.getNewInstance();

// Import all modules and get `module.default` from each module
// Edit moduleKey value as necessary, this example imports from modules using:
// `export default { state, getters, actions, mutations };`
const modules = importer.getModules({ moduleKey: 'default' });

// Framework setup using the modules
const store = new Vuex.Store({ modules });

// Setup HMR with a callback
importer.setupHMR(updatedModules => store.hotUpdate({ modules: updatedModules }));

// Create new vue instance like normal
new Vue({
  el: '#app',
  store,
  render: h => h(app),
});

```

# Read more
- [Webpack require context](https://webpack.github.io/docs/context.html)
- [Dynamic context HMR example](https://github.com/AlexLeung/webpack-hot-module-reload-with-context-example)
- [Vuex HMR](https://vuex.vuejs.org/en/hot-reload.html)

# License
MIT
