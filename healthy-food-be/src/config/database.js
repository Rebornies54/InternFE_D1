
const { 
    pool, 
    testConnection, 
    executeQuery, 
    executeTransaction, 
    healthCheck, 
    dbConfig 
  } = require('../../database/connection');
  
  module.exports = {
    pool,
    testConnection,
    executeQuery,
    executeTransaction,
    healthCheck,
    dbConfig
  }; 