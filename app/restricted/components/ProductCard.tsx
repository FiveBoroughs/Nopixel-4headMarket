"use client";

import { AlertTriangle, Package } from 'lucide-react';
import Image from 'next/image';
import { forwardRef } from 'react';

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  show_price: boolean;
  stock: number;
  show_stock: boolean;
  image: string;
  warning?: string;
  categories?: string[];
  sort?: number;
  enabled: boolean;
  group?: string[];
}

const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ id, title, price, show_price, stock, show_stock, image, warning, categories, sort, enabled, group }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white/20 border border-[#39ff14] rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
      >
        <div className="relative aspect-square">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain opacity-80 hover:opacity-100 transition-opacity p-5"
          />
          {warning && (
          <div className="absolute top-2 right-2 bg-[#8b0000] px-3 py-1 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-5 h-5 text-black" />
            <span className="font-mono">{warning}</span>
          </div>
          )}
          {show_stock && (
            <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded-full flex items-center gap-1">
              <Package className="w-3 h-3 text-[#39ff14]" />
              <p className="text-[#39ff14] text-xs">
                {stock}+
              </p>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-[#39ff14] toxic-shadow text-xl mb-2">{title}</h3>
          {show_price ? (
            <p className="text-[#39ff14] toxic-shadow text-3xl font-bold mb-4">
              ${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          ) : (
            <div className="relative">
              <p className="text-[#39ff14] toxic-shadow text-3xl font-bold blur-sm mb-4 relative">
                <span className="relative">
                  ${price.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/\d/g, '#')}
                  <span className="absolute left-0 top-1/2 w-full h-2 bg-red-500 -rotate-12 origin-center blur-none"></span>
                </span>
              </p>
            </div>
          )}
          {show_stock && (
            <p className="text-[#39ff14] text-sm mt-2">
              Stock: {stock} {stock === 1 ? 'unit' : 'units'} available
            </p>
          )}
          </div>
      </div>
    );
  }
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;