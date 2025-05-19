import matter from "gray-matter";
import { Link } from "react-router-dom";

const files = import.meta.glob("../posts/*.md", { query: "?raw", import: "default", eager: true });

const posts = Object.entries(files)
  .map(([path, content]) => {
    const { data, content: mdContent } = matter(content);
    const slug = path.split("/").pop().replace(/\.md$/, "");

    // Attempt to find the first paragraph for a summary
    let summary = data.description || ""; // Use description from frontmatter if available
    if (!summary) {
      const firstParagraphMatch = mdContent.match(/^([A-Za-z0-9_,\s\-'.()]+)(?=\n\n|\r\n\r\n|$)/m);
      if (firstParagraphMatch && firstParagraphMatch[0].trim().length > 10) {
        // Basic check for meaningful content
        summary = firstParagraphMatch[0].trim().substring(0, 150) + "...";
      } else {
        summary = mdContent.substring(0, 150) + "..."; // Fallback if no clear paragraph
      }
    }

    return {
      slug,
      title: data.title || "Untitled Post",
      date: data.date || new Date().toISOString().split("T")[0],
      description: summary, // Use the generated or frontmatter summary
    };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

export default function PostList() {
  return (
    <div className="post-list content-pane">
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={`/posts/${post.slug}`}>{post.title}</Link>
            <small>{new Date(post.date).toLocaleDateString()}</small>
            <p>{post.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
