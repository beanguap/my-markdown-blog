import React, { useState, useEffect } from "react"; // Added useState, useEffect
import { Routes, Route, Link } from "react-router-dom";
import PostList from "./components/PostList";
import Post from "./components/Post";
import Sidebar from "./components/Sidebar";

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light'; // Default to light theme
  });

  useEffect(() => {
    document.documentElement.className = theme; // Apply theme to <html> tag
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <button onClick={toggleTheme} className="theme-toggle-button">
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </nav>
      <div className="main-layout">
        <Sidebar />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:slug" element={<Post />} />
            {/* Add a route for the "now" page if you want a direct link,
                otherwise it's accessible via sidebar */}
            <Route path="/posts/now" element={<Post />} /> 
            <Route path="/posts/about" element={<Post />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
