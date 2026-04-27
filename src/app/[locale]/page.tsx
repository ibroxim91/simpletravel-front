import HomeBenefits from '@/features/home/ui/HomeBenefits';
import HotTours from '@/features/home/ui/HotTours';
import Populardestinations from '@/features/home/ui/Populardestinations';
import PopulardestinationsMboile from '@/features/home/ui/PopulardestinationsMboile';
import SearchTours from '@/features/home/ui/SearchTours';
import VisaTours from '@/features/home/ui/VisaTours';

export default async function Home() {
  return (
    <>
      <main>
        <div className="flex flex-col">
          <div className="bg-[#1E73E8] pb-[180px] max-lg:pb-0">
            <div className="pt-[104px] max-lg:pt-8">
              <SearchTours />
            </div>
          </div>
          <div className="-mt-[246px]  max-lg:mt-26 relative z-10">
            <HotTours />
          </div>
          <div className="mt-[104px] flex flex-col gap-[104px]">
            <Populardestinations />
            {/* <PopulardestinationsMboile /> */}
            <VisaTours />
            <HomeBenefits />
          </div>
        </div>
      </main>
    </>
  );
}
