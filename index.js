
module.exports = process.env.BUNYAN_ENV_COV
  ? require('./lib-cov/bunyan-env')
  : require('./lib/bunyan-env');
