
var bunyan = require('bunyan');

//
// # log all `info` messages for all loggers
// $ BUNYAN_ENABLED=* BUNYAN_LEVEL=info node app
//
// # log all messages for logger `foo`
// $ BUNYAN_ENABLED=foo BUNYAN_LEVEL=* node app
//
// # log all `trace` messages for logger `foo`
// $ BUNYAN_ENABLED=foo BUNYAN_LEVEL=trace node app
//
// # enable loggers and level via `config.json`
// $ BUNYAN_CONFIG=config.json node app
//

var level = process.env.BUNYAN_LEVEL;
var enabled = process.env.BUNYAN_ENABLED;

var config = process.env.BUNYAN_CONFIG;
if (config) {
  var read = require('fs').readFileSync;
  var json = JSON.parse(read(config));
  level = json.level;
  enabled = json.enabled;
}

/**
 * Expose Logger.
 */

exports = module.exports = Logger;

/**
 * Expose RegExps.
 */

exports.enabled = enabled = parseEnabled(enabled);

/**
 * Expose the enabled logging level.
 */

exports.level = level = parseLevel(level);


function Logger(opts) {
  if (!(this instanceof Logger)) return new Logger(opts);
  if ('string' === typeof opts) opts = { name: opts };
  this.opts = opts;
  this.name = opts.name;
  this.log = bunyan.createLogger(this.opts);
  if (level) this.log.level(level);
}

Object.defineProperty(Logger.prototype, 'enabled', {
  get: function () {
    var name = this.name;
    return enabled.some(function (re) {
      return re.test(name);
    });
  },
  enumerable: true,
  configurable: false
});

/**
 * Decorate bunyan methods on
 * the Logger prototype.
 */

[
  'trace', 'debug', 'info', 'warn', 'error', 'fatal'
].forEach(function (method) {
  Logger.prototype[method] = level
    ? function () {
        // ensure we're enabled
        if (!this.enabled) return;
        // let bunyan determine if we should log or not
        this.log[method].apply(this.log, arguments);
      }
    : noop;
});

/**
 * Parse `enabled` and create RegExps.
 *
 * @api private
 * @param {String|Array} enabled
 * @return {Array}
 */

function parseEnabled(enabled) {
  enabled = enabled || [];
  if ('string' === typeof enabled) {
    enabled = enabled.split(/[\s,]+/);
  }

  return enabled
    .map(function (name) {
      // disable loggers with `-LOGGER_NAME`
      if (name && '-' != name[0]) {
        return new RegExp('^' + name.replace('*', '.*?') + '$');
      }
    })
    .filter(Boolean);
}

/**
 * Parse the given `level`.
 *
 * @api private
 * @param {Number|String} level
 * @return {Number|String}
 */

function parseLevel(level) {
  if (!level) return null;
  return '*' === level
    ? 'TRACE'
    : bunyan.resolveLevel(level);
}

/**
 * No operation.
 */

function noop(){}
