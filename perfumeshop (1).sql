-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th12 06, 2025 lúc 01:58 PM
-- Phiên bản máy phục vụ: 9.1.0
-- Phiên bản PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `perfumeshop`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chi_tiet_don_hang`
--

DROP TABLE IF EXISTS `chi_tiet_don_hang`;
CREATE TABLE IF NOT EXISTS `chi_tiet_don_hang` (
  `id_chi_tiet_don_hang` int NOT NULL AUTO_INCREMENT,
  `id_don_hang` int NOT NULL,
  `id_san_pham` int NOT NULL,
  `so_luong` int NOT NULL DEFAULT '1',
  `gia_tai_thoi_diem_mua` decimal(15,2) NOT NULL,
  PRIMARY KEY (`id_chi_tiet_don_hang`),
  KEY `chi_tiet_don_hang_ibfk_1` (`id_don_hang`),
  KEY `chi_tiet_don_hang_ibfk_2` (`id_san_pham`)
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chi_tiet_don_hang`
--

INSERT INTO `chi_tiet_don_hang` (`id_chi_tiet_don_hang`, `id_don_hang`, `id_san_pham`, `so_luong`, `gia_tai_thoi_diem_mua`) VALUES
(1, 1, 1, 1, 3500000.00),
(2, 2, 2, 1, 3200000.00),
(3, 2, 4, 1, 6500000.00),
(4, 3, 1, 2, 1200000.00),
(5, 4, 2, 1, 2500000.00),
(6, 5, 1, 2, 3500000.00),
(7, 5, 3, 1, 2800000.00),
(8, 6, 1, 2, 3500000.00),
(9, 6, 3, 1, 2800000.00),
(10, 1, 1, 1, 3200000.00),
(11, 2, 3, 1, 6500000.00),
(12, 3, 5, 2, 650000.00),
(13, 4, 2, 1, 3800000.00),
(124, 1062, 8, 1, 9500000.00),
(126, 1064, 3, 1, 2800000.00),
(128, 1066, 5, 1, 1999000.00),
(130, 1067, 4, 1, 6500000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danh_gia_san_pham`
--

DROP TABLE IF EXISTS `danh_gia_san_pham`;
CREATE TABLE IF NOT EXISTS `danh_gia_san_pham` (
  `id_danh_gia` int NOT NULL AUTO_INCREMENT,
  `id_san_pham` int NOT NULL,
  `id_nguoi_dung` int NOT NULL,
  `diem_danh_gia` int DEFAULT NULL,
  `binh_luan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_danh_gia`),
  KEY `danh_gia_san_pham_ibfk_1` (`id_san_pham`),
  KEY `danh_gia_san_pham_ibfk_2` (`id_nguoi_dung`)
) ;

--
-- Đang đổ dữ liệu cho bảng `danh_gia_san_pham`
--

INSERT INTO `danh_gia_san_pham` (`id_danh_gia`, `id_san_pham`, `id_nguoi_dung`, `diem_danh_gia`, `binh_luan`, `ngay_tao`) VALUES
(1, 1, 1, 5, 'Mùi hương rất thơm và lưu hương lâu, shop đóng gói kỹ.', '2025-11-28 19:06:14'),
(2, 1, 1, 5, 'Mùi hương rất thơm và lưu hương lâu, shop đóng gói kỹ.', '2025-11-28 21:07:51'),
(3, 1, 1, 5, 'Chồng mình rất thích mùi này, giao hàng nhanh!', '2025-11-28 21:51:01'),
(4, 3, 1, 5, '1', '2025-12-06 18:15:56'),
(5, 5, 1, 5, 'w2', '2025-12-06 18:43:08');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danh_muc`
--

DROP TABLE IF EXISTS `danh_muc`;
CREATE TABLE IF NOT EXISTS `danh_muc` (
  `id_danh_muc` int NOT NULL AUTO_INCREMENT,
  `ten_danh_muc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_danh_muc`),
  UNIQUE KEY `ten_danh_muc` (`ten_danh_muc`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `danh_muc`
--

INSERT INTO `danh_muc` (`id_danh_muc`, `ten_danh_muc`) VALUES
(1, 'Nước hoa Nam'),
(2, 'Nước hoa Nữ'),
(3, 'Nước hoa Unisex');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `don_hang`
--

DROP TABLE IF EXISTS `don_hang`;
CREATE TABLE IF NOT EXISTS `don_hang` (
  `id_don_hang` int NOT NULL AUTO_INCREMENT,
  `id_nguoi_dung` int DEFAULT NULL,
  `id_nhan_vien` int DEFAULT NULL,
  `trang_thai_van_hanh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai_thanh_toan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tong_tien` decimal(15,2) NOT NULL DEFAULT '0.00',
  `tien_dat_coc` decimal(15,2) DEFAULT '0.00',
  `ten_nguoi_nhan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dia_chi_giao_hang` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ten_khach_vang_lai` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_dat_hang` datetime DEFAULT CURRENT_TIMESTAMP,
  `ma_van_don` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ly_do_huy` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_hoan_thanh` datetime DEFAULT NULL,
  PRIMARY KEY (`id_don_hang`),
  KEY `don_hang_ibfk_1` (`id_nguoi_dung`),
  KEY `don_hang_ibfk_2` (`id_nhan_vien`)
) ENGINE=InnoDB AUTO_INCREMENT=1068 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `don_hang`
--

INSERT INTO `don_hang` (`id_don_hang`, `id_nguoi_dung`, `id_nhan_vien`, `trang_thai_van_hanh`, `trang_thai_thanh_toan`, `tong_tien`, `tien_dat_coc`, `ten_nguoi_nhan`, `dia_chi_giao_hang`, `ten_khach_vang_lai`, `ngay_dat_hang`, `ma_van_don`, `ly_do_huy`, `ngay_hoan_thanh`) VALUES
(1, 1, 2, 'Đã hủy', 'Đã xác nhận', 3500000.00, 0.00, 'Nguyễn Thị Hương', '123 Lê Lợi, Q1, TP.HCM', NULL, '2023-10-01 10:00:00', NULL, 'doi y', '2025-12-02 16:43:44'),
(2, 2, 1, 'Đã xác nhận', 'Chờ cọc', 9700000.00, 0.00, 'Phạm Văn Nam', '456 Cầu Giấy, Hà Nội', NULL, '2025-11-28 19:06:14', NULL, NULL, NULL),
(3, NULL, 1, 'Hoàn thành', 'Đã thanh toán', 2400000.00, 0.00, NULL, NULL, 'Khách A', NULL, '1', NULL, NULL),
(4, 5, 1, 'Chờ hàng', 'Đã cọc', 2500000.00, 1250000.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 2, NULL, 'Đã hủy', 'Chưa thanh toán', 9800000.00, 0.00, 'Nguyen Van A', '123 ABC', NULL, '2025-11-28 21:06:38', NULL, 'het', NULL),
(6, 2, 1, 'Hoàn thành', 'Chưa thanh toán', 9800000.00, 0.00, 'Nguyen Van A', '123 ABC', NULL, '2025-11-28 21:09:03', '234', NULL, '2025-12-06 18:25:19'),
(7, 1, 2, 'Hoàn thành', 'Đã thanh toán', 3200000.00, 0.00, 'Phạm Hương Giang', NULL, NULL, '2023-11-01 08:30:00', NULL, NULL, NULL),
(8, 2, 1, 'Hoàn thành', 'Đã thanh toán', 6500000.00, 3250000.00, 'Trần Tùng', NULL, NULL, '2025-11-28 21:51:01', '3', NULL, '2025-12-06 18:25:02'),
(9, NULL, 2, 'Hoàn thành', 'Đã thanh toán', 1300000.00, 0.00, NULL, NULL, 'Anh Grab Bike', '2025-11-28 21:51:01', '123', NULL, NULL),
(10, 3, NULL, 'Đã hủy', 'Đã xác nhận', 3800000.00, 0.00, NULL, NULL, NULL, '2023-11-20 09:00:00', NULL, 'doi y', NULL),
(11, 5, 2, 'Hoàn thành', 'Đã thanh toán', 250000.00, 50000.00, 'Trần Văn A', '123 Đường Nguyễn Huệ, Quận 1, TP.HCM', NULL, '2025-12-02 16:17:29', 'VN123456789', 'doi y', '2025-12-06 18:24:37'),
(1062, NULL, 1, 'Hoàn thành', 'Đã cọc', 9500000.00, 4750000.00, 'qwe', 'qwe', 'tuyen', NULL, '123', NULL, '2025-12-06 18:04:52'),
(1064, 1, 1, 'Hoàn thành', 'Chưa thanh toán', 2800000.00, 0.00, '123', '123', NULL, '2025-12-06 18:10:25', '123', NULL, '2025-12-06 18:10:58'),
(1065, 1, NULL, 'Giỏ hàng', 'Chưa thanh toán', 0.00, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1066, 1, 1, 'Hoàn thành', 'Chưa thanh toán', 1999000.00, 0.00, '1234', '124', NULL, '2025-12-06 18:31:45', '123', NULL, '2025-12-06 18:32:13'),
(1067, 1, 1, 'Hoàn thành', 'Chưa thanh toán', 6500000.00, 0.00, '123', '123', NULL, '2025-12-06 18:58:02', '1', NULL, '2025-12-06 18:59:01');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoi_dung`
--

DROP TABLE IF EXISTS `nguoi_dung`;
CREATE TABLE IF NOT EXISTS `nguoi_dung` (
  `id_nguoi_dung` int NOT NULL AUTO_INCREMENT,
  `ten_dang_nhap` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mat_khau_bam` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ho_ten` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_dien_thoai` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dia_chi` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_nguoi_dung`),
  UNIQUE KEY `ten_dang_nhap` (`ten_dang_nhap`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoi_dung`
--

INSERT INTO `nguoi_dung` (`id_nguoi_dung`, `ten_dang_nhap`, `mat_khau_bam`, `ho_ten`, `so_dien_thoai`, `dia_chi`) VALUES
(1, '1', '1', 'Nguyễn Thị Hương', '0901234567', '123 Lê Lợi, Q1, TP.HCM'),
(2, 'khachhang2', '123456', 'Phạm Văn Nam', '0912345678', '456 Cầu Giấy, Hà Nội'),
(3, 'user1', '123456', 'Le Thi B', '090...', '...'),
(4, 'khach_vip', '123', 'Phạm Hương Giang', '0988888888', 'Landmark 81, TP.HCM'),
(5, 'khach_moi', '123', 'Trần Tùng', '0912345678', 'Cầu Giấy, Hà Nội'),
(6, 'khach_huy_don', '123', 'Lê Hay Bùng', '0909090909', 'Đà Nẵng'),
(7, '123', '123', '123', '123', '123');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhan_vien`
--

DROP TABLE IF EXISTS `nhan_vien`;
CREATE TABLE IF NOT EXISTS `nhan_vien` (
  `id_nhan_vien` int NOT NULL AUTO_INCREMENT,
  `ten_dang_nhap` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mat_khau_bam` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ho_ten` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vai_tro` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_nhan_vien`),
  UNIQUE KEY `ten_dang_nhap` (`ten_dang_nhap`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nhan_vien`
--

INSERT INTO `nhan_vien` (`id_nhan_vien`, `ten_dang_nhap`, `mat_khau_bam`, `ho_ten`, `vai_tro`) VALUES
(1, '2', '1', '1', 'Admin'),
(2, 'nv1', '1', 'Nguyen Van A', 'staff'),
(4, 'admin_boss', '$2y$10$...', 'Trần Quản Trị', 'Admin'),
(5, 'staff_sale', '$2y$10$...', 'Lê Thu Ngân', 'staff'),
(6, 'staff_kho_1', '$2y$10$...', 'Nguyễn Văn Kho', 'staff');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phieu_doi_tra`
--

DROP TABLE IF EXISTS `phieu_doi_tra`;
CREATE TABLE IF NOT EXISTS `phieu_doi_tra` (
  `id_doi_tra` int NOT NULL AUTO_INCREMENT,
  `id_don_hang` int NOT NULL,
  `id_nguoi_dung` int NOT NULL,
  `id_nhan_vien` int DEFAULT NULL,
  `ly_do` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_doi_tra`),
  KEY `phieu_doi_tra_ibfk_1` (`id_don_hang`),
  KEY `phieu_doi_tra_ibfk_2` (`id_nguoi_dung`),
  KEY `phieu_doi_tra_ibfk_3` (`id_nhan_vien`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `phieu_doi_tra`
--

INSERT INTO `phieu_doi_tra` (`id_doi_tra`, `id_don_hang`, `id_nguoi_dung`, `id_nhan_vien`, `ly_do`, `trang_thai`, `ngay_tao`) VALUES
(1, 1, 1, 2, 'Sản phẩm bị móp hộp nhẹ trong quá trình vận chuyển.', 'Đã duyệt', '2025-11-28 19:06:14'),
(2, 2, 2, 2, '123', 'Từ chối', '2025-11-28 20:48:24'),
(3, 1, 1, 1, 'Vòi xịt bị tắc, không ra nước hoa', 'Từ chối', '2025-11-28 21:51:02'),
(7, 1064, 1, 1, '123123', 'Đã duyệt', '2025-12-06 18:40:57'),
(8, 1064, 1, 1, '123', 'Từ chối', '2025-12-06 18:42:15'),
(9, 1064, 1, 1, '123', 'Từ chối', '2025-12-06 18:42:18'),
(10, 1064, 1, 1, '123', 'Từ chối', '2025-12-06 18:42:22'),
(11, 1066, 1, 1, '1', 'Từ chối', '2025-12-06 18:46:06'),
(12, 1064, 1, 1, '123', 'Từ chối', '2025-12-06 18:48:56');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `san_pham`
--

DROP TABLE IF EXISTS `san_pham`;
CREATE TABLE IF NOT EXISTS `san_pham` (
  `id_san_pham` int NOT NULL AUTO_INCREMENT,
  `ten_san_pham` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `mo_ta` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url_hinh_anh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gia_ban` decimal(38,2) DEFAULT NULL,
  `dung_tich_ml` int DEFAULT NULL,
  `nong_do` int DEFAULT NULL COMMENT 'Ví dụ: nồng độ tinh dầu',
  `so_luong_ton_kho` int DEFAULT '0',
  `id_danh_muc` int DEFAULT NULL,
  `id_thuong_hieu` int DEFAULT NULL,
  PRIMARY KEY (`id_san_pham`),
  KEY `id_danh_muc` (`id_danh_muc`),
  KEY `id_thuong_hieu` (`id_thuong_hieu`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `san_pham`
--

INSERT INTO `san_pham` (`id_san_pham`, `ten_san_pham`, `mo_ta`, `url_hinh_anh`, `gia_ban`, `dung_tich_ml`, `nong_do`, `so_luong_ton_kho`, `id_danh_muc`, `id_thuong_hieu`) VALUES
(1, 'Bleu de Chanel', 'Mùi hương nam tính, mạnh mẽ, sang trọng.', 'http://localhost/uploads/chanel1.jpg', 3500000.00, 100, 20, 43, 1, 1),
(2, 'Dior Sauvage', 'Hương thơm phóng khoáng, tươi mát.', 'http://localhost/uploads/dior.png', 3200000.00, 100, 15, 37, 1, 2),
(3, 'Gucci Bloom', 'Hương hoa nhài và hoa huệ trắng.', 'http://localhost/uploads/Gucci-bloom.png', 2800000.00, 50, 15, 13, 2, 3),
(4, 'Santal 33', 'Hương gỗ đàn hương đặc trưng, unisex.', 'http://localhost/uploads/T.png', 6500000.00, 50, 25, 97, 3, 4),
(5, 'Versace Eros Parfum', 'Nước hoa Versace Eros là sự pha trộn tinh tế giữa tinh dầu bạch hà, táo xanh và hương chanh ở hương đầu tạo nên sự dịu mát.', 'https://orchard.vn/wp-content/uploads/2024/07/versace-eros-parfum_3.jpg', 1999000.00, 100, 30, 90, 1, 5),
(8, 'Roja Elysium', 'Đẳng cấp giới thượng lưu', 'http://localhost/uploads/Roja.jpg', 9500000.00, 50, 35, 0, 1, 1),
(17, '123', '123', '', 123.00, 123, 123, 122, 2, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thuong_hieu`
--

DROP TABLE IF EXISTS `thuong_hieu`;
CREATE TABLE IF NOT EXISTS `thuong_hieu` (
  `id_thuong_hieu` int NOT NULL AUTO_INCREMENT,
  `ten_thuong_hieu` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_thuong_hieu`),
  UNIQUE KEY `ten_thuong_hieu` (`ten_thuong_hieu`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `thuong_hieu`
--

INSERT INTO `thuong_hieu` (`id_thuong_hieu`, `ten_thuong_hieu`) VALUES
(1, 'Chanel'),
(8, 'Coach'),
(6, 'D&G'),
(2, 'Dior'),
(3, 'Gucci'),
(4, 'Le Labo'),
(7, 'Tom Ford'),
(5, 'Versace');

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  ADD CONSTRAINT `chi_tiet_don_hang_ibfk_1` FOREIGN KEY (`id_don_hang`) REFERENCES `don_hang` (`id_don_hang`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `chi_tiet_don_hang_ibfk_2` FOREIGN KEY (`id_san_pham`) REFERENCES `san_pham` (`id_san_pham`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Các ràng buộc cho bảng `danh_gia_san_pham`
--
ALTER TABLE `danh_gia_san_pham`
  ADD CONSTRAINT `danh_gia_san_pham_ibfk_1` FOREIGN KEY (`id_san_pham`) REFERENCES `san_pham` (`id_san_pham`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `danh_gia_san_pham_ibfk_2` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoi_dung` (`id_nguoi_dung`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Các ràng buộc cho bảng `don_hang`
--
ALTER TABLE `don_hang`
  ADD CONSTRAINT `don_hang_ibfk_1` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoi_dung` (`id_nguoi_dung`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `don_hang_ibfk_2` FOREIGN KEY (`id_nhan_vien`) REFERENCES `nhan_vien` (`id_nhan_vien`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Các ràng buộc cho bảng `phieu_doi_tra`
--
ALTER TABLE `phieu_doi_tra`
  ADD CONSTRAINT `phieu_doi_tra_ibfk_1` FOREIGN KEY (`id_don_hang`) REFERENCES `don_hang` (`id_don_hang`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `phieu_doi_tra_ibfk_2` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoi_dung` (`id_nguoi_dung`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `phieu_doi_tra_ibfk_3` FOREIGN KEY (`id_nhan_vien`) REFERENCES `nhan_vien` (`id_nhan_vien`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Các ràng buộc cho bảng `san_pham`
--
ALTER TABLE `san_pham`
  ADD CONSTRAINT `san_pham_ibfk_1` FOREIGN KEY (`id_thuong_hieu`) REFERENCES `thuong_hieu` (`id_thuong_hieu`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `san_pham_ibfk_2` FOREIGN KEY (`id_danh_muc`) REFERENCES `danh_muc` (`id_danh_muc`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
