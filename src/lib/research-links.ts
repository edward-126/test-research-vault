import { ObjectId, type Sort } from "mongodb";

import {
  DEFAULT_LINK_SORT,
  DEFAULT_LINK_STATUS,
  type DuplicateWarning,
  type LinkFilters,
  type LinkItem,
  type LinkSort,
} from "./types";
import { getDatabase } from "./mongodb";
import { normalizeUrl, type NormalizedLinkInput } from "./validation";

const COLLECTION_NAME = "links";

type LinkDocument = {
  _id?: ObjectId;
  url: string;
  title: string;
  notes: string;
  category: LinkItem["category"];
  tags?: string[];
  status?: LinkItem["status"];
  isFavorite?: boolean;
  normalizedUrl?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

function getLinksCollection() {
  return getDatabase().then((database) =>
    database.collection<LinkDocument>(COLLECTION_NAME)
  );
}

function toDate(value: Date | string | undefined, fallback: Date) {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = new Date(value);

    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return fallback;
}

function toLinkItem(document: LinkDocument & { _id: ObjectId }): LinkItem {
  const createdAt = toDate(document.createdAt, new Date());
  const updatedAt = toDate(document.updatedAt, createdAt);

  return {
    id: document._id.toHexString(),
    url: document.url,
    title: document.title,
    notes: document.notes,
    category: document.category,
    tags: document.tags ?? [],
    status: document.status ?? DEFAULT_LINK_STATUS,
    isFavorite: Boolean(document.isFavorite),
    normalizedUrl: document.normalizedUrl ?? normalizeUrl(document.url),
    createdAt,
    updatedAt,
  };
}

function escapeForRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSort(sort: LinkSort): Sort {
  switch (sort) {
    case "oldest":
      return { createdAt: 1 as const };
    case "title-asc":
      return { title: 1 as const };
    case "title-desc":
      return { title: -1 as const };
    case "newest":
    default:
      return { updatedAt: -1 as const, createdAt: -1 as const };
  }
}

function buildFiltersQuery(filters: Partial<LinkFilters>) {
  const search = filters.search?.trim();
  const category = filters.category?.trim();
  const tag = filters.tag?.trim();
  const status = filters.status?.trim();
  const favorite = filters.favorite?.trim();
  const clauses: Record<string, unknown>[] = [];

  if (search) {
    const pattern = new RegExp(escapeForRegex(search), "i");

    clauses.push({
      $or: [{ title: pattern }, { notes: pattern }, { tags: pattern }],
    });
  }

  if (category) {
    clauses.push({ category });
  }

  if (tag) {
    clauses.push({
      tags: {
        $elemMatch: {
          $regex: new RegExp(`^${escapeForRegex(tag)}$`, "i"),
        },
      },
    });
  }

  if (status) {
    clauses.push({ status });
  }

  if (favorite === "true") {
    clauses.push({ isFavorite: true });
  }

  if (clauses.length === 0) {
    return {};
  }

  return clauses.length === 1 ? clauses[0] : { $and: clauses };
}

async function findDuplicateWarning(normalizedUrl: string) {
  const collection = await getLinksCollection();
  const documents = await collection
    .find(
      {},
      {
        projection: {
          url: 1,
          title: 1,
          status: 1,
          isFavorite: 1,
          createdAt: 1,
          normalizedUrl: 1,
        },
      }
    )
    .toArray();

  const duplicateDocument = documents.find((document) => {
    const candidate = document.normalizedUrl ?? normalizeUrl(document.url);
    return candidate === normalizedUrl;
  });

  if (!duplicateDocument?._id) {
    return null;
  }

  const existingLink = toLinkItem(
    duplicateDocument as LinkDocument & { _id: ObjectId }
  );

  const duplicateWarning: DuplicateWarning = {
    message: `Saved successfully, but a similar research URL already exists: ${existingLink.title}.`,
    existingLink: {
      id: existingLink.id,
      title: existingLink.title,
      url: existingLink.url,
      status: existingLink.status,
      isFavorite: existingLink.isFavorite,
      createdAt: existingLink.createdAt,
    },
  };

  return duplicateWarning;
}

export function buildLinkDocument(data: NormalizedLinkInput) {
  const now = new Date();

  return {
    ...data,
    createdAt: now,
    updatedAt: now,
  };
}

export async function listLinks(
  filters: Partial<LinkFilters> = {}
): Promise<LinkItem[]> {
  const collection = await getLinksCollection();
  const sort = buildSort(filters.sort ?? DEFAULT_LINK_SORT);
  const documents = await collection
    .find(buildFiltersQuery(filters), { sort })
    .toArray();

  return documents.map((document) =>
    toLinkItem(document as LinkDocument & { _id: ObjectId })
  );
}

export async function createLink(data: NormalizedLinkInput) {
  const duplicateWarning = await findDuplicateWarning(data.normalizedUrl);
  const collection = await getLinksCollection();
  const document = buildLinkDocument(data);

  const result = await collection.insertOne(document);

  return {
    link: {
      id: result.insertedId.toHexString(),
      ...document,
    },
    duplicateWarning,
  };
}

export function isValidLinkId(id: string) {
  return ObjectId.isValid(id);
}

export async function updateLink(id: string, data: NormalizedLinkInput) {
  const collection = await getLinksCollection();
  const objectId = new ObjectId(id);
  const nextDocument = {
    ...data,
    updatedAt: new Date(),
  };

  const result = await collection.findOneAndUpdate(
    { _id: objectId },
    {
      $set: nextDocument,
    },
    {
      returnDocument: "after",
    }
  );

  return result ? toLinkItem(result as LinkDocument & { _id: ObjectId }) : null;
}

export async function deleteLink(id: string) {
  const collection = await getLinksCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount > 0;
}
