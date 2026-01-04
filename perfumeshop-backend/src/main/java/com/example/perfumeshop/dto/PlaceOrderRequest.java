package com.example.perfumeshop.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class PlaceOrderRequest {
    // Có thể null nếu khách vãng lai
    private Integer idNguoiDung;

    @NotEmpty
    private String tenNguoiNhan;

    @NotEmpty
    private String diaChiGiaoHang;

    @NotEmpty
    private List<PlaceOrderItemRequest> items;
    private Boolean allowBackorder;



}
