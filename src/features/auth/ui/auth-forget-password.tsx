'use client';

import Banner from '@/assets/Auth_Banner.png';
import Image from 'next/image';
import { useState } from 'react';
import ForgetOneStep from './forget-one-step';
import ForgetThirdStep from './forget-third-step';
import ForgetTwoSteps from './forget-two-steps';

const AuthForgetPassword = () => {
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
      {step === 1 && <ForgetOneStep setStep={setStep} />}
      {step === 2 && <ForgetTwoSteps setStep={setStep} />}
      {step === 3 && <ForgetThirdStep />}
    </div>
  );
};

export default AuthForgetPassword;
