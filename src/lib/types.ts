export type LinkCategory =
  | "Journal Article"
  | "Book"
  | "Video"
  | "Dataset"
  | "Tool"
  | "Other";

export type LinkInput = {
  url: string;
  title: string;
  notes: string;
  category: string;
  tags: string[];
};

export type LinkItem = {
  id: string;
  url: string;
  title: string;
  notes: string;
  category: LinkCategory;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type CreateLinkInput = LinkInput;

export type UpdateLinkInput = LinkInput;

export type LinkFilters = {
  search: string;
  category: string;
  tag: string;
};

export const LINK_CATEGORIES: LinkCategory[] = [
  "Journal Article",
  "Book",
  "Video",
  "Dataset",
  "Tool",
  "Other",
];
