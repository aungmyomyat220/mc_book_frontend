'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type BookItem = {
  id: number;
  page_number: number;
};

type Book = {
  id: number;
  name: string;
};

export default function BookItemPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = Array.isArray(params.categoryId) ? params.categoryId[0] : params.categoryId;
  const bookId = Array.isArray(params.bookId) ? params.bookId[0] : params.bookId;
  
  const [book, setBook] = useState<Book | null>(null);
  const [items, setItems] = useState<BookItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch book and items
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch book details
        const bookResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/books/${bookId}`);
        if (!bookResponse.ok) throw new Error('Failed to fetch book');
        const bookData = await bookResponse.json();
        
        // Fetch items with their real IDs
        const itemsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/books/${bookId}/item-count`);
        if (!itemsResponse.ok) throw new Error('Failed to fetch items');
        const itemsData = await itemsResponse.json();
        
        // Create items array with real IDs and page numbers
        const itemsArray = itemsData.itemIds.map((id: number, index: number) => ({
          id: id,
          page_number: index + 1
        }));
        
        setBook(bookData);
        setItems(itemsArray);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load book. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (bookId) {
      fetchData();
    }
  }, [bookId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error || 'Book not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href={`/myanmar-comic/home/${categoryId}`}
          className="inline-flex items-center text-blue-400 hover:underline"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          နောက်သို့ဆုတ်ရန်
        </Link>
      </div>

      {/* Book Title */}
      <h1 className="text-2xl font-bold mb-6">{book.name}</h1>
      
      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <div 
            key={item.id}
            className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => router.push(`/myanmar-comic/home/${categoryId}/post/${bookId}/${item.id}`)}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white mr-4">
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">အပိုင်း - {item.page_number}</h3>
              <p className="text-sm text-gray-400">ဖတ်ရန်နှိပ်ပါ</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}