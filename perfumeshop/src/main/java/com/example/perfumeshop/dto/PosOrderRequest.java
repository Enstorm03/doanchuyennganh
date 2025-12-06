package com.example.perfumeshop.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class PosOrderRequest {
    @NotNull
    private Integer nhanVienId;

    private Integer khachHangId; // id_nguoi_dung, có thể null

    private String tenKhachVangLai; // nếu là khách vãng lai

    @NotEmpty
    private List<PosItemRequest> items;
}
