var Presenteration,
    format = require('format');

Presentation = function (options) {
  this.options = options;
  this.number  = options.number || 0;
};

Presentation.prototype.render = function(el) {
  return '<h2 class="presentation">Презентация № ' + this.number + '<h2>';
};

module.exports = Presentation;
