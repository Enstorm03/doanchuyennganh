import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ id, name, brand, price, image }) => {
  return (
    <Link to={`/product/${id}`} className="flex flex-col gap-4 group">
      <div className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg overflow-hidden border border-border-light dark:border-border-dark">
        <img 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            src={image} 
            alt={name} 
        />
      </div>
      <div className="px-2">
        <p className="text-base font-bold leading-normal">{name}</p>
        <p className="text-text-subtle-light dark:text-text-subtle-dark text-sm font-normal leading-normal">{brand}</p>
        <p className="text-primary text-sm font-bold leading-normal mt-1">${price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;