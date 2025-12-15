package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.ChiTietDonHang;
import com.example.perfumeshop.entity.DonHang;
import com.example.perfumeshop.entity.SanPham;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.DonHangRepository;
import com.example.perfumeshop.repository.SanPhamRepository;
import com.example.perfumeshop.dto.DonHangHistoryDto;
import com.example.perfumeshop.dto.ChiTietDonHangDto;
import com.example.perfumeshop.dto.PosItemRequest; // Đã thêm import này
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
public class DonHangService {

    public static final String TT_CHO_XAC_NHAN = "Đang chờ";
    public static final String TT_DA_XAC_NHAN = "Đã xác nhận";
    public static final String TT_DANG_GIAO = "Đang giao hàng";
    public static final String TT_HOAN_THANH = "Hoàn thành";
    public static final String TT_CHO_HANG = "Chờ hàng";
    public static final String TT_DA_HUY = "Đã hủy";

    @Autowired
    private DonHangRepository donHangRepository;

    @Autowired
    private SanPhamRepository sanPhamRepository;

    public List<DonHang> listByTrangThai(String trangThai) {
        if (trangThai == null || trangThai.isBlank()) return donHangRepository.findAll();
        return donHangRepository.findByTrangThaiVanHanh(trangThai);
    }

    public List<DonHang> historyByUser(Integer userId, String trangThai) {
        if (userId == null) throw new BusinessException("userId không được trống");
        if (trangThai == null || trangThai.isBlank()) {
            // mặc định: loại trừ Giỏ hàng
            return donHangRepository.findByIdNguoiDungAndTrangThaiVanHanhNot(userId, "Giỏ hàng");
        }
        return donHangRepository.findByIdNguoiDungAndTrangThaiVanHanh(userId, trangThai);
    }

    public List<DonHangHistoryDto> historyDtoByUser(Integer userId, String trangThai) {
        List<DonHang> orders = historyByUser(userId, trangThai);
        return orders.stream().map(this::toHistoryDto).collect(Collectors.toList());
    }

    public DonHangHistoryDto toHistoryDto(DonHang dh) {
        DonHangHistoryDto dto = new DonHangHistoryDto();
        dto.setIdDonHang(dh.getIdDonHang());
        dto.setTrangThaiVanHanh(dh.getTrangThaiVanHanh());
        dto.setTrangThaiThanhToan(dh.getTrangThaiThanhToan());
        dto.setTongTien(dh.getTongTien());
        dto.setTienDatCoc(dh.getTienDatCoc());
        dto.setTenNguoiNhan(dh.getTenNguoiNhan());
        dto.setDiaChiGiaoHang(dh.getDiaChiGiaoHang());
        dto.setTenKhachVangLai(dh.getTenKhachVangLai());
        dto.setNgayDatHang(dh.getNgayDatHang());
        dto.setNgayHoanThanh(dh.getNgayHoanThanh());
        dto.setMaVanDon(dh.getMaVanDon());

        List<ChiTietDonHang> items = dh.getChiTietDonHangs();
        List<ChiTietDonHangDto> itemDtos = new ArrayList<>();
        if (items != null) {
            for (ChiTietDonHang ct : items) {
                ChiTietDonHangDto it = new ChiTietDonHangDto();
                SanPham sp = ct.getSanPham(); // có thể null nếu sản phẩm bị xóa
                it.setSanPhamId(sp != null ? sp.getIdSanPham() : null);
                it.setTenSanPham(sp != null ? sp.getTenSanPham() : "(Sản phẩm đã không còn)");
                it.setUrlHinhAnh(sp != null ? sp.getUrlHinhAnh() : null);
                it.setSoLuong(ct.getSoLuong());
                it.setGiaTaiThoiDiemMua(ct.getGiaTaiThoiDiemMua());
                itemDtos.add(it);
            }
        }
        dto.setChiTiet(itemDtos);
        return dto;
    }

    public List<DonHang> searchByMaVanDon(String keyword) {
        if (keyword == null || keyword.isBlank()) return List.of();
        return donHangRepository.findByMaVanDonContainingIgnoreCase(keyword);
    }

    public DonHang getById(Integer id) {
        return donHangRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Đơn hàng không tồn tại"));
    }

