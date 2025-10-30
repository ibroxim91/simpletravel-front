import { Suspense } from 'react';
import AboutClient from './AboutClient';

const About = async () => {
  return (
    <>
      <Suspense>
        <AboutClient />
      </Suspense>
    </>
  );
};

export default About;
