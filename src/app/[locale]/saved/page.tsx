import { Suspense } from 'react';
import SavedClient from './savedClient';

export default async function SavedPage() {
  return (
    <>
      <Suspense>
        <SavedClient />
      </Suspense>
    </>
  );
}
