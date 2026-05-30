import { Suspense } from 'react';
import SelectourTestClient from './selectourTestClient';

export default async function Page() {
  return (
    <>
      <Suspense>
        <SelectourTestClient />
      </Suspense>
    </>
  );
}
