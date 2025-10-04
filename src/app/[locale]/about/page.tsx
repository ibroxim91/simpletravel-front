'use client';
import Header from '@/features/about/ui/Header';
import Partner from '@/features/about/ui/Partner';
import Sertificat from '@/features/about/ui/Sertificat';

const About = () => {
  return (
    <div className="flex flex-col gap-10 mb-10 overflow-hidden">
      <Header />
      <div className="bg-white p-4">
        <Partner />
      </div>
      <Sertificat />
    </div>
  );
};

export default About;
