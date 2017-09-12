module.exports = {
  ArnomaDB: {
    user: 'sa',
    password: 'P@ssw0rd',
    server: 'MSC23832',
    //server: '192.168.28.125\\mssql2008r2',
    database: 'ARNOMA_HMS_DB_LIVE',
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 1
    }
  },
  EmailDB: {
    user: 'sa',
    password: 'P@ssw0rd',
    server: 'MSC23832',
    //server: '192.168.28.125\\mssql2008r2',
    database: 'EmailDB',
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 1
    }
  }
};
