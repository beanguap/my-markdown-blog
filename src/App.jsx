import { Routes, Route } from "react-router-dom";
import PostList from "./components/PostList";
import Post from "./components/Post";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PostList />} />
      <Route path="/posts/:slug" element={<Post />} />
    </Routes>
  );
}

export default App;
