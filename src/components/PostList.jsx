import { Link } from "react-router-dom";
import matter from "gray-matter";

const files = import.meta.glob("../posts/*.md", { query: "?raw", import: "default", eager: true });

const posts = Object.entries(files)
  .map(([path, content]) => {
    const { data, content: md } = matter(content);
    const slug = path.split("/").pop().replace(/\.md$/, "");
    // Grab the first real paragraph (skip headings)
    const excerpt =
      md
        .split("\n\n")
        .filter((block) => !block.trim().startsWith("#") && block.trim().length > 0)[0]?.trim().slice(0, 120) +
      (md.split("\n\n").filter((block) => !block.trim().startsWith("#") && block.trim().length > 0)[0]?.length > 120 ? "…" : "");
    return { ...data, slug, excerpt };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

// Now the component:

export default function PostList() {
  return (
    <div className="post-list">
      <h1>My Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={`/posts/${post.slug}`}>{post.title}</Link>
            <br />
            <small>{post.date}</small>
            <p>{post.description || post.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
