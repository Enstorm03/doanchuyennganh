package com.example.perfumeshop.controller;

import com.example.perfumeshop.dto.LoginRequest;
import com.example.perfumeshop.entity.NguoiDung;
import com.example.perfumeshop.entity.NhanVien;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.NguoiDungRepository;
import com.example.perfumeshop.repository.NhanVienRepository;
import com.example.perfumeshop.dto.CreateKhachHangRequest;
import com.example.perfumeshop.service.AdminUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private AdminUserService adminUserService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest req) {
        String type = req.getLoai().toLowerCase();
        Map<String, Object> body = new HashMap<>();
        switch (type) {
            case "customer":
            case "khach":
                NguoiDung kh = nguoiDungRepository.findByTenDangNhap(req.getTenDangNhap())
                        .orElseThrow(() -> new BusinessException("Sai tài khoản hoặc mật khẩu"));
                if (!kh.getMatKhauBam().equals(req.getMatKhau())) {
                    throw new BusinessException("Sai tài khoản hoặc mật khẩu");
                }
                body.put("type", "customer");
                body.put("userId", kh.getIdNguoiDung());
                body.put("displayName", kh.getHoTen());
                return ResponseEntity.ok(body);
            case "employee":
            case "nhanvien":
                NhanVien nv = nhanVienRepository.findByTenDangNhap(req.getTenDangNhap())
                        .orElseThrow(() -> new BusinessException("Sai tài khoản hoặc mật khẩu"));
                if (!nv.getMatKhauBam().equals(req.getMatKhau())) {
                    throw new BusinessException("Sai tài khoản hoặc mật khẩu");
                }
                body.put("type", "employee");
                body.put("userId", nv.getIdNhanVien());
                body.put("displayName", nv.getHoTen());
                body.put("role", nv.getVaiTro());
                return ResponseEntity.ok(body);
            default:
                throw new BusinessException("loai phải là 'customer|khach' hoặc 'employee|nhanvien'");
        }
    }

    @PostMapping("/register-customer")
    public ResponseEntity<NguoiDung> registerCustomer(@Valid @RequestBody CreateKhachHangRequest req) {
        // Tái sử dụng logic tạo khách hàng từ AdminUserService (đã kiểm tra trùng username)
        NguoiDung created = adminUserService.createKhachHang(req);
        return ResponseEntity.ok(created);
    }
}
