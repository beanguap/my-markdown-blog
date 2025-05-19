import { Routes, Route, Link } from "react-router-dom";
import PostList from "./components/PostList";
import Post from "./components/Post";
import Sidebar from "./components/Sidebar"; // Import the Sidebar

function App() {
  return (
    <>
      <nav className="navbar">
        <Link to="/">Home</Link>
      </nav>
      <div className="main-layout">
        <Sidebar /> {/* Add the Sidebar component here */}
        <main className="content-area">
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:slug" element={<Post />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
