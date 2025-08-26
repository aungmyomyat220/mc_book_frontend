import { useState, useEffect, useCallback } from 'react';
import { Post, postService } from '@/services/postService';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await postService.getPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const getPostById = useCallback(
    async (id: number): Promise<Post | undefined> => {
      try {
        return await postService.getPostById(id);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch post'));
        return undefined;
      }
    },
    []
  );

  const getPostsByCategory = useCallback(
    async (categoryId: number): Promise<Post[]> => {
      try {
        return await postService.getPostsByCategory(categoryId);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch posts by category'));
        return [];
      }
    },
    []
  );

  return {
    posts,
    loading,
    error,
    getPostById,
    getPostsByCategory,
    refetch: fetchPosts,
  };
};

export default usePosts;
