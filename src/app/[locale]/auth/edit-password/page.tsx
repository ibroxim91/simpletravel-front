import { Suspense } from 'react';
import EditPasswordClient from './EditPasswordClient';

export default async function EditPassword() {
  return (
    <>
      <Suspense>
        <EditPasswordClient />
      </Suspense>
    </>
  );
}
