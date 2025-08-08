CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    gender ENUM('male', 'female', 'other'),
    birthday DATE,
    province VARCHAR(100),
    district VARCHAR(100),
    address TEXT,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Food categories table
CREATE TABLE IF NOT EXISTS food_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food items table
CREATE TABLE IF NOT EXISTS food_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) DEFAULT '100g',
    calories DECIMAL(8,2) NOT NULL,
    protein DECIMAL(8,2) DEFAULT 0,
    fat DECIMAL(8,2) DEFAULT 0,
    carbs DECIMAL(8,2) DEFAULT 0,
    fiber DECIMAL(8,2) DEFAULT 0,
    image_url VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES food_categories(id) ON DELETE CASCADE
);

-- User food logs table
CREATE TABLE IF NOT EXISTS user_food_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    food_item_id INT NOT NULL,
    quantity DECIMAL(8,2) NOT NULL,
    calories DECIMAL(8,2) NOT NULL,
    log_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE
);

-- User BMI data table
CREATE TABLE IF NOT EXISTS user_bmi_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    height DECIMAL(5,2) NOT NULL, -- in cm
    weight DECIMAL(5,2) NOT NULL, -- in kg
    bmi DECIMAL(4,2) NOT NULL,
    bmi_category ENUM('underweight', 'normal', 'overweight', 'obese') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_bmi (user_id)
);

-- Insert default food categories
INSERT INTO food_categories (name, description) VALUES
('Meat / Eggs / Seafood', 'Meat, poultry, eggs, fish and seafood products'),
('Vegetables & Legumes', 'Fresh vegetables, legumes and pulses'),
('Fruits', 'Fresh fruits and dried fruits'),
('Grains / Cereals / Breads', 'Cereals, grains, breads and pasta'),
('Beverages & Dairy Products', 'Milk, dairy products and beverages'),
('Snacks & Processed Foods', 'Snacks, processed foods and convenience foods');

-- Insert sample food items based on FAO data
INSERT INTO food_items (category_id, name, unit, calories, protein, fat, carbs) VALUES
-- Meat / Eggs / Seafood
(1, 'Chicken (raw)', '100g', 239, 23.0, 14.0, 0.0),
(1, 'Pork (raw)', '100g', 242, 27.0, 14.0, 0.0),
(1, 'Beef (raw)', '100g', 250, 26.0, 15.0, 0.0),
(1, 'Egg (chicken)', '100g', 155, 13.0, 11.0, 1.0),
(1, 'Salmon (raw)', '100g', 208, 20.0, 13.0, 0.0),
(1, 'Tuna (raw)', '100g', 144, 23.0, 5.0, 0.0),
(1, 'Shrimp (raw)', '100g', 99, 24.0, 0.3, 0.2),
(1, 'Cod (raw)', '100g', 82, 18.0, 0.7, 0.0),
(1, 'Turkey (raw)', '100g', 189, 29.0, 7.0, 0.0),
(1, 'Duck (raw)', '100g', 337, 19.0, 28.0, 0.0),

-- Vegetables & Legumes
(2, 'Broccoli (raw)', '100g', 34, 2.8, 0.4, 7.0),
(2, 'Spinach (raw)', '100g', 23, 2.9, 0.4, 3.6),
(2, 'Carrots (raw)', '100g', 41, 0.9, 0.2, 10.0),
(2, 'Tomatoes (raw)', '100g', 18, 0.9, 0.2, 3.9),
(2, 'Potatoes (raw)', '100g', 77, 2.0, 0.1, 17.0),
(2, 'Onions (raw)', '100g', 40, 1.1, 0.1, 9.0),
(2, 'Bell Peppers (raw)', '100g', 20, 0.9, 0.2, 4.6),
(2, 'Cucumber (raw)', '100g', 16, 0.7, 0.1, 3.6),
(2, 'Lentils (cooked)', '100g', 116, 9.0, 0.4, 20.0),
(2, 'Chickpeas (cooked)', '100g', 164, 9.0, 2.6, 27.0),

-- Fruits
(3, 'Apples (raw)', '100g', 52, 0.3, 0.2, 14.0),
(3, 'Bananas (raw)', '100g', 89, 1.1, 0.3, 23.0),
(3, 'Oranges (raw)', '100g', 47, 0.9, 0.1, 12.0),
(3, 'Strawberries (raw)', '100g', 32, 0.7, 0.3, 8.0),
(3, 'Grapes (raw)', '100g', 62, 0.6, 0.2, 16.0),
(3, 'Pineapple (raw)', '100g', 50, 0.5, 0.1, 13.0),
(3, 'Mango (raw)', '100g', 60, 0.8, 0.4, 15.0),
(3, 'Watermelon (raw)', '100g', 30, 0.6, 0.2, 8.0),
(3, 'Peaches (raw)', '100g', 39, 0.9, 0.3, 10.0),
(3, 'Pears (raw)', '100g', 57, 0.4, 0.1, 15.0),

-- Grains / Cereals / Breads
(4, 'White Rice (cooked)', '100g', 130, 2.7, 0.3, 28.0),
(4, 'Brown Rice (cooked)', '100g', 111, 2.6, 0.9, 23.0),
(4, 'Whole Wheat Bread', '100g', 247, 13.0, 4.2, 41.0),
(4, 'White Bread', '100g', 265, 9.0, 3.2, 49.0),
(4, 'Oatmeal (cooked)', '100g', 68, 2.4, 1.4, 12.0),
(4, 'Pasta (cooked)', '100g', 131, 5.0, 1.1, 25.0),
(4, 'Quinoa (cooked)', '100g', 120, 4.4, 1.9, 22.0),
(4, 'Corn (cooked)', '100g', 86, 3.2, 1.2, 19.0),
(4, 'Barley (cooked)', '100g', 123, 2.3, 0.4, 28.0),
(4, 'Buckwheat (cooked)', '100g', 92, 3.4, 0.6, 20.0),

-- Beverages & Dairy Products
(5, 'Whole Milk', '100g', 61, 3.2, 3.3, 4.8),
(5, 'Skim Milk', '100g', 42, 3.4, 0.1, 5.0),
(5, 'Yogurt (plain)', '100g', 59, 10.0, 0.4, 3.6),
(5, 'Cheese (cheddar)', '100g', 403, 25.0, 33.0, 1.3),
(5, 'Butter', '100g', 717, 0.9, 81.0, 0.1),
(5, 'Orange Juice', '100g', 45, 0.7, 0.2, 10.0),
(5, 'Apple Juice', '100g', 46, 0.1, 0.1, 11.0),
(5, 'Coffee (black)', '100g', 2, 0.3, 0.0, 0.0),
(5, 'Tea (black)', '100g', 1, 0.0, 0.0, 0.0),
(5, 'Coconut Milk', '100g', 230, 2.3, 24.0, 6.0),

-- Snacks & Processed Foods
(6, 'Potato Chips', '100g', 536, 7.0, 35.0, 53.0),
(6, 'Popcorn (air-popped)', '100g', 375, 11.0, 4.0, 74.0),
(6, 'Chocolate (dark)', '100g', 546, 4.9, 31.0, 61.0),
(6, 'Ice Cream (vanilla)', '100g', 207, 3.5, 11.0, 24.0),
(6, 'Cookies (chocolate chip)', '100g', 502, 5.0, 25.0, 63.0),
(6, 'Cake (chocolate)', '100g', 371, 5.0, 15.0, 53.0),
(6, 'Pizza (cheese)', '100g', 266, 11.0, 10.0, 33.0),
(6, 'Hamburger (fast food)', '100g', 295, 17.0, 12.0, 30.0),
(6, 'French Fries', '100g', 312, 3.4, 15.0, 41.0),
(6, 'Soda (cola)', '100g', 42, 0.0, 0.0, 11.0);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content LONGTEXT NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Blog post likes table
CREATE TABLE IF NOT EXISTS blog_post_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_post_like (user_id, post_id)
);

-- Blog comments table
CREATE TABLE IF NOT EXISTS blog_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_id INT NULL,
    content TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES blog_comments(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id)
);

-- Blog comment likes table
CREATE TABLE IF NOT EXISTS blog_comment_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    comment_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES blog_comments(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_comment_like (user_id, comment_id)
);

-- Insert sample users for blog posts
INSERT INTO users (id, name, email, password, phone, gender, birthday, province, district, address, avatar_url) VALUES
(1, 'Admin User', 'admin@healthyfood.com', '$2b$10$rQZ8K9mN2pL4vX7yJ1hF3sA6bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA0bB1cD2eF3gH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ', '0123456789', 'male', '1990-01-01', 'Hà Nội', 'Cầu Giấy', '123 Đường ABC', NULL);

-- Insert sample blog posts
INSERT INTO blog_posts (user_id, title, description, content, category, likes_count) VALUES
(1, 'Khoai tây - Nguồn vitamin C dồi dào', 'Khoai tây chứa hàm lượng vitamin C cao...', 'Khoai tây thường bị đánh giá thấp về giá trị dinh dưỡng, nhưng thực tế chúng chứa nhiều vitamin và khoáng chất quan trọng. Một củ khoai tây cỡ trung bình cung cấp khoảng 27mg vitamin C, chiếm 30% nhu cầu hàng ngày của cơ thể. Ngoài ra, khoai tây còn chứa kali, vitamin B6 và chất xơ. Cách chế biến khoai tây cũng ảnh hưởng đến hàm lượng dinh dưỡng - nướng hoặc luộc sẽ giữ được nhiều vitamin hơn so với chiên.', 'thực phẩm', 15),
(1, 'Rau củ - Thực phẩm ít calo, nhiều dưỡng chất', 'Rau củ là lựa chọn tuyệt vời...', 'Rau củ là nền tảng của mọi chế độ ăn lành mạnh. Chúng cung cấp ít calo nhưng lại giàu vitamin, khoáng chất và chất xơ. Mỗi loại rau củ có những lợi ích riêng: cà rốt giàu beta-carotene tốt cho mắt, bông cải xanh chứa sulforaphane có tác dụng chống ung thư, cải bó xôi giàu sắt và canxi. Để tối ưu hóa dinh dưỡng, nên ăn đa dạng các loại rau củ với nhiều màu sắc khác nhau.', 'thực phẩm', 23),
(1, 'Nấm - Protein thực vật chất lượng cao', 'Giàu protein và ít calo...', 'Nấm không chỉ là một nguyên liệu ngon miệng mà còn là nguồn protein thực vật chất lượng cao. Chúng chứa tất cả 9 axit amin thiết yếu mà cơ thể cần. Nấm cũng giàu vitamin D, selenium và các chất chống oxy hóa. Một số loại nấm như shiitake còn có tác dụng tăng cường hệ miễn dịch. Nấm có thể thay thế thịt trong nhiều món ăn, giúp giảm lượng calo và chất béo bão hòa.', 'thực phẩm', 8),
(1, 'Cách xây dựng thực đơn cân bằng', 'Một thực đơn cân bằng giúp cung cấp đầy đủ dưỡng chất...', 'Thực đơn cân bằng lý tưởng nên bao gồm 50% rau củ và trái cây, 25% protein (thịt, cá, đậu), và 25% ngũ cốc nguyên hạt. Bữa sáng nên có protein và chất xơ để duy trì năng lượng. Bữa trưa cần đầy đủ các nhóm chất. Bữa tối nên nhẹ nhàng với nhiều rau củ. Uống đủ nước và hạn chế đồ ngọt, thức ăn nhanh. Lập kế hoạch bữa ăn trước để tránh ăn uống thiếu cân bằng.', 'thực đơn', 31),
(1, 'Bí quyết ăn uống cân bằng khi bận rộn', 'Duy trì chế độ ăn lành mạnh ngay cả khi lịch trình bận rộn...', 'Cuộc sống bận rộn không phải là lý do để từ bỏ ăn uống lành mạnh. Chuẩn bị bữa ăn vào cuối tuần, sử dụng nồi nấu chậm, và dự trữ thực phẩm đông lạnh là những cách hiệu quả. Luôn mang theo đồ ăn nhẹ lành mạnh như hạt, trái cây. Chọn nhà hàng có menu lành mạnh khi ăn ngoài. Sử dụng ứng dụng theo dõi dinh dưỡng để đảm bảo cân bằng. Nhớ rằng một bữa ăn không lành mạnh không làm hỏng cả chế độ ăn.', 'bí quyết', 19),
(1, 'Thủy phân cơ thể - Tầm quan trọng của nước', 'Uống đủ nước không chỉ giúp duy trì sức khỏe...', 'Nước đóng vai trò thiết yếu trong mọi chức năng của cơ thể: vận chuyển chất dinh dưỡng, điều hòa nhiệt độ, thải độc tố. Người trưởng thành nên uống 2-3 lít nước mỗi ngày, tùy thuộc vào hoạt động thể chất và khí hậu. Dấu hiệu thiếu nước bao gồm khát, nước tiểu sẫm màu, mệt mỏi. Ngoài nước lọc, có thể bổ sung nước từ trái cây, rau củ và các loại trà thảo mộc.', 'bí quyết', 12);