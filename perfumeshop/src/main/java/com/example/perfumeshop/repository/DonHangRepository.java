package com.example.perfumeshop.repository;

import com.example.perfumeshop.entity.DonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonHangRepository extends JpaRepository<DonHang, Integer> {
    List<DonHang> findByTrangThaiVanHanh(String trangThaiVanHanh);
    List<DonHang> findByIdNguoiDungAndTrangThaiVanHanh(Integer idNguoiDung, String trangThaiVanHanh);
    List<DonHang> findByIdNguoiDungAndTrangThaiVanHanhNot(Integer idNguoiDung, String trangThaiVanHanh);
    List<DonHang> findByMaVanDonContainingIgnoreCase(String maVanDon);
}
