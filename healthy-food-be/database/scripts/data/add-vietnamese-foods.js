const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'healthy_food_db'
};

// Danh sách thực phẩm Việt Nam truyền thống
const vietnameseFoods = [
  // Category 1: Meat / Eggs / Seafood
  {
    category_id: 1,
    name: 'Thịt Lợn Nạc',
    unit: '100g',
    calories: 242,
    protein: 27.0,
    fat: 14.0,
    carbs: 0.0,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop'
  },
  {
    category_id: 1,
    name: 'Thịt Bò Nạc',
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
    name: 'Thịt Gà Ta',
    unit: '100g',
    calories: 239,
    protein: 23.0,
    fat: 14.0,
    carbs: 0.0,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop'
  },
  {
    category_id: 1,
    name: 'Cá Hồi Việt',
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
    name: 'Tôm Sú',
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
    name: 'Cá Trắm',
    unit: '100g',
    calories: 82,
    protein: 18.0,
    fat: 0.7,
    carbs: 0.0,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop'
  },
  {
    category_id: 1,
    name: 'Trứng Gà Ta',
    unit: '100g',
    calories: 155,
    protein: 13.0,
    fat: 11.0,
    carbs: 1.0,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop'
  },

  // Category 2: Vegetables & Legumes
  {
    category_id: 2,
    name: 'Rau Muống',
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
    name: 'Rau Cải',
    unit: '100g',
    calories: 25,
    protein: 2.5,
    fat: 0.3,
    carbs: 4.2,
    fiber: 2.8,
    image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Rau Ngót',
    unit: '100g',
    calories: 30,
    protein: 3.2,
    fat: 0.4,
    carbs: 5.1,
    fiber: 3.1,
    image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Rau Dền',
    unit: '100g',
    calories: 23,
    protein: 2.5,
    fat: 0.3,
    carbs: 4.0,
    fiber: 2.5,
    image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Bí Đỏ',
    unit: '100g',
    calories: 26,
    protein: 1.0,
    fat: 0.1,
    carbs: 6.5,
    fiber: 0.5,
    image_url: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3caa?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Bí Xanh',
    unit: '100g',
    calories: 16,
    protein: 0.7,
    fat: 0.1,
    carbs: 3.6,
    fiber: 0.5,
    image_url: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3caa?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Đậu Phụ',
    unit: '100g',
    calories: 76,
    protein: 8.0,
    fat: 4.8,
    carbs: 1.9,
    fiber: 0.3,
    image_url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Đậu Xanh',
    unit: '100g',
    calories: 347,
    protein: 23.0,
    fat: 1.2,
    carbs: 63.0,
    fiber: 16.0,
    image_url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Đậu Đen',
    unit: '100g',
    calories: 341,
    protein: 21.0,
    fat: 1.4,
    carbs: 62.0,
    fiber: 15.0,
    image_url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Đậu Đỏ',
    unit: '100g',
    calories: 337,
    protein: 22.0,
    fat: 0.5,
    carbs: 61.0,
    fiber: 15.0,
    image_url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=300&fit=crop'
  },
  {
    category_id: 2,
    name: 'Măng Tây',
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
    name: 'Nấm Rơm',
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
    name: 'Nấm Hương',
    unit: '100g',
    calories: 34,
    protein: 2.2,
    fat: 0.5,
    carbs: 6.8,
    fiber: 2.5,
    image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop'
  },

  // Category 3: Fruits
  {
    category_id: 3,
    name: 'Xoài Cát Hòa Lộc',
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
    name: 'Nhãn Lồng',
    unit: '100g',
    calories: 60,
    protein: 1.1,
    fat: 0.1,
    carbs: 15.0,
    fiber: 1.1,
    image_url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Vải Thiều',
    unit: '100g',
    calories: 66,
    protein: 0.8,
    fat: 0.4,
    carbs: 17.0,
    fiber: 1.3,
    image_url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Chôm Chôm',
    unit: '100g',
    calories: 68,
    protein: 1.0,
    fat: 0.2,
    carbs: 17.0,
    fiber: 2.8,
    image_url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Sầu Riêng',
    unit: '100g',
    calories: 147,
    protein: 1.5,
    fat: 5.3,
    carbs: 27.0,
    fiber: 3.8,
    image_url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Măng Cụt',
    unit: '100g',
    calories: 73,
    protein: 0.6,
    fat: 0.6,
    carbs: 18.0,
    fiber: 1.8,
    image_url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Bưởi Da Xanh',
    unit: '100g',
    calories: 42,
    protein: 0.8,
    fat: 0.1,
    carbs: 11.0,
    fiber: 1.8,
    image_url: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Cam Sành',
    unit: '100g',
    calories: 47,
    protein: 0.9,
    fat: 0.1,
    carbs: 12.0,
    fiber: 2.4,
    image_url: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Quýt Hồng',
    unit: '100g',
    calories: 53,
    protein: 0.8,
    fat: 0.3,
    carbs: 13.0,
    fiber: 1.8,
    image_url: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Chuối Sứ',
    unit: '100g',
    calories: 89,
    protein: 1.1,
    fat: 0.3,
    carbs: 23.0,
    fiber: 2.6,
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop'
  },
  {
    category_id: 3,
    name: 'Dừa Tươi',
    unit: '100g',
    calories: 354,
    protein: 3.3,
    fat: 33.0,
    carbs: 15.0,
    fiber: 9.0,
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop'
  },

  // Category 4: Grains / Cereals / Breads
  {
    category_id: 4,
    name: 'Gạo Tám Thơm',
    unit: '100g',
    calories: 130,
    protein: 2.7,
    fat: 0.3,
    carbs: 28.0,
    fiber: 0.4,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'
  },
  {
    category_id: 4,
    name: 'Gạo Nếp',
    unit: '100g',
    calories: 145,
    protein: 2.7,
    fat: 0.3,
    carbs: 32.0,
    fiber: 0.4,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'
  },
  {
    category_id: 4,
    name: 'Bánh Mì Việt Nam',
    unit: '100g',
    calories: 265,
    protein: 9.0,
    fat: 3.2,
    carbs: 49.0,
    fiber: 2.5,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
  },
  {
    category_id: 4,
    name: 'Bún Tươi',
    unit: '100g',
    calories: 110,
    protein: 3.0,
    fat: 0.2,
    carbs: 23.0,
    fiber: 0.5,
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop'
  },
  {
    category_id: 4,
    name: 'Phở Tươi',
    unit: '100g',
    calories: 120,
    protein: 3.5,
    fat: 0.3,
    carbs: 25.0,
    fiber: 0.8,
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop'
  },
  {
    category_id: 4,
    name: 'Mì Gạo',
    unit: '100g',
    calories: 110,
    protein: 2.5,
    fat: 0.2,
    carbs: 24.0,
    fiber: 0.3,
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop'
  },
  {
    category_id: 4,
    name: 'Bánh Cuốn',
    unit: '100g',
    calories: 140,
    protein: 4.0,
    fat: 0.5,
    carbs: 28.0,
    fiber: 0.8,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
  },
  {
    category_id: 4,
    name: 'Bánh Chưng',
    unit: '100g',
    calories: 180,
    protein: 5.0,
    fat: 2.0,
    carbs: 35.0,
    fiber: 1.5,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
  },

  // Category 5: Beverages & Dairy Products
  {
    category_id: 5,
    name: 'Sữa Đậu Nành',
    unit: '100g',
    calories: 33,
    protein: 3.3,
    fat: 1.8,
    carbs: 2.8,
    fiber: 0.3,
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop'
  },
  {
    category_id: 5,
    name: 'Sữa Chua Dừa',
    unit: '100g',
    calories: 72,
    protein: 1.5,
    fat: 5.0,
    carbs: 5.0,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop'
  },
  {
    category_id: 5,
    name: 'Trà Xanh',
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
    name: 'Nước Mía',
    unit: '100g',
    calories: 50,
    protein: 0.0,
    fat: 0.0,
    carbs: 13.0,
    fiber: 0.0,
    image_url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop'
  },
  {
    category_id: 5,
    name: 'Nước Dừa Tươi',
    unit: '100g',
    calories: 19,
    protein: 0.7,
    fat: 0.2,
    carbs: 3.7,
    fiber: 1.1,
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop'
  },

  // Category 6: Snacks & Processed Foods
  {
    category_id: 6,
    name: 'Bánh Đậu Xanh',
    unit: '100g',
    calories: 320,
    protein: 8.0,
    fat: 12.0,
    carbs: 48.0,
    fiber: 3.0,
    image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=300&fit=crop'
  },
  {
    category_id: 6,
    name: 'Bánh Bèo',
    unit: '100g',
    calories: 150,
    protein: 3.0,
    fat: 1.0,
    carbs: 32.0,
    fiber: 1.0,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
  },
  {
    category_id: 6,
    name: 'Bánh Bột Lọc',
    unit: '100g',
    calories: 140,
    protein: 4.0,
    fat: 0.5,
    carbs: 28.0,
    fiber: 0.8,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
  },
  {
    category_id: 6,
    name: 'Chè Hạt Sen',
    unit: '100g',
    calories: 120,
    protein: 3.0,
    fat: 0.5,
    carbs: 25.0,
    fiber: 2.0,
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop'
  },
  {
    category_id: 6,
    name: 'Chè Đậu Xanh',
    unit: '100g',
    calories: 110,
    protein: 4.0,
    fat: 0.3,
    carbs: 22.0,
    fiber: 3.0,
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop'
  },
  {
    category_id: 6,
    name: 'Chè Ba Màu',
    unit: '100g',
    calories: 130,
    protein: 2.0,
    fat: 0.5,
    carbs: 28.0,
    fiber: 1.0,
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop'
  },
  {
    category_id: 6,
    name: 'Bánh Tét',
    unit: '100g',
    calories: 200,
    protein: 6.0,
    fat: 3.0,
    carbs: 38.0,
    fiber: 2.0,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
  },
  {
    category_id: 6,
    name: 'Bánh Dày',
    unit: '100g',
    calories: 160,
    protein: 4.0,
    fat: 0.5,
    carbs: 32.0,
    fiber: 1.0,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
  },
  {
    category_id: 6,
    name: 'Bánh Giò',
    unit: '100g',
    calories: 180,
    protein: 5.0,
    fat: 2.0,
    carbs: 35.0,
    fiber: 1.5,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
  },
  {
    category_id: 6,
    name: 'Bánh Tôm',
    unit: '100g',
    calories: 220,
    protein: 8.0,
    fat: 4.0,
    carbs: 38.0,
    fiber: 2.0,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
  }
];

async function addVietnameseFoods() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Connected to database successfully!');
    console.log(`📦 Adding ${vietnameseFoods.length} Vietnamese food items...`);
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const food of vietnameseFoods) {
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
    console.log(`📊 Total processed: ${vietnameseFoods.length} items`);
    
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
addVietnameseFoods().catch(console.error);
