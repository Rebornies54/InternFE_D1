import React, { useState, useEffect } from 'react';
import { foodAPI } from '../../services/api';
import { authAPI } from '../../services/api';
import { useFoodContext } from '../../context/FoodContext';
import { useCalorieContext } from '../../context/CalorieContext';
import './BodyIndex.css';

const BodyIndex = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [dragStartX, setDragStartX] = useState(null);
  
  // Food data states
  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [recommendedFoods, setRecommendedFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bmiLoading, setBmiLoading] = useState(false);
  
  // Use FoodContext for food management
  const { 
    pendingFoods, 
    addToPendingFoods, 
    removeFromPendingFoods, 
    updatePendingFoodQuantity,
    getPendingTotalCalories 
  } = useFoodContext();
  
  // Fallback if CalorieContext is needed but not available
  const calorieContext = (() => {
    try {
      return useCalorieContext();
    } catch (error) {
      // Fallback to empty functions
      return {
        pendingCalorieFoods: [],
        addToPendingCalorieFoods: () => {},
        removeFromPendingCalorieFoods: () => {},
        updatePendingCalorieFoodQuantity: () => {},
        getPendingCalorieTotalCalories: () => 0
      };
    }
  })();

  // Load food data on component mount
  useEffect(() => {
    loadFoodData();
    loadBMIData();
  }, []);

  const loadFoodData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, itemsRes] = await Promise.all([
        foodAPI.getCategories(),
        foodAPI.getAllItems()
      ]);
      
      setCategories(categoriesRes.data.data);
      setFoodItems(itemsRes.data.data);
    } catch (error) {
      console.error('Error loading food data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBMIData = async () => {
    try {
      setBmiLoading(true);
      const response = await authAPI.getBMIData();
      if (response.data.success && response.data.data) {
        const bmiData = response.data.data;
        setHeight(bmiData.height.toString());
        setWeight(bmiData.weight.toString());
        setBmi(bmiData.bmi.toString());
        
        // Generate recommendations based on saved BMI
        generateRecommendations(bmiData.bmi.toString());
      }
    } catch (error) {
      console.error('Error loading BMI data:', error);
    } finally {
      setBmiLoading(false);
    }
  };

  const handleWheel = (e) => {
    if (document.activeElement === e.target) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const handleCalculate = async () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const bmiValue = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(1);
      const bmiCategory = getBMICategory(bmiValue).toLowerCase().replace(' ', '');
      
      setBmi(bmiValue);
      
      // Generate recommendations based on BMI
      generateRecommendations(bmiValue);
      
      // Save BMI data to database
      try {
        await authAPI.saveBMIData({
          height: parseFloat(height),
          weight: parseFloat(weight),
          bmi: parseFloat(bmiValue),
          bmi_category: bmiCategory
        });
        console.log('BMI data saved successfully');
      } catch (error) {
        console.error('Error saving BMI data:', error);
      }
    }
  };

  const generateRecommendations = (bmiValue) => {
    const bmi = parseFloat(bmiValue);
    let recommendedCategories = [];
    
    if (bmi < 18.5) {
      // Underweight - recommend high calorie foods
      recommendedCategories = [1, 4, 5, 6]; // Meat, Grains, Dairy, Snacks
    } else if (bmi >= 18.5 && bmi < 25) {
      // Normal weight - balanced diet
      recommendedCategories = [2, 3, 4, 5]; // Vegetables, Fruits, Grains, Dairy
    } else if (bmi >= 25 && bmi < 30) {
      // Overweight - low calorie, high fiber
      recommendedCategories = [2, 3]; // Vegetables, Fruits
    } else {
      // Obese - very low calorie, high fiber
      recommendedCategories = [2]; // Vegetables only
    }
    
    // Filter food items by recommended categories
    const recommended = foodItems.filter(item => 
      recommendedCategories.includes(item.category_id)
    );
    
    // Take first 8 items for display (2 rows of 4)
    setRecommendedFoods(recommended.slice(0, 8));
  };

  const openModal = (food) => {
    setSelectedFood(food);
    setModalOpen(true);
    setActiveImg(0);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedFood(null);
  };

  const getBMICategory = (bmi) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue >= 18.5 && bmiValue < 25) return 'Normal weight';
    if (bmiValue >= 25 && bmiValue < 30) return 'Overweight';
    return 'Obese';
  };

  const getBMICategoryColor = (bmi) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return '#4299E1'; // Blue
    if (bmiValue >= 18.5 && bmiValue < 25) return '#48BB78'; // Green
    if (bmiValue >= 25 && bmiValue < 30) return '#F6AD55'; // Orange
    return '#F56565'; // Red
  };

  // Calculate BMI marker position on scale (0-100%)
  const getBMIMarkerPosition = (bmi) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 16) return 0;
    if (bmiValue > 35) return 100;
    
    // Map BMI value to percentage (16-35 range maps to 0-100%)
    return ((bmiValue - 16) / (35 - 16)) * 100;
  };

  // Add food to calorie calculation
  const addToCalorieCalculation = (food) => {
    addToPendingFoods(food);
    // Also add to calorie context if available
    if (calorieContext.addToPendingCalorieFoods) {
      calorieContext.addToPendingCalorieFoods(food);
    }
  };

  // Remove food from calorie calculation
  const removeFromCalorieCalculation = (foodId) => {
    removeFromPendingFoods(foodId);
    // Also remove from calorie context if available
    if (calorieContext.removeFromPendingCalorieFoods) {
      calorieContext.removeFromPendingCalorieFoods(foodId);
    }
  };

  // Update food quantity
  const updateFoodQuantity = (foodId, quantity) => {
    updatePendingFoodQuantity(foodId, quantity);
    // Also update in calorie context if available
    if (calorieContext.updatePendingCalorieFoodQuantity) {
      calorieContext.updatePendingCalorieFoodQuantity(foodId, quantity);
    }
  };

  // Calculate total calories
  const calculateTotalCalories = () => {
    return getPendingTotalCalories();
  };

  // Improved image handling function
  const getFoodImageUrl = (food) => {
    if (!food.image_url) {
      return null;
    }
    
    // Check if its a valid URL
    try {
      new URL(food.image_url);
      return food.image_url;
    } catch {
      return null;
    }
  };

  // Handle image error with fallback
  const handleImageError = (e, foodName) => {
    console.warn(`Failed to load image for ${foodName}:`, e.target.src);
    e.target.style.display = 'none';
    if (e.target.nextSibling) {
      e.target.nextSibling.style.display = 'block';
    }
  };

  // Get placeholder color based on food category
  const getPlaceholderColor = (categoryId) => {
    const colors = {
      1: '#f8f9fa', // Meat
      2: '#f8f9fa', // Vegetables
      3: '#f8f9fa', // Fruits
      4: '#f8f9fa', // Grains
      5: '#f8f9fa', // Dairy
      6: '#f8f9fa'  // Snacks
    };
    return colors[categoryId] || '#f8f9fa';
  };

  return (
    <div className="body-index-container">
      <h1 className="body-index-title">Calorie Index (BMI) Calculation</h1>
      <div className="body-index-content">
        <div className="body-index-form-section">
          <div className="body-index-form-row">
            <div className="body-index-form-inputs">
              {bmiLoading && (
                <div className="bmi-loading">
                  Loading your BMI data...
                </div>
              )}
              <div className="body-index-form-group">
                <label className="body-index-label">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  placeholder="Enter height..."
                  className="body-index-input"
                  onWheelCapture={handleWheel}
                />
              </div>
              <div className="body-index-form-group">
                <label className="body-index-label">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  placeholder="Enter weight"
                  className="body-index-input"
                  onWheelCapture={handleWheel}
                />
              </div>
              <div className="body-index-form-group">
                <button
                  className="body-index-calc-btn"
                  onClick={handleCalculate}
                  disabled={!height || !weight}
                >
                  Calculate BMI
                </button>
              </div>
            </div>
            
            {bmi && (
              <div className="bmi-results-container">
                <div className="bmi-value-display">
                  <div 
                    className="bmi-number" 
                    style={{ color: getBMICategoryColor(bmi) }}
                  >
                    {bmi}
                  </div>
                  <div 
                    className="bmi-category"
                    style={{ 
                      color: getBMICategoryColor(bmi),
                      backgroundColor: `${getBMICategoryColor(bmi)}15`
                    }}
                  >
                    {getBMICategory(bmi)}
                  </div>
                </div>
                
                <div className="bmi-scale">
                  <div 
                    className="bmi-marker"
                    style={{ 
                      left: `${getBMIMarkerPosition(bmi)}%`,
                      borderColor: getBMICategoryColor(bmi)
                    }}
                  ></div>
                </div>
                <div className="bmi-scale-labels">
                  <span>Underweight</span>
                  <span>Normal</span>
                  <span>Overweight</span>
                  <span>Obese</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="food-list-section">
          <h2 className="body-index-section-title">
            Recommended Dishes
            {bmi && (
              <span style={{ 
                fontSize: '15px', 
                color: getBMICategoryColor(bmi),
                fontWeight: 'normal',
                backgroundColor: `${getBMICategoryColor(bmi)}15`,
                padding: '6px 14px',
                borderRadius: '10px'
              }}>
                Based on BMI: {getBMICategory(bmi)}
              </span>
            )}
          </h2>
          
          {loading ? (
            <div className="loading-message">Loading food recommendations...</div>
          ) : (
            <div className="recommended-food-list">
              {recommendedFoods.length > 0 ? (
                recommendedFoods.map((food) => (
                  <div className="food-item" key={food.id}>
                    <div className="food-img-container">
                      {getFoodImageUrl(food) ? (
                        <img 
                          src={getFoodImageUrl(food)} 
                          alt={food.name}
                          className="food-image"
                          onError={(e) => handleImageError(e, food.name)}
                        />
                      ) : null}
                      <div className="food-img-placeholder" style={{ 
                        display: getFoodImageUrl(food) ? 'none' : 'block',
                        backgroundColor: getPlaceholderColor(food.category_id)
                      }}></div>
                    </div>
                    <div className="food-content">
                      <h3 className="food-title">{food.name}</h3>
                      <p className="food-description">
                        {food.calories} calories per {food.unit}
                      </p>
                      <div className="food-nutrition-info">
                        <span>Protein: {food.protein}g</span>
                        <span>Fat: {food.fat}g</span>
                        <span>Carbs: {food.carbs}g</span>
                      </div>
                      <div className="food-actions">
                        <button className="detail-btn" onClick={() => openModal(food)}>
                          View Details
                        </button>
                        <button 
                          className="add-to-calorie-btn" 
                          onClick={() => addToCalorieCalculation(food)}
                        >
                          Add to Calorie Calc
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-recommendations">
                  {bmi ? 'No recommendations available for your BMI category.' : 'Calculate your BMI to see personalized food recommendations.'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Calorie Calculation Section */}
      {pendingFoods.length > 0 && (
        <div className="calorie-calculation-section">
          <h2 className="body-index-section-title">
            Calorie Calculation
            <span className="total-calories">
              Total: {calculateTotalCalories().toFixed(1)} calories
            </span>
          </h2>
          
          <div className="selected-foods-list">
            {pendingFoods.map((food) => (
              <div key={food.id} className="selected-food-item">
                <div className="selected-food-info">
                  <h4>{food.name}</h4>
                  <p>{food.calories} cal per {food.unit}</p>
                </div>
                <div className="selected-food-quantity">
                  <button 
                    className="quantity-btn"
                    onClick={() => updateFoodQuantity(food.id, Math.max(1, food.quantity - 1))}
                    disabled={food.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{food.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => updateFoodQuantity(food.id, food.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="selected-food-calories">
                  {(food.calories * food.quantity).toFixed(1)} cal
                </div>
                <button 
                  className="remove-food-btn"
                  onClick={() => removeFromCalorieCalculation(food.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {modalOpen && selectedFood && (
        <div className="food-modal-overlay" onClick={closeModal}>
          <div className="food-modal-outer" onClick={e => e.stopPropagation()}>
            <div className="food-modal">
              <button className="modal-close-btn" onClick={closeModal}>×</button>
              <div className="food-modal-img-large">
                {getFoodImageUrl(selectedFood) ? (
                  <img 
                    src={getFoodImageUrl(selectedFood)} 
                    alt={selectedFood.name}
                    className="food-modal-image"
                    onError={(e) => handleImageError(e, selectedFood.name)}
                  />
                ) : null}
                <div className="food-img-placeholder food-modal-img-placeholder" style={{ 
                  display: getFoodImageUrl(selectedFood) ? 'none' : 'block',
                  backgroundColor: getPlaceholderColor(selectedFood.category_id)
                }}></div>
              </div>
              <h3 className="food-title">{selectedFood.name}</h3>
              <p className="food-description">
                Category: {categories.find(cat => cat.id === selectedFood.category_id)?.name || 'Unknown'}
              </p>
              <div className="food-nutrition-details">
                <div className="nutrition-item">
                  <strong>Calories:</strong> 
                  <span className="nutrition-value">{selectedFood.calories} cal per {selectedFood.unit}</span>
                </div>
                <div className="nutrition-item">
                  <strong>Protein:</strong> 
                  <span className="nutrition-value">{selectedFood.protein}g</span>
                </div>
                <div className="nutrition-item">
                  <strong>Fat:</strong> 
                  <span className="nutrition-value">{selectedFood.fat}g</span>
                </div>
                <div className="nutrition-item">
                  <strong>Carbohydrates:</strong> 
                  <span className="nutrition-value">{selectedFood.carbs}g</span>
                </div>
                {selectedFood.fiber && (
                  <div className="nutrition-item">
                    <strong>Fiber:</strong> 
                    <span className="nutrition-value">{selectedFood.fiber}g</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyIndex;