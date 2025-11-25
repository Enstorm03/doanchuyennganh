import React, { createContext, useContext, useState, useEffect } from 'react';

// Auth Context để quản lý authentication cho cả user và nhân viên
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khôi phục session từ localStorage khi app khởi động
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedStaff = localStorage.getItem('staff');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedStaff) {
      setStaff(JSON.parse(savedStaff));
    }

    setLoading(false);
  }, []);

  // Login cho người dùng thông thường (từ Nguoi_Dung table)
  const loginUser = async (data) => {
    try {
      // FUTURE API CALL: POST /api/nguoi-dung/login
      // const response = await fetch('/api/nguoi-dung/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });

      // Mock login for now
      const mockUser = {
        id_nguoi_dung: 1,
        ten_dang_nhap: data.ten_dang_nhap,
        ho_ten: "Nguyễn Văn A",
        so_dien_thoai: "0987654321",
        dia_chi: "123 Đường ABC, Quận 1, TP.HCM"
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));

      // Clear staff login if user logs in
      setStaff(null);
      localStorage.removeItem('staff');

      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login cho nhân viên (từ Nhan_Vien table)
  const loginStaff = async (data) => {
    try {
      // FUTURE API CALL: POST /api/nhan-vien/login
      // const response = await fetch('/api/nhan-vien/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });

      // Mock staff login for now
      const mockStaff = {
        id_nhan_vien: 1,
        ten_dang_nhap: data.ten_dang_nhap,
        ho_ten: "Admin User",
        vai_tro: data.ten_dang_nhap.includes('admin') ? 'admin' : 'staff'
      };

      setStaff(mockStaff);
      localStorage.setItem('staff', JSON.stringify(mockStaff));

      // Clear user login if staff logs in
      setUser(null);
      localStorage.removeItem('user');

      return { success: true, staff: mockStaff };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setStaff(null);
    localStorage.removeItem('user');
    localStorage.removeItem('staff');
  };

  // Check roles
  const isStaff = () => staff !== null;
  const isAdmin = () => staff?.vai_tro === 'admin';
  const isUser = () => user !== null;

  // Get current user (user hoặc staff)
  const getCurrentUser = () => {
    if (staff) return { ...staff, userType: 'staff' };
    if (user) return { ...user, userType: 'customer' };
    return null;
  };

  const value = {
    user,
    staff,
    loading,
    loginUser,
    loginStaff,
    logout,
    isStaff,
    isAdmin,
    isUser,
    getCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
