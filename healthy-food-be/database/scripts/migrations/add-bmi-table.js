const { pool } = require('../../connection');

async function addBMITable() {
  try {
    console.log('Adding BMI data table...');

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS user_bmi_data (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        height DECIMAL(5,2) NOT NULL,
        weight DECIMAL(5,2) NOT NULL,
        bmi DECIMAL(4,2) NOT NULL,
        bmi_category VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Successfully created user_bmi_data table');
  } catch (error) {
    console.error('Error creating BMI table:', error);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  addBMITable();
}

module.exports = addBMITable; 