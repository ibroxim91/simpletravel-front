'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const BlogHeader = dynamic(() => import('@/features/blogs/ui/Headers'), {
  ssr: false,
});

const News = dynamic(() => import('@/features/blogs/ui/News'), {
  ssr: false,
});

const Blogs = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col gap-10 mb-10 overflow-hidden">
        <BlogHeader />
        <News />
      </div>
    </Suspense>
  );
};

export default Blogs;
