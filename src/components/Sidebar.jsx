import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import matter from 'gray-matter';

// Use import.meta.glob to get all markdown files from the posts directory
const files = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true });

const posts = Object.entries(files)
  .map(([path, rawContent]) => {
    const { data } = matter(rawContent);
    const slug = path.split('/').pop().replace(/\.md$/, '');
    return {
      slug,
      title: data.title || 'Untitled Post',
      date: data.date || new Date().toISOString(),
    };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">Posts</h3>
      <nav>
        <ul>
          {posts.map((post) => {
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
