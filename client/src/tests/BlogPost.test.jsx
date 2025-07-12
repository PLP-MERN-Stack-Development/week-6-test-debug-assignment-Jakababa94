import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BlogPost from '../pages/BlogPost';
import { vi } from 'vitest';
import { postService } from '../services/api';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  };
});

vi.mock('../services/api', () => ({
  postService: {
    getPost: vi.fn(),
    addComment: vi.fn(),
  },
}));

const mockPost = {
  _id: '1',
  title: 'Test Post Title',
  content: 'This is the post content',
  author: { name: 'John Doe' },
  comments: [],
};

describe('BlogPost Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    postService.getPost.mockImplementation(() => new Promise(() => {})); // unresolved
    render(
      <BrowserRouter>
        <BlogPost />
      </BrowserRouter>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders post content after fetching', async () => {
    postService.getPost.mockResolvedValue(mockPost);
    render(
      <BrowserRouter>
        <BlogPost />
      </BrowserRouter>
    );

    expect(await screen.findByText(/test post title/i)).toBeInTheDocument();
    expect(screen.getByText(/this is the post content/i)).toBeInTheDocument();
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });
});
