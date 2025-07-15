const mysql = require('mysql2/promise');
require('dotenv').config();

async function testLogic() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('Testing smart logic...');
    
    // Test 1: Thêm thực phẩm mới
    console.log('\n1. Thêm thực phẩm mới (Chicken raw)');
    const [result1] = await connection.execute(
      'INSERT INTO user_food_logs (user_id, food_item_id, quantity, calories, log_date) VALUES (?, ?, ?, ?, ?)',
      [3, 4, 100, 155, '2025-07-15']
    );
    console.log('✅ Thêm mới thành công, ID:', result1.insertId);

    // Test 2: Thêm cùng thực phẩm (sẽ cập nhật)
    console.log('\n2. Thêm cùng thực phẩm (sẽ cập nhật)');
    const [existingLogs] = await connection.execute(
      'SELECT * FROM user_food_logs WHERE user_id = ? AND food_item_id = ? AND log_date = ?',
      [3, 4, '2025-07-15']
    );
    
    if (existingLogs.length > 0) {
      const existingLog = existingLogs[0];
      const newQuantity = existingLog.quantity + 200;
      const newCalories = existingLog.calories + 310;
      
      await connection.execute(
        'UPDATE user_food_logs SET quantity = ?, calories = ?, updated_at = NOW() WHERE id = ?',
        [newQuantity, newCalories, existingLog.id]
      );
      console.log('✅ Cập nhật thành công:', { newQuantity, newCalories });
    }

    // Test 3: Kiểm tra kết quả
    console.log('\n3. Kiểm tra kết quả cuối cùng');
    const [finalLogs] = await connection.execute(
      'SELECT * FROM user_food_logs WHERE user_id = ? AND food_item_id = ? AND log_date = ?',
      [3, 4, '2025-07-15']
    );
    
    if (finalLogs.length > 0) {
      console.log('✅ Kết quả:', finalLogs[0]);
    }

  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await connection.end();
  }
}

testLogic(); 