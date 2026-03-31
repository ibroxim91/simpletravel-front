import { Suspense } from 'react';
import SelectourClient from './selectourClient';

export default async function Page() {
  return (
    <>
      <Suspense>
        <SelectourClient />
      </Suspense>
    </>
  );
}
