import {
  DEFAULT_LINK_STATUS,
  LINK_CATEGORIES,
  LINK_STATUSES,
  type LinkCategory,
  type LinkInput,
  type LinkStatus,
} from "./types";

export type LinkFieldErrors = Partial<Record<keyof LinkInput, string>>;

export type NormalizedLinkInput = {
  url: string;
  title: string;
  notes: string;
  category: LinkCategory;
  tags: string[];
  status: LinkStatus;
  isFavorite: boolean;
  normalizedUrl: string;
};

function uniqueTags(tags: string[]) {
  const seen = new Set<string>();

  return tags.filter((tag) => {
    const normalizedTag = tag.toLocaleLowerCase();

    if (seen.has(normalizedTag)) {
      return false;
    }

    seen.add(normalizedTag);
    return true;
  });
}

export function normalizeUrl(value: string) {
  try {
    const parsedUrl = new URL(value.trim());
    const hostname = parsedUrl.hostname.replace(/^www\./i, "").toLowerCase();
    const pathname = parsedUrl.pathname.replace(/\/+$/, "") || "/";
    const search = parsedUrl.searchParams.toString();

    return `${hostname}${pathname.toLowerCase()}${search ? `?${search}` : ""}`;
  } catch {
    return value.trim().toLowerCase();
  }
}

export function normalizeLinkInput(input: LinkInput): NormalizedLinkInput {
  const url = input.url.trim();

  return {
    url,
    title: input.title.trim(),
    notes: input.notes.trim(),
    category: input.category.trim() as LinkCategory,
    tags: uniqueTags(
      input.tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)
    ),
    status: (input.status.trim() || DEFAULT_LINK_STATUS) as LinkStatus,
    isFavorite: Boolean(input.isFavorite),
    normalizedUrl: normalizeUrl(url),
  };
}

export function validateLinkInput(input: LinkInput): {
  data: NormalizedLinkInput | null;
  errors: LinkFieldErrors;
} {
  const data = normalizeLinkInput(input);
  const errors: LinkFieldErrors = {};

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

  if (!data.status) {
    errors.status = "Choose a reading status.";
  } else if (!LINK_STATUSES.includes(data.status as LinkStatus)) {
    errors.status = "Choose one of the supported reading statuses.";
  }

  if (data.tags.some((tag) => tag.length > 40)) {
    errors.tags = "Keep each tag under 40 characters.";
  }

  return {
    data: Object.keys(errors).length === 0 ? data : null,
    errors,
  };
}
