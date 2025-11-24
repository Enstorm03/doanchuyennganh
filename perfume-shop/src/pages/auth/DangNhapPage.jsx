import React from 'react';
import { Link } from 'react-router-dom';

const DangNhapPage = () => {
  return (
    <main className="flex flex-1 justify-center items-center py-12 px-4 bg-background-light dark:bg-background-dark min-h-screen">
      <div className="w-full max-w-md">
        <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-lg border border-border-light dark:border-border-dark">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-text-light dark:text-text-dark">Đăng Nhập</h1>
            <p className="text-text-subtle-light dark:text-text-subtle-dark mt-2">Chào mừng bạn trở lại!</p>
          </div>

          <form className="flex flex-col gap-6">
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
              <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Mật khẩu</label>
                  <Link to="#" className="text-sm text-primary hover:underline">Quên mật khẩu?</Link>
              </div>
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
              Đăng Nhập
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark">
                Chưa có tài khoản? <Link to="/register" className="font-medium text-primary hover:underline">Đăng ký ngay</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default DangNhapPage;