export interface GetBanner {
  status: boolean;
  data: {
    links: {
      previous: string;
      next: string;
    };
    total_items: number;
    total_pages: number;
    page_size: number;
    current_page: number;
    results: {
      id: number;
      title: string;
      description: string;
      image: string;
      link: string;
      position: string;
    }[];
  };
}
