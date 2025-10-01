'use client';

import Banner from '@/assets/Auth_Banner.png';
import Image from 'next/image';
import { useState } from 'react';
import OneStep from './one-step';
import ThirdStep from './third-step';
import TwoStep from './two-steps';

const Auth = () => {
  const [step, setStep] = useState<number>(1);
  return (
    <div className="custom-container mt-2 relative">
      <Image
        src={Banner}
        alt="banner"
        width={1119}
        height={224}
        priority
        quality={100}
        className="object-center w-full h-[300px] max-sm:h-[100px] rounded-3xl"
      />
      {step === 1 && <OneStep setStep={setStep} />}
      {step === 2 && <TwoStep setStep={setStep} />}
      {step === 3 && <ThirdStep />}
    </div>
  );
};

export default Auth;
