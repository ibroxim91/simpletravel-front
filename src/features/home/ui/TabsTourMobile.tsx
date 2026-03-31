import FilterToursMobile from '@/widgets/filter/ui/FilterToursMobile';

interface Props {
  active: 'tours' | 'hotel';
}

const TabsTourMobile = ({ active }: Props) => {
  return <>{active === 'tours' && <FilterToursMobile />}</>;
};

export default TabsTourMobile;
