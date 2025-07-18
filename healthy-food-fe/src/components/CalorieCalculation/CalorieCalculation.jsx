import React, { useState, useEffect, useCallback } from 'react';
import { foodAPI } from '../../services/api';
import { useFoodContext } from '../../context/FoodContext';
import './CalorieCalculation.css';

const CalorieCalculation = () => {
  // State for food database
  const [foodCategories, setFoodCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [selectedFood, setSelectedFood] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [dailyFoodLog, setDailyFoodLog] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State for statistics
  const [dailyStats, setDailyStats] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(dailyFoodLog.length / itemsPerPage));

  // State for edit functionality
  const [editingLog, setEditingLog] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editQuantity, setEditQuantity] = useState(100);
  const [editCalories, setEditCalories] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Use FoodContext for pending foods
  const { 
    pendingFoods = [], 
    removeFromPendingFoods, 
    updatePendingFoodQuantity,
    clearPendingFoods,
    getPendingTotalCalories 
  } = useFoodContext();

  // Load food categories on component mount
  useEffect(() => {
    loadFoodCategories();
  }, []);

  // Load food items when category changes
  useEffect(() => {
    if (selectedCategory) {
      loadFoodItems(selectedCategory);
    }
  }, [selectedCategory]);

  // Debounced function để tránh gọi API quá nhiều
  const debouncedLoadData = useCallback(
    (() => {
      let timeoutId;
      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          Promise.all([
            loadUserFoodLogs(),
            loadDailyStatistics()
          ]);
        }, 300); // Delay 300ms
      };
    })(),
    [selectedDate]
  );

  // Load user's food logs and statistics với debouncing
  useEffect(() => {
    debouncedLoadData();
  }, [selectedDate, debouncedLoadData]);

  // Load weekly and monthly statistics on mount
  useEffect(() => {
    // Batch load weekly and monthly statistics
    Promise.all([
      loadWeeklyStatistics(),
      loadMonthlyStatistics()
    ]);
  }, []);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const loadFoodCategories = async () => {
    try {
      setLoading(true);
      const response = await foodAPI.getCategories();
      if (response.data.success) {
        setFoodCategories(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedCategory(response.data.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading food categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFoodItems = async (categoryId) => {
    try {
      setLoading(true);
      const response = await foodAPI.getItemsByCategory(categoryId);
      if (response.data.success) {
        setFoodItems(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedFood(response.data.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading food items:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserFoodLogs = async () => {
    try {
      const response = await foodAPI.getFoodLogs(selectedDate);
      if (response.data.success) {
        setDailyFoodLog(response.data.data);
      }
    } catch (error) {
      console.error('Error loading food logs:', error);
    }
  };

  const loadDailyStatistics = async () => {
    try {
      const response = await foodAPI.getDailyStatistics(selectedDate);
      if (response.data.success) {
        setDailyStats(response.data.data);
      }
    } catch (error) {
      console.error('Error loading daily statistics:', error);
    }
  };

  const loadWeeklyStatistics = async () => {
    try {
      const response = await foodAPI.getWeeklyStatistics();
      if (response.data.success) {
        // Weekly stats loaded successfully
      }
    } catch (error) {
      console.error('Error loading weekly statistics:', error);
    }
  };

  const loadMonthlyStatistics = async () => {
    try {
      const currentDate = new Date();
      const response = await foodAPI.getMonthlyStatistics(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      );
      if (response.data.success) {
        // Monthly stats loaded successfully
      }
    } catch (error) {
      console.error('Error loading monthly statistics:', error);
    }
  };

  const calculateCalories = (foodId, qty) => {
    const food = foodItems.find(item => item.id === parseInt(foodId));
    if (!food) return 0;
    
    const caloriesPer100g = food.calories;
    return Math.round(caloriesPer100g * qty / 100);
  };
  
  // Handle adding food to log
  const addFoodToLog = async () => {
    if (!selectedFood) return;

    try {
      // Save current scroll position
      const currentScrollPosition = window.scrollY;

      const food = foodItems.find(item => item.id === parseInt(selectedFood));
      if (!food) return;

      const calories = calculateCalories(selectedFood, quantity);
      const logData = {
        food_item_id: parseInt(selectedFood),
        quantity: quantity,
        calories: calories,
        log_date: selectedDate
      };

      const response = await foodAPI.addFoodLog(logData);
      if (response.data.success) {
        // Show appropriate message based on action
        if (response.data.data.action === 'updated') {
          setMessage(`Đã cập nhật ${food.name}: ${response.data.data.newQuantity}g (${response.data.data.newCalories} cal)`);
          setMessageType('success');
        } else {
          setMessage(`Đã thêm ${food.name} vào nhật ký hàng ngày`);
          setMessageType('success');
        }
        
        // Batch reload - chỉ reload những gì cần thiết
        await Promise.all([
          loadUserFoodLogs(),
          loadDailyStatistics()
        ]);
        
        // Reset form
        setQuantity(100);
        
        // Khôi phục vị trí scroll sau khi reload
        setTimeout(() => {
          window.scrollTo(0, currentScrollPosition);
        }, 100);
      }
    } catch (error) {
      console.error('Error adding food log:', error);
      setMessage('Lỗi khi thêm thực phẩm vào nhật ký');
      setMessageType('error');
    }
  };

  // Handle editing food entry
  const editFoodEntry = (log) => {
    setEditingLog(log);
    // Hiển thị quantity và calories hiện tại (đã được cộng dồn)
    setEditQuantity(Math.round(log.quantity));
    setEditCalories(Math.round(log.calories));
    setShowEditModal(true);
  };

  // Calculate calories for edit mode
  const calculateEditCalories = (qty) => {
    if (!editingLog) return 0;
    const food = foodItems.find(item => item.id === editingLog.food_item_id);
    if (!food) return 0;
    
    const caloriesPer100g = food.calories;
    return Math.round(caloriesPer100g * qty / 100);
  };

  // Handle updating food entry
  const updateFoodEntry = async () => {
    if (!editingLog) return;

    try {
      const response = await foodAPI.updateFoodLog(editingLog.id, {
        quantity: editQuantity,
        calories: editCalories
      });

      if (response.data.success) {
        setMessage(`Đã cập nhật ${editingLog.food_name}: ${editQuantity}g (${editCalories} cal)`);
        setMessageType('success');
        setShowEditModal(false);
        setEditingLog(null);
        
        // Batch reload để cập nhật cả logs và statistics
        await Promise.all([
          loadUserFoodLogs(),
          loadDailyStatistics()
        ]);
        
        // Reset về trang 1 nếu cần
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error updating food log:', error);
      setMessage('Lỗi khi cập nhật thực phẩm');
      setMessageType('error');
    }
  };

  // Handle deleting food entry
  const deleteFoodEntry = async (id) => {
    try {
      const response = await foodAPI.deleteFoodLog(id);
      if (response.data.success) {
        setMessage('Đã xóa thực phẩm thành công');
        setMessageType('success');
        
        // Batch reload để cập nhật cả logs và statistics
        await Promise.all([
          loadUserFoodLogs(),
          loadDailyStatistics()
        ]);
        
        // Reset về trang 1 nếu cần
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error deleting food log:', error);
      setMessage('Lỗi khi xóa thực phẩm');
      setMessageType('error');
    }
  };
  
  // Get current items for pagination
  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return dailyFoodLog.slice(indexOfFirstItem, indexOfLastItem);
  };
  
  // Increase quantity
  const increaseQuantity = () => {
    setQuantity(prev => Math.round(prev) + 100);
  };
  
  // Decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 100) {
      setQuantity(prev => Math.round(prev) - 100);
    }
  };

  // Increase edit quantity
  const increaseEditQuantity = () => {
    const newQuantity = Math.round(editQuantity) + 100;
    setEditQuantity(newQuantity);
    setEditCalories(calculateEditCalories(newQuantity));
  };
  
  // Decrease edit quantity
  const decreaseEditQuantity = () => {
    if (editQuantity > 100) {
      const newQuantity = Math.round(editQuantity) - 100;
      setEditQuantity(newQuantity);
      setEditCalories(calculateEditCalories(newQuantity));
    }
  };

  // Table options mapping
  const getTableOptions = () => {
    if (!foodCategories || foodCategories.length === 0) {
      return [];
    }
    return foodCategories.map(category => ({
      value: category.id,
      label: `Calorie Calculation Table for ${category.name}`
    }));
  };

  // Add pending foods to Daily Food Tracking
  const addPendingFoodsToTracking = async () => {
    if (pendingFoods.length === 0) return;

    try {
      setLoading(true);
      let successCount = 0;

      for (const food of pendingFoods) {
        const calories = Math.round(food.calories * food.quantity / 100);
        const logData = {
          food_item_id: food.id,
          quantity: food.quantity,
          calories: calories,
          log_date: selectedDate
        };

        try {
          const response = await foodAPI.addFoodLog(logData);
          if (response.data.success) {
            successCount++;
          }
        } catch (error) {
          console.error(`Error adding ${food.name}:`, error);
        }
      }

      if (successCount > 0) {
        setMessage(`Đã thêm ${successCount} sản phẩm vào Daily Food Tracking`);
        setMessageType('success');
        
        // Reload data
        await Promise.all([
          loadUserFoodLogs(),
          loadDailyStatistics()
        ]);
        
        // Clear pending foods
        clearPendingFoods();
      }
    } catch (error) {
      console.error('Error adding pending foods:', error);
      setMessage('Lỗi khi thêm sản phẩm vào Daily Food Tracking');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="calorie-calculation-container">
      {/* Message Display */}
      {message && (
        <div className={`message-display ${messageType}`}>
          {message}
        </div>
      )}

      {/* Food database section */}
      <div className="food-database-table-wrapper">
        <div className="food-database-section">
          {/* Food database section content */}
          <div className="table-select-form-group">
            <label className="table-select-label">Select calculation table</label>
            <select 
              className="table-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(parseInt(e.target.value))}
              disabled={loading}
            >
              {getTableOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <table className="food-database-table">
            <thead>
              <tr>
                <th>Food Type</th>
                <th>Unit</th>
                <th>Calories</th>
                <th>Protein (g)</th>
                <th>Fat (g)</th>
                <th>Carbs (g)</th>
              </tr>
            </thead>
            <tbody>
              {foodItems.map(food => (
                <tr key={food.id}>
                  <td>{food.name}</td>
                  <td>{food.unit}</td>
                  <td>{food.calories}</td>
                  <td>{food.protein}</td>
                  <td>{food.fat}</td>
                  <td>{food.carbs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Daily Statistics Section */}
      {dailyStats && (
        <div className="daily-statistics-section">
          <h2 className="section-title">Daily Food Statistics - {selectedDate}</h2>
          
          <div className="statistics-summary">
            <div className="stat-card">
              <h3>Total Calories</h3>
              <p className="stat-value">{dailyStats.summary.total_calories || 0} cal</p>
            </div>
            <div className="stat-card">
              <h3>Total Quantity</h3>
              <p className="stat-value">{dailyStats.summary.total_quantity || 0}g</p>
            </div>
            <div className="stat-card">
              <h3>Food Entries</h3>
              <p className="stat-value">{dailyStats.summary.total_entries || 0}</p>
            </div>
          </div>

          {dailyStats.categoryStats && dailyStats.categoryStats.length > 0 && (
            <div className="category-stats">
              <h3>Statistics by Category</h3>
              <div className="category-stats-grid">
                {dailyStats.categoryStats.map((cat, index) => (
                  <div key={index} className="category-stat-card">
                    <h4>{cat.category_name}</h4>
                    <p>{cat.total_calories} cal</p>
                    <p>{cat.total_quantity}g</p>
                    <p>{cat.entry_count} entries</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dailyStats.topFoods && dailyStats.topFoods.length > 0 && (
            <div className="top-foods">
              <h3>Top Foods Consumed</h3>
              <div className="top-foods-list">
                {dailyStats.topFoods.map((food, index) => (
                  <div key={index} className="top-food-item">
                    <span className="food-name">{food.food_name}</span>
                    <span className="food-category">({food.category_name})</span>
                    <span className="food-calories">{food.total_calories} cal</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Food tracking section */}
      <div className="food-tracking-section">
        <h2 className="section-title">Daily Food Tracking</h2>
        
        {/* Pending Foods Section */}
        {pendingFoods.length > 0 && (
          <div className="pending-foods-section">
            <div className="pending-foods-header">
              <h3>Pending Foods from BodyIndex</h3>
              <div className="pending-foods-summary">
                <span>{pendingFoods.length} items</span>
                <span>{getPendingTotalCalories().toFixed(1)} total calories</span>
              </div>
            </div>
            
            <div className="pending-foods-list">
              {pendingFoods.map((food) => (
                <div key={food.id} className="pending-food-item">
                  <div className="pending-food-info">
                    <h4>{food.name}</h4>
                    <p>{food.calories} cal per {food.unit}</p>
                  </div>
                  <div className="pending-food-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => updatePendingFoodQuantity(food.id, food.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity-display">{food.quantity}g</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updatePendingFoodQuantity(food.id, food.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="pending-food-calories">
                    {(food.calories * food.quantity / 100).toFixed(1)} cal
                  </div>
                  <button 
                    className="remove-food-btn"
                    onClick={() => removeFromPendingFoods(food.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <div className="pending-foods-actions">
              <button 
                className="add-all-btn"
                onClick={addPendingFoodsToTracking}
                disabled={loading}
              >
                Add All to Daily Tracking
              </button>
              <button 
                className="clear-all-btn"
                onClick={clearPendingFoods}
              >
                Clear All
              </button>
            </div>
          </div>
        )}
        
        <div className="date-selector">
          <label>Select Date:</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>
        
        <div className="add-food-form">
          <div className="form-row">
            <div className="form-group food-group">
              <label>Food Type</label>
              <select 
                value={selectedFood}
                onChange={(e) => setSelectedFood(e.target.value)}
                className="food-select"
                disabled={loading}
              >
                <option value="">Select a food item</option>
                {foodItems.map(food => (
                  <option key={food.id} value={food.id}>{food.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <div className="quantity-group">
                <button onClick={decreaseQuantity} className="quantity-btn">-</button>
                <input 
                  type="number" 
                  min={0}
                  step={100}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.round(parseFloat(e.target.value)) || 0)}
                  className="quantity-input"
                  placeholder="Quantity (g)"
                />
                <button onClick={increaseQuantity} className="quantity-btn">+</button>
              </div>
            </div>
            
            <div className="form-group">
              <input 
                type="text" 
                value={calculateCalories(selectedFood, quantity)}
                readOnly
                className="calorie-display"
                placeholder="Calories"
              />
            </div>
            
            <div className="form-group">
              <button 
                onClick={addFoodToLog} 
                className="add-food-btn"
                disabled={!selectedFood || loading}
              >
                Add to table
              </button>
            </div>
          </div>
        </div>
        
        <table className="food-log-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Food</th>
              <th>Quantity</th>
              <th>Calories</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentItems().map((entry, index) => (
              <tr key={entry.id}>
                <td style={{textAlign: 'center'}}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{entry.log_date}</td>
                <td>{entry.food_name}</td>
                <td>{entry.quantity}g</td>
                <td>{entry.calories}</td>
                <td className="action-buttons" style={{justifyContent: 'center'}}>
                  <button onClick={() => editFoodEntry(entry)} className="edit-btn">Edit</button>
                  <button onClick={() => deleteFoodEntry(entry.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
            {/* Add empty rows to fill the table */}
            {Array.from({ length: Math.max(0, itemsPerPage - getCurrentItems().length) }, (_, i) => (
              <tr key={`empty-${i}`} className="empty-row">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingLog && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-content">
            <h2>Edit Food Entry</h2>
            <div className="edit-modal-info">
              <p><strong>Note:</strong> This entry represents the total quantity and calories for this food item on this date.</p>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Food Name:</label>
                <div className="food-name-display">
                  <strong>{editingLog.food_name}</strong>
                </div>
              </div>
              <div className="form-group">
                <label>Total Quantity (g):</label>
                <div className="quantity-group">
                  <button onClick={decreaseEditQuantity} className="quantity-btn">-</button>
                  <input 
                    type="number" 
                    min={0}
                    step={100}
                    value={editQuantity}
                    onChange={(e) => {
                      const newQuantity = Math.round(parseFloat(e.target.value)) || 0;
                      setEditQuantity(newQuantity);
                      setEditCalories(calculateEditCalories(newQuantity));
                    }}
                    className="quantity-input"
                  />
                  <button onClick={increaseEditQuantity} className="quantity-btn">+</button>
                </div>
              </div>
              <div className="form-group">
                <label>Total Calories:</label>
                <input 
                  type="text" 
                  value={editCalories}
                  readOnly
                  className="calorie-display"
                  placeholder="Calories"
                />
              </div>
              <div className="form-group">
                <button onClick={updateFoodEntry} className="save-btn">Save Changes</button>
                <button onClick={() => setShowEditModal(false)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div className={`message-display ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default CalorieCalculation;