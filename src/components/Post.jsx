import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import matter from "gray-matter";
import { useParams, Link } from "react-router-dom";

const files = import.meta.glob("../posts/*.md", { query: "?raw", import: "default", eager: true });

export default function Post() {
  const { slug } = useParams();
  const fileKey = Object.keys(files).find((key) => key.endsWith(`${slug}.md`));
  if (!fileKey) return <div className="post-container content-pane">Post not found</div>;

  const { data, content } = matter(files[fileKey]);

  return (
    <div className="post-container content-pane">
      <Link to="/">← Back</Link>
      <h1>{data.title}</h1>
      <small>{data.date}</small>
      <ReactMarkdown
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={dracula}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
