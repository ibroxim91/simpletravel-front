import FilterTours from '@/widgets/filter/ui/FilterTours';

interface Props {
  active: 'tours' | 'hotel';
}

const TabsTours = ({ active }: Props) => {
  return <>{active === 'tours' && <FilterTours />}</>;
};

export default TabsTours;
