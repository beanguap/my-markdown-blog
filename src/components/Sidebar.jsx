import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import matter from 'gray-matter';

// Use import.meta.glob to get all markdown files from the posts directory
const files = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true });

const posts = Object.entries(files)
  .map(([path, rawContent]) => {
    const { data } = matter(rawContent);
    const slug = path.split('/').pop().replace(/\\.md$/, '');
    return {
      slug,
      title: data.title || 'Untitled Post',
      date: data.date || new Date().toISOString(),
      tags: data.tags || [], // Added tags
      description: data.description || '' // Added description
    };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

export default function Sidebar() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(''); // Added searchTerm state

  const filteredPosts = posts.filter(post => {
    const term = searchTerm.toLowerCase();
    const titleMatch = post.title.toLowerCase().includes(term);
    const tagsMatch = post.tags.some(tag => tag.toLowerCase().includes(term));
    const descriptionMatch = post.description.toLowerCase().includes(term);
    return titleMatch || tagsMatch || descriptionMatch;
  });

  return (
    <aside className="sidebar">
      <input
        type="text"
        placeholder="Search posts..."
        className="sidebar-search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <h3 className="sidebar-title">Posts</h3>
      <nav>
        <ul>
          {filteredPosts.map((post) => { // Changed to filteredPosts
            const isActive = location.pathname === `/posts/${post.slug}`;
            return (
              <li key={post.slug}>
                <Link
                  to={`/posts/${post.slug}`}
                  className={isActive ? 'active-link' : ''}
                >
                  {post.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
