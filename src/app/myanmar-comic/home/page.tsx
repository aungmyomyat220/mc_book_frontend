'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: number;
  category_name: string;
  category_cover: string;
  category_description: string;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <main className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          ဇာတ်လမ်းအမျိုးအစား
        </h1>
        
        <div className="space-y-8">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/myanmar-comic/home/${category.id}`}
              className="block group"
            >
              <div className="relative rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                {/* Full-width cover image */}
                <div className="relative w-full h-48">
                  <Image
                    src={category.category_cover}
                    alt={category.category_name}
                    fill
                    className="object-cover"
                  />
                  {/* Gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h2 className="text-xl font-bold">{category.category_name}</h2>
                  <p className="text-sm text-gray-200">{category.category_description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
