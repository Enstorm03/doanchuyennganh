package com.example.perfumeshop.repository;

import com.example.perfumeshop.entity.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Integer> {
    // Bạn có thể định nghĩa thêm hàm tìm kiếm tại đây nếu cần
    // Ví dụ: Tìm sản phẩm theo tên
    // List<SanPham> findByTenSanPhamContaining(String ten);

    @Query("SELECT p FROM SanPham p " +
            "WHERE (:kw IS NULL OR LOWER(p.tenSanPham) LIKE LOWER(CONCAT('%', :kw, '%'))) " +
            "AND (:danhMucId IS NULL OR p.danhMuc.idDanhMuc = :danhMucId) " +
            "AND (:thuongHieuId IS NULL OR p.thuongHieu.idThuongHieu = :thuongHieuId) " +
            "AND (:nongDo IS NULL OR p.nongDo = :nongDo) " +
            "AND (:dungTich IS NULL OR p.dungTichMl = :dungTich)")
    java.util.List<SanPham> search(
            @Param("kw") String keyword,
            @Param("danhMucId") Integer danhMucId,
            @Param("thuongHieuId") Integer thuongHieuId,
            @Param("nongDo") Integer nongDo,
            @Param("dungTich") Integer dungTich
    );
}