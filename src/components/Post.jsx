import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula, coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getPostBySlug } from "../utils/posts";
import "./Post.css";

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const handleThemeChange = () => {
      setCurrentTheme(localStorage.getItem("theme") || "light");
    };
    window.addEventListener("themeChanged", handleThemeChange);
    return () => window.removeEventListener("themeChanged", handleThemeChange);
  }, []);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const postData = await getPostBySlug(slug);
        if (postData) {
          setPost(postData);
          setError(null);
        } else {
          setError("Post not found.");
          setPost(null);
        }
      } catch (err) {
        console.error(`Error fetching post ${slug}:`, err);
        setError("Failed to load post.");
        setPost(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="post-container content-pane">Loading post...</div>;
  }

  if (error) {
    return (
      <div className="post-container content-pane error-message">{error}</div>
    );
  }

  if (!post) {
    return <div className="post-container content-pane">Post not found.</div>;
  }

  const syntaxTheme = currentTheme === "dark" ? dracula : coy;

  return (
    <div className="post-container content-pane">
      <Link to="/">← Back</Link>
      <h1>{post.frontmatter.title}</h1>
      <small>{new Date(post.frontmatter.date).toLocaleDateString()}</small>
      {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
        <div className="post-tags">
          Tags:{" "}
          {post.frontmatter.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      <ReactMarkdown
        children={post.content}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, "")}
                style={syntaxTheme}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
}
