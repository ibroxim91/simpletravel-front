'use client';

import { Dispatch, SetStateAction } from 'react';
import OneStep from './one-step';
import ThirdStep from './third-step';
import TwoStep from './two-steps';

type Props = {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
};

const AuthRegisterFlow = ({ step, setStep }: Props) => {
  return (
    <div className="w-full">
      {step === 1 && <OneStep setStep={setStep} embedded />}
      {step === 2 && <TwoStep setStep={setStep} embedded />}
      {step === 3 && <ThirdStep embedded />}
    </div>
  );
};

export default AuthRegisterFlow;
