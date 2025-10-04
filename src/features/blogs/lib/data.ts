export interface All_Blogs_Type {
  status: boolean;
  data: {
    current_page: number;
    links: { previous: string; next: string };
    page_size: number;
    total_items: number;
    total_pages: number;
    results: All_Blogs_Data[];
  };
}

export interface All_Blogs_Data {
  created: string;
  id: number;
  image: string;
  short_text: string;
  short_title: string;
  slug: string;
  category: {
    id: number;
    name: string;
  };
}

export interface Detail_Blogs_Type {
  status: boolean;
  data: {
    id: number;
    title: string;
    image: string;
    text: string;
    post_images: [
      {
        id: number;
        image: string;
        text: string;
      },
    ];
    post_tags: [
      {
        id: number;
        name: string;
      },
    ];
    is_public: boolean;
    slug: string;
    created: string;
  };
}

export interface Get_Tags_Date {
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
      name: string;
    }[];
  };
}

export interface Get_Tags_Detail {
  status: boolean;
  data: {
    id: number;
    name: string;
  };
}
