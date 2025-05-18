import { Link } from "react-router-dom";
import matter from "gray-matter";

const files = import.meta.glob("../posts/*.md", { as: "raw", eager: true });

const posts = Object.entries(files)
  .map(([path, content]) => {
    const { data } = matter(content); // Parse frontmatter
    const slug = path.split("/").pop().replace(/\.md$/, "");

    return { ...data, slug };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

// Now the component:

export default function PostList() {
  return (
    <div>
      <h1>My Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={`/posts/${post.slug}`}>{post.title}</Link>
            <br />
            <small>{post.date}</small>
            <p>{post.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
