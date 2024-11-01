"use client";

import { DollarSign, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { forwardRef } from 'react';

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  warning?: string;
}

const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ id, title, price, image, warning }, ref) => {
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
        </div>

        <div className="p-4">
          <h3 className="text-[#39ff14] toxic-shadow text-xl mb-2">{title}</h3>
          <p className="text-[#39ff14] toxic-shadow text-3xl font-bold mb-4">
            ${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;