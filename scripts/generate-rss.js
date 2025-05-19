\
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { Feed } = require('feed'); // Using 'feed' package

const postsDirectory = path.join(__dirname, '../src/posts');
const publicDirectory = path.join(__dirname, '../public');

async function generateRssFeed() {
  const siteURL = 'YOUR_SITE_URL'; // Replace with your actual site URL e.g., https://yourblog.com
  const siteTitle = 'My Markdown Blog'; // Replace with your blog title
  const siteDescription = 'Posts about tech, life, and everything in between.'; // Replace with your blog description
  const authorName = '[Your Name/Handle]'; // Replace with your name
  const authorEmail = '[Your Email]'; // Optional: Replace with your email
  const authorLink = siteURL; // Optional: Link to your site or social media

  const feed = new Feed({
    title: siteTitle,
    description: siteDescription,
    id: siteURL,
    link: siteURL,
    language: 'en', // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: `${siteURL}/vite.svg`, // Optional: URL to an image
    favicon: `${siteURL}/favicon.ico`, // Optional: URL to a favicon
    copyright: `All rights reserved ${new Date().getFullYear()}, ${authorName}`,
    updated: new Date(), // optional, default = new Date()
    generator: 'Awesome Feed Generator', // optional, default = 'Feed for Node.js'
    feedLinks: {
      json: `${siteURL}/feed.json`, // optional
      atom: `${siteURL}/atom.xml`, // optional
      rss: `${siteURL}/rss.xml`   // Link to the RSS feed itself
    },
    author: {
      name: authorName,
      email: authorEmail,
      link: authorLink
    }
  });

  const filenames = fs.readdirSync(postsDirectory);

  filenames.forEach((filename) => {
    if (path.extname(filename) === '.md') {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      const slug = filename.replace(/\\.md$/, '');
      const postUrl = `${siteURL}/posts/${slug}`;

      // Basic HTML conversion for description (can be improved with a markdown parser)
      const description = data.description || content.substring(0, 200).replace(/\\n/g, ' ') + '...';


      if (data.title && data.date) { // Only include posts with title and date
        feed.addItem({
          title: data.title,
          id: postUrl,
          link: postUrl,
          description: description,
          content: content, // Full markdown content, some readers might render it
          author: [
            {
              name: authorName,
              email: authorEmail,
              link: authorLink
            }
          ],
          date: new Date(data.date),
          // image: data.image, // if you have images in frontmatter
        });
      }
    }
  });

  if (!fs.existsSync(publicDirectory)) {
    fs.mkdirSync(publicDirectory, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDirectory, 'rss.xml'), feed.rss2());
  // fs.writeFileSync(path.join(publicDirectory, 'atom.xml'), feed.atom1()); // Optional Atom feed
  // fs.writeFileSync(path.join(publicDirectory, 'feed.json'), feed.json1()); // Optional JSON feed

  console.log('RSS feed generated!');
}

generateRssFeed().catch(console.error);
