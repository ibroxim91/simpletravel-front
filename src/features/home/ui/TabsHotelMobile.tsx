import FilterHotelMobile from '@/widgets/filter/ui/FilterHotelMobile';

interface Props {
  active: 'tours' | 'hotel';
}

const TabsHotelMobile = ({ active }: Props) => {
  return <>{active === 'hotel' && <FilterHotelMobile />}</>;
};

export default TabsHotelMobile;
