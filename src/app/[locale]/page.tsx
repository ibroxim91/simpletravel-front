import HomeBenefits from '@/features/home/ui/HomeBenefits';
import HotOffersPromoPopup from '@/features/home/ui/HotOffersPromoPopup';
import HowItWorks from '@/features/home/ui/HowItWorks';
import HotTours from '@/features/home/ui/HotTours';
import Populardestinations from '@/features/home/ui/Populardestinations';
import RecommendedHotels from '@/features/home/ui/RecommendedHotels';
import SearchTours from '@/features/home/ui/SearchTours';
import HomeCommentTour from '@/features/home/ui/commentTour';
import VideoReviews from '@/features/home/ui/videoReviews';

export default async function Home() {
  return (
    <>
      <main>
        <div className="flex flex-col">
          <div className="bg-[#1E73E8] pb-[180px] max-lg:h-[759px] max-lg:pb-0">
            <div className="pt-[104px] max-lg:pt-0">
              <SearchTours />
            </div>
          </div>
          <div className="-mt-[246px] max-lg:-mt-[165px] relative z-10">
            <HotTours />
          </div>
          <div className="mt-[104px] mb-[104px] flex flex-col gap-[104px] max-lg:mt-[64px] max-lg:mb-[64px] max-lg:gap-[64px]">
            <HowItWorks />
            <RecommendedHotels />
            <VideoReviews />
            <HomeCommentTour />
            <Populardestinations />
            <HomeBenefits />
          </div>
        </div>
      </main>
      <HotOffersPromoPopup />
    </>
  );
}
