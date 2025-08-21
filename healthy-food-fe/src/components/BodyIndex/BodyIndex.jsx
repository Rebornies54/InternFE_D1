// Fixed import
import React, { useState, useEffect } from 'react';
import { foodAPI } from '../../services/api';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useFoodContext } from '../../context/FoodContext';
import { useCalorieContext } from '../../context/CalorieContext';
import { DEFAULTS, UI_TEXT } from '../../constants';
import './BodyIndex.css';


  // Helper functions for CSS classes
  const getBMICategoryClass = (bmi) => {
    if (bmi < 18.5) return 'underweight';
    if (bmi >= 18.5 && bmi < 25) return 'normal';
    if (bmi >= 25 && bmi < 30) return 'overweight';
    return 'obese';
  };

  const getFoodCategoryClass = (categoryId) => {
    const classes = {
      1: 'meat',
      2: 'vegetables', 
      3: 'fruits',
      4: 'grains',
      5: 'dairy',
      6: 'snacks'
    };
    return classes[categoryId] || 'default';
  };
const BodyIndex = () => {
  const { setCurrentBmi } = useAuth();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [activeImg, setActiveImg] = useState(DEFAULTS.ACTIVE_IMG);
  const [dragStartX, setDragStartX] = useState(null);

  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [recommendedFoods, setRecommendedFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bmiLoading, setBmiLoading] = useState(false);

  const { 
    pendingFoods, 
    addToPendingFoods, 
    removeFromPendingFoods, 
    updatePendingFoodQuantity,
    getPendingTotalCalories 
  } = useFoodContext();
  
  const calorieContext = (() => {
    try {
      return useCalorieContext();
    } catch (error) {

      return {
        pendingCalorieFoods: [],
        addToPendingCalorieFoods: () => {},
        removeFromPendingCalorieFoods: () => {},
        updatePendingCalorieFoodQuantity: () => {},
        getPendingCalorieTotalCalories: () => 0
      };
    }
  })();

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
    } catch (error) { /* Error handled */ }finally {
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
        setCurrentBmi(Number(bmiData.bmi));
        
        generateRecommendations(bmiData.bmi.toString());
      }
    } catch (error) { /* Error handled */ }finally {
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

      generateRecommendations(bmiValue);

      try {
        await authAPI.saveBMIData({
          height: parseFloat(height),
          weight: parseFloat(weight),
          bmi: parseFloat(bmiValue),
          bmi_category: bmiCategory
        });
        setCurrentBmi(parseFloat(bmiValue));

      } catch (error) { /* Error handled */ }}
  };

  const generateRecommendations = (bmiValue) => {
    const bmi = parseFloat(bmiValue);
    let recommendedCategories = [];
    
    if (bmi < 18.5) {
      recommendedCategories = [1, 4, 5, 6]; 
    } else if (bmi >= 18.5 && bmi < 25) {
      recommendedCategories = [2, 3, 4, 5]; 
    } else if (bmi >= 25 && bmi < 30) {
      recommendedCategories = [2, 3]; 
    } else {
      recommendedCategories = [2]; 
    }
 
    const recommended = foodItems.filter(item => 
      recommendedCategories.includes(item.category_id)
    );

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

  // const getBMICategoryColor = (bmi) => {
  //   const bmiValue = parseFloat(bmi);
  //   if (bmiValue < 18.5) return '#4299E1'; // Blue
  //   if (bmiValue >= 18.5 && bmiValue < 25) return '#48BB78'; 
  //   if (bmiValue >= 25 && bmiValue < 30) return '#F6AD55';
  //   return '#F56565'; 
  // };

  // const getBMIMarkerPosition = (bmi) => {
  //   const bmiValue = parseFloat(bmi);
  //   if (bmiValue < 16) return 0;
  //   if (bmiValue > 35) return 100;

  //   return ((bmiValue - 16) / (35 - 16)) * 100;
  // };

  const addToCalorieCalculation = (food) => {
    addToPendingFoods(food);
    if (calorieContext.addToPendingCalorieFoods) {
      calorieContext.addToPendingCalorieFoods(food);
    }
  };

  const removeFromCalorieCalculation = (foodId) => {
    removeFromPendingFoods(foodId);
    if (calorieContext.removeFromPendingCalorieFoods) {
      calorieContext.removeFromPendingCalorieFoods(foodId);
    }
  };

  const updateFoodQuantity = (foodId, quantity) => {
    updatePendingFoodQuantity(foodId, quantity);
    if (calorieContext.updatePendingCalorieFoodQuantity) {
      calorieContext.updatePendingCalorieFoodQuantity(foodId, quantity);
    }
  };

  const calculateTotalCalories = () => {
    return getPendingTotalCalories();
  };

  const getFoodImageUrl = (food) => {
    if (!food.image_url) {
      return null;
    }

    try {
      new URL(food.image_url);
      return food.image_url;
    } catch {
      return null;
    }
  };

  const handleImageError = (e, foodName) => {
    logWarning(`Failed to load image for ${foodName}:`, e.target.src);
    e.target.style.display = 'none';
    if (e.target.nextSibling) {
      e.target.nextSibling.style.display = 'block';
    }
  };

  // const getPlaceholderColor = (categoryId) => {
  //   const colors = {
  //     1: '#f8f9fa', // Meat
  //     2: '#f8f9fa', // Vegetables
  //     3: '#f8f9fa', // Fruits
  //     4: '#f8f9fa', // Grains
  //     5: '#f8f9fa', // Dairy
  //     6: '#f8f9fa'  // Snacks
  //   };
  //   return colors[categoryId] || '#f8f9fa';
  // };

  // const getTableOptions = () => {
  //   const seen = new Set();
  //   return categories
  //     .map(cat => ({
  //       value: cat.id,
  //       label: cat.name
  //     }))
  //     .filter(option => {
  //       if (seen.has(option.label)) return false;
  //       seen.add(option.label);
  //       return true;
  //     });
  // };

  return (
    <div className="body-index-container">
      <h1 className="body-index-title">Calorie Index (BMI) Calculation</h1>
      <div className="body-index-content">
        <div className="body-index-form-section">
          <div className="body-index-form-row">
            <div className="body-index-form-inputs">
              {bmiLoading && (
                <div className="bmi-loading">
                  {UI_TEXT.LOADING_BMI_DATA}
                </div>
              )}
              <div className="body-index-form-group">
                <label className="body-index-label">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={_e => setHeight(_e.target.value)}
                  placeholder={UI_TEXT.ENTER_HEIGHT_PLACEHOLDER}
                  className="body-index-input"
                  onWheelCapture={handleWheel}
                />
              </div>
              <div className="body-index-form-group">
                <label className="body-index-label">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={_e => setWeight(_e.target.value)}
                  placeholder={UI_TEXT.ENTER_WEIGHT_PLACEHOLDER}
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
                    className={`bmi-number bmi-number-${getBMICategoryClass(bmi)}`}
                  >
                    {bmi}
                  </div>
                  <div 
                    className={`bmi-category bmi-category-${getBMICategoryClass(bmi)}`}
                  >
                    {getBMICategory(bmi)}
                  </div>
                </div>
                
                <div className="bmi-scale">
                  <div 
                    className={`bmi-marker bmi-marker-${getBMICategoryClass(bmi)}`}
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
            {UI_TEXT.RECOMMENDED_DISHES}
            {bmi && (
              <span className={`bmi-badge bmi-badge-${getBMICategoryClass(bmi)}`}>
                {UI_TEXT.BASED_ON_BMI} {getBMICategory(bmi)}
              </span>
            )}
          </h2>
          
          {loading ? (
                          <div className="loading-message">{UI_TEXT.LOADING_FOOD_RECOMMENDATIONS}</div>
          ) : (
            <div className="recommended-food-list">
              {recommendedFoods.length > 0 ? (
                recommendedFoods.map((food) => (
                  <div className="food-item" key={food.id}>
                    <div className="food-img-container">
                      {getFoodImageUrl(food) && getFoodImageUrl(food).trim() !== '' ? (
                        <img 
                          src={getFoodImageUrl(food)} 
                          alt={food.name}
                          className="food-image"
                          onError={(_e) => handleImageError(_e, food.name)}
                        />
                      ) : null}
                      <div className={`food-img-placeholder food-placeholder-${getFoodCategoryClass(food.category_id)}`}></div>
                    </div>
                    <div className="food-content">
                      <h3 className="food-title">{food.name}</h3>
                      <p className="food-description">
                        {food.calories} calories per {food.unit}
                      </p>
                      <div className="food-nutrition-info">
                        <span>{UI_TEXT.PROTEIN_LABEL} {food.protein}g</span>
                        <span>{UI_TEXT.FAT_LABEL} {food.fat}g</span>
                        <span>{UI_TEXT.CARBS_LABEL} {food.carbs}g</span>
                      </div>
                      <div className="food-actions">
                        <button className="detail-btn" onClick={() => openModal(food)}>
                          View Details
                        </button>
                        <button 
                          className="add-to-calorie-btn" 
                          onClick={() => addToCalorieCalculation(food)}
                        >
                          {UI_TEXT.ADD_TO_CALORIE_CALC}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-recommendations">
                  {bmi ? UI_TEXT.NO_RECOMMENDATIONS_AVAILABLE : UI_TEXT.CALCULATE_BMI_FOR_RECOMMENDATIONS}
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
            {UI_TEXT.CALORIE_CALCULATION}
            <span className="total-calories">
              {UI_TEXT.TOTAL}: {calculateTotalCalories().toFixed(1)} {UI_TEXT.CALORIES}
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
                  <input
                    type="number"
                    min="1"
                    value={food.quantity}
                    onChange={(_e) => {
                      const newQuantity = parseInt(_e.target.value) || 1;
                      updateFoodQuantity(food.id, Math.max(1, newQuantity));
                    }}
                    onBlur={(e) => {
                      const newQuantity = parseInt(e.target.value) || 1;
                      updateFoodQuantity(food.id, Math.max(1, newQuantity));
                    }}
                    className="quantity-input"
                  />
                  <span className="quantity-unit">{UI_TEXT.QUANTITY_UNIT}</span>
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
                  {UI_TEXT.CLOSE_BUTTON}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {modalOpen && selectedFood && (
        <div className="food-modal-overlay" onClick={closeModal}>
          <div className="food-modal-outer" onClick={_e => _e.stopPropagation()}>
            <div className="food-modal">
                              <button className="modal-close-btn" onClick={closeModal}>{UI_TEXT.CLOSE_BUTTON}</button>
              <div className="food-modal-img-large">
                {getFoodImageUrl(selectedFood) && getFoodImageUrl(selectedFood).trim() !== '' ? (
                  <img 
                    src={getFoodImageUrl(selectedFood)} 
                    alt={selectedFood.name}
                    className="food-modal-image"
                    onError={(_e) => handleImageError(_e, selectedFood.name)}
                  />
                ) : null}
                <div className={`food-img-placeholder food-modal-img-placeholder food-placeholder-${getFoodCategoryClass(selectedFood.category_id)}`}></div>
              </div>
              <h3 className="food-title">{selectedFood.name}</h3>
              <p className="food-description">
                {UI_TEXT.FOOD_CATEGORY_LABEL} {categories.find(cat => cat.id === selectedFood.category_id)?.name || UI_TEXT.UNKNOWN_CATEGORY}
              </p>
              <div className="food-nutrition-details">
                <div className="nutrition-item">
                  <strong>{UI_TEXT.CALORIES_LABEL}</strong> 
                  <span className="nutrition-value">{selectedFood.calories} {UI_TEXT.CAL_PER_UNIT} {selectedFood.unit}</span>
                </div>
                <div className="nutrition-item">
                  <strong>{UI_TEXT.PROTEIN_LABEL}</strong> 
                  <span className="nutrition-value">{selectedFood.protein}g</span>
                </div>
                <div className="nutrition-item">
                  <strong>{UI_TEXT.FAT_LABEL}</strong> 
                  <span className="nutrition-value">{selectedFood.fat}g</span>
                </div>
                <div className="nutrition-item">
                  <strong>{UI_TEXT.CARBOHYDRATES_LABEL}</strong> 
                  <span className="nutrition-value">{selectedFood.carbs}g</span>
                </div>
                {selectedFood.fiber && (
                  <div className="nutrition-item">
                    <strong>{UI_TEXT.FIBER_LABEL}</strong> 
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