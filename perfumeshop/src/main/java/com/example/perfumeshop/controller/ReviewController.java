package com.example.perfumeshop.controller;

import com.example.perfumeshop.dto.CreateReviewRequest;
import com.example.perfumeshop.entity.DanhGiaSanPham;
import com.example.perfumeshop.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<DanhGiaSanPham> create(@Valid @RequestBody CreateReviewRequest req) {
        return ResponseEntity.ok(reviewService.create(req));
    }
}
