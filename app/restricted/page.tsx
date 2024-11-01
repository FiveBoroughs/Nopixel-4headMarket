"use client";

import { useEffect, useState } from 'react';  // removed unused imports
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import { Product, getProducts } from './utils/product';

export default function RestrictedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeProducts = async () => {
      setLoading(true);
      const initialProducts = await getProducts();
      setProducts(initialProducts);
      setLoading(false);
    };
    initializeProducts();
  }, []);

  // New function to group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const categories = Array.isArray(product.categories)
      ? product.categories
      : [product.categories || 'Uncategorized'];

    categories.forEach(category => {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
    });

    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <main className="min-h-screen bg-black sketchy-bg relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8b000033] to-transparent pointer-events-none" />
      <Header />

      <div className="container mx-auto px-4 py-8">
        {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
          <div key={category} className="mb-12">
            <h2 className="text-[#39ff14] toxic-shadow text-2xl mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (  // removed index and ref
                <ProductCard
                  key={product.id}
                  id={Number(product.id)}
                  title={product.title}
                  price={product.price}
                  image={product.image}
                  warning={product.warning}
                />
              ))}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-center py-8">
            <div className="text-[#39ff14] toxic-shadow animate-pulse">
              Loading more items...
            </div>
          </div>
        )}
      </div>
    </main>
  );
}