import React from 'react';
import { Link } from 'react-router-dom';

const DangKyPage = () => {
  return (
    <main className="flex flex-1 justify-center items-center py-12 px-4 bg-background-light dark:bg-background-dark min-h-screen">
      <div className="w-full max-w-md">
        <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-lg border border-border-light dark:border-border-dark">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-text-light dark:text-text-dark">Tạo tài khoản</h1>
            <p className="text-text-subtle-light dark:text-text-subtle-dark mt-2">Bắt đầu hành trình hương thơm của bạn.</p>
          </div>

          <form className="flex flex-col gap-6">
            {/* Full Name Input */}
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium mb-2 text-text-subtle-light dark:text-text-subtle-dark">Họ và tên</label>
              <input 
                type="text" 
                id="fullname" 
                className="form-input w-full h-12 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50" 
                placeholder="Nguyễn Văn A" 
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-text-subtle-light dark:text-text-subtle-dark">Email</label>
              <input 
                type="email" 
                id="email" 
                className="form-input w-full h-12 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50" 
                placeholder="email@example.com" 
              />
            </div>

            {/* Password Input */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-text-subtle-light dark:text-text-subtle-dark">Mật khẩu</label>
              <input 
                type="password" 
                id="password" 
                className="form-input w-full h-12 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50" 
                placeholder="••••••••" 
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full h-12 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-bold hover:bg-opacity-90 transition-colors mt-4"
            >
              Đăng Ký
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark">
                Đã có tài khoản? <Link to="/login" className="font-medium text-primary hover:underline">Đăng nhập</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default DangKyPage;