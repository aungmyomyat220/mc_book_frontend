'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

function CategoryContent() {
  const router = useRouter();
  const params = useParams();
  const categoryId = Array.isArray(params.categoryId) ? params.categoryId[0] : params.categoryId;
  
  const [selectedTag, setSelectedTag] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const itemsPerPage = 5;
  
  useEffect(() => {
    const loadCategoryAndBooks = async () => {
      try {
        if (!categoryId) return;
        
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${categoryId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch category and books');
        }
        const data = await response.json();
        
        setCategory({
          id: data.id,
          name: data.category_name,
          description: data.category_description,
          cover: data.category_cover
        });
        
        // Transform books data to match the existing structure
        const transformedBooks = data.books.map((book: any) => ({
          id: book.id,
          title: book.name,
          content: book.description,
          image: book.image_link,
          tags: book.tags.map((tag: any) => tag.tag.name),
          views: book.views
        }));
        
        setBooks(transformedBooks);
        setError(null);
      } catch (err) {
        console.error('Error loading category:', err);
        setError(err instanceof Error ? err : new Error('Failed to load category'));
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryAndBooks();
  }, [categoryId]);

  // Format view count with k notation for numbers >= 1000
  const formatViewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  // Calculate tag counts
  const tagCounts = books.reduce((acc, book) => {
    book.tags?.forEach((tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Add 'All' tag with total count
  const allTags = [
    { name: 'All', count: books.length },
    ...Array.from(new Set(books.flatMap(book => book.tags || [])))
      .map(tag => ({ name: tag, count: tagCounts[tag] || 0 }))
      .sort((a, b) => b.count - a.count) // Sort by count descending
  ];

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  const filteredByTag = selectedTag === 'All' 
    ? books 
    : books.filter(book => book.tags?.includes(selectedTag));

  const totalPages = Math.ceil(filteredByTag.length / itemsPerPage);
  const currentItems = filteredByTag.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        <div className="text-red-500">Error loading category: {error.message}</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Category not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gray-800 text-white rounded-lg shadow-lg">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center mb-4">
            <h1 className="text-2xl font-bold">{category.name}</h1>
          </div>
          <p className="text-gray-300 mt-2">{category.description}</p>
          
          {/* Tag Selection */}
          <div className="flex flex-wrap gap-2 mt-4">
            {allTags.map((tag) => (
              <button
                key={tag.name}
                onClick={() => handleTagFilter(tag.name)}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  selectedTag === tag.name
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                {tag.name}
                <span className="text-xs opacity-80 ml-1">
                  ({formatViewCount(tag.count)})
                </span>
              </button>
            ))}
          </div>
          <button 
              onClick={() => router.push(`/myanmar-comic/home`)}
              className="flex items-center mt-5 text-blue-400 hover:text-blue-300 mr-4"
            >
              <svg 
                className="w-5 h-5 mr-1" 
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
              <span>နောက်သို့</span>
            </button>
        </div>
      </header>

      {/* Main content area with fixed header and scrollable content */}
      <div className="flex flex-col h-[calc(100vh-200px)]">
        <div className="border-t border-gray-700 mt-5"></div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <main className="max-w-4xl mx-auto p-4">
            <div className="space-y-4">
              {currentItems.length > 0 ? (
                currentItems.map((book) => (
                  <div key={book.id} className="space-y-2">
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                      <div className="relative w-32 h-48 flex-shrink-0">
                        <Image
                          src={book.image}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4 flex flex-col h-full">
                        <div className="flex-grow">
                          <h2 className="font-semibold text-lg mb-2">{book.title}</h2>
                          <div className="text-white text-sm line-clamp-3 mb-2">
                            {book.content}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {book.tags?.map((tag: string, index: number) => (
                              <span key={index} className="text-xs bg-gray-300 text-black px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-auto pt-2 text-right">
                          <div className="inline-flex items-center text-sm text-gray-400">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{book.views ? formatViewCount(book.views) : '0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link 
                      href={`/myanmar-comic/home/${categoryId}/post/${book.id}`}
                      className="block w-full text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
                    >
                      ဖတ်ရှူရန်
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No books found in this category.
                </div>
              )}
            </div>

            {/* Pagination (keep the existing pagination code) */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-md ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Keep the default export
export default function CategoryPage() {
  return <CategoryContent />;
}