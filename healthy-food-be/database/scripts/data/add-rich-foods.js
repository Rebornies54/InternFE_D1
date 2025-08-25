const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'healthy_food_db'
};

// Danh sách thực phẩm phong phú với ảnh đẹp
const richFoods = [
  // Category 1: Meat / Eggs / Seafood
  {
    category_id: 1,
    name: 'Grilled Salmon',
    unit: '100g',
    calories: 208,
    protein: 20.0,
    fat: 13.0,
    carbs: 0.0,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop'
  },
  {
    category_id: 1,
    name: 'Organic Chicken Breast',
    unit: '100g',
    calories: 165,
    protein: 31.0,
    fat: 3.6,
    carbs: 0.0,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop'
  },
  {
    category_id: 1,
    name: 'Fresh Shrimp',
    unit: '100g',
    calories: 99,
    protein: 24.0,
    fat: 0.3,
    carbs: 0.2,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop'
  },
  {
    category_id: 1,
    name: 'Free Range Eggs',
    unit: '100g',
    calories: 155,
    protein: 13.0,
    fat: 11.0,
    carbs: 1.0,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop'
  },
  {
    category_id: 1,
    name: 'Lean Beef Steak',
    unit: '100g',
    calories: 250,
    protein: 26.0,
    fat: 15.0,
    carbs: 0.0,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop'
  },
  {
    category_id: 1,
    name: 'Fresh Tuna',
    unit: '100g',
    calories: 144,
    protein: 23.0,
    fat: 5.0,
    carbs: 0.0,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop'
  },
  {
    category_id: 1,
    name: 'Organic Turkey',
    unit: '100g',
    calories: 189,
    protein: 29.0,
    fat: 7.0,
    carbs: 0.0,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop'
  },
  {
    category_id: 1,
    name: 'Fresh Cod Fish',
    unit: '100g',
    calories: 82,
    protein: 18.0,
    fat: 0.7,
    carbs: 0.0,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop'
  },

  // Category 2: Vegetables & Legumes
  {
    category_id: 2,
    name: 'Fresh Broccoli',
    unit: '100g',
    calories: 34,
    protein: 2.8,
    fat: 0.4,
    carbs: 7.0,
    fiber: 2.6,
    image_url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Organic Spinach',
    unit: '100g',
    calories: 23,
    protein: 2.9,
    fat: 0.4,
    carbs: 3.6,
    fiber: 2.2,
    image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Fresh Carrots',
    unit: '100g',
    calories: 41,
    protein: 0.9,
    fat: 0.2,
    carbs: 10.0,
    fiber: 2.8,
    image_url: 'https://images.unsplash.com/photo-1447175008436-170170753886?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Cherry Tomatoes',
    unit: '100g',
    calories: 18,
    protein: 0.9,
    fat: 0.2,
    carbs: 3.9,
    fiber: 1.2,
    image_url: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Sweet Bell Peppers',
    unit: '100g',
    calories: 20,
    protein: 0.9,
    fat: 0.2,
    carbs: 4.6,
    fiber: 1.7,
    image_url: 'https://images.unsplash.com/photo-1525607551316-5a1323a14c54?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Fresh Cucumber',
    unit: '100g',
    calories: 16,
    protein: 0.7,
    fat: 0.1,
    carbs: 3.6,
    fiber: 0.5,
    image_url: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Organic Kale',
    unit: '100g',
    calories: 49,
    protein: 4.3,
    fat: 0.9,
    carbs: 8.8,
    fiber: 3.6,
    image_url: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Fresh Asparagus',
    unit: '100g',
    calories: 20,
    protein: 2.2,
    fat: 0.1,
    carbs: 3.9,
    fiber: 2.1,
    image_url: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Organic Lentils',
    unit: '100g',
    calories: 116,
    protein: 9.0,
    fat: 0.4,
    carbs: 20.0,
    fiber: 7.9,
    image_url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Fresh Green Beans',
    unit: '100g',
    calories: 31,
    protein: 1.8,
    fat: 0.2,
    carbs: 7.0,
    fiber: 3.4,
    image_url: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Organic Cauliflower',
    unit: '100g',
    calories: 25,
    protein: 1.9,
    fat: 0.3,
    carbs: 5.0,
    fiber: 2.0,
    image_url: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3caa?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Fresh Mushrooms',
    unit: '100g',
    calories: 22,
    protein: 3.1,
    fat: 0.3,
    carbs: 3.3,
    fiber: 1.0,
    image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Organic Zucchini',
    unit: '100g',
    calories: 17,
    protein: 1.2,
    fat: 0.3,
    carbs: 3.1,
    fiber: 1.0,
    image_url: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3caa?w=400&h=300&fit=crop'
  },

  // Category 3: Fruits
  {
    category_id: 3,
    name: 'Fresh Strawberries',
    unit: '100g',
    calories: 32,
    protein: 0.7,
    fat: 0.3,
    carbs: 8.0,
    fiber: 2.0,
    image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Organic Blueberries',
    unit: '100g',
    calories: 57,
    protein: 0.7,
    fat: 0.3,
    carbs: 14.0,
    fiber: 2.4,
    image_url: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Fresh Raspberries',
    unit: '100g',
    calories: 52,
    protein: 1.2,
    fat: 0.7,
    carbs: 12.0,
    fiber: 6.5,
    image_url: 'https://images.unsplash.com/photo-1515589666096-d5c0b1865b22?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Organic Blackberries',
    unit: '100g',
    calories: 43,
    protein: 1.4,
    fat: 0.5,
    carbs: 10.0,
    fiber: 5.3,
    image_url: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Fresh Pineapple',
    unit: '100g',
    calories: 50,
    protein: 0.5,
    fat: 0.1,
    carbs: 13.0,
    fiber: 1.4,
    image_url: 'https://images.unsplash.com/photo-1550258987-190a62d4fa70?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Organic Mango',
    unit: '100g',
    calories: 60,
    protein: 0.8,
    fat: 0.4,
    carbs: 15.0,
    fiber: 1.6,
    image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Fresh Watermelon',
    unit: '100g',
    calories: 30,
    protein: 0.6,
    fat: 0.2,
    carbs: 8.0,
    fiber: 0.4,
    image_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Organic Avocado',
    unit: '100g',
    calories: 160,
    protein: 2.0,
    fat: 15.0,
    carbs: 9.0,
    fiber: 6.7,
    image_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Fresh Kiwi',
    unit: '100g',
    calories: 61,
    protein: 1.1,
    fat: 0.5,
    carbs: 15.0,
    fiber: 3.0,
    image_url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Organic Pomegranate',
    unit: '100g',
    calories: 83,
    protein: 1.7,
    fat: 1.2,
    carbs: 19.0,
    fiber: 4.0,
    image_url: 'https://images.unsplash.com/photo-1541344999733-bb4c6d910c8c?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Fresh Dragon Fruit',
    unit: '100g',
    calories: 60,
    protein: 1.1,
    fat: 0.0,
    carbs: 13.0,
    fiber: 1.1,
    image_url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Organic Passion Fruit',
    unit: '100g',
    calories: 97,
    protein: 2.2,
    fat: 0.7,
    carbs: 23.0,
    fiber: 10.4,
    image_url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=300&fit=crop'
  },

  // Category 4: Grains / Cereals / Breads
  {
    category_id: 4,
    name: 'Quinoa Bowl',
    unit: '100g',
    calories: 120,
    protein: 4.4,
    fat: 1.9,
    carbs: 22.0,
    fiber: 2.8,
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'
  },
  {
    category_id: 4,
    name: 'Steel Cut Oats',
    unit: '100g',
    calories: 68,
    protein: 2.4,
    fat: 1.4,
    carbs: 12.0,
    fiber: 1.7,
    image_url: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=400&h=300&fit=crop'
  },
  {
    category_id: 4,
    name: 'Whole Grain Bread',
    unit: '100g',
    calories: 247,
    protein: 13.0,
    fat: 4.2,
    carbs: 41.0,
    fiber: 7.0,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
  },
  {
    category_id: 4,
    name: 'Brown Rice',
    unit: '100g',
    calories: 111,
    protein: 2.6,
    fat: 0.9,
    carbs: 23.0,
    fiber: 1.8,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'
  },
  {
    category_id: 4,
    name: 'Whole Wheat Pasta',
    unit: '100g',
    calories: 131,
    protein: 5.0,
    fat: 1.1,
    carbs: 25.0,
    fiber: 3.2,
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop'
  },
  {
    category_id: 4,
    name: 'Buckwheat Groats',
    unit: '100g',
    calories: 92,
    protein: 3.4,
    fat: 0.6,
    carbs: 20.0,
    fiber: 2.7,
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'
  },
  {
    category_id: 4,
    name: 'Barley',
    unit: '100g',
    calories: 123,
    protein: 2.3,
    fat: 0.4,
    carbs: 28.0,
    fiber: 3.8,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'
  },
  {
    category_id: 4,
    name: 'Millet',
    unit: '100g',
    calories: 119,
    protein: 3.5,
    fat: 1.0,
    carbs: 23.0,
    fiber: 1.3,
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'
  },

  // Category 5: Beverages & Dairy Products
  {
    category_id: 5,
    name: 'Greek Yogurt',
    unit: '100g',
    calories: 59,
    protein: 10.0,
    fat: 0.4,
    carbs: 3.6,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop'
  },
  {
    category_id: 5,
    name: 'Almond Milk',
    unit: '100g',
    calories: 17,
    protein: 0.6,
    fat: 1.5,
    carbs: 0.6,
    fiber: 0.4,
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop'
  },
  {
    category_id: 5,
    name: 'Coconut Water',
    unit: '100g',
    calories: 19,
    protein: 0.7,
    fat: 0.2,
    carbs: 3.7,
    fiber: 1.1,
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop'
  },
  {
    category_id: 5,
    name: 'Green Tea',
    unit: '100g',
    calories: 1,
    protein: 0.0,
    fat: 0.0,
    carbs: 0.0,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop'
  },
  {
    category_id: 5,
    name: 'Fresh Orange Juice',
    unit: '100g',
    calories: 45,
    protein: 0.7,
    fat: 0.2,
    carbs: 10.0,
    fiber: 0.2,
    image_url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop'
  },
  {
    category_id: 5,
    name: 'Organic Cottage Cheese',
    unit: '100g',
    calories: 98,
    protein: 11.0,
    fat: 4.3,
    carbs: 3.4,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop'
  },
  {
    category_id: 5,
    name: 'Fresh Mozzarella',
    unit: '100g',
    calories: 280,
    protein: 28.0,
    fat: 17.0,
    carbs: 2.2,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop'
  },
  {
    category_id: 5,
    name: 'Organic Kefir',
    unit: '100g',
    calories: 64,
    protein: 3.8,
    fat: 3.6,
    carbs: 4.5,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop'
  },

  // Category 6: Snacks & Processed Foods (Healthy Options)
  {
    category_id: 6,
    name: 'Mixed Nuts',
    unit: '100g',
    calories: 607,
    protein: 20.0,
    fat: 54.0,
    carbs: 19.0,
    fiber: 7.0,
    image_url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop'
  },
  {
    category_id: 6,
    name: 'Dark Chocolate (70%)',
    unit: '100g',
    calories: 598,
    protein: 7.8,
    fat: 43.0,
    carbs: 45.0,
    fiber: 10.9,
    image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=300&fit=crop'
  },
  {
    category_id: 6,
    name: 'Air-Popped Popcorn',
    unit: '100g',
    calories: 375,
    protein: 11.0,
    fat: 4.0,
    carbs: 74.0,
    fiber: 15.0,
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
  },
  {
    category_id: 6,
    name: 'Organic Granola',
    unit: '100g',
    calories: 471,
    protein: 10.0,
    fat: 20.0,
    carbs: 64.0,
    fiber: 8.0,
    image_url: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=400&h=300&fit=crop'
  },
  {
    category_id: 6,
    name: 'Dried Cranberries',
    unit: '100g',
    calories: 308,
    protein: 0.1,
    fat: 1.4,
    carbs: 82.0,
    fiber: 5.7,
    image_url: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=300&fit=crop'
  },
  {
    category_id: 6,
    name: 'Organic Trail Mix',
    unit: '100g',
    calories: 462,
    protein: 12.0,
    fat: 35.0,
    carbs: 35.0,
    fiber: 8.0,
    image_url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop'
  },
  {
    category_id: 6,
    name: 'Rice Cakes',
    unit: '100g',
    calories: 387,
    protein: 7.0,
    fat: 3.0,
    carbs: 80.0,
    fiber: 3.0,
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'
  },
  {
    category_id: 6,
    name: 'Hummus',
    unit: '100g',
    calories: 166,
    protein: 7.9,
    fat: 9.6,
    carbs: 14.3,
    fiber: 6.0,
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'
  }
];

async function addRichFoods() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Connected to database successfully!');
    console.log(`📦 Adding ${richFoods.length} rich food items...`);
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const food of richFoods) {
      try {
        // Check if food already exists
        const [existing] = await connection.execute(
          'SELECT id FROM food_items WHERE name = ?',
          [food.name]
        );
        
        if (existing.length > 0) {
          console.log(`⏭️  Skipped: ${food.name} (already exists)`);
          skippedCount++;
          continue;
        }
        
        // Insert new food item
        await connection.execute(
          `INSERT INTO food_items 
           (category_id, name, unit, calories, protein, fat, carbs, fiber, image_url) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            food.category_id,
            food.name,
            food.unit,
            food.calories,
            food.protein,
            food.fat,
            food.carbs,
            food.fiber,
            food.image_url
          ]
        );
        
        console.log(`✅ Added: ${food.name}`);
        addedCount++;
        
      } catch (error) {
        console.error(`❌ Error adding ${food.name}:`, error.message);
      }
    }
    
    console.log('\n🎉 Summary:');
    console.log(`✅ Successfully added: ${addedCount} items`);
    console.log(`⏭️  Skipped (already exists): ${skippedCount} items`);
    console.log(`📊 Total processed: ${richFoods.length} items`);
    
    // Get total count
    const [totalResult] = await connection.execute('SELECT COUNT(*) as total FROM food_items');
    console.log(`📈 Total food items in database: ${totalResult[0].total}`);
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the script
addRichFoods().catch(console.error);
