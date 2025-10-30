import { Suspense } from 'react';
import ProfileClient from './profileClient';

const Profile = () => {
  return (
    <>
      <Suspense>
        <ProfileClient />
      </Suspense>
    </>
  );
};

export default Profile;
