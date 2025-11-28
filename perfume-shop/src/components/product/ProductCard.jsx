import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ id_san_pham, ten_san_pham, gia_ban, url_hinh_anh, id_thuong_hieu  }) => {
  // Map brand IDs to names (same as in POSPage)


  return (
    <Link to={`/product/${id_san_pham}`} className="flex flex-col gap-4 group">
      <div className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg overflow-hidden border border-border-light dark:border-border-dark">
        <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            src={url_hinh_anh}
            alt={ten_san_pham}
        />
      </div>
      <div className="px-2">
        <p className="text-base font-bold leading-normal">{ten_san_pham}</p>
        <p className="text-text-subtle-light dark:text-text-subtle-dark text-sm font-normal leading-normal">{[id_thuong_hieu]}</p>
        <p className="text-primary text-sm font-bold leading-normal mt-1">{gia_ban.toLocaleString('vi-VN')}₫</p>
      </div>
    </Link>
  );
};

export default ProductCard;
