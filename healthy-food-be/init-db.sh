#!/bin/sh

echo "🔧 Initializing database..."

# Database is already ready, skip waiting
echo "✅ Database is ready!"

# Check if database is already initialized
echo "🔍 Checking if database is already initialized..."
node -e "
const mysql = require('mysql2/promise');
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '0504Giavuong',
  database: process.env.DB_NAME || 'healthyfood',
  port: process.env.DB_PORT || 3306
});
connection.execute('SELECT COUNT(*) as count FROM users').then(([rows]) => {
  if (rows[0].count > 0) {
    console.log('Database already initialized');
    process.exit(0);
  } else {
    console.log('Database needs initialization');
    process.exit(1);
  }
}).catch(() => {
  console.log('Database needs initialization');
  process.exit(1);
});
" 2>/dev/null

if [ $? -eq 0 ]; then
  echo "✅ Database already initialized, skipping setup"
else
  echo "🚀 Running database setup..."
  node database/scripts/docker-setup.js
fi
