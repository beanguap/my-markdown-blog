import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllPostsMetadata } from "../utils/posts"; // Import the new utility
import "./PostList.css";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const postsData = await getAllPostsMetadata();
        setPosts(postsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching posts metadata:", err);
        setError("Failed to load posts. Please try again later.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="post-list-container content-pane">Loading posts...</div>;
  }

  if (error) {
    return <div className="post-list-container content-pane error-message">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="post-list-container content-pane">No posts found.</div>;
  }

  return (
    <div className="post-list-container content-pane">
      <h1 className="post-list-title">Blog Posts</h1>
      <ul className="post-list">
        {posts.map((post) => {
          // Use frontmatter description if available, otherwise generate a short excerpt
          // For simplicity, we'll just use the description or a placeholder.
          // More complex excerpt generation can be added here if needed.
          const summary = post.description || "Read more...";

          return (
            <li key={post.slug} className="post-list-item">
              <Link to={`/posts/${post.slug}`} className="post-link">
                <h2 className="post-title">{post.title}</h2>
                <p className="post-date">{new Date(post.date).toLocaleDateString()}</p>
                <p className="post-summary">{summary}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PostList;
