import { Suspense } from 'react';
import ForgetPasswordClient from './ForgetPasswordClient';

export default async function ForgetPassword() {
  return (
    <>
      <Suspense>
        <ForgetPasswordClient />
      </Suspense>
    </>
  );
}