    @Transactional
    public DonHang confirm(Integer id, Integer nhanVienId) {
        DonHang dh = getById(id);
        if (!(TT_CHO_XAC_NHAN.equals(dh.getTrangThaiVanHanh()) || TT_CHO_HANG.equals(dh.getTrangThaiVanHanh()))) {
            throw new BusinessException("Chỉ xác nhận đơn ở trạng thái 'Đang chờ' hoặc 'Chờ hàng'");
        }
        dh.setIdNhanVien(nhanVienId);
        dh.setTrangThaiVanHanh(TT_DA_XAC_NHAN);
        return donHangRepository.save(dh);
    }

    @Transactional
    public DonHang updateTrackingAndShip(Integer id, String maVanDon) {
        DonHang dh = getById(id);
        if (!TT_DA_XAC_NHAN.equals(dh.getTrangThaiVanHanh())) {
            throw new BusinessException("Chỉ chuyển 'Đang giao hàng' từ 'Đã xác nhận'");
        }
        // chỉ cập nhật trạng thái
        dh.setTrangThaiVanHanh(TT_DANG_GIAO);
        dh.setMaVanDon(maVanDon);
        return donHangRepository.save(dh);
    }

    @Transactional
    public DonHang complete(Integer id) {
        DonHang dh = getById(id);
        if (!TT_DANG_GIAO.equals(dh.getTrangThaiVanHanh())) {
            throw new BusinessException("Chỉ hoàn thành đơn từ trạng thái 'Đang giao hàng'");
        }
        dh.setTrangThaiVanHanh(TT_HOAN_THANH);
        dh.setNgayHoanThanh(LocalDateTime.now());
        return donHangRepository.save(dh);
    }

    @Transactional
    public DonHang cancel(Integer id, String lyDo) {
        DonHang dh = getById(id);
        String tt = dh.getTrangThaiVanHanh();
        if (!(TT_CHO_XAC_NHAN.equals(tt) || TT_DA_XAC_NHAN.equals(tt) || TT_CHO_HANG.equals(tt))) {
            throw new BusinessException("Không thể hủy đơn ở trạng thái hiện tại");
        }
        // Hoàn kho theo quy tắc
        if (TT_CHO_XAC_NHAN.equals(tt) || TT_DA_XAC_NHAN.equals(tt)) {
            // Hàng có sẵn: hoàn kho
            restoreInventory(dh);
        } else if (TT_CHO_HANG.equals(tt)) {
            // Hàng order chưa về: không hoàn kho
        }
        dh.setTrangThaiVanHanh(TT_DA_HUY);
        dh.setLyDoHuy(lyDo);
        return donHangRepository.save(dh);
    }

    private void restoreInventory(DonHang dh) {
        List<ChiTietDonHang> items = dh.getChiTietDonHangs();
        if (items == null) return;
        for (ChiTietDonHang item : items) {
            SanPham sp = item.getSanPham();
            if (sp == null) continue;
            Integer soLuongTon = sp.getSoLuongTonKho() == null ? 0 : sp.getSoLuongTonKho();
            sp.setSoLuongTonKho(soLuongTon + item.getSoLuong());
            sanPhamRepository.save(sp);
        }
    }

