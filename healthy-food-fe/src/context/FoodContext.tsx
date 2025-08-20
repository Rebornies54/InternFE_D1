import { createContext, useContext, useState, type ReactNode } from 'react';
import { FoodItem, FoodContextType, PendingFoodItem } from '../types';

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const useFoodContext = (): FoodContextType => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error('useFoodContext must be used within a FoodProvider');
  }
  return context;
};

interface FoodProviderProps {
  children: ReactNode;
}

export const FoodProvider: React.FC<FoodProviderProps> = ({ children }: { children: ReactNode }) => {
  const [pendingFoods, setPendingFoods] = useState<PendingFoodItem[]>([]);

  const addToPendingFoods = (food: FoodItem, quantity: number = 1): void => {
    const existingFood = pendingFoods.find((item: PendingFoodItem) => item.id === food.id);
    if (existingFood) {
      setPendingFoods(pendingFoods.map((item: PendingFoodItem) => 
        item.id === food.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setPendingFoods([...pendingFoods, { ...food, quantity }]);
    }
  };

  const removeFromPendingFoods = (foodId: number): void => {
    setPendingFoods(pendingFoods.filter((item: PendingFoodItem) => item.id !== foodId));
  };

  const updatePendingFoodQuantity = (foodId: number, quantity: number): void => {
    if (quantity <= 0) {
      removeFromPendingFoods(foodId);
    } else {
      setPendingFoods(pendingFoods.map((item: PendingFoodItem) => 
        item.id === foodId ? { ...item, quantity } : item
      ));
    }
  };

  const clearPendingFoods = (): void => {
    setPendingFoods([]);
  };

  const getPendingTotalCalories = (): number => {
    if (!pendingFoods || pendingFoods.length === 0) return 0;
    return pendingFoods.reduce((total: number, food: PendingFoodItem) => {
      return total + (food.calories * food.quantity);
    }, 0);
  };

  const value: FoodContextType = {
    pendingFoods,
    addToPendingFoods,
    removeFromPendingFoods,
    updatePendingFoodQuantity,
    clearPendingFoods,
    getPendingTotalCalories
  };

  return (
    <FoodContext.Provider value={value}>
      {children}
    </FoodContext.Provider>
  );
};
