const API_BASE_URL = 'http://localhost:8000/api';

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    name: string;
  };
  tag: {
    id: number;
    name: string;
  };
  item: {
    id: number;
    name: string;
  };
}

export interface ApiResponse<T> {
  data: T[];
}

export const postService = {
  async getPosts(): Promise<Post[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/post`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data: ApiResponse<Post> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  async getPostById(id: number): Promise<Post | undefined> {
    try {
      const posts = await this.getPosts();
      return posts.find(post => post.id === id);
    } catch (error) {
      console.error(`Error fetching post with id ${id}:`, error);
      throw error;
    }
  },

  async getPostsByCategory(categoryId: number): Promise<Post[]> {
    try {
      const posts = await this.getPosts();
      return posts.filter(post => post.category.id === categoryId);
    } catch (error) {
      console.error(`Error fetching posts for category ${categoryId}:`, error);
      throw error;
    }
  }
};
