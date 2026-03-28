import {
  LINK_CATEGORIES,
  type CreateLinkInput,
  type LinkCategory,
} from "./types";

export type CreateLinkFieldErrors = Partial<Record<keyof CreateLinkInput, string>>;

export type NormalizedCreateLinkInput = {
  url: string;
  title: string;
  notes: string;
  category: LinkCategory;
};

export function normalizeCreateLinkInput(
  input: CreateLinkInput
): NormalizedCreateLinkInput {
  return {
    url: input.url.trim(),
    title: input.title.trim(),
    notes: input.notes.trim(),
    category: input.category.trim() as LinkCategory,
  };
}

export function validateCreateLinkInput(input: CreateLinkInput): {
  data: NormalizedCreateLinkInput | null;
  errors: CreateLinkFieldErrors;
} {
  const data = normalizeCreateLinkInput(input);
  const errors: CreateLinkFieldErrors = {};

  if (!data.url) {
    errors.url = "A research URL is required.";
  } else {
    try {
      const parsedUrl = new URL(data.url);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        errors.url = "Use a valid http or https URL.";
      }
    } catch {
      errors.url = "Use a valid URL.";
    }
  }

  if (!data.title) {
    errors.title = "A title is required.";
  }

  if (!data.category) {
    errors.category = "Choose a category.";
  } else if (!LINK_CATEGORIES.includes(data.category as LinkCategory)) {
    errors.category = "Choose one of the supported categories.";
  }

  return {
    data: Object.keys(errors).length === 0 ? data : null,
    errors,
  };
}
