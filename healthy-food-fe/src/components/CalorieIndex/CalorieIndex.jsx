import React, { useState, useEffect } from 'react';
import './CalorieIndex.css';

const CalorieIndex = () => {
  const [age, setAge] = useState('20');
  const [gender, setGender] = useState('女'); // Female as default
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('60');
  const [activityLevel, setActivityLevel] = useState('');
  const [bmr, setBmr] = useState(0);
  const [tdee, setTdee] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const calculateBMR = () => {
    // Harris-Benedict formula
    if (gender === '男') { // Male
      return 66 + (13.7 * parseFloat(weight)) + (5 * parseFloat(height)) - (6.8 * parseFloat(age));
    } else { // Female
      return 655 + (9.6 * parseFloat(weight)) + (1.8 * parseFloat(height)) - (4.7 * parseFloat(age));
    }
  };

  const calculateTDEE = (bmr) => {
    let activityMultiplier = 1.2; // Default: Sedentary
    
    switch(activityLevel) {
      case 'あまりしない・ほとんどしない':
        activityMultiplier = 1.375;
        break;
      case 'ちょっとする 1~3回/週':
        activityMultiplier = 1.55;
        break;
      case 'そこそこする 4~5回/週':
        activityMultiplier = 1.725;
        break;
      case 'とてもする 6~7回/週、それ以上':
        activityMultiplier = 1.9;
        break;
      default:
        activityMultiplier = 1.2;
    }
    
    return bmr * activityMultiplier;
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    
    // Kiểm tra xem đã chọn activity level chưa
    if (!activityLevel || activityLevel === '') {
      alert('Vui lòng chọn mức vận động (運動量)');
      return;
    }
    
    const calculatedBMR = calculateBMR();
    setBmr(calculatedBMR);
    setTdee(calculateTDEE(calculatedBMR));
    setShowResults(true);
  };

  const handleReset = () => {
    setAge('20');
    setGender('女');
    setHeight('170');
    setWeight('60');
    setActivityLevel('');
    setShowResults(false);
  };

  return (
    <div className="calorie-calculator-container">
      <h1 className="calculator-title">Lượng calo cơ thể cần trong ngày</h1>
      <div className="calculator-form-2col">
        {/* Cột trái */}
        <div className="form-left-col">
          <div className="form-row">
            <label htmlFor="age">年齢</label>
            <div className="input-wrapper">
              <input 
                type="number" 
                id="age" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row-gender">
            <label htmlFor="gender" style={{marginRight: '16px', minWidth: '40px', marginBottom: 0}}>性別</label>
            <div className="gender-options">
              <label className="radio-label">
                <input 
                  type="checkbox" 
                  name="gender" 
                  checked={gender === '女'}
                  onChange={() => setGender('女')}
                />
                女
              </label>
              <label className="radio-label">
                <input 
                  type="checkbox" 
                  name="gender" 
                  checked={gender === '男'}
                  onChange={() => setGender('男')}
                />
                男
              </label>
            </div>
          </div>
          <div className="form-row-2col">
            <div className="form-col">
              <label htmlFor="height">Chiều cao (身長)</label>
              <div className="input-wrapper">
                <input 
                  type="number" 
                  id="height" 
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
                <span className="unit">cm</span>
              </div>
            </div>
            <div className="form-col">
              <label htmlFor="activity">運動量</label>
              <div className="select-placeholder-wrapper">
                <select 
                  id="activity"
                  value={activityLevel === "" ? "__placeholder__" : activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="activity-select activity-select-large"
                >
                  <option value="__placeholder__" disabled hidden />
                  <option value="あまりしない・ほとんどしない">あまりしない: ほとんどしない</option>
                  <option value="ちょっとする 1~3回/週">ちょっとする: 1~3回/週</option>
                  <option value="そこそこする 4~5回/週">そこそこする: 4~5回/週</option>
                  <option value="とてもする 6~7回/週、それ以上">とてもする: 6~7回/週, それ以上</option>
                </select>
                {activityLevel === "" && (
                  <span className="select-placeholder-fake">ほとんどしない</span>
                )}
              </div>
            </div>
          </div>
          <div className="form-row">
            <label htmlFor="weight">Cân nặng (体重)</label>
            <div className="input-wrapper">
              <input 
                type="number" 
                id="weight" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <span className="unit">kg</span>
            </div>
          </div>
          <div className="button-group">
            <button type="button" onClick={handleCalculate} className="calculate-btn">計算</button>
            <button type="button" onClick={handleReset} className="reset-btn">リセット</button>
          </div>
          <div className="calculator-note">
            <p>Tính toán tham khảo công thức: https://www.calculator.net/bmr-calculator.html</p>
          </div>
        </div>
        {/* Cột phải */}
        <div className="form-right-col">
          {/* Nếu có danh sách mức vận động, render ở đây */}
        </div>
      </div>
      {/* Bọc results-section trong container để căn giữa */}
      <div className="container">
        {showResults && (
          <div className="results-section">
            <div className="total-calories">
              <h2>結果: {Math.round(tdee)} Calories/日 (TDEE = Calorie x BMR)</h2>
              <p>必要なカロリー: ~{Math.round(tdee)} Calories/ngày (100%) = 維持量</p>
            </div>
            <div className="results-inner-box">
              <div className="weight-scenarios">
                <div className="scenario-row">
                  <div className="scenario-box">
                    <h3>体重を少し(0.25kg)減らすなら...</h3>
                    <p>0.25kg/tuần</p>
                    <p>{Math.round(tdee * 0.85)} Calories/ngày (85%)</p>
                  </div>
                  <div className="scenario-box">
                    <h3>体重をそこそこ(0.5kg)減らすなら...</h3>
                    <p>0.5kg/tuần</p>
                    <p>{Math.round(tdee * 0.7)} Calories/ngày (70%)</p>
                  </div>
                  <div className="scenario-box">
                    <h3>体重をとても(1kg)減らすなら...</h3>
                    <p>1kg/tuần</p>
                    <p>{Math.round(tdee * 0.41)} Calories/ngày (41%)</p>
                  </div>
                </div>
                <div className="scenario-row">
                  <div className="scenario-box">
                    <h3>体重を少し(0.25kg)増やすなら...</h3>
                    <p>0.25kg/tuần</p>
                    <p>{Math.round(tdee * 1.15)} Calories/ngày (115%)</p>
                  </div>
                  <div className="scenario-box">
                    <h3>体重をそこそこ(0.5kg)増やすなら...</h3>
                    <p>0.5kg/tuần</p>
                    <p>{Math.round(tdee * 1.30)} Calories/ngày (130%)</p>
                  </div>
                  <div className="scenario-box">
                    <h3>体重をとても(1kg)増やすなら...</h3>
                    <p>1kg/tuần</p>
                    <p>{Math.round(tdee * 1.59)} Calories/ngày (159%)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalorieIndex;