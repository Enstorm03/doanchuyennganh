package com.example.perfumeshop.controller;

import com.example.perfumeshop.entity.SanPham;
import com.example.perfumeshop.service.SanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/san-pham") // Đường dẫn gốc: http://localhost:8080/api/san-pham
@CrossOrigin(origins = "*") // Cho phép React gọi API mà không bị chặn (CORS)
public class SanPhamController {

    @Autowired
    private SanPhamService sanPhamService;

    // GET: Lấy danh sách sản phẩm
    @GetMapping
    public List<SanPham> getAll() {
        return sanPhamService.getAllSanPhams();
    }

    // GET: Lấy chi tiết 1 sản phẩm
    @GetMapping("/{id}")
    public SanPham getDetail(@PathVariable Integer id) {
        return sanPhamService.getSanPhamById(id);
    }

    // POST: Thêm sản phẩm mới
    @PostMapping
    public SanPham create(@RequestBody SanPham sanPham) {
        return sanPhamService.saveSanPham(sanPham);
    }
    @PutMapping("/{id}")
    public SanPham update(@PathVariable Integer id, @RequestBody SanPham sanPham) {
        return sanPhamService.updateSanPham(id, sanPham);
    }

    // DELETE: Xóa sản phẩm
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        sanPhamService.deleteSanPham(id);
    }
}