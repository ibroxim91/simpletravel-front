'use client';
import BlogHeader from '@/features/blogs/ui/Headers';
import News from '@/features/blogs/ui/News';
import { Suspense } from 'react';

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