    // Mốc 2: POS bán lẻ (Hàng có sẵn) - tạo đơn hoàn thành ngay, trừ kho, đã thanh toán
    @Transactional
    public DonHang createPosBanLe(Integer nhanVienId, Integer khachHangId, String tenKhachVangLai,
                                  List<PosItemRequest> itemsInput) { // Đã sửa thành PosItemRequest
        if (itemsInput == null || itemsInput.isEmpty()) {
            throw new BusinessException("Danh sách sản phẩm trống");
        }

        DonHang dh = new DonHang();
        dh.setIdNhanVien(nhanVienId);
        dh.setIdNguoiDung(khachHangId);
        dh.setTenKhachVangLai(tenKhachVangLai);
        dh.setTrangThaiVanHanh(TT_HOAN_THANH);
        dh.setTrangThaiThanhToan("Đã thanh toán");

        BigDecimal tong = BigDecimal.ZERO;
        List<ChiTietDonHang> ctList = new ArrayList<>();

        // Kiểm tra tồn kho trước, sau đó trừ kho
        for (PosItemRequest in : itemsInput) {
            SanPham sp = sanPhamRepository.findById(in.getSanPhamId())
                    .orElseThrow(() -> new BusinessException("Sản phẩm không tồn tại: " + in.getSanPhamId()));
            int ton = sp.getSoLuongTonKho() == null ? 0 : sp.getSoLuongTonKho();
            if (ton < in.getSoLuong()) {
                throw new BusinessException("Không đủ tồn kho cho sản phẩm: " + sp.getTenSanPham());
            }
        }

        for (PosItemRequest in : itemsInput) {
            SanPham sp = sanPhamRepository.findById(in.getSanPhamId()).orElseThrow();
            // trừ kho
            sp.setSoLuongTonKho((sp.getSoLuongTonKho() == null ? 0 : sp.getSoLuongTonKho()) - in.getSoLuong());
            sanPhamRepository.save(sp);

            ChiTietDonHang ct = new ChiTietDonHang();
            ct.setDonHang(dh);
            ct.setSanPham(sp);
            ct.setSoLuong(in.getSoLuong());
            ct.setGiaTaiThoiDiemMua(in.getGia());
            ctList.add(ct);

            tong = tong.add(in.getGia().multiply(BigDecimal.valueOf(in.getSoLuong())));
        }

        dh.setTongTien(tong);
        dh.setTienDatCoc(BigDecimal.ZERO);
        dh.setChiTietDonHangs(ctList);
        dh.setNgayHoanThanh(LocalDateTime.now());
        return donHangRepository.save(dh);
    }

    // Mốc 2: POS Order (Đặt cọc 50%), không trừ kho, trạng thái Chờ hàng, thanh toán = Đã cọc
    @Transactional
    public DonHang createPosOrder(Integer nhanVienId, Integer khachHangId, String tenKhachVangLai,
                                  List<PosItemRequest> itemsInput) { // Đã sửa thành PosItemRequest
        if (itemsInput == null || itemsInput.isEmpty()) {
            throw new BusinessException("Danh sách sản phẩm trống");
        }
        DonHang dh = new DonHang();
        dh.setIdNhanVien(nhanVienId);
        dh.setIdNguoiDung(khachHangId);
        dh.setTenKhachVangLai(tenKhachVangLai);
        dh.setTrangThaiVanHanh(TT_CHO_HANG);
        dh.setTrangThaiThanhToan("Đã cọc");

        BigDecimal tong = BigDecimal.ZERO;
        List<ChiTietDonHang> ctList = new ArrayList<>();
        for (PosItemRequest in : itemsInput) {
            SanPham sp = sanPhamRepository.findById(in.getSanPhamId())
                    .orElseThrow(() -> new BusinessException("Sản phẩm không tồn tại: " + in.getSanPhamId()));
            ChiTietDonHang ct = new ChiTietDonHang();
            ct.setDonHang(dh);
            ct.setSanPham(sp);
            ct.setSoLuong(in.getSoLuong());
            ct.setGiaTaiThoiDiemMua(in.getGia());
            ctList.add(ct);
            tong = tong.add(in.getGia().multiply(BigDecimal.valueOf(in.getSoLuong())));
        }
        dh.setTongTien(tong);
        dh.setTienDatCoc(tong.multiply(new BigDecimal("0.5")));
        dh.setChiTietDonHangs(ctList);
        return donHangRepository.save(dh);
    }

    @Transactional
    public DonHang daThuTienConLai(Integer id) {
        DonHang dh = getById(id);
        if (!TT_CHO_HANG.equals(dh.getTrangThaiVanHanh()) || !"Đã cọc".equals(dh.getTrangThaiThanhToan())) {
            throw new BusinessException("Chỉ áp dụng cho đơn 'Chờ hàng' đã đặt cọc");
        }

        dh.setTrangThaiThanhToan("Đã thanh toán");
        return donHangRepository.save(dh);
    }

    @Transactional
    public DonHang capNhatNguoiNhan(Integer id, String tenNguoiNhan, String diaChiGiaoHang) {
        DonHang dh = getById(id);
        if (!TT_CHO_HANG.equals(dh.getTrangThaiVanHanh())) {
            throw new BusinessException("Chỉ cập nhật người nhận cho đơn 'Chờ hàng'");
        }

        dh.setTenNguoiNhan(tenNguoiNhan);
        dh.setDiaChiGiaoHang(diaChiGiaoHang);
        return donHangRepository.save(dh);
    }

    // Đã xóa class ItemInput
}