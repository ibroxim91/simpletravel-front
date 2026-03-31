import FilterHotel from '@/widgets/filter/ui/FilterHotel';

interface Props {
  active: 'tours' | 'hotel';
}
const TabsHotel = ({ active }: Props) => {
  return <>{active === 'hotel' && <FilterHotel />}</>;
};

export default TabsHotel;
