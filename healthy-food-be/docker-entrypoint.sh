#!/bin/sh

echo "🚀 Starting Healthy Food Backend..."

# Wait for database to be ready with better error handling
echo "⏳ Waiting for database connection..."
until node -e "
(async () => {
  const mysql = require('mysql2/promise');
  try {
    console.log('Testing database connection...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'mysql',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '0504Giavuong',
      port: process.env.DB_PORT || 3306
    });
    await connection.ping();
    await connection.end();
    console.log('Database is ready!');
    process.exit(0);
  } catch (err) {
    console.log('Database not ready yet:', err.message);
    process.exit(1);
  }
})();
" 2>/dev/null; do
  echo "Database not ready yet, waiting..."
  sleep 3
done

echo "✅ Database is ready!"

# Test database connection more thoroughly
echo "🔍 Running comprehensive database test..."
node database/scripts/check-db-connection.js 2>/dev/null || echo "Database test script not found, continuing..."

# Initialize database if needed
echo "🔧 Checking database initialization..."
/app/init-db.sh

# Start the application
echo "🎯 Starting Node.js application..."
exec node server.js
