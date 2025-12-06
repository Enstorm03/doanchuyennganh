package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.DanhMuc;
import com.example.perfumeshop.entity.SanPham;
import com.example.perfumeshop.entity.ThuongHieu;
import com.example.perfumeshop.repository.DanhMucRepository;
import com.example.perfumeshop.repository.SanPhamRepository;
import com.example.perfumeshop.repository.ThuongHieuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductCatalogService {

    @Autowired
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private DanhMucRepository danhMucRepository;

    @Autowired
    private ThuongHieuRepository thuongHieuRepository;

    public List<SanPham> search(String kw, Integer danhMucId, Integer thuongHieuId, Integer nongDo, Integer dungTich) {
        return sanPhamRepository.search(
                (kw == null || kw.isBlank()) ? null : kw,
                danhMucId,
                thuongHieuId,
                nongDo,
                dungTich
        );
    }

    public List<DanhMuc> listDanhMuc() {
        return danhMucRepository.findAll();
    }

    public List<ThuongHieu> listThuongHieu() {
        return thuongHieuRepository.findAll();
    }
}
