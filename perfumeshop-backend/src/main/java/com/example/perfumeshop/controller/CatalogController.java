package com.example.perfumeshop.controller;

import com.example.perfumeshop.entity.DanhMuc;
import com.example.perfumeshop.entity.SanPham;
import com.example.perfumeshop.entity.ThuongHieu;
import com.example.perfumeshop.service.ProductCatalogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalog")
@CrossOrigin(origins = "*")
public class CatalogController {

    @Autowired
    private ProductCatalogService catalogService;

    @GetMapping("/san-pham/search")
    public ResponseEntity<List<SanPham>> search(
            @RequestParam(value = "kw", required = false) String kw,
            @RequestParam(value = "danhMucId", required = false) Integer danhMucId,
            @RequestParam(value = "thuongHieuId", required = false) Integer thuongHieuId,
            @RequestParam(value = "nongDo", required = false) Integer nongDo,
            @RequestParam(value = "dungTich", required = false) Integer dungTich
    ) {
        return ResponseEntity.ok(catalogService.search(kw, danhMucId, thuongHieuId, nongDo, dungTich));
    }

    @GetMapping("/danh-muc")
    public ResponseEntity<List<DanhMuc>> danhMuc() {
        return ResponseEntity.ok(catalogService.listDanhMuc());
    }

    @GetMapping("/thuong-hieu")
    public ResponseEntity<List<ThuongHieu>> thuongHieu() {
        return ResponseEntity.ok(catalogService.listThuongHieu());
    }
}
