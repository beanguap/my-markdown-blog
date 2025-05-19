// src/utils/posts.js
import matter from 'gray-matter';

// Get all .md files in the posts directory
// Update to use query syntax for Vite 6+
const postModules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default' });

let allPostsMetadataCache = null;

export async function getAllPostsMetadata() {
  if (allPostsMetadataCache) {
    return allPostsMetadataCache;
  }

  const posts = [];
  for (const path in postModules) {
    try {
      const rawContent = await postModules[path](); // Dynamically import the raw string
      const { data } = matter(rawContent);
      // Extract slug from path, e.g., ../posts/my-post.md -> my-post
      const slug = path.match(/([^/]+)\.md$/)?.[1];

      if (slug) {
        posts.push({
          slug,
          title: data.title || 'Untitled Post',
          date: data.date || new Date().toISOString(),
          description: data.description || '',
          tags: data.tags || [],
          ...data, // include any other frontmatter
        });
      }
    } catch (error) {
      console.error(`Failed to load or parse post: ${path}`, error);
      // Optionally skip this post or handle error differently
    }
  }

  // Sort posts by date, newest first
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  allPostsMetadataCache = posts;
  return posts;
}

export async function getPostBySlug(slug) {
  // Construct the expected key in postModules map.
  // e.g., slug 'my-first-post' becomes '../posts/my-first-post.md'
  const moduleKey = `../posts/${slug}.md`;

  if (postModules[moduleKey]) {
    try {
      const rawContent = await postModules[moduleKey]();
      const { data: frontmatter, content } = matter(rawContent);
      return {
        frontmatter: {
          title: frontmatter.title || 'Untitled Post',
          date: frontmatter.date || new Date().toISOString(),
          ...frontmatter
        },
        content,
        slug,
      };
    } catch (error) {
      console.error(`Failed to load or parse post by slug: ${slug}`, error);
      return null; // Post not found or error during processing
    }
  }
  console.warn(`Post with slug "${slug}" not found.`);
  return null; // Post not found
}
