declare type Product = {
  name: string;
  detail: string;
  price: number;
  image: string;
  _id: string;
};

declare type PaginatedProducts = {
  docs: Product[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: null | number;
  page: number;
  pagingCounter: number;
  prevPage: null | number;
  totalDocs: number;
  totalPages: number;
};
