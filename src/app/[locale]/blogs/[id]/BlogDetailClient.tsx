'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const BlogDetail = dynamic(() => import('@/features/blogs/ui/BlogDetail'), {
  ssr: false,
});

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
