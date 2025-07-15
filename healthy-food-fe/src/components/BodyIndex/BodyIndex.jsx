import React, { useState } from 'react';
import './BodyIndex.css';

const foodList = [
  {
    name: 'Dish A',
    description: 'Content...',
    images: [
      'https://via.placeholder.com/786x247?text=Image+1',
      'https://via.placeholder.com/786x247?text=Image+2',
    ],
    nutrition: [
      { food: 'Arrowroot', serving: '1 piece (33 g)', calories: '21 cal' },
      { food: 'Artichoke', serving: '1 piece (128 g)', calories: '56 cal' },
      { food: 'Asparagus', serving: '1 piece, small (12 g)', calories: '2 cal' },
    ],
  },
  {
    name: 'Vegetables',
    description: 'Vegetables are a great high-volume, low-calorie option. You can eat a lot of them',
    images: [
      'https://via.placeholder.com/786x247?text=Veg+1',
      'https://via.placeholder.com/786x247?text=Veg+2',
      'https://via.placeholder.com/786x247?text=Veg+3',
    ],
    nutrition: [
      { food: 'Asparagus, cooked', serving: '1 portion (125 g)', calories: '19 cal' },
      { food: 'Azuki Beans', serving: '1 portion (60 g)', calories: '217 cal' },
      { food: 'Baked Beans', serving: '1 cup (253 g)', calories: '266 cal' },
      { food: 'Arrowroot', serving: '1 piece (33 g)', calories: '21 cal' },
      { food: 'Artichoke', serving: '1 piece (128 g)', calories: '56 cal' },
      { food: 'Asparagus', serving: '1 piece, small (12 g)', calories: '2 cal' },
    ],
  },
];

const BodyIndex = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [dragStartX, setDragStartX] = useState(null);

  const handleWheel = (e) => {
    if (document.activeElement === e.target) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const handleCalculate = () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const bmiValue = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(bmiValue);
    }
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

  return (
    <div className="body-index-container">
      <h1 className="body-index-title">Calorie Index (BMI) Calculation</h1>
      <div className="body-index-content">
        <div className="body-index-form-section">
          <div className="body-index-form-row">
            <div className="body-index-form-inputs">
              <div className="body-index-form-group">
                <label className="body-index-label">Height</label>
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
                <label className="body-index-label">Weight</label>
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
                <label className="body-index-label">Calculation Result</label>
                <input
                  type="text"
                  value={bmi}
                  readOnly
                  placeholder="Result"
                  className="body-index-input"
                />
              </div>
              <div className="body-index-form-group">
                <button
                  className="body-index-calc-btn"
                  onClick={handleCalculate}
                  disabled={!height || !weight}
                >
                  Calculate
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="food-list-section">
          <h2 className="body-index-section-title">Recommended Dishes List</h2>
          <div className="recommended-food-list">
            {foodList.map((food, idx) => (
              <div className="food-item" key={idx}>
                <div className="food-img-placeholder"></div>
                <div className="food-content">
                  <h3 className="food-title">{food.name}</h3>
                  <p className="food-description">{food.description}</p>
                  <button className="detail-btn" onClick={() => openModal(food)}>Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {modalOpen && selectedFood && (
        <div className="food-modal-overlay" onClick={closeModal}>
          <div className="food-modal-outer">
            <div className="food-modal" onClick={e => e.stopPropagation()}>
              <div
                className="food-modal-img-large"
                onMouseDown={e => setDragStartX(e.clientX)}
                onMouseUp={e => {
                  if (dragStartX !== null) {
                    const diff = e.clientX - dragStartX;
                    if (diff > 50 && activeImg > 0) setActiveImg(activeImg - 1);
                    if (diff < -50 && activeImg < selectedFood.images.length - 1) setActiveImg(activeImg + 1);
                    setDragStartX(null);
                  }
                }}
                onMouseLeave={() => setDragStartX(null)}
                onTouchStart={e => setDragStartX(e.touches[0].clientX)}
                onTouchEnd={e => {
                  if (dragStartX !== null) {
                    const diff = e.changedTouches[0].clientX - dragStartX;
                    if (diff > 50 && activeImg > 0) setActiveImg(activeImg - 1);
                    if (diff < -50 && activeImg < selectedFood.images.length - 1) setActiveImg(activeImg + 1);
                    setDragStartX(null);
                  }
                }}
              >
                <div className="food-img-placeholder food-modal-img-placeholder"></div>
              </div>
              {selectedFood.images && selectedFood.images.length > 1 && (
                <div className="food-modal-img-dots">
                  {selectedFood.images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`food-img-dot${activeImg === idx ? ' active' : ''}`}
                      onClick={() => setActiveImg(idx)}
                    />
                  ))}
                </div>
              )}
              <h3 className="food-title">{selectedFood.name}</h3>
              <p className="food-description">{selectedFood.description}</p>
              <table className="food-nutrition-table">
                <thead>
                  <tr>
                    <th>Food</th>
                    <th>Serving</th>
                    <th>Calories</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedFood.nutrition && selectedFood.nutrition.map((item, i) => (
                    <tr key={i}>
                      <td>{item.food}</td>
                      <td>{item.serving}</td>
                      <td>{item.calories}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyIndex;