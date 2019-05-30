
const {
  GOCHAT_DATABASE_USER,
  GOCHAT_DATABASE_PASSWORD,
  GOCHAT_DATABASE_HOSTNAME,
} = require('./environments');

const defaults = {
  username: GOCHAT_DATABASE_USER,
  password: GOCHAT_DATABASE_PASSWORD,
  host: GOCHAT_DATABASE_HOSTNAME,
  dialect: 'postgres',
};

module.exports = {
  development: {
    database: 'gochat_development',
    username: defaults.username,
    password: defaults.password,
    host: defaults.host,
    dialect: defaults.dialect,
  },
  test: {
    database: 'gochat_test',
    username: defaults.username,
    password: defaults.password,
    host: defaults.host,
    dialect: defaults.dialect,
  },
  production: {
    database: 'gochat_production',
    username: defaults.username,
    password: defaults.password,
    host: defaults.host,
    dialect: defaults.dialect,
  }
};
