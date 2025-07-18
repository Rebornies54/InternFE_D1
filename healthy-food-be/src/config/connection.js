const { 
  pool, 
  testConnection, 
  executeQuery, 
  executeTransaction, 
  healthCheck, 
  dbConfig 
} = require('../../database/connection');

const testDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('Database connected successfully');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  testConnection: testDatabaseConnection,
  executeQuery,
  executeTransaction,
  healthCheck,
  dbConfig
}; 