declare type User = {
  _id: string;
  fullName: string;
  email: string;
  phone: number;
  role: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
};

declare type PaginatedUsers = {
  docs: User[];
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
