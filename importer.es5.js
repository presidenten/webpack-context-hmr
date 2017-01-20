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


