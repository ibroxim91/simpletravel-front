export interface GetOffertaData {
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
      content: string;
      person_type: 'individual' | 'legal_entity';
      is_active: boolean;
    }[];
  };
}
