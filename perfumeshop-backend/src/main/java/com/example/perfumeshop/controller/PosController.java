package com.example.perfumeshop.controller;

import com.example.perfumeshop.dto.PosBanLeRequest;
import com.example.perfumeshop.dto.PosItemRequest;
import com.example.perfumeshop.dto.PosOrderRequest;
import com.example.perfumeshop.entity.DonHang;
import com.example.perfumeshop.service.DonHangService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pos")
@CrossOrigin(origins = "*")
public class PosController {

    @Autowired
    private DonHangService donHangService;

    @PostMapping("/ban-le")
    public ResponseEntity<DonHang> banLe(@Valid @RequestBody PosBanLeRequest req) {
        // Không cần map nữa, truyền thẳng req.getItems() vào vì nó chính là List<PosItemRequest>
        DonHang dh = donHangService.createPosBanLe(
                req.getNhanVienId(),
                req.getKhachHangId(),
                req.getTenKhachVangLai(),
                req.getItems()
        );
        return ResponseEntity.ok(dh);
    }

    @PostMapping("/order")
    public ResponseEntity<DonHang> order(@Valid @RequestBody PosOrderRequest req) {
        // Tương tự, truyền thẳng items vào
        DonHang dh = donHangService.createPosOrder(
                req.getNhanVienId(),
                req.getKhachHangId(),
                req.getTenKhachVangLai(),
                req.getItems()
        );
        return ResponseEntity.ok(dh);
    }

    // Đã xóa hàm private mapItem() vì không còn cần thiết
}