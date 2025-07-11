import React, { useState, useEffect } from 'react';
import './CalorieCalculation.css';

const CalorieCalculation = () => {
  // State for food database
  const [foodDatabase, setFoodDatabase] = useState([
    { id: 1, name: 'Thịt gà', unit: '100g', calories: 239 },
    { id: 2, name: 'Thịt heo', unit: '100g', calories: 242.1 },
    { id: 3, name: 'Trứng gà', unit: '100g (2 quả)', calories: 155.1 },
    { id: 4, name: 'Trứng vịt', unit: '70g (1 quả)', calories: 130 },
    { id: 5, name: 'Cá ngừ', unit: '100g', calories: 129.8 },
    { id: 6, name: 'Tôm', unit: '100g', calories: 99.2 },
    { id: 7, name: 'Cua', unit: '100g', calories: 103 },
    { id: 8, name: 'Súp lơ', unit: '100g', calories: 25 },
    { id: 9, name: 'Dưa hấu', unit: '100g', calories: 30 },
    { id: 10, name: 'Khoai tây', unit: '100g', calories: 77 },
    { id: 11, name: 'Chuối', unit: '100g', calories: 88 },
  ]);

  // State for food tracking
  const [selectedDate, setSelectedDate] = useState('2024-08-22');
  const [selectedFood, setSelectedFood] = useState(1);
  const [quantity, setQuantity] = useState(100);
  const [dailyFoodLog, setDailyFoodLog] = useState([
    { id: 1, date: '2024-08-22', foodId: 1, name: 'Thịt gà', quantity: 100, calories: 239 },
    { id: 2, date: '2024-08-22', foodId: 3, name: 'Trứng gà', quantity: 100, calories: 155.1 },
    { id: 3, date: '2024-08-22', foodId: 8, name: 'Súp lơ', quantity: 400, calories: 100 },
    { id: 4, date: '2024-08-22', foodId: 9, name: 'Dưa hấu', quantity: 400, calories: 120 },
    { id: 5, date: '2024-08-22', foodId: 10, name: 'Khoai tây', quantity: 100, calories: 77 },
    { id: 6, date: '2024-08-22', foodId: 11, name: 'Chuối', quantity: 200, calories: 176 },
  ]);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(dailyFoodLog.length / itemsPerPage));

  const calculateCalories = (foodId, qty) => {
    const food = foodDatabase.find(item => item.id === parseInt(foodId));
    if (!food) return 0;
    
    const caloriesPer100g = food.calories;
    return Math.round(caloriesPer100g * qty / 100);
  };
  
  // Handle adding food to log
  const addFoodToLog = () => {
    const food = foodDatabase.find(item => item.id === parseInt(selectedFood));
    if (!food) return;
    
    const newEntry = {
      id: dailyFoodLog.length + 1,
      date: selectedDate,
      foodId: food.id,
      name: food.name,
      quantity: quantity,
      calories: calculateCalories(selectedFood, quantity)
    };
    
    setDailyFoodLog([...dailyFoodLog, newEntry]);
  };
  
  // Handle editing food entry
  const editFoodEntry = (id) => {
    // Logic for editing would go here
    console.log("Edit food entry with ID:", id);
  };
  
  // Handle deleting food entry
  const deleteFoodEntry = (id) => {
    setDailyFoodLog(dailyFoodLog.filter(entry => entry.id !== id));
  };
  
  // Get current items for pagination
  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return dailyFoodLog.slice(indexOfFirstItem, indexOfLastItem);
  };
  
  // Increase quantity
  const increaseQuantity = () => {
    setQuantity(prev => prev + 100);
  };
  
  // Decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 100) {
      setQuantity(prev => prev - 100);
    }
  };

  return (
    <div className="calorie-calculation-container">
      {/* Food database section */}
      <div className="food-database-table-wrapper">
        <div className="food-database-section">
          {/* Food database section content */}
          <div className="table-select-form-group">
            <label className="table-select-label">Chọn bảng tính</label>
            <select className="table-select">
              <option>Bảng tính calo trong thịt/trứng/hải sản</option>
            </select>
          </div>
          <table className="food-database-table">
            <thead>
              <tr>
                <th>Loại thực ăn</th>
                <th>Đơn vị tính</th>
                <th>Kcal</th>
              </tr>
            </thead>
            <tbody>
              {foodDatabase.map(food => (
                <tr key={food.id}>
                  <td>{food.name}</td>
                  <td>{food.unit}</td>
                  <td>{food.calories}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Food tracking section */}
      <div className="food-tracking-section">
        <h2 className="section-title">Thống kê các món ăn theo ngày</h2>
        
        <div className="add-food-form">
          <div className="form-row">
            <div className="form-group date-group">
              <label>Ngày</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
            </div>
            
            <div className="form-group food-group">
              <label>Loại thực ăn</label>
              <select 
                value={selectedFood}
                onChange={(e) => setSelectedFood(e.target.value)}
                className="food-select"
              >
                {foodDatabase.map(food => (
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
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="quantity-input"
                  placeholder="Số lượng (g)"
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
                placeholder="Kcal"
              />
            </div>
            
            <div className="form-group">
              <button onClick={addFoodToLog} className="add-food-btn">
                Thêm vào bảng
              </button>
            </div>
          </div>
        </div>
        
        <table className="food-log-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Ngày</th>
              <th>Thực phẩm</th>
              <th>Số lượng</th>
              <th>calo</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentItems().map((entry, index) => (
              <tr key={entry.id}>
                <td style={{textAlign: 'center'}}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{entry.date}</td>
                <td>{entry.name}</td>
                <td>{entry.quantity}g</td>
                <td>{entry.calories}</td>
                <td className="action-buttons" style={{justifyContent: 'center'}}>
                  <button onClick={() => editFoodEntry(entry.id)} className="edit-btn">Edit</button>
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
        
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            &lt;
          </button>
          
          {currentPage > 1 && (
            <button 
              onClick={() => setCurrentPage(1)}
              className="pagination-btn"
            >
              1
            </button>
          )}
          
          {currentPage > 3 && <span className="pagination-ellipsis">...</span>}
          
          {currentPage > 2 && (
            <button 
              onClick={() => setCurrentPage(currentPage - 1)}
              className="pagination-btn"
            >
              {currentPage - 1}
            </button>
          )}
          
          <button className="pagination-btn active">{currentPage}</button>
          
          {currentPage < totalPages - 1 && (
            <button 
              onClick={() => setCurrentPage(currentPage + 1)}
              className="pagination-btn"
            >
              {currentPage + 1}
            </button>
          )}
          
          {currentPage < totalPages - 2 && <span className="pagination-ellipsis">...</span>}
          
          {currentPage < totalPages && (
            <button 
              onClick={() => setCurrentPage(totalPages)}
              className="pagination-btn"
            >
              {totalPages}
            </button>
          )}
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            &gt;
          </button>
          
          <span className="pagination-info">
            {itemsPerPage}/ページ
          </span>
        </div>
      </div>
    </div>
  );
};

export default CalorieCalculation;