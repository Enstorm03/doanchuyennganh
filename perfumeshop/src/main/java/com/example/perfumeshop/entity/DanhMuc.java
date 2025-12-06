package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;

@Entity
@Table(name = "Danh_Muc") // Tên bảng trong SQL
@Data // Lombok tự sinh Getter/Setter
public class DanhMuc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_danh_muc")
    private Integer idDanhMuc;

    @Column(name = "ten_danh_muc")
    private String tenDanhMuc;

    // Quan hệ: Một danh mục có nhiều sản phẩm
    // mappedBy trỏ tới tên biến "danhMuc" trong class SanPham
    @OneToMany(mappedBy = "danhMuc")
    @JsonManagedReference
    private List<SanPham> listSanPham;
}