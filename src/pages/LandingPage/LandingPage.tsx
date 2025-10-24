import { Hero } from '@/components/sections/Hero/Hero';
import { Services } from '@/components/sections/Services/Services';
import { Members } from '@/components/sections/Members/Members';
import { GetHelp } from '@/components/sections/GetHelp/GetHelp';

export const LandingPage = () => {
  return (
    <>
      <Hero />
      <Services />
      <Members />
      <GetHelp />
    </>
  );
};
