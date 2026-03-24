module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './gamehub.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './migrations'
    }
  },
  production: {
    client: 'pg', // Switch to pg for production
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './migrations'
    }
  }
};
