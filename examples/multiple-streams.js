
var logger = require('..')({
  name: 'multiple-streams',
  streams: [
    {
      level: 'trace',
      path: './trace.log'
    },
    {
      level: 'debug',
      path: './debug.log'
    },
    {
      level: 'info',
      path: './info.log'
    },
    {
      level: 'warn',
      path: './warn.log'
    },
    {
      level: 'error',
      path: './error.log'
    },
    {
      level: 'fatal',
      path: './fatal.log'
    }
  ]
});

logger.trace('super verbose message');
logger.debug('debugging message');
logger.info('general infomation message');
logger.warn('scary message');
logger.error('really scary message');
logger.fatal('dead');
