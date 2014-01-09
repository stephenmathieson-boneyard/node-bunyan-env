
var logger = require('..')({
  name: 'single-stream',
  stream: process.stdout
});

logger.trace('super verbose message');
logger.debug('debugging message');
logger.info('general infomation message');
logger.warn('scary message');
logger.error('really scary message');
logger.fatal('dead');
