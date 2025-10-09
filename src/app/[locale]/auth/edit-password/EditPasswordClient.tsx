'use client';

import dynamic from 'next/dynamic';

const AuthEditPassword = dynamic(
  () => import('@/features/auth/ui/auth-edit-password'),
  { ssr: false },
);

const EditPasswordClient = () => {
  return (
    <div className="h-full">
      <AuthEditPassword />
    </div>
  );
};

export default EditPasswordClient;
