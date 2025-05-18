import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import matter from "gray-matter";

// Get all posts as raw
const files = import.meta.glob("../posts/*.md", { as: "raw", eager: true });

export default function Post() {
  // Get slug from URL
  const { slug } = useParams();

  // Find the matching file
  const fileKey = Object.keys(files).find((key) => key.endsWith(`${slug}.md`));
  if (!fileKey) return <div>Post not found</div>;

  // Parse frontmatter and content
  const { content, data } = matter(files[fileKey]);

  return (
    <div>
      <Link to="/">← Back to Posts</Link>
      <h1>{data.title}</h1>
      <small>{data.date}</small>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
