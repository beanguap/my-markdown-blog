import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllPostsMetadata } from '../utils/posts';
import './Sidebar.css';

function Sidebar() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    async function fetchPostsData() {
      try {
        setIsLoading(true);
        const metadata = await getAllPostsMetadata();
        setPosts(metadata);
        setFilteredPosts(metadata); // Initially, all posts are shown
        setError(null);
      } catch (err) {
        console.error("Error fetching posts for sidebar:", err);
        setError("Failed to load navigation.");
        setPosts([]);
        setFilteredPosts([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPostsData();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    if (!term) {
      setFilteredPosts(posts);
      return;
    }
    const filtered = posts.filter(post => {
      return (
        post.title.toLowerCase().includes(term) ||
        (post.description && post.description.toLowerCase().includes(term)) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    });
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  if (isLoading) {
    return <aside className="sidebar-container">Loading navigation...</aside>;
  }

  if (error) {
    return <aside className="sidebar-container error-message">{error}</aside>;
  }

  return (
    <aside className="sidebar-container">
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sidebar-search-input"
        />
      </div>
      <nav className="sidebar-nav">
        <ul className="sidebar-post-list">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <li key={post.slug} className={`sidebar-post-item ${location.pathname === `/posts/${post.slug}` ? 'active' : ''}`}>
                <Link to={`/posts/${post.slug}`} className="sidebar-post-link">
                  {post.title}
                </Link>
              </li>
            ))
          ) : (
            <li className="sidebar-no-results">No posts found.</li>
          )}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
