import React, { createContext, useContext, useState } from 'react';

const FoodContext = createContext();

export const useFoodContext = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error('useFoodContext must be used within a FoodProvider');
  }
  return context;
};

export const FoodProvider = ({ children }) => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodVariations, setFoodVariations] = useState([]);
  const [isFoodDetailOpen, setIsFoodDetailOpen] = useState(false);
  const [showVariationsInMain, setShowVariationsInMain] = useState(false);
  const [shouldSwitchToMenuTab, setShouldSwitchToMenuTab] = useState(false);

  // Hàm xử lý khi user click vào thực phẩm trong sidebar
  const handleFoodClick = (food) => {
    setSelectedFood(food);
    
    // Tìm các biến thể của thực phẩm này
    const variations = getFoodVariations(food);
    setFoodVariations(variations);
    
    // Đánh dấu cần chuyển sang tab Menu List
    setShouldSwitchToMenuTab(true);
    setShowVariationsInMain(true);
    setIsFoodDetailOpen(false);
  };

  // Hàm tìm các biến thể của thực phẩm
  const getFoodVariations = (selectedFood) => {
    if (!selectedFood) return [];

    const variations = {
      // Meat variations
      'Chicken (raw)': [
        { id: 'chicken_breast', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },
        { id: 'chicken_thigh', name: 'Chicken Thigh', calories: 209, protein: 26, carbs: 0, fat: 12, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
        { id: 'chicken_wings', name: 'Chicken Wings', calories: 290, protein: 27, carbs: 0, fat: 19, image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop' },
        { id: 'grilled_chicken', name: 'Grilled Chicken', calories: 165, protein: 31, carbs: 0, fat: 3.6, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
        { id: 'fried_chicken', name: 'Fried Chicken', calories: 335, protein: 23, carbs: 15, fat: 21, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' }
      ],
      'Pork (raw)': [
        { id: 'pork_chop', name: 'Pork Chop', calories: 231, protein: 26, carbs: 0, fat: 14, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
        { id: 'pork_belly', name: 'Pork Belly', calories: 518, protein: 9, carbs: 0, fat: 53, image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop' },
        { id: 'pork_loin', name: 'Pork Loin', calories: 143, protein: 26, carbs: 0, fat: 4, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
        { id: 'bacon', name: 'Bacon', calories: 541, protein: 37, carbs: 1.4, fat: 42, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },
        { id: 'ham', name: 'Ham', calories: 145, protein: 21, carbs: 1.5, fat: 6, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' }
      ],
      'Beef (raw)': [
        { id: 'beef_steak', name: 'Beef Steak', calories: 271, protein: 26, carbs: 0, fat: 18, image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop' },
        { id: 'ground_beef', name: 'Ground Beef', calories: 332, protein: 23, carbs: 0, fat: 27, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
        { id: 'beef_roast', name: 'Beef Roast', calories: 250, protein: 26, carbs: 0, fat: 15, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },
        { id: 'beef_burger', name: 'Beef Burger', calories: 295, protein: 17, carbs: 30, fat: 12, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
        { id: 'beef_stir_fry', name: 'Beef Stir Fry', calories: 180, protein: 22, carbs: 8, fat: 8, image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop' }
      ],
      'Salmon (raw)': [
        { id: 'salmon_fillet', name: 'Salmon Fillet', calories: 208, protein: 25, carbs: 0, fat: 12, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
        { id: 'grilled_salmon', name: 'Grilled Salmon', calories: 208, protein: 25, carbs: 0, fat: 12, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },
        { id: 'baked_salmon', name: 'Baked Salmon', calories: 206, protein: 25, carbs: 0, fat: 12, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
        { id: 'salmon_sushi', name: 'Salmon Sushi', calories: 150, protein: 20, carbs: 25, fat: 2, image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop' },
        { id: 'smoked_salmon', name: 'Smoked Salmon', calories: 117, protein: 18, carbs: 0, fat: 4, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' }
      ],
      'Tuna (raw)': [
        { id: 'tuna_steak', name: 'Tuna Steak', calories: 144, protein: 30, carbs: 0, fat: 1, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },
        { id: 'canned_tuna', name: 'Canned Tuna', calories: 116, protein: 26, carbs: 0, fat: 1, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
        { id: 'tuna_salad', name: 'Tuna Salad', calories: 180, protein: 20, carbs: 5, fat: 10, image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop' },
        { id: 'tuna_sushi', name: 'Tuna Sushi', calories: 150, protein: 20, carbs: 25, fat: 2, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
        { id: 'seared_tuna', name: 'Seared Tuna', calories: 144, protein: 30, carbs: 0, fat: 1, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' }
      ],
      'Egg (chicken)': [
        { id: 'scrambled_eggs', name: 'Scrambled Eggs', calories: 155, protein: 13, carbs: 1.1, fat: 11, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
        { id: 'fried_egg', name: 'Fried Egg', calories: 90, protein: 6, carbs: 0.4, fat: 7, image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop' },
        { id: 'boiled_egg', name: 'Boiled Egg', calories: 78, protein: 6, carbs: 0.6, fat: 5, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
        { id: 'poached_egg', name: 'Poached Egg', calories: 74, protein: 6, carbs: 0.4, fat: 5, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },
        { id: 'omelette', name: 'Omelette', calories: 154, protein: 11, carbs: 2, fat: 12, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' }
      ],

      // Vietnamese dishes variations
      'Phở Bò': [
        { id: 'pho_tai', name: 'Phở Tái', calories: 350, protein: 25, carbs: 45, fat: 8, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
        { id: 'pho_chin', name: 'Phở Chín', calories: 380, protein: 28, carbs: 45, fat: 10, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },
        { id: 'pho_dac_biet', name: 'Phở Đặc Biệt', calories: 420, protein: 32, carbs: 45, fat: 12, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
        { id: 'pho_ga', name: 'Phở Gà', calories: 320, protein: 22, carbs: 45, fat: 6, image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop' },
        { id: 'pho_chay', name: 'Phở Chay', calories: 280, protein: 8, carbs: 50, fat: 4, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' }
      ],
      'Bún Bò Huế': [
        { id: 'bun_bo_tai', name: 'Bún Bò Tái', calories: 380, protein: 28, carbs: 50, fat: 10, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },
        { id: 'bun_bo_chin', name: 'Bún Bò Chín', calories: 410, protein: 30, carbs: 50, fat: 12, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
        { id: 'bun_bo_dac_biet', name: 'Bún Bò Đặc Biệt', calories: 450, protein: 35, carbs: 50, fat: 14, image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop' },
        { id: 'bun_bo_chay', name: 'Bún Bò Chay', calories: 320, protein: 12, carbs: 55, fat: 6, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
        { id: 'bun_bo_spicy', name: 'Bún Bò Cay', calories: 420, protein: 30, carbs: 50, fat: 12, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' }
      ],
      'Cơm Tấm': [
        { id: 'com_tam_suon', name: 'Cơm Tấm Sườn', calories: 450, protein: 25, carbs: 55, fat: 15, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
        { id: 'com_tam_ga', name: 'Cơm Tấm Gà', calories: 380, protein: 22, carbs: 55, fat: 10, image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop' },
        { id: 'com_tam_cha', name: 'Cơm Tấm Chả', calories: 420, protein: 20, carbs: 55, fat: 12, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
        { id: 'com_tam_dac_biet', name: 'Cơm Tấm Đặc Biệt', calories: 520, protein: 30, carbs: 55, fat: 18, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },
        { id: 'com_tam_chay', name: 'Cơm Tấm Chay', calories: 350, protein: 12, carbs: 60, fat: 8, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' }
      ],
      'Bánh Mì': [
        { id: 'banh_mi_thit', name: 'Bánh Mì Thịt', calories: 320, protein: 15, carbs: 45, fat: 10, image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop' },
        { id: 'banh_mi_ga', name: 'Bánh Mì Gà', calories: 280, protein: 12, carbs: 45, fat: 8, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
        { id: 'banh_mi_trung', name: 'Bánh Mì Trứng', calories: 250, protein: 10, carbs: 45, fat: 6, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },
        { id: 'banh_mi_chay', name: 'Bánh Mì Chay', calories: 220, protein: 8, carbs: 45, fat: 4, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
        { id: 'banh_mi_dac_biet', name: 'Bánh Mì Đặc Biệt', calories: 380, protein: 18, carbs: 45, fat: 12, image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop' }
      ],

      // International dishes variations
      'Pizza Margherita': [
        { id: 'pizza_margherita_classic', name: 'Pizza Margherita Classic', calories: 266, protein: 11, carbs: 33, fat: 10, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
        { id: 'pizza_margherita_thin', name: 'Pizza Margherita Thin Crust', calories: 220, protein: 10, carbs: 25, fat: 8, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },
        { id: 'pizza_margherita_deep', name: 'Pizza Margherita Deep Dish', calories: 320, protein: 12, carbs: 40, fat: 12, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
        { id: 'pizza_margherita_gluten', name: 'Pizza Margherita Gluten-Free', calories: 240, protein: 10, carbs: 28, fat: 9, image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop' },
        { id: 'pizza_margherita_vegan', name: 'Pizza Margherita Vegan', calories: 200, protein: 8, carbs: 30, fat: 6, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' }
      ],
      'Hamburger': [
        { id: 'hamburger_classic', name: 'Classic Hamburger', calories: 354, protein: 17, carbs: 30, fat: 17, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },
        { id: 'hamburger_cheese', name: 'Cheeseburger', calories: 380, protein: 18, carbs: 30, fat: 20, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
        { id: 'hamburger_double', name: 'Double Hamburger', calories: 450, protein: 25, carbs: 30, fat: 25, image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop' },
        { id: 'hamburger_veggie', name: 'Veggie Burger', calories: 280, protein: 12, carbs: 35, fat: 10, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
        { id: 'hamburger_chicken', name: 'Chicken Burger', calories: 320, protein: 20, carbs: 30, fat: 12, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' }
      ],
      'Pasta Carbonara': [
        { id: 'pasta_carbonara_classic', name: 'Classic Carbonara', calories: 400, protein: 15, carbs: 45, fat: 18, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
        { id: 'pasta_carbonara_light', name: 'Light Carbonara', calories: 280, protein: 12, carbs: 40, fat: 10, image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop' },
        { id: 'pasta_carbonara_vegan', name: 'Vegan Carbonara', calories: 250, protein: 8, carbs: 45, fat: 6, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
        { id: 'pasta_carbonara_seafood', name: 'Seafood Carbonara', calories: 350, protein: 18, carbs: 45, fat: 12, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' },
        { id: 'pasta_carbonara_mushroom', name: 'Mushroom Carbonara', calories: 320, protein: 10, carbs: 45, fat: 12, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' }
      ],

      // Rice variations
      'White Rice (cooked)': [
        { id: 'white_rice_steamed', name: 'Steamed White Rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop' },
        { id: 'white_rice_fried', name: 'Fried White Rice', calories: 180, protein: 3, carbs: 30, fat: 5, image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop' },
        { id: 'white_rice_sticky', name: 'Sticky White Rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop' },
        { id: 'white_rice_sushi', name: 'Sushi Rice', calories: 140, protein: 2.7, carbs: 30, fat: 0.3, image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop' },
        { id: 'white_rice_risotto', name: 'Risotto Rice', calories: 150, protein: 3, carbs: 32, fat: 0.5, image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop' }
      ],
      'Brown Rice (cooked)': [
        { id: 'brown_rice_steamed', name: 'Steamed Brown Rice', calories: 110, protein: 2.5, carbs: 23, fat: 0.9, image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop' },
        { id: 'brown_rice_fried', name: 'Fried Brown Rice', calories: 160, protein: 3, carbs: 25, fat: 5, image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop' },
        { id: 'brown_rice_pilaf', name: 'Brown Rice Pilaf', calories: 140, protein: 3, carbs: 25, fat: 3, image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop' },
        { id: 'brown_rice_salad', name: 'Brown Rice Salad', calories: 120, protein: 2.5, carbs: 23, fat: 2, image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop' },
        { id: 'brown_rice_bowl', name: 'Brown Rice Bowl', calories: 150, protein: 4, carbs: 25, fat: 4, image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop' }
      ],

      // Vegetable variations
      'Broccoli (raw)': [
        { id: 'broccoli_steamed', name: 'Steamed Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop' },
        { id: 'broccoli_roasted', name: 'Roasted Broccoli', calories: 70, protein: 3.7, carbs: 11, fat: 2, image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop' },
        { id: 'broccoli_stir_fry', name: 'Stir-Fried Broccoli', calories: 60, protein: 3.7, carbs: 11, fat: 1, image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
        { id: 'broccoli_soup', name: 'Broccoli Soup', calories: 80, protein: 4, carbs: 12, fat: 2, image_url: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&h=300&fit=crop' },
        { id: 'broccoli_salad', name: 'Broccoli Salad', calories: 50, protein: 3.7, carbs: 10, fat: 1, image_url: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&h=300&fit=crop' }
      ],
      'Spinach (raw)': [
        { id: 'spinach_sauteed', name: 'Sautéed Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop' },
        { id: 'spinach_salad', name: 'Spinach Salad', calories: 20, protein: 2.9, carbs: 3.6, fat: 0.4, image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop' },
        { id: 'spinach_smoothie', name: 'Spinach Smoothie', calories: 30, protein: 3, carbs: 5, fat: 0.5, image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
        { id: 'spinach_dip', name: 'Spinach Dip', calories: 80, protein: 3, carbs: 4, fat: 6, image_url: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&h=300&fit=crop' },
        { id: 'spinach_soup', name: 'Spinach Soup', calories: 40, protein: 3, carbs: 5, fat: 1, image_url: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&h=300&fit=crop' }
      ],

      // Fruit variations
      'Apples (raw)': [
        { id: 'apple_red', name: 'Red Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, image_url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop' },
        { id: 'apple_green', name: 'Green Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, image_url: 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=400&h=300&fit=crop' },
        { id: 'apple_pie', name: 'Apple Pie', calories: 237, protein: 2.4, carbs: 34, fat: 11, image_url: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop' },
        { id: 'apple_sauce', name: 'Apple Sauce', calories: 68, protein: 0.2, carbs: 18, fat: 0.2, image_url: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop' },
        { id: 'apple_juice', name: 'Apple Juice', calories: 46, protein: 0.1, carbs: 11, fat: 0.1, image_url: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop' }
      ],
      'Bananas (raw)': [
        { id: 'banana_yellow', name: 'Yellow Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, image_url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop' },
        { id: 'banana_green', name: 'Green Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, image_url: 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=400&h=300&fit=crop' },
        { id: 'banana_bread', name: 'Banana Bread', calories: 158, protein: 2.5, carbs: 25, fat: 6, image_url: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop' },
        { id: 'banana_smoothie', name: 'Banana Smoothie', calories: 120, protein: 2, carbs: 25, fat: 1, image_url: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop' },
        { id: 'banana_chips', name: 'Banana Chips', calories: 147, protein: 1.4, carbs: 18, fat: 8, image_url: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop' }
      ]
    };

    // Return variations for the selected food, or default to original food if no variations found
    return variations[selectedFood.name] || [
      {
        id: selectedFood.id,
        name: selectedFood.name,
        calories: selectedFood.calories,
        protein: selectedFood.protein || 0,
        carbs: selectedFood.carbs || 0,
        fat: selectedFood.fat || 0,
        image_url: selectedFood.image_url
      }
    ];
  };

  // Hàm đóng detail view
  const closeFoodDetail = () => {
    setIsFoodDetailOpen(false);
    setSelectedFood(null);
    setFoodVariations([]);
  };

  // Hàm mở modal chi tiết
  const openFoodDetail = (food) => {
    setSelectedFood(food);
    setIsFoodDetailOpen(true);
  };

  // Hàm đóng variations trong main content
  const closeVariationsInMain = () => {
    setShowVariationsInMain(false);
    setSelectedFood(null);
    setFoodVariations([]);
    setShouldSwitchToMenuTab(false);
  };

  // Hàm reset trạng thái chuyển tab
  const resetTabSwitch = () => {
    setShouldSwitchToMenuTab(false);
  };

  const value = {
    selectedFood,
    foodVariations,
    isFoodDetailOpen,
    showVariationsInMain,
    shouldSwitchToMenuTab,
    handleFoodClick,
    closeFoodDetail,
    openFoodDetail,
    closeVariationsInMain,
    resetTabSwitch,
    getFoodVariations
  };

  return (
    <FoodContext.Provider value={value}>
      {children}
    </FoodContext.Provider>
  );
}; 