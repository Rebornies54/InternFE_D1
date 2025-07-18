const { pool } = require('../../connection');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const addSampleBlogs = async () => {
  try {
    console.log('Adding sample blog posts...');
    
    const sampleBlogs = [
      {
        user_id: 1,
        title: 'Lợi ích của việc ăn rau xanh mỗi ngày',
        description: 'Rau xanh là nguồn dinh dưỡng quan trọng cho sức khỏe',
        content: `Rau xanh là một phần không thể thiếu trong chế độ ăn uống lành mạnh. Chúng chứa nhiều vitamin, khoáng chất và chất xơ cần thiết cho cơ thể.

Các loại rau xanh như cải bó xôi, cải xoăn, rau chân vịt chứa nhiều vitamin K, A, C và folate. Chúng cũng là nguồn cung cấp chất chống oxy hóa tự nhiên.

Ăn rau xanh thường xuyên có thể giúp:
- Tăng cường hệ miễn dịch
- Cải thiện sức khỏe tim mạch
- Hỗ trợ tiêu hóa
- Giảm nguy cơ mắc bệnh mãn tính

Hãy thêm rau xanh vào bữa ăn hàng ngày để có một cơ thể khỏe mạnh!`,
        category: 'Dinh dưỡng'
      },
      {
        user_id: 1,
        title: 'Hướng dẫn tính toán calo cho người mới bắt đầu',
        description: 'Cách tính toán calo cơ bản cho người tập gym',
        content: `Tính toán calo là bước đầu tiên quan trọng trong hành trình fitness. Hiểu được nhu cầu calo của cơ thể sẽ giúp bạn xây dựng chế độ ăn phù hợp.

Công thức tính BMR (Basal Metabolic Rate):
- Nam: BMR = 88.362 + (13.397 × cân nặng kg) + (4.799 × chiều cao cm) - (5.677 × tuổi)
- Nữ: BMR = 447.593 + (9.247 × cân nặng kg) + (3.098 × chiều cao cm) - (4.330 × tuổi)

Sau khi có BMR, nhân với hệ số hoạt động:
- Ít vận động: BMR × 1.2
- Vận động nhẹ: BMR × 1.375
- Vận động vừa: BMR × 1.55
- Vận động nhiều: BMR × 1.725
- Vận động rất nhiều: BMR × 1.9

Để giảm cân: Ăn ít hơn 500 calo so với nhu cầu
Để tăng cân: Ăn nhiều hơn 500 calo so với nhu cầu`,
        category: 'Fitness'
      },
      {
        user_id: 1,
        title: 'Top 10 thực phẩm giàu protein cho người tập gym',
        description: 'Danh sách các thực phẩm giàu protein tốt cho cơ bắp',
        content: `Protein là dưỡng chất quan trọng cho việc xây dựng và phục hồi cơ bắp. Dưới đây là 10 thực phẩm giàu protein hàng đầu:

1. Thịt gà (31g protein/100g)
   - Dễ tiêu hóa, ít chất béo
   - Phù hợp cho mọi chế độ ăn

2. Cá hồi (20g protein/100g)
   - Giàu omega-3
   - Tốt cho tim mạch

3. Trứng (13g protein/quả)
   - Protein hoàn chỉnh
   - Giá thành rẻ

4. Thịt bò nạc (26g protein/100g)
   - Giàu sắt và vitamin B12
   - Tốt cho người thiếu máu

5. Đậu nành (36g protein/100g)
   - Protein thực vật
   - Phù hợp cho người ăn chay

6. Sữa chua Hy Lạp (10g protein/100g)
   - Giàu probiotic
   - Tốt cho tiêu hóa

7. Hạnh nhân (21g protein/100g)
   - Giàu chất béo tốt
   - Tiện lợi để ăn vặt

8. Quinoa (14g protein/100g)
   - Protein hoàn chỉnh
   - Không chứa gluten

9. Cá ngừ (30g protein/100g)
   - Ít chất béo
   - Giàu vitamin D

10. Đậu lăng (9g protein/100g)
    - Giàu chất xơ
    - Giá thành rẻ

Hãy kết hợp các thực phẩm này vào chế độ ăn để đạt hiệu quả tối ưu!`,
        category: 'Dinh dưỡng'
      }
    ];
    
    console.log(`Adding ${sampleBlogs.length} sample blog posts...`);
    
    let successCount = 0;
    let skipCount = 0;
    
    for (const blog of sampleBlogs) {
      try {
        await pool.execute(
          'INSERT INTO blog_posts (user_id, title, description, content, category) VALUES (?, ?, ?, ?, ?)',
          [blog.user_id, blog.title, blog.description, blog.content, blog.category]
        );
        console.log(`Added blog: ${blog.title}`);
        successCount++;
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`Skipped (already exists): ${blog.title}`);
          skipCount++;
        } else {
          console.error(`Error adding blog ${blog.title}:`, error.message);
        }
      }
    }
    
    const [totalCount] = await pool.execute('SELECT COUNT(*) as count FROM blog_posts');
    console.log('\nSummary:');
    console.log(`   - Successfully added: ${successCount} blogs`);
    console.log(`   - Skipped (duplicates): ${skipCount} blogs`);
    console.log(`   - Total blog posts in database: ${totalCount[0].count}`);
    
    console.log('\nSample blogs addition completed!');
    
  } catch (error) {
    console.error('Error adding sample blogs:', error.message);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  addSampleBlogs();
}

module.exports = addSampleBlogs; 