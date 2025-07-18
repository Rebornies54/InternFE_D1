const { pool } = require('../../connection');

async function addBMITable() {
  try {
    console.log('🚀 Adding BMI data table...');
    
    // Create user_bmi_data table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS user_bmi_data (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        height DECIMAL(5,2) NOT NULL, -- in cm
        weight DECIMAL(5,2) NOT NULL, -- in kg
        bmi DECIMAL(4,2) NOT NULL,
        bmi_category ENUM('underweight', 'normal', 'overweight', 'obese') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_bmi (user_id)
      )
    `);
    
    console.log('✅ Successfully created user_bmi_data table');
    
  } catch (error) {
    console.error('❌ Error creating BMI table:', error);
  } finally {
    await pool.end();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  addBMITable();
}

module.exports = addBMITable; 