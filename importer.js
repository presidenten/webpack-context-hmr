var Importer = function () {
  var modules = {};
  var getModulesContext = function () { return require.context('.', false, /override-me-in-webpack-config$/); };
  var getFileName = function (string) {
    return string.match(/[^\\|/]*(?=[.][a-zA-Z]+$)/)[0];
  };
  var contextId;
  var moduleKey;

  /**
   * Returns an object with loaded modules
   *
   * @param {Object} config - Set `config.moduleKey` if importing specfic key from modules.
   */
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

  /**
   * @callback callback
   * @param {Object}
   */
  /**
   * Returns an object with loaded modules
   *
   * @param {callback} hmrHandler - The hmrHandler is called with the newModules
   */
  this.setupHMR = function (hmrHandler) {
    if (module.hot) {
      // Accept last context as input
      module.hot.accept(contextId, function () {
        // Require the updated modules
        var reloadedContext = getModulesContext();
        var changedModules = reloadedContext.keys()
          .map(function(key) {
            return {
              name: getFileName(key),
              object: moduleKey ? reloadedContext(key)[moduleKey] : reloadedContext(key),
            };
          })
          .filter(function(reloadedModule) {
            return modules[reloadedModule.name] !== reloadedModule.object;
          });

        // Update changed modules
        changedModules.forEach(function (module) {
          modules[module.name] = module.object;
          console.info('HMR - [' + module.name + '] is updated');
        });

        // Handle the new modules
        hmrHandler(modules);
      });
    }
  };
};


/**
 * Get new instance of the importer
 */
module.exports.getNewInstance = function () {
  return new Importer();
};

