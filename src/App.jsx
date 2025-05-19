import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import PostList from "./components/PostList";
import Post from "./components/Post";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });

  useEffect(() => {
    document.documentElement.className = theme + '-mode';
    localStorage.setItem('theme', theme);
    // Dispatch a custom event when the theme changes
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Component to conditionally render sidebar based on route
  const LayoutWithSidebar = () => {
    const location = useLocation();
    // Define paths where the sidebar should not be shown, e.g., a dedicated full-screen about page
    // For now, we show it on all post-related pages and the main list.
    const showSidebar = location.pathname.startsWith('/posts') || location.pathname === '/';

    return (
      <div className={`app-container ${showSidebar ? 'with-sidebar' : 'no-sidebar'}`}>
        {showSidebar && <Sidebar />}
        <main className="main-content">
          {/* Routes are now directly rendered here, not inside another Router */}
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:slug" element={<Post />} />
          </Routes>
        </main>
      </div>
    );
  };

  return (
    // <Router> has been removed from here
    <>
      <header className="app-header">
        <nav className="navbar">
          <Link to="/" className="nav-logo">My Markdown Blog</Link>
          <div className="nav-links">
            <Link to="/" className="nav-item">Home</Link>
            <Link to="/posts/about" className="nav-item">About</Link>
            <Link to="/posts/now" className="nav-item">Now</Link>
            {/* Add other top-level navigation items here */}
          </div>
          <button onClick={toggleTheme} className="theme-toggle-button">
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </nav>
      </header>
      <LayoutWithSidebar />
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Your Name/Blog Name. All rights reserved.</p>
        <p><a href="/rss.xml" target="_blank" rel="noopener noreferrer">RSS Feed</a></p>
      </footer>
    </>
    // </Router> was removed
  );
}

export default App;
