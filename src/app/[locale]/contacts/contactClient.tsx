'use client';

import dynamic from 'next/dynamic';
const Contacts = dynamic(() => import('@/widgets/contacts/ui'), {
  ssr: false,
});

export default function ContactClient() {
  return (
    <div className="bg-[#EDEEF1] min-h-screen">
      <Contacts />
    </div>
  );
}
