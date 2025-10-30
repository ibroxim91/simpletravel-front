import { Suspense } from 'react';
import LoginClient from './LoginClient';

export default async function Login() {
  return (
    <>
      <Suspense>
        <LoginClient />
      </Suspense>
    </>
  );
}
