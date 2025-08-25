// Utility to update food images through API
const API_BASE_URL = 'http://localhost:3000/api';

const fallbackImages = {
  1: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop', // Meat
  2: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop', // Vegetables
  3: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop', // Fruits
  4: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop', // Grains
  5: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop', // Dairy
  6: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'  // Snacks
};

export const getFallbackImage = (categoryId) => {
  return fallbackImages[categoryId] || fallbackImages[1];
};

export const updateFoodImages = async () => {
  try {
    // This would be called from an admin panel or development tool
    console.log('Updating food images...');
    
    // For now, we'll just return the fallback images mapping
    return fallbackImages;
  } catch (error) {
    console.error('Error updating food images:', error);
    return fallbackImages;
  }
};
