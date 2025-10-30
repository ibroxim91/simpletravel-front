import { Suspense } from 'react';
import ContactClient from './contactClient';

export default function Page() {
  return (
    <>
      <div className="bg-[#EDEEF1] min-h-screen">
        <Suspense>
          <ContactClient />
        </Suspense>
      </div>
    </>
  );
}
