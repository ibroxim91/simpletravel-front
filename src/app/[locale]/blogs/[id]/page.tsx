import { Suspense } from 'react';
import BlogDetailClient from './BlogDetailClient';

export default async function BlogDetailPage() {
  return (
    <>
      <Suspense>
        <BlogDetailClient />
      </Suspense>
    </>
  );
}
