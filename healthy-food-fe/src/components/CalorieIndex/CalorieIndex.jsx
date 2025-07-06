import React, { useState } from 'react';
import './CalorieIndex.css';

const CalorieIndex = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const foodData = [
    { name: 'Apple', servingSize: '1 medium (182g)', calories: 95 },
    { name: 'Banana', servingSize: '1 medium (118g)', calories: 105 },
    { name: 'Chicken Breast', servingSize: '100g', calories: 165 },
    { name: 'Salmon', servingSize: '100g', calories: 208 },
    { name: 'Brown Rice', servingSize: '1 cup cooked (195g)', calories: 216 },
    { name: 'Broccoli', servingSize: '1 cup chopped (91g)', calories: 31 },
    { name: 'Egg', servingSize: '1 large (50g)', calories: 74 },
    { name: 'Milk', servingSize: '1 cup (244g)', calories: 103 },
    { name: 'Oatmeal', servingSize: '1 cup cooked (234g)', calories: 166 },
    { name: 'Sweet Potato', servingSize: '1 medium (114g)', calories: 103 },
    { name: 'Spinach', servingSize: '1 cup raw (30g)', calories: 7 },
    { name: 'Tuna', servingSize: '100g', calories: 144 }
  ];

  const filteredFoods = foodData.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="calorie-index-container">
      <h1 className="calorie-index-title">カロリーインデックス</h1>
      <div className="calorie-index-content">
        <h2>Food Calorie Index</h2>
        <p>Browse common foods and their calorie content.</p>
        
        <div className="search-section">
          <input 
            type="text" 
            placeholder="Search foods..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="table-container">
          <table className="food-table">
            <thead>
              <tr>
                <th>Food</th>
                <th>Serving Size</th>
                <th>Calories</th>
              </tr>
            </thead>
            <tbody>
              {filteredFoods.map((food, index) => (
                <tr key={index}>
                  <td>{food.name}</td>
                  <td>{food.servingSize}</td>
                  <td>{food.calories}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredFoods.length === 0 && (
            <div className="no-results">
              <p>No foods found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
        
        <div className="calorie-info">
          <h3>Understanding Calories</h3>
          <p>
            Calories are units of energy that your body uses for various functions including 
            breathing, circulating blood, and physical activity. The number of calories you 
            need depends on your age, gender, weight, height, and activity level.
          </p>
          <div className="calorie-tips">
            <h4>Tips for Healthy Eating:</h4>
            <ul>
              <li>Focus on nutrient-dense foods</li>
              <li>Include a variety of fruits and vegetables</li>
              <li>Choose lean proteins</li>
              <li>Limit added sugars and processed foods</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieIndex; 