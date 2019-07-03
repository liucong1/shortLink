const config = {};

config.redis = {
  client: {
    cluster: true,
    nodes: [
      {
        host: 'xx.xx.xx.xx',
        port: 0,
        password: null,
        db: 0,
      },
      {
        host: 'xx.xx.xx.xx',
        port: 0,
        password: null,
        db: 0,
      },
    ],
  },

};

config.mysql = {
  client: {
    host: 'xx.xx.xx.xx',
    port: '3306',
    user: 'xxxx',
    password: 'xxxx',
    database: 'xxxx',
  },
};

config.shortLinkPrefix = 'http://ecool.fun/s';

module.exports = config;
