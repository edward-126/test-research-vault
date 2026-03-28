export type LinkCategory =
  | "Journal Article"
  | "Book"
  | "Video"
  | "Dataset"
  | "Tool"
  | "Other";

export type LinkItem = {
  id: string;
  url: string;
  title: string;
  notes: string;
  category: LinkCategory;
  createdAt: Date;
};

export type CreateLinkInput = {
  url: string;
  title: string;
  notes: string;
  category: string;
};

export const LINK_CATEGORIES: LinkCategory[] = [
  "Journal Article",
  "Book",
  "Video",
  "Dataset",
  "Tool",
  "Other",
];
