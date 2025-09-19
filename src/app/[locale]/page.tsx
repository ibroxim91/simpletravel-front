import BannerCarousel from '@/features/home/ui/BannerCarousel';
import BannerCarouselMobile from '@/features/home/ui/BannerCarouselMobile';
import HotTours from '@/features/home/ui/HotTours';
import News from '@/features/home/ui/News';
import Populardestinations from '@/features/home/ui/Populardestinations';
import PopulardestinationsMboile from '@/features/home/ui/PopulardestinationsMboile';
import SearchTours from '@/features/home/ui/SearchTours';

export default async function Home() {
  return (
    <div className="flex flex-col gap-10">
      <BannerCarousel />
      <BannerCarouselMobile />
      <SearchTours />
      <div className="bg-white shadow-xl rounded-t-4xl p-4">
        <Populardestinations />
        <PopulardestinationsMboile />
        <HotTours />
        <News />
      </div>
    </div>
  );
}
