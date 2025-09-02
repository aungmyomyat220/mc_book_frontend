'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import CreateHandler from 'monetag-tg-sdk'

type BookItem = {
  id: number;
  name: string;
  image_link: string;
  content: string;
};

type Book = {
  id: number;
  name: string;
};

export default function BookItemPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = Array.isArray(params.categoryId)
    ? params.categoryId[0]
    : params.categoryId;
  const bookId = Array.isArray(params.bookId)
    ? params.bookId[0]
    : params.bookId;
  const itemId = Array.isArray(params.itemId)
    ? params.itemId[0]
    : params.itemId;

  const [book, setBook] = useState<Book | null>(null);
  const [item, setItem] = useState<BookItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [itemIds, setItemIds] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isVisible, setIsVisible] = useState(false);

  // Show/hide scroll to top button
  const toggleVisibility = useCallback(() => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [toggleVisibility]);

  // Ad configuration
  useEffect(() => {
    const adHandler = CreateHandler(9748595);
    
    adHandler({
      type: 'inApp',
      inAppSettings: {
        frequency: 1,       // max 2 ads
        capping: 0.1,       // in 6 minutes
        interval: 50,       // 50s between ads
        timeout: 50,        // show first ad after 10s
        everyPage: false,   
      },
    }).then(() => {
      console.log('Ad configured successfully');
    }).catch((error) => {
      console.error('Ad configuration error:', error);
    });

    // Cleanup function
    return () => {
      // Add any necessary cleanup for the ad handler here
    };
  }, [itemId]);

  // Fetch book and item data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch book details
        const bookResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/books/${bookId}`
        );
        if (!bookResponse.ok) throw new Error('Failed to fetch book');
        const bookData = await bookResponse.json();

        // Fetch items with their real IDs
        const itemsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/books/${bookId}/item-count`
        );
        if (!itemsResponse.ok) throw new Error('Failed to fetch items');
        const itemsData = await itemsResponse.json();
        
        setItemIds(itemsData.itemIds);
        setTotalItems(itemsData.count);

        // Find the current index based on the itemId in URL
        const currentId = parseInt(itemId || itemsData.itemIds[0].toString());
        const foundIndex = itemsData.itemIds.findIndex((id: number) => id === currentId);
        
        if (foundIndex === -1) throw new Error('Item not found');
        
        setCurrentIndex(foundIndex);
        
        // Fetch current item using the real ID
        const itemResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/items/${currentId}`
        );
        if (!itemResponse.ok) throw new Error('Failed to fetch item');
        const itemData = await itemResponse.json();

        setBook(bookData);
        setItem(itemData);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchData();
    }
  }, [bookId, itemId]);

  const navigateToItem = (direction: 'prev' | 'next') => {
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < itemIds.length) {
      const newItemId = itemIds[newIndex];
      setCurrentIndex(newIndex);
      router.push(
        `/myanmar-comic/home/${categoryId}/post/${bookId}/${newItemId}`
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !book || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-red-500">{error || 'Content not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Bar */}
      <Link
        href={`/myanmar-comic/home/${categoryId}/post/${bookId}`}
        className="flex items-center text-blue-400 hover:underline"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        နောက်သို့ပြန်ရန်
      </Link>
      <div className="bg-gray-800 mt-7 p-4 flex flex-col items-center justify-between">
        <h1 className="text-lg font-semibold">
          {book.name} - {item.name}
        </h1>
      </div>

      {/* Content */}
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Item Image */}
        <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
          {item.image_link ? (
            <img
              src={item.image_link}
              alt={item.name}
              className="w-full h-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = '/placeholder.jpg';
              }}
            />
          ) : (
            <div className="bg-gray-700 h-64 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Item Content */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6 whitespace-pre-line">
          {item.content}
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-8 mb-12">
          <button
            onClick={() => navigateToItem('prev')}
            disabled={currentIndex <= 0}
            className={`px-4 py-2 rounded-lg ${
              currentIndex <= 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            နောက်သို့
          </button>

          <div className="text-center">
            <span className="text-gray-300">
              စာမျက်နှာ {currentIndex + 1} / {totalItems}
            </span>
          </div>

          <button
            onClick={() => navigateToItem('next')}
            disabled={currentIndex >= totalItems - 1}
            className={`px-4 py-2 rounded-lg ${
              currentIndex >= totalItems - 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            ရှေ့ဆက်ရန်
          </button>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110"
          aria-label="Go to top"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </button>
      )}
    </div>
  );
}
