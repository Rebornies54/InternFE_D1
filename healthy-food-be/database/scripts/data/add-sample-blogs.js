const { pool } = require('../../connection');

const addSampleBlogs = async () => {
  try {
    console.log('📝 Adding sample blog posts...');
    
    const sampleBlogs = [
      {
        user_id: 1,
        title: 'Khoai tây - Nguồn vitamin C dồi dào',
        description: 'Khoai tây chứa hàm lượng vitamin C cao...',
        content: 'Khoai tây thường bị đánh giá thấp về giá trị dinh dưỡng, nhưng thực tế chúng chứa nhiều vitamin và khoáng chất quan trọng. Một củ khoai tây cỡ trung bình cung cấp khoảng 27mg vitamin C, chiếm 30% nhu cầu hàng ngày của cơ thể. Ngoài ra, khoai tây còn chứa kali, vitamin B6 và chất xơ. Cách chế biến khoai tây cũng ảnh hưởng đến hàm lượng dinh dưỡng - nướng hoặc luộc sẽ giữ được nhiều vitamin hơn so với chiên.',
        category: 'thực phẩm',
        likes_count: 15
      },
      {
        user_id: 1,
        title: 'Rau củ - Thực phẩm ít calo, nhiều dưỡng chất',
        description: 'Rau củ là lựa chọn tuyệt vời...',
        content: 'Rau củ là nền tảng của mọi chế độ ăn lành mạnh. Chúng cung cấp ít calo nhưng lại giàu vitamin, khoáng chất và chất xơ. Mỗi loại rau củ có những lợi ích riêng: cà rốt giàu beta-carotene tốt cho mắt, bông cải xanh chứa sulforaphane có tác dụng chống ung thư, cải bó xôi giàu sắt và canxi. Để tối ưu hóa dinh dưỡng, nên ăn đa dạng các loại rau củ với nhiều màu sắc khác nhau.',
        category: 'thực phẩm',
        likes_count: 23
      },
      {
        user_id: 1,
        title: 'Nấm - Protein thực vật chất lượng cao',
        description: 'Giàu protein và ít calo...',
        content: 'Nấm không chỉ là một nguyên liệu ngon miệng mà còn là nguồn protein thực vật chất lượng cao. Chúng chứa tất cả 9 axit amin thiết yếu mà cơ thể cần. Nấm cũng giàu vitamin D, selenium và các chất chống oxy hóa. Một số loại nấm như shiitake còn có tác dụng tăng cường hệ miễn dịch. Nấm có thể thay thế thịt trong nhiều món ăn, giúp giảm lượng calo và chất béo bão hòa.',
        category: 'thực phẩm',
        likes_count: 8
      },
      {
        user_id: 1,
        title: 'Cách xây dựng thực đơn cân bằng',
        description: 'Một thực đơn cân bằng giúp cung cấp đầy đủ dưỡng chất...',
        content: 'Thực đơn cân bằng lý tưởng nên bao gồm 50% rau củ và trái cây, 25% protein (thịt, cá, đậu), và 25% ngũ cốc nguyên hạt. Bữa sáng nên có protein và chất xơ để duy trì năng lượng. Bữa trưa cần đầy đủ các nhóm chất. Bữa tối nên nhẹ nhàng với nhiều rau củ. Uống đủ nước và hạn chế đồ ngọt, thức ăn nhanh. Lập kế hoạch bữa ăn trước để tránh ăn uống thiếu cân bằng.',
        category: 'thực đơn',
        likes_count: 31
      },
      {
        user_id: 1,
        title: 'Bí quyết ăn uống cân bằng khi bận rộn',
        description: 'Duy trì chế độ ăn lành mạnh ngay cả khi lịch trình bận rộn...',
        content: 'Cuộc sống bận rộn không phải là lý do để từ bỏ ăn uống lành mạnh. Chuẩn bị bữa ăn vào cuối tuần, sử dụng nồi nấu chậm, và dự trữ thực phẩm đông lạnh là những cách hiệu quả. Luôn mang theo đồ ăn nhẹ lành mạnh như hạt, trái cây. Chọn nhà hàng có menu lành mạnh khi ăn ngoài. Sử dụng ứng dụng theo dõi dinh dưỡng để đảm bảo cân bằng. Nhớ rằng một bữa ăn không lành mạnh không làm hỏng cả chế độ ăn.',
        category: 'bí quyết',
        likes_count: 19
      },
      {
        user_id: 1,
        title: 'Thủy phân cơ thể - Tầm quan trọng của nước',
        description: 'Uống đủ nước không chỉ giúp duy trì sức khỏe...',
        content: 'Nước đóng vai trò thiết yếu trong mọi chức năng của cơ thể: vận chuyển chất dinh dưỡng, điều hòa nhiệt độ, thải độc tố. Người trưởng thành nên uống 2-3 lít nước mỗi ngày, tùy thuộc vào hoạt động thể chất và khí hậu. Dấu hiệu thiếu nước bao gồm khát, nước tiểu sẫm màu, mệt mỏi. Ngoài nước lọc, có thể bổ sung nước từ trái cây, rau củ và các loại trà thảo mộc.',
        category: 'bí quyết',
        likes_count: 12
      }
    ];
    
    let successCount = 0;
    let skipCount = 0;
    
    for (const blog of sampleBlogs) {
      try {
        await pool.execute(
          'INSERT INTO blog_posts (user_id, title, description, content, category, likes_count) VALUES (?, ?, ?, ?, ?, ?)',
          [blog.user_id, blog.title, blog.description, blog.content, blog.category, blog.likes_count]
        );
        console.log(`✅ Added blog: ${blog.title}`);
        successCount++;
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Skipped (already exists): ${blog.title}`);
          skipCount++;
        } else {
          console.error(`❌ Error adding blog ${blog.title}:`, error.message);
        }
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`   - Successfully added: ${successCount} blogs`);
    console.log(`   - Skipped (duplicates): ${skipCount} blogs`);
    
    // Show final count
    const [totalCount] = await pool.execute('SELECT COUNT(*) as count FROM blog_posts');
    console.log(`   - Total blog posts in database: ${totalCount[0].count}`);
    
    console.log('\n🎉 Sample blogs addition completed!');
    
  } catch (error) {
    console.error('❌ Error adding sample blogs:', error.message);
  } finally {
    await pool.end();
  }
};

// Run if this file is executed directly
if (require.main === module) {
  addSampleBlogs();
}

module.exports = addSampleBlogs; 