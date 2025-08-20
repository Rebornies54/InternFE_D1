const nodemailer = require('nodemailer');

class EmailService {
  static transporter = null;

  static init() {
    // Cấu hình email service
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Gmail của bạn
        pass: process.env.EMAIL_APP_PASSWORD // App Password từ Google
      }
    });
  }

  static async sendOTP(email, otp, userName) {
    try {
      if (!this.transporter) {
        this.init();
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Mã OTP đặt lại mật khẩu - Healthy Food',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">Healthy Food</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Đặt lại mật khẩu</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-bottom: 20px;">Xin chào ${userName || 'bạn'}!</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
                Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. 
                Vui lòng sử dụng mã OTP dưới đây để hoàn tất quá trình đặt lại mật khẩu.
              </p>
              
              <div style="background: #fff; border: 2px dashed #667eea; border-radius: 8px; padding: 25px; text-align: center; margin: 25px 0;">
                <h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px;">Mã OTP của bạn:</h3>
                <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>
              
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  <strong>Lưu ý:</strong> 
                  <ul style="margin: 10px 0 0 20px; padding: 0;">
                    <li>Mã OTP có hiệu lực trong 10 phút</li>
                    <li>Không chia sẻ mã này với bất kỳ ai</li>
                    <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
                  </ul>
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">
                Trân trọng,<br>
                <strong>Đội ngũ Healthy Food</strong>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>Email này được gửi tự động, vui lòng không trả lời.</p>
              <p>Nếu có vấn đề, vui lòng liên hệ: support@healthyfood.com</p>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email OTP đã được gửi thành công:', result.messageId);
      return result;

    } catch (error) {
      console.error('❌ Lỗi khi gửi email OTP:', error);
      throw new Error('Không thể gửi email OTP. Vui lòng thử lại sau.');
    }
  }

  static async sendWelcomeEmail(email, userName) {
    try {
      if (!this.transporter) {
        this.init();
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Chào mừng bạn đến với Healthy Food!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">Healthy Food</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Chào mừng bạn!</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-bottom: 20px;">Xin chào ${userName}!</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
                Cảm ơn bạn đã đăng ký tài khoản tại Healthy Food. 
                Chúng tôi rất vui mừng được đồng hành cùng bạn trên hành trình chăm sóc sức khỏe!
              </p>
              
              <div style="background: #fff; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center;">
                <h3 style="color: #333; margin: 0 0 15px 0;">Bắt đầu ngay hôm nay:</h3>
                <ul style="text-align: left; color: #666; line-height: 1.8;">
                  <li>📊 Theo dõi chỉ số BMI và calo</li>
                  <li>🍎 Quản lý chế độ ăn uống</li>
                  <li>📝 Chia sẻ kiến thức dinh dưỡng</li>
                  <li>🎯 Đặt mục tiêu sức khỏe</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/home" 
                   style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Khám phá ngay
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">
                Trân trọng,<br>
                <strong>Đội ngũ Healthy Food</strong>
              </p>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email chào mừng đã được gửi thành công:', result.messageId);
      return result;

    } catch (error) {
      console.error('❌ Lỗi khi gửi email chào mừng:', error);
      // Không throw error vì đây không phải lỗi nghiêm trọng
    }
  }

  // Test connection
  static async testConnection() {
    try {
      if (!this.transporter) {
        this.init();
      }
      
      await this.transporter.verify();
      console.log('✅ Email service connection successful');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = EmailService;
