import React, { useState, useEffect, useCallback } from 'react';
import { foodAPI } from '../../services/api';
import { useFoodContext } from '../../context/FoodContext';
import { PAGINATION, DEFAULTS, VALIDATION, UI_TEXT } from '../../constants';
import useDebounce from '../../hooks/useDebounce';
import useMessageTimer from '../../hooks/useMessageTimer';
import DatePicker from '../DatePicker';
import './CalorieCalculation.css';

const CalorieCalculation = () => {
  const [foodCategories, setFoodCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(DEFAULTS.SELECTED_CATEGORY);
  const [selectedFood, setSelectedFood] = useState('');
  const [quantity, setQuantity] = useState(DEFAULTS.QUANTITY);
  const [dailyFoodLog, setDailyFoodLog] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dailyStats, setDailyStats] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
 
  const [currentPage, setCurrentPage] = useState(DEFAULTS.CURRENT_PAGE);
  const itemsPerPage = PAGINATION.DEFAULT_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(dailyFoodLog.length / itemsPerPage));

  const [editingLog, setEditingLog] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editQuantity, setEditQuantity] = useState(DEFAULTS.EDIT_QUANTITY);
  const [editCalories, setEditCalories] = useState(DEFAULTS.EDIT_CALORIES);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const [activeMobileMenu, setActiveMobileMenu] = useState(null);

  // Sử dụng custom hooks thay vì timeout trực tiếp
  const debouncedLoadData = useDebounce(() => {
    Promise.all([
      loadUserFoodLogs(),
      loadDailyStatistics()
    ]);
  }, 300);

  useMessageTimer(message, setMessage, setMessageType, 3000);

  const { 
    pendingFoods = [], 
    removeFromPendingFoods, 
    updatePendingFoodQuantity,
    clearPendingFoods,
    getPendingTotalCalories 
  } = useFoodContext();

  useEffect(() => {
    loadFoodCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadFoodItems(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    debouncedLoadData();
  }, [selectedDate, debouncedLoadData]);

  useEffect(() => {
    Promise.all([
      loadWeeklyStatistics(),
      loadMonthlyStatistics()
    ]);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMobileMenu && !event.target.closest('.mobile-actions-container')) {
        setActiveMobileMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMobileMenu]);

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
    } catch (error) { /* Error handled */ }finally {
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
    } catch (error) { /* Error handled */ }finally {
      setLoading(false);
    }
  };

  const loadUserFoodLogs = async () => {
    try {
      const response = await foodAPI.getFoodLogs(selectedDate);
      if (response.data.success) {
        setDailyFoodLog(response.data.data);
      }
    } catch (error) { /* Error handled */ }};

  const loadDailyStatistics = async () => {
    try {
      const response = await foodAPI.getDailyStatistics(selectedDate);
      if (response.data.success) {
        setDailyStats(response.data.data);
      }
    } catch (error) { /* Error handled */ }};

  const loadWeeklyStatistics = async () => {
    try {
      const response = await foodAPI.getWeeklyStatistics();
      if (response.data.success) {
      }
    } catch (error) { /* Error handled */ }};

  const loadMonthlyStatistics = async () => {
    try {
      const currentDate = new Date();
      const response = await foodAPI.getMonthlyStatistics(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      );
      if (response.data.success) {
      }
    } catch (error) { /* Error handled */ }};

  const calculateCalories = (foodId, qty) => {
    const food = foodItems.find(item => item.id === parseInt(foodId));
    if (!food) return 0;
    
    const caloriesPer100g = food.calories;
    return Math.round(caloriesPer100g * qty / 100);
  };

  const addFoodToLog = async () => {
    if (!selectedFood) return;

    try {
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
        if (response.data.data.action === 'updated') {
          setMessage(`Đã cập nhật ${food.name}: ${response.data.data.newQuantity}g (${response.data.data.newCalories} cal)`);
          setMessageType('success');
        } else {
          setMessage(`Đã thêm ${food.name} vào nhật ký hàng ngày`);
          setMessageType('success');
        }

        await Promise.all([
          loadUserFoodLogs(),
          loadDailyStatistics()
        ]);
        setQuantity(100);
        
        // Restore scroll position after reload
        requestAnimationFrame(() => {
          window.scrollTo(0, currentScrollPosition);
        });
      }
    } catch (error) {
      setMessage('Lỗi khi thêm thực phẩm vào nhật ký');
      setMessageType('error');
    }
  };

  const editFoodEntry = (log) => {
    setEditingLog(log);
    setEditQuantity(Math.round(log.quantity));
    setEditCalories(Math.round(log.calories));
    setShowEditModal(true);
    setActiveMobileMenu(null);
  };

  const calculateEditCalories = (qty) => {
    if (!editingLog) return 0;
    const food = foodItems.find(item => item.id === editingLog.food_item_id);
    if (!food) return 0;
    
    const caloriesPer100g = food.calories;
    return Math.round(caloriesPer100g * qty / 100);
  };

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

        await Promise.all([
          loadUserFoodLogs(),
          loadDailyStatistics()
        ]);
        setCurrentPage(1);
      }
    } catch (error) {
      setMessage('Lỗi khi cập nhật thực phẩm');
      setMessageType('error');
    }
  };
  const deleteFoodEntry = async (id) => {
    try {
      const response = await foodAPI.deleteFoodLog(id);
      if (response.data.success) {
        setMessage('Đã xóa thực phẩm thành công');
        setMessageType('success');

        await Promise.all([
          loadUserFoodLogs(),
          loadDailyStatistics()
        ]);

        setCurrentPage(1);
      }
      setActiveMobileMenu(null); 
    } catch (error) {
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

  // Toggle mobile actions menu
  const toggleMobileMenu = (id) => {
    setActiveMobileMenu(activeMobileMenu === id ? null : id);
  };

  // Table options mapping
  const getTableOptions = () => {
    const seen = new Set();
    return foodCategories
      .map(cat => ({
        value: cat.id,
        label: cat.name
      }))
      .filter(option => {
        if (seen.has(option.label)) return false;
        seen.add(option.label);
        return true;
      });
  };

  const addPendingFoodsToTracking = useCallback(async () => {
    if (pendingFoods.length === 0) return;

    try {
      setLoading(true);

      const batchData = pendingFoods.map(food => ({
        food_item_id: food.id,
        quantity: food.quantity,
        calories: Math.round(food.calories * food.quantity / 100),
        log_date: selectedDate
      }));

      try {
        const response = await foodAPI.addFoodLogsBatch(batchData);
        if (response.data.success) {
          setMessage(`Đã thêm ${pendingFoods.length} sản phẩm vào Daily Food Tracking`);
          setMessageType('success');

          await Promise.all([
            loadUserFoodLogs(),
            loadDailyStatistics()
          ]);
          
          clearPendingFoods();
        }
      } catch (batchError) {
        let successCount = 0;
        const promises = pendingFoods.map(async (food) => {
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
          } catch (error) { /* Error handled */ }});

        await Promise.all(promises);

        if (successCount > 0) {
          setMessage(`Đã thêm ${successCount} sản phẩm vào Daily Food Tracking`);
          setMessageType('success');

          await Promise.all([
            loadUserFoodLogs(),
            loadDailyStatistics()
          ]);
          clearPendingFoods();
        }
      }
    } catch (error) {
      setMessage('Lỗi khi thêm sản phẩm vào Daily Food Tracking');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }, [pendingFoods, selectedDate, loadUserFoodLogs, loadDailyStatistics, clearPendingFoods]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="calorie-calculation-container">
      {message && (
        <div className={`message-display ${messageType}`}>
          {message}
        </div>
      )}

      {/* Food database section */}
      <div className="food-database-table-wrapper">
        <div className="food-database-section">
          <div className="table-select-form-group">
            <label className="table-select-label">{UI_TEXT.SELECT_CALCULATION_TABLE}</label>
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
          
          {/* Compact food table with essential info only */}
          <div className="food-table-container">
            <table className="food-database-table">
              <thead>
                <tr>
                  <th>{UI_TEXT.FOOD_TYPE_LABEL}</th>
                  <th>{UI_TEXT.CALORIES_PER_100G}</th>
                  <th>{UI_TEXT.UNIT_LABEL}</th>
                </tr>
              </thead>
              <tbody>
                {foodItems.slice(0, 10).map(food => (
                  <tr key={food.id}>
                    <td>{food.name}</td>
                    <td>{food.calories} {UI_TEXT.CAL_LABEL}</td>
                    <td>{food.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {foodItems.length > 10 && (
              <div className="food-table-note">
                <p>{UI_TEXT.SHOWING_FIRST_10_ITEMS}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Daily Statistics Section */}
      {dailyStats && (
        <div className="daily-statistics-section">
          <h2 className="section-title">{UI_TEXT.DAILY_FOOD_STATISTICS} - {selectedDate}</h2>
          
          <div className="statistics-summary">
            <div className="stat-card">
              <h3>{UI_TEXT.TOTAL_CALORIES}</h3>
              <p className="stat-value">{dailyStats.summary.total_calories || 0} {UI_TEXT.CAL_LABEL}</p>
            </div>
            <div className="stat-card">
              <h3>{UI_TEXT.TOTAL_QUANTITY}</h3>
              <p className="stat-value">{dailyStats.summary.total_quantity || 0}g</p>
            </div>
            <div className="stat-card">
              <h3>{UI_TEXT.FOOD_ENTRIES}</h3>
              <p className="stat-value">{dailyStats.summary.total_entries || 0}</p>
            </div>
          </div>

          {dailyStats.categoryStats && dailyStats.categoryStats.length > 0 && (
            <div className="category-stats">
              <h3>{UI_TEXT.STATISTICS_BY_CATEGORY}</h3>
              <div className="category-stats-grid">
                {dailyStats.categoryStats.map((cat, index) => (
                  <div key={index} className="category-stat-card">
                    <h4>{cat.category_name}</h4>
                    <p>{cat.total_calories} {UI_TEXT.CAL_LABEL}</p>
                    <p>{cat.total_quantity}g</p>
                    <p>{cat.entry_count} {UI_TEXT.ENTRIES_LABEL}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dailyStats.topFoods && dailyStats.topFoods.length > 0 && (
            <div className="top-foods">
              <h3>{UI_TEXT.TOP_FOODS_CONSUMED}</h3>
              <div className="top-foods-list">
                {dailyStats.topFoods.map((food, index) => (
                  <div key={index} className="top-food-item">
                    <span className="food-name">{food.food_name}</span>
                    <span className="food-category">({food.category_name})</span>
                    <span className="food-calories">{food.total_calories} {UI_TEXT.CAL_LABEL}</span>
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
              <h3>{UI_TEXT.PENDING_FOODS_FROM_BODYINDEX}</h3>
              <div className="pending-foods-summary">
                <span>{pendingFoods.length} {UI_TEXT.ITEMS_LABEL}</span>
                <span>{getPendingTotalCalories().toFixed(1)} {UI_TEXT.TOTAL_CALORIES_LABEL}</span>
              </div>
            </div>
            
            <div className="pending-foods-list">
              {pendingFoods.map((food) => (
                <div key={food.id} className="pending-food-item">
                  <div className="pending-food-info">
                    <h4>{food.name}</h4>
                    <p>{food.calories} {UI_TEXT.CAL_LABEL} {UI_TEXT.PER_100G} {food.unit}</p>
                  </div>
                  <div className="pending-food-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => updatePendingFoodQuantity(food.id, Math.max(1, food.quantity - 1))}
                      disabled={food.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={food.quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value) || 1;
                        updatePendingFoodQuantity(food.id, Math.max(1, newQuantity));
                      }}
                      onBlur={(e) => {
                        const newQuantity = parseInt(e.target.value) || 1;
                        updatePendingFoodQuantity(food.id, Math.max(1, newQuantity));
                      }}
                      className="quantity-input"
                    />
                    <span className="quantity-unit">{UI_TEXT.QUANTITY_UNIT}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updatePendingFoodQuantity(food.id, food.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="pending-food-calories">
                    {(food.calories * food.quantity / 100).toFixed(1)} {UI_TEXT.CAL_LABEL}
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
                  {UI_TEXT.ADD_ALL_TO_DAILY_TRACKING}
                </button>
                              <button 
                  className="clear-all-btn"
                  onClick={clearPendingFoods}
                >
                  {UI_TEXT.CLEAR_ALL}
                </button>
            </div>
          </div>
        )}
        
        <div className="date-selector">
          <label>Select Date:</label>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            placeholder={UI_TEXT.SELECT_DATE_PLACEHOLDER}
            className="date-input"
          />
        </div>
        
        <div className="add-food-form">
          <div className="form-row">
            <div className="form-group food-group">
              <label>{UI_TEXT.FOOD_TYPE_LABEL}</label>
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
              <label>{UI_TEXT.QUANTITY_PLACEHOLDER}</label>
              <div className="quantity-group">
                <button onClick={decreaseQuantity} className="quantity-btn">-</button>
                <input 
                  type="number" 
                  min={0}
                  step={100}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.round(parseFloat(e.target.value)) || 0)}
                  className="quantity-input"
                  placeholder={UI_TEXT.QUANTITY_PLACEHOLDER}
                />
                <button onClick={increaseQuantity} className="quantity-btn">+</button>
              </div>
            </div>
            
            <div className="form-group">
              <label>{UI_TEXT.CALORIES_LABEL}</label>
              <input 
                type="text" 
                value={calculateCalories(selectedFood, quantity)}
                readOnly
                className="calorie-display"
                placeholder={UI_TEXT.CALORIES_LABEL}
              />
            </div>
            
            <div className="form-group">
                              <button 
                  onClick={addFoodToLog} 
                  className="add-food-btn"
                  disabled={!selectedFood || loading}
                >
                  {UI_TEXT.ADD_TO_TABLE}
                </button>
            </div>
          </div>
        </div>
        
        {/* Table View for Larger Screens */}
        <div className="food-log-table-container">
          <table className="food-log-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Food</th>
                <th>{UI_TEXT.QUANTITY_PLACEHOLDER}</th>
                <th>{UI_TEXT.CALORIES_LABEL}</th>
                <th>{UI_TEXT.ACTION_LABEL}</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentItems().map((entry, index) => (
                <tr key={entry.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{entry.log_date}</td>
                  <td>{entry.food_name}</td>
                  <td>{entry.quantity}g</td>
                  <td>{entry.calories}</td>
                  <td className="action-buttons">
                    <button onClick={() => editFoodEntry(entry)} className="edit-btn">{UI_TEXT.EDIT_BUTTON_TEXT}</button>
                    <button onClick={() => deleteFoodEntry(entry.id)} className="delete-btn">{UI_TEXT.DELETE_BUTTON_TEXT}</button>
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
        </div>
        
        {/* Card View for Mobile */}
        {getCurrentItems().map((entry, index) => (
          <div key={entry.id} className="food-log-card">
            <div className="food-log-card-header">
              <div className="food-log-card-title">{entry.food_name}</div>
              <div className="food-log-card-date">{formatDate(entry.log_date)}</div>
            </div>
            <div className="food-log-card-details">
              <div className="food-log-card-detail">
                <span className="food-log-card-detail-label">Quantity</span>
                <span className="food-log-card-detail-value">{entry.quantity}g</span>
              </div>
              <div className="food-log-card-detail">
                <span className="food-log-card-detail-label">Calories</span>
                <span className="food-log-card-detail-value">{entry.calories} cal</span>
              </div>
              <div className="food-log-card-detail">
                <span className="food-log-card-detail-label">{UI_TEXT.ENTRY_LABEL} #{(currentPage - 1) * itemsPerPage + index + 1}</span>
              </div>
            </div>
            <div className="food-log-card-actions">
                          <button onClick={() => editFoodEntry(entry)} className="edit-btn">{UI_TEXT.EDIT_BUTTON_TEXT}</button>
            <button onClick={() => deleteFoodEntry(entry.id)} className="delete-btn">{UI_TEXT.DELETE_BUTTON_TEXT}</button>
            </div>
          </div>
        ))}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => {
                setCurrentPage(prev => Math.max(1, prev - 1));
              }}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              {UI_TEXT.PREVIOUS_BUTTON_TEXT}
            </button>
            <span className="pagination-info">
                              {UI_TEXT.PAGE_INFO_TEXT} {currentPage} {UI_TEXT.OF_TEXT} {totalPages}
            </span>
            <button 
              onClick={() => {
                setCurrentPage(prev => Math.min(totalPages, prev + 1));
              }}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              {UI_TEXT.NEXT_BUTTON_TEXT}
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingLog && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-content">
            <h2>{UI_TEXT.EDIT_FOOD_ENTRY}</h2>
            <div className="edit-modal-info">
              <p><strong>Note:</strong> {UI_TEXT.EDIT_ENTRY_NOTE}</p>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{UI_TEXT.FOOD_NAME_LABEL}</label>
                <div className="food-name-display">
                  <strong>{editingLog.food_name}</strong>
                </div>
              </div>
              <div className="form-group">
                <label>{UI_TEXT.TOTAL_QUANTITY_LABEL}</label>
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
                <label>{UI_TEXT.TOTAL_CALORIES_LABEL_2}</label>
                <input 
                  type="text" 
                  value={editCalories}
                  readOnly
                  className="calorie-display"
                  placeholder={UI_TEXT.CALORIES_LABEL}
                />
              </div>
              <div className="form-group">
                <button onClick={updateFoodEntry} className="save-btn">{UI_TEXT.SAVE_CHANGES}</button>
                <button onClick={() => setShowEditModal(false)} className="cancel-btn">{UI_TEXT.CANCEL_BUTTON}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Display (bottom) */}
      {message && (
        <div className={`message-display ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default CalorieCalculation;