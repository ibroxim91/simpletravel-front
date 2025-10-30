import { Suspense } from 'react';
import BlogsClient from './BlogsClient';

export default async function Blogs() {
  return (
    <>
      <Suspense>
        <BlogsClient />
      </Suspense>
    </>
  );
}
