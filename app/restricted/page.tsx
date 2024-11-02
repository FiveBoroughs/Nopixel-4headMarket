"use client";

import { useEffect, useState } from 'react';  // removed unused imports
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import { Product, getProducts } from './utils/product';
import { AlertTriangle } from 'lucide-react';

export default function RestrictedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeProducts = async () => {
      try {
        setLoading(true);
        const initialProducts = await getProducts();
        setProducts(initialProducts);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load products'));
      } finally {
        setLoading(false);
      }
    };
    initializeProducts();
  }, []);

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-black sketchy-bg relative">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white/20 border border-[#39ff14] rounded-lg overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-white/10" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-6 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-black/50 p-6 border border-[#8b0000] rounded-lg backdrop-blur-sm max-w-md">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-[#8b0000]" />
            <h2 className="text-xl text-[#8b0000] toxic-shadow">DATA CORRUPTION</h2>
          </div>
          <p className="text-gray-400">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#8b0000] hover:bg-[#39ff14] hover:text-black transition-colors duration-300 border border-[#39ff14] rounded"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

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
            <h2 className="text-[#39ff14] toxic-shadow text-2xl mb-6">{category.toUpperCase()}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (  // removed index and ref
                <ProductCard
                  key={product.id}
                  id={Number(product.id)}
                  title={product.title}
                  price={product.price}
                  show_price={product.show_price}
                  stock={product.stock}
                  show_stock={product.show_stock}
                  image={product.image}
                  warning={product.warning}
                  enabled={product.enabled}
                  categories={product.categories}
                  group={product.group}
                  sort={product.sort}
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