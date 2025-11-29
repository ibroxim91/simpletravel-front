export interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  items?: MenuItem[];
}

export interface LocationList {
  status: boolean;
  data: {
    departures: string[];
    destinations: string[];
  };
}
