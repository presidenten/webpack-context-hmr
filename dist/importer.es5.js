'use strict';

var Importer = function Importer() {
  var modules = {};
  var getModulesContext = function getModulesContext() {
    return require.context('.', false, /override-me-in-webpack-config$/);
  };
  var getFileName = function getFileName(string) {
    return string.match(/[^\\|/]*(?=[.][a-zA-Z]+$)/)[0];
  };
  var contextId;
  var moduleKey;

  this.getModules = function (config) {
    moduleKey = config.moduleKey;
    var context = getModulesContext();
    contextId = context.id;
    context.keys().forEach(function (key) {
      var fileName = getFileName(key);
      modules[fileName] = moduleKey ? context(key)[moduleKey] : context(key);
    });

    return modules;
  };

  this.setupHMR = function (hmrHandler) {
    if (module.hot) {
      module.hot.accept(contextId, function () {
        var reloadedContext = getModulesContext();
        var changedModules = reloadedContext.keys().map(function (key) {
          return {
            name: getFileName(key),
            object: moduleKey ? reloadedContext(key)[moduleKey] : reloadedContext(key)
          };
        }).filter(function (reloadedModule) {
          return modules[reloadedModule.name] !== reloadedModule.object;
        });

        changedModules.forEach(function (module) {
          modules[module.name] = module.object;
          console.info('HMR - [' + module.name + '] is updated');
        });

        hmrHandler(modules);
      });
    }
  };
};

module.exports.getNewInstance = function () {
  return new Importer();
};


'use strict';

var Importer = function Importer() {
  var modules = {};
  var getModulesContext = function getModulesContext() {
    return require.context('.', false, /override-me-in-webpack-config$/);
  };
  var getFileName = function getFileName(string) {
    return string.match(/[^\\|/]*(?=[.][a-zA-Z]+$)/)[0];
  };
  var contextId = void 0;
  var moduleKey = void 0;

  this.getModules = function (config) {
    moduleKey = config.moduleKey;
    var context = getModulesContext();
    contextId = context.id;
    context.keys().forEach(function (key) {
      var fileName = getFileName(key);
      modules[fileName] = moduleKey ? context(key)[moduleKey] : context(key);
    });

    return modules;
  };

  this.setupHMR = function (hmrHandler) {
    if (module.hot) {
      module.hot.accept(contextId, function () {
        var reloadedContext = getModulesContext();
        var changedModules = reloadedContext.keys().map(function (key) {
          return {
            name: getFileName(key),
            object: moduleKey ? reloadedContext(key)[moduleKey] : reloadedContext(key)
          };
        }).filter(function (reloadedModule) {
          return modules[reloadedModule.name] !== reloadedModule.object;
        });

        changedModules.forEach(function (module) {
          modules[module.name] = module.object;
          console.info('HMR - [' + module.name + '] is updated');
        });

        hmrHandler(modules);
      });
    }
  };
};

module.exports.getNewInstance = function () {
  return new Importer();
};

'use strict';

module.exports.getNewInstance = function () {
  var Importer = function Importer() {
    var modules = {};
    var getModulesContext = function getModulesContext() {
      return require.context('.', false, /override-me-in-webpack-config$/);
    };
    var getFileName = function getFileName(string) {
      return string.match(/[^\\|/]*(?=[.][a-zA-Z]+$)/)[0];
    };
    var contextId = void 0;
    var moduleKey = void 0;

    this.getModules = function (config) {
      moduleKey = config.moduleKey;
      var context = getModulesContext();
      contextId = context.id;
      context.keys().forEach(function (key) {
        var fileName = getFileName(key);
        if (fileName.slice(-6) === '-store') {
          modules[fileName] = moduleKey ? context(key)[moduleKey] : context(key);
        }
      });

      return modules;
    };

    this.setupHMR = function (hmrHandler) {
      if (module.hot) {
        module.hot.accept(contextId, function () {
          var reloadedContext = getModulesContext();
          var allModules = reloadedContext.keys().map(function (key) {
            return {
              name: getFileName(key),
              object: moduleKey ? reloadedContext(key)[moduleKey] : reloadedContext(key)
            };
          });

          var newModules = allModules.filter(function (reloadedModule) {
            return reloadedModule.name.slice(-6) === '-store';
          }).filter(function (reloadedModule) {
            return modules[reloadedModule.name] !== reloadedModule.object;
          });

          newModules.forEach(function (module) {
            modules[module.name] = module.object;
            console.info('[HMR] - Modules are replaced');
          });

          hmrHandler(modules);
        });
      }
    };
  };

  return new Importer();
};
/**
 * Get new instance of the importer
 */
module.exports.getNewInstance = () => {
  const Importer = function () {
    const modules = {};
    const getModulesContext = () => require.context('.', false, /override-me-in-webpack-config$/);
    const getFileName = string => string.match(/[^\\|/]*(?=[.][a-zA-Z]+$)/)[0];
    let contextId;
    let moduleKey;

    /**
     * Returns an object with loaded modules
     *
     * @param {Object} config - Set `config.moduleKey` if importing specfic key from modules.
     */
    this.getModules = config => {
      moduleKey = config.moduleKey;
      const context = getModulesContext();
      contextId = context.id;
      context.keys().forEach(key => {
        const fileName = getFileName(key);
        if (fileName.slice(-6) === '-store') {
          modules[fileName] = moduleKey ? context(key)[moduleKey] : context(key);
        }
      });

      return modules;
    };

    /**
     * @callback callback
     * @param {Object}
     */
    /**
     * Returns an object with loaded modules
     *
     * @param {callback} hmrHandler - The hmrHandler is called with the newModules
     */

    this.setupHMR = hmrHandler => {
      if (module.hot) {
        // Accept last context as input
        module.hot.accept(contextId, () => {
          // Require the updated modules
          const reloadedContext = getModulesContext();
          let allModules = reloadedContext.keys().map(key => ({
            name: getFileName(key),
            object: moduleKey ? reloadedContext(key)[moduleKey] : reloadedContext(key)
          }));

          let newModules = allModules.filter(reloadedModule => reloadedModule.name.slice(-6) === '-store').filter(reloadedModule => modules[reloadedModule.name] !== reloadedModule.object);

          // Update changed modules
          newModules.forEach(module => {
            modules[module.name] = module.object;
            console.info('[HMR] - Modules are replaced');
          });

          // Handle the new modules
          hmrHandler(modules);
        });
      }
    };
  };

  return new Importer();
};

