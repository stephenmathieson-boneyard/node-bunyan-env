
var assert = require('better-assert');
var bunyan = require('bunyan');
var path = require('path');
var fs = require('fs');

describe('bunyan-env', function () {
  describe('environment variables', function () {
    beforeEach(function () {
      delete require.cache[require.resolve('..')];
      delete require.cache[require.resolve('../lib/bunyan-env.js')];
      try {
        delete require.cache[require.resolve('../lib-cov/bunyan-env.js')];
      } catch (e) {}
      delete process.env.BUNYAN_ENABLED;
      delete process.env.BUNYAN_LEVEL;
      delete process.env.BUNYAN_CONFIG;
    });

    describe('BUNYAN_ENABLED=foo', function () {
      it('should enable the "foo" logger', function () {
        process.env.BUNYAN_ENABLED = 'foo';

        var foo = require('..')('foo');
        var bar = require('..')('bar');
        var baz = require('..')('baz');

        assert(true === foo.enabled);
        assert(false === bar.enabled);
        assert(false === baz.enabled);
      });
    });

    describe('BUNYAN_ENABLED="foo bar"', function () {
      it('should enable the "foo" and "bar" loggers', function () {
        process.env.BUNYAN_ENABLED = 'foo bar';

        var foo = require('..')('foo');
        var bar = require('..')('bar');
        var baz = require('..')('baz');

        assert(true === foo.enabled);
        assert(true === bar.enabled);
        assert(false === baz.enabled);
      });
    });

    describe('BUNYAN_ENABLED="*"', function () {
      it('should enable all loggers', function () {
        process.env.BUNYAN_ENABLED = '*';

        var foo = require('..')('foo');
        var bar = require('..')('bar');
        var baz = require('..')('baz');

        assert(true === foo.enabled);
        assert(true === bar.enabled);
        assert(true === baz.enabled);
      });
    });

    describe('BUNYAN_LEVEL=', function () {
      it('should not allow loggers to log anything', function (done) {
        process.env.BUNYAN_ENABLED = '*';

        var foo = require('..')({
          name: 'foo',
          stream: stream(function () {
            throw new Error('should not log');
          })
        });

        foo.trace('trace');
        foo.debug('debug');
        foo.info('info');
        foo.warn('warn');
        foo.error('error');
        foo.fatal('fatal');

        process.nextTick(done);
      });
    });

    describe('BUNYAN_LEVEL=info', function () {
      it('should allow enabled loggers to log info', function (done) {
        process.env.BUNYAN_ENABLED = 'foo bar';
        process.env.BUNYAN_LEVEL = 'info';

        var fooLogged = false;
        var barLogged = false;

        var baz = require('..')({
          name: 'baz',
          stream: stream(function () {
            throw new Error('should not log');
          })
        });

        var foo = require('..')({
          name: 'foo',
          stream: stream(function (data) {
            assert(30 == data.level);
            assert('hello from foo' == data.msg);
            fooLogged = true;
          })
        });

        var bar = require('..')({
          name: 'bar',
          stream: stream(function (data) {
            assert(30 == data.level);
            assert('hello from bar' == data.msg);
            barLogged = true;
          })
        });

        baz.info('hello from baz');
        foo.info('hello from foo');
        bar.info('hello from bar');

        process.nextTick(function () {
          assert(fooLogged);
          assert(barLogged);
          done();
        });
      });
    });

    describe('BUNYAN_LEVEL=*', function () {
      it('should allow loggers to log everything', function (done) {
        process.env.BUNYAN_LEVEL = '*';
        process.env.BUNYAN_ENABLED = '*';

        var wrote = 0;
        var index = 0;

        test('trace');
        test('debug');
        test('info');
        test('warn');
        test('error');
        test('fatal');

        setTimeout(function () {
          assert(wrote == index);
          done();
        }, 300);


        function test(level) {
          var name = 'logger' + index++;
          var logger = require('..')({
            name: name,
            stream: stream(function (data) {
              var num = bunyan.resolveLevel(level);
              assert(num == data.level);
              assert(level + ' from ' + name == data.msg);
              wrote++;
            })
          });
          logger[level](level + ' from ' + name);
        }
      });
    });

    describe('BUNYAN_CONFIG=config.json', function () {
      var config;

      before(function (done) {
        config = path.join(__dirname, 'test-config.json');
        fs.writeFile(config, JSON.stringify({
          enabled: [ 'foo', 'bar', 'baz' ],
          level: 'info'
        }), done);
      });

      it('should load config from "./config.json"', function () {
        process.env.BUNYAN_CONFIG = config;
        var bunyan = require('..');
        assert(30 == bunyan.level);
        assert(3 == bunyan.enabled.length);
        assert(bunyan.enabled[0].test('foo'));
        assert(bunyan.enabled[1].test('bar'));
        assert(bunyan.enabled[2].test('baz'));
      });
    });
  });
});


/**
 * Mock stream helper.
 */

function stream(fn) {
  return {
    write: function (data) {
      fn(JSON.parse(data));
    }
  };
}
