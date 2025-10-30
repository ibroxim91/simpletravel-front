import { Suspense } from 'react';
import FaqClient from './faqClient';

export default async function Faq() {
  return (
    <>
      <Suspense>
        <FaqClient />
      </Suspense>
    </>
  );
}
