'use client';

import { Suspense } from 'react';

import BlogHeader from '@/features/blogs/ui/Headers';
import News from '@/features/blogs/ui/News';

const BlogsClient = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <div className="flex flex-col gap-10 mb-10 overflow-hidden">
        <BlogHeader />
        <News />
      </div>
    </Suspense>
  );
};

export default BlogsClient;
