package com.example.perfumeshop.controller;

import com.example.perfumeshop.dto.*;
import com.example.perfumeshop.entity.DonHang;
import com.example.perfumeshop.service.DonHangService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/don-hang")
@CrossOrigin(origins = "*")
public class DonHangController {

    @Autowired
    private DonHangService donHangService;

    @GetMapping
    public ResponseEntity<List<DonHang>> list(@RequestParam(value = "trangThai", required = false) String trangThai) {
        return ResponseEntity.ok(donHangService.listByTrangThai(trangThai));
    }

    @GetMapping("/lich-su")
    public ResponseEntity<List<DonHang>> history(@RequestParam("userId") Integer userId,
                                                 @RequestParam(value = "trangThai", required = false) String trangThai) {
        return ResponseEntity.ok(donHangService.historyByUser(userId, trangThai));
    }

    @GetMapping("/lich-su-dto")
    public ResponseEntity<List<DonHangHistoryDto>> historyDto(@RequestParam("userId") Integer userId,
                                                              @RequestParam(value = "trangThai", required = false) String trangThai) {
        return ResponseEntity.ok(donHangService.historyDtoByUser(userId, trangThai));
    }

    @GetMapping("/gio-hang-dto")
    public ResponseEntity<List<DonHangHistoryDto>> cartDto(@RequestParam("userId") Integer userId) {
        return ResponseEntity.ok(donHangService.historyDtoByUser(userId, "Giỏ hàng"));
    }

    @GetMapping("/search-by-tracking")
    public ResponseEntity<List<DonHang>> searchByTracking(@RequestParam("q") String q) {
        return ResponseEntity.ok(donHangService.searchByMaVanDon(q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonHang> detail(@PathVariable Integer id) {
        return ResponseEntity.ok(donHangService.getById(id));
    }

    @PostMapping("/{id}/xac-nhan")
    public ResponseEntity<DonHang> confirm(@PathVariable Integer id, @Valid @RequestBody ConfirmDonRequest req) {
        return ResponseEntity.ok(donHangService.confirm(id, req.getNhanVienId()));
    }

    @PostMapping("/{id}/cap-nhat-van-don")
    public ResponseEntity<DonHang> updateTracking(@PathVariable Integer id, @Valid @RequestBody UpdateTrackingRequest req) {
        return ResponseEntity.ok(donHangService.updateTrackingAndShip(id, req.getMaVanDon()));
    }

    @PostMapping("/{id}/hoan-thanh")
    public ResponseEntity<DonHang> complete(@PathVariable Integer id) {
        return ResponseEntity.ok(donHangService.complete(id));
    }

    @PostMapping("/{id}/huy")
    public ResponseEntity<DonHang> cancel(@PathVariable Integer id, @Valid @RequestBody CancelDonRequest req) {
        return ResponseEntity.ok(donHangService.cancel(id, req.getLyDo()));
    }
    @PostMapping("/{id}/da-thu-tien-con-lai")
    public ResponseEntity<DonHang> daThuTienConLai(@PathVariable Integer id) {
        try {
            DonHang donHang = donHangService.daThuTienConLai(id);
            return ResponseEntity.ok(donHang);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @PostMapping("/{id}/cap-nhat-nguoi-nhan")
    public ResponseEntity<DonHang> capNhatNguoiNhan(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        try {
            String tenNguoiNhan = request.get("tenNguoiNhan");
            String diaChiGiaoHang = request.get("diaChiGiaoHang");

            DonHang donHang = donHangService.capNhatNguoiNhan(id, tenNguoiNhan, diaChiGiaoHang);
            return ResponseEntity.ok(donHang);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

}
