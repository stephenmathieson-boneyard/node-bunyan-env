
# bunyan-env

  [bunyan](https://github.com/trentm/node-bunyan) logger working with ENV vars.

## Installation

    $ npm install bunyan-env

## API

### bunyan(opts)

  Create a logger, passing `opts` directly to `bunyan`.

### bunyan(name)

  Create a logger with the given `name`.

### logger#trace(...)
### logger#debug(...)
### logger#info(...)
### logger#warn(...)
### logger#error(...)
### logger#fatal(...)

  Log a message of `level`, assuming `level` logging is enabled.

### logger#enabled

  Boolean enabled state of the `logger`.

## Environment Variables

### BUNYAN_ENABLED="<logger name(s)>"

  Define names of loggers to enable.  `*` will enable all loggers.

### BUNYAN_LEVEL="<log level>"

  Define the level of logging.  `*` will enable all logging levels.

### BUNYAN_CONFIG="<path>"

  Define the path to a JSON configuration file.  Expects the JSON to contain an `enabled` string or array and a `level` string.

## Usage

```
# log all `info` messages for all loggers
$ BUNYAN_ENABLED=* BUNYAN_LEVEL=info node app

# log all messages for logger `foo`
$ BUNYAN_ENABLED=foo BUNYAN_LEVEL=* node app

# log all `trace` messages for logger `foo`
$ BUNYAN_ENABLED=foo BUNYAN_LEVEL=trace node app

# enable loggers and level via `config.json`
$ BUNYAN_CONFIG=config.json node app
```

## Example

```
$ stephenmathieson at MBP in ~/projects/node-bunyan-env
BUNYAN_ENABLED=example BUNYAN_LEVEL=* node example
{"name":"example","hostname":"MBP","pid":80141,"level":30,"msg":"hello world","time":"2014-01-09T15:07:03.169Z","v":0}
```

**example.js**

```js
var debug = require('bunyan-env')('example');

debug.info('hello world');
```

## License 

(The MIT License)

Copyright (c) 2014 Stephen Mathieson &lt;me@stephenmathieson.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.