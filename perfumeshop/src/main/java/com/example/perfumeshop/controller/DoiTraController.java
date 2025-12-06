package com.example.perfumeshop.controller;

import com.example.perfumeshop.dto.ApproveReturnRequest;
import com.example.perfumeshop.dto.CreateReturnRequest;
import com.example.perfumeshop.entity.PhieuDoiTra;
import com.example.perfumeshop.service.ReturnService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doi-tra")
@CrossOrigin(origins = "*")
public class DoiTraController {

    @Autowired
    private ReturnService returnService;

    @GetMapping("/cho-duyet")
    public ResponseEntity<List<PhieuDoiTra>> listPending() {
        return ResponseEntity.ok(returnService.listPending());
    }

    @PostMapping
    public ResponseEntity<PhieuDoiTra> create(@Valid @RequestBody CreateReturnRequest req) {
        return ResponseEntity.ok(returnService.create(req.getIdDonHang(), req.getIdNguoiDung(), req.getLyDo()));
    }

    @PostMapping("/{id}/duyet")
    public ResponseEntity<PhieuDoiTra> approve(@PathVariable Integer id, @Valid @RequestBody ApproveReturnRequest req) {
        return ResponseEntity.ok(returnService.approve(id, req.getNhanVienId()));
    }

    @PostMapping("/{id}/tu-choi")
    public ResponseEntity<PhieuDoiTra> reject(@PathVariable Integer id, @Valid @RequestBody ApproveReturnRequest req) {
        return ResponseEntity.ok(returnService.reject(id, req.getNhanVienId()));
    }
}
