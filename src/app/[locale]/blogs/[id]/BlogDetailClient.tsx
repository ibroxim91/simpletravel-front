'use client';

import BlogDetail from '@/features/blogs/ui/BlogDetail';
import { Suspense } from 'react';

const BlogDetailClient = () => {
  return (
    <Suspense>
      <div className="flex flex-col gap-10 mb-10 overflow-hidden">
        <BlogDetail />
      </div>
    </Suspense>
  );
};

export default BlogDetailClient;
