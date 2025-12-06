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

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pos")
@CrossOrigin(origins = "*")
public class PosController {

    @Autowired
    private DonHangService donHangService;

    @PostMapping("/ban-le")
    public ResponseEntity<DonHang> banLe(@Valid @RequestBody PosBanLeRequest req) {
        List<DonHangService.ItemInput> items = req.getItems().stream()
                .map(this::mapItem)
                .collect(Collectors.toList());
        DonHang dh = donHangService.createPosBanLe(
                req.getNhanVienId(), req.getKhachHangId(), req.getTenKhachVangLai(), items
        );
        return ResponseEntity.ok(dh);
    }

    @PostMapping("/order")
    public ResponseEntity<DonHang> order(@Valid @RequestBody PosOrderRequest req) {
        List<DonHangService.ItemInput> items = req.getItems().stream()
                .map(this::mapItem)
                .collect(Collectors.toList());
        DonHang dh = donHangService.createPosOrder(
                req.getNhanVienId(), req.getKhachHangId(), req.getTenKhachVangLai(), items
        );
        return ResponseEntity.ok(dh);
    }

    private DonHangService.ItemInput mapItem(PosItemRequest it) {
        return new DonHangService.ItemInput(it.getSanPhamId(), it.getSoLuong(), it.getGia());
    }

}
