import React, { useState, useEffect, useCallback } from 'react';
import { foodAPI } from '../../services/api';
import { useFoodContext } from '../../context/FoodContext';
import { PAGINATION, DEFAULTS, VALIDATION } from '../../constants';
import { 
  FoodDatabaseSection, 
  FoodTrackingForm, 
  FoodLogDisplay 
} from './components';
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
        }, 300); 
      };
    })(),
    [selectedDate]
  );

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
    } catch (error) { /* Error handled */ } finally {
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
    } catch (error) { /* Error handled */ } finally {
      setLoading(false);
    }
  };

  const loadUserFoodLogs = async () => {
    try {
      const response = await foodAPI.getFoodLogs(selectedDate);
      if (response.data.success) {
        setDailyFoodLog(response.data.data);
      }
    } catch (error) { /* Error handled */ }
  };

  const loadDailyStatistics = async () => {
    try {
      const response = await foodAPI.getDailyStatistics(selectedDate);
      if (response.data.success) {
        setDailyStats(response.data.data);
      }
    } catch (error) { /* Error handled */ }
  };

  const loadWeeklyStatistics = async () => {
    try {
      const response = await foodAPI.getWeeklyStatistics();
      if (response.data.success) {
      }
    } catch (error) { /* Error handled */ }
  };

  const loadMonthlyStatistics = async () => {
    try {
      const currentDate = new Date();
      const response = await foodAPI.getMonthlyStatistics(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      );
      if (response.data.success) {
      }
    } catch (error) { /* Error handled */ }
  };

  const calculateCalories = (foodId, qty) => {
    const food = foodItems.find(item => item.id === parseInt(foodId));
    if (!food) return 0;
    
    const caloriesPer100g = food.calories;
    return Math.round(caloriesPer100g * qty / 100);
  };

  const addFoodToLog = async () => {
    if (!selectedFood) return;

    try {
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
    } catch (error) {
      setMessage('Lỗi khi xóa thực phẩm');
      setMessageType('error');
    }
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
          } catch (error) { /* Error handled */ }
        });

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

      <FoodDatabaseSection
        foodCategories={foodCategories}
        foodItems={foodItems}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        loading={loading}
        dailyStats={dailyStats}
        selectedDate={selectedDate}
      />

      <FoodTrackingForm
        pendingFoods={pendingFoods}
        selectedDate={selectedDate}
        selectedFood={selectedFood}
        quantity={quantity}
        foodItems={foodItems}
        loading={loading}
        onDateChange={setSelectedDate}
        onFoodChange={setSelectedFood}
        onQuantityChange={setQuantity}
        onIncreaseQuantity={increaseQuantity}
        onDecreaseQuantity={decreaseQuantity}
        onAddFood={addFoodToLog}
        onRemovePendingFood={removeFromPendingFoods}
        onUpdatePendingFoodQuantity={updatePendingFoodQuantity}
        onAddPendingFoodsToTracking={addPendingFoodsToTracking}
        onClearPendingFoods={clearPendingFoods}
        getPendingTotalCalories={getPendingTotalCalories}
        calculateCalories={calculateCalories}
      />

      <FoodLogDisplay
        dailyFoodLog={dailyFoodLog}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        editingLog={editingLog}
        showEditModal={showEditModal}
        editQuantity={editQuantity}
        editCalories={editCalories}
        onEditFoodEntry={editFoodEntry}
        onDeleteFoodEntry={deleteFoodEntry}
        onUpdateFoodEntry={updateFoodEntry}
        onCloseEditModal={() => setShowEditModal(false)}
        onIncreaseEditQuantity={increaseEditQuantity}
        onDecreaseEditQuantity={decreaseEditQuantity}
        onEditQuantityChange={(newQuantity) => {
          setEditQuantity(newQuantity);
          setEditCalories(calculateEditCalories(newQuantity));
        }}
        onPageChange={setCurrentPage}
        calculateEditCalories={calculateEditCalories}
        formatDate={formatDate}
      />
    </div>
  );
};

export default CalorieCalculation;