package com.example.perfumeshop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PosItemRequest {
    @NotNull
    private Integer sanPhamId;

    @NotNull
    @Min(1)
    private Integer soLuong;

    @NotNull
    private BigDecimal gia; // giá tại thời điểm bán/đặt
}
