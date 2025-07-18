const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

// Get all food categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM food_categories ORDER BY id');
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching food categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch food categories'
    });
  }
});

// Get food items by category
router.get('/items/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM food_items WHERE category_id = ? ORDER BY name',
      [categoryId]
    );
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching food items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch food items'
    });
  }
});

// Get all food items
router.get('/items', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT fi.*, fc.name as category_name 
      FROM food_items fi 
      JOIN food_categories fc ON fi.category_id = fc.id 
      ORDER BY fc.id, fi.name
    `);
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching all food items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch food items'
    });
  }
});

// Add food log entry (requires authentication)
router.post('/log', auth, async (req, res) => {
  try {
    console.log('Adding food log for user:', req.user);
    const { food_item_id, quantity, calories, log_date } = req.body;
    const user_id = req.user.userId;

    console.log('Food log data:', { food_item_id, quantity, calories, log_date, user_id });

    // Check if user already has this food item logged for the same date
    const [existingLogs] = await pool.execute(
      'SELECT * FROM user_food_logs WHERE user_id = ? AND food_item_id = ? AND log_date = ?',
      [user_id, food_item_id, log_date]
    );

    if (existingLogs.length > 0) {
      // Update existing log by adding quantities
      const existingLog = existingLogs[0];
      const newQuantity = existingLog.quantity + quantity;
      const newCalories = existingLog.calories + calories;

      await pool.execute(
        'UPDATE user_food_logs SET quantity = ?, calories = ? WHERE id = ?',
        [newQuantity, newCalories, existingLog.id]
      );

      res.json({
        success: true,
        message: 'Food log updated successfully',
        data: { 
          id: existingLog.id,
          action: 'updated',
          newQuantity,
          newCalories
        }
      });
    } else {
      // Insert new log
      const [result] = await pool.execute(
        'INSERT INTO user_food_logs (user_id, food_item_id, quantity, calories, log_date) VALUES (?, ?, ?, ?, ?)',
        [user_id, food_item_id, quantity, calories, log_date]
      );

      res.json({
        success: true,
        message: 'Food log added successfully',
        data: { 
          id: result.insertId,
          action: 'created'
        }
      });
    }
  } catch (error) {
    console.error('Error adding food log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add food log'
    });
  }
});

// Update food log entry (requires authentication)
router.put('/log/:id', auth, async (req, res) => {
  try {
    console.log('Updating food log for user:', req.user);
    const { id } = req.params;
    const { quantity, calories } = req.body;
    const user_id = req.user.userId;

    // Check if the log belongs to the user
    const [existingLog] = await pool.execute(
      'SELECT * FROM user_food_logs WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (existingLog.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Food log not found or access denied'
      });
    }

    // Update the log
    await pool.execute(
      'UPDATE user_food_logs SET quantity = ?, calories = ? WHERE id = ?',
      [quantity, calories, id]
    );

    res.json({
      success: true,
      message: 'Food log updated successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Error updating food log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update food log'
    });
  }
});

// Delete food log entry (requires authentication)
router.delete('/log/:id', auth, async (req, res) => {
  try {
    console.log('Deleting food log for user:', req.user);
    const { id } = req.params;
    const user_id = req.user.userId;

    // Check if the log belongs to the user
    const [existingLog] = await pool.execute(
      'SELECT * FROM user_food_logs WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (existingLog.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Food log not found or access denied'
      });
    }

    // Delete the log
    await pool.execute(
      'DELETE FROM user_food_logs WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Food log deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting food log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete food log'
    });
  }
});

// Get user's food logs (requires authentication)
router.get('/log', auth, async (req, res) => {
  try {
    console.log('Getting food logs for user:', req.user);
    const user_id = req.user.userId;
    const { date } = req.query;

    console.log('Query params:', { user_id, date });

    let query = `
      SELECT ufl.*, fi.name as food_name, fi.unit, fc.name as category_name
      FROM user_food_logs ufl
      JOIN food_items fi ON ufl.food_item_id = fi.id
      JOIN food_categories fc ON fi.category_id = fc.id
      WHERE ufl.user_id = ?
    `;
    let params = [user_id];

    if (date) {
      query += ' AND ufl.log_date = ?';
      params.push(date);
    }

    query += ' ORDER BY ufl.log_date DESC, ufl.created_at DESC';

    console.log('Executing query:', query);
    console.log('Query params:', params);

    const [rows] = await pool.execute(query, params);
    console.log('Query result:', rows.length, 'rows');

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching food logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch food logs'
    });
  }
});

// Get daily food statistics (requires authentication)
router.get('/statistics/daily', auth, async (req, res) => {
  try {
    console.log('Getting daily statistics for user:', req.user);
    const user_id = req.user.userId;
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    console.log('Daily stats params:', { user_id, targetDate });

    // Get daily summary
    const [dailySummary] = await pool.execute(`
      SELECT 
        SUM(ufl.calories) as total_calories,
        SUM(ufl.quantity) as total_quantity,
        COUNT(*) as total_entries
      FROM user_food_logs ufl
      WHERE ufl.user_id = ? AND ufl.log_date = ?
    `, [user_id, targetDate]);

    // Get statistics by category
    const [categoryStats] = await pool.execute(`
      SELECT 
        fc.name as category_name,
        fc.id as category_id,
        SUM(ufl.calories) as total_calories,
        SUM(ufl.quantity) as total_quantity,
        COUNT(*) as entry_count
      FROM user_food_logs ufl
      JOIN food_items fi ON ufl.food_item_id = fi.id
      JOIN food_categories fc ON fi.category_id = fc.id
      WHERE ufl.user_id = ? AND ufl.log_date = ?
      GROUP BY fc.id, fc.name
      ORDER BY total_calories DESC
    `, [user_id, targetDate]);

    // Get top foods consumed
    const [topFoods] = await pool.execute(`
      SELECT 
        fi.name as food_name,
        fc.name as category_name,
        SUM(ufl.calories) as total_calories,
        SUM(ufl.quantity) as total_quantity,
        COUNT(*) as entry_count
      FROM user_food_logs ufl
      JOIN food_items fi ON ufl.food_item_id = fi.id
      JOIN food_categories fc ON fi.category_id = fc.id
      WHERE ufl.user_id = ? AND ufl.log_date = ?
      GROUP BY fi.id, fi.name, fc.name
      ORDER BY total_calories DESC
      LIMIT 10
    `, [user_id, targetDate]);

    res.json({
      success: true,
      data: {
        date: targetDate,
        summary: dailySummary[0] || { total_calories: 0, total_quantity: 0, total_entries: 0 },
        categoryStats,
        topFoods
      }
    });
  } catch (error) {
    console.error('Error fetching daily statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily statistics'
    });
  }
});

// Get weekly food statistics (requires authentication)
router.get('/statistics/weekly', auth, async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { start_date, end_date } = req.query;
    
    let startDate, endDate;
    if (start_date && end_date) {
      startDate = start_date;
      endDate = end_date;
    } else {
      // Default to current week
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      startDate = startOfWeek.toISOString().split('T')[0];
      endDate = endOfWeek.toISOString().split('T')[0];
    }

    // Get weekly summary
    const [weeklySummary] = await pool.execute(`
      SELECT 
        SUM(ufl.calories) as total_calories,
        SUM(ufl.quantity) as total_quantity,
        COUNT(*) as total_entries,
        AVG(ufl.calories) as avg_calories_per_day
      FROM user_food_logs ufl
      WHERE ufl.user_id = ? AND ufl.log_date BETWEEN ? AND ?
    `, [user_id, startDate, endDate]);

    // Get daily breakdown
    const [dailyBreakdown] = await pool.execute(`
      SELECT 
        ufl.log_date,
        SUM(ufl.calories) as daily_calories,
        SUM(ufl.quantity) as daily_quantity,
        COUNT(*) as daily_entries
      FROM user_food_logs ufl
      WHERE ufl.user_id = ? AND ufl.log_date BETWEEN ? AND ?
      GROUP BY ufl.log_date
      ORDER BY ufl.log_date
    `, [user_id, startDate, endDate]);

    // Get category breakdown for the week
    const [categoryBreakdown] = await pool.execute(`
      SELECT 
        fc.name as category_name,
        SUM(ufl.calories) as total_calories,
        SUM(ufl.quantity) as total_quantity,
        COUNT(*) as entry_count
      FROM user_food_logs ufl
      JOIN food_items fi ON ufl.food_item_id = fi.id
      JOIN food_categories fc ON fi.category_id = fc.id
      WHERE ufl.user_id = ? AND ufl.log_date BETWEEN ? AND ?
      GROUP BY fc.id, fc.name
      ORDER BY total_calories DESC
    `, [user_id, startDate, endDate]);

    res.json({
      success: true,
      data: {
        period: { start_date: startDate, end_date: endDate },
        summary: weeklySummary[0] || { total_calories: 0, total_quantity: 0, total_entries: 0, avg_calories_per_day: 0 },
        dailyBreakdown,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Error fetching weekly statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weekly statistics'
    });
  }
});

// Get monthly food statistics (requires authentication)
router.get('/statistics/monthly', auth, async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { year, month } = req.query;
    
    let targetYear = year || new Date().getFullYear();
    let targetMonth = month || new Date().getMonth() + 1;

    // Get monthly summary
    const [monthlySummary] = await pool.execute(`
      SELECT 
        SUM(ufl.calories) as total_calories,
        SUM(ufl.quantity) as total_quantity,
        COUNT(*) as total_entries,
        AVG(ufl.calories) as avg_calories_per_day
      FROM user_food_logs ufl
      WHERE ufl.user_id = ? AND YEAR(ufl.log_date) = ? AND MONTH(ufl.log_date) = ?
    `, [user_id, targetYear, targetMonth]);

    // Get weekly breakdown for the month
    const [weeklyBreakdown] = await pool.execute(`
      SELECT 
        WEEK(ufl.log_date) as week_number,
        SUM(ufl.calories) as weekly_calories,
        SUM(ufl.quantity) as weekly_quantity,
        COUNT(*) as weekly_entries
      FROM user_food_logs ufl
      WHERE ufl.user_id = ? AND YEAR(ufl.log_date) = ? AND MONTH(ufl.log_date) = ?
      GROUP BY WEEK(ufl.log_date)
      ORDER BY week_number
    `, [user_id, targetYear, targetMonth]);

    // Get category breakdown for the month
    const [categoryBreakdown] = await pool.execute(`
      SELECT 
        fc.name as category_name,
        SUM(ufl.calories) as total_calories,
        SUM(ufl.quantity) as total_quantity,
        COUNT(*) as entry_count
      FROM user_food_logs ufl
      JOIN food_items fi ON ufl.food_item_id = fi.id
      JOIN food_categories fc ON fi.category_id = fc.id
      WHERE ufl.user_id = ? AND YEAR(ufl.log_date) = ? AND MONTH(ufl.log_date) = ?
      GROUP BY fc.id, fc.name
      ORDER BY total_calories DESC
    `, [user_id, targetYear, targetMonth]);

    res.json({
      success: true,
      data: {
        period: { year: targetYear, month: targetMonth },
        summary: monthlySummary[0] || { total_calories: 0, total_quantity: 0, total_entries: 0, avg_calories_per_day: 0 },
        weeklyBreakdown,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Error fetching monthly statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly statistics'
    });
  }
});

module.exports = router; 