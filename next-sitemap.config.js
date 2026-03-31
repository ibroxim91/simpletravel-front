/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,

  transform: async (config, path) => ({
    loc: path,
    changefreq: 'weekly',
    priority: path === '/' ? 1.0 : 0.8,
    lastmod: new Date().toISOString(),
  }),

  additionalPaths: async (config) => {
    // 1️⃣ Blogs
    const blogsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/post/`,
    );
    const blogsJson = await blogsRes.json();
    const blogs = blogsJson.data?.results || [];

    const blogPaths = blogs.map((blog) =>
      config.transform(config, `/blogs/${blog.slug}`),
    );

    // 2️⃣ Products / Tickets
    const productsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tickets/`,
    );
    const productsJson = await productsRes.json();
    const products = productsJson.data?.results.tickets || [];

    const productPaths = products.map((product) =>
      config.transform(config, `/selectour/${product.slug}`),
    );

    return [...blogPaths, ...productPaths];
  },
};
