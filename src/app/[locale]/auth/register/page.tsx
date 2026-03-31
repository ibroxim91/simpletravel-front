import { Suspense } from 'react';
import RegisterClient from './RegisterClient';

export default async function Register() {
  return (
    <>
      <Suspense>
        <RegisterClient />
      </Suspense>
    </>
  );
}
