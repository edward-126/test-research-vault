import { ObjectId } from "mongodb";
import { getDatabase } from "./mongodb";
import type { LinkFilters, LinkItem } from "./types";
import type { NormalizedLinkInput } from "./validation";

const COLLECTION_NAME = "links";

type LinkDocument = {
  _id?: ObjectId;
  url: string;
  title: string;
  notes: string;
  category: LinkItem["category"];
  tags?: string[];
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
    createdAt,
    updatedAt,
  };
}

function escapeForRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildFiltersQuery(filters: Partial<LinkFilters>) {
  const search = filters.search?.trim();
  const category = filters.category?.trim();
  const tag = filters.tag?.trim();
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

  if (clauses.length === 0) {
    return {};
  }

  return clauses.length === 1 ? clauses[0] : { $and: clauses };
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
  const documents = await collection
    .find(buildFiltersQuery(filters), { sort: { createdAt: -1 } })
    .toArray();

  return documents.map((document) =>
    toLinkItem(document as LinkDocument & { _id: ObjectId })
  );
}

export async function createLink(data: NormalizedLinkInput) {
  const collection = await getLinksCollection();
  const document = buildLinkDocument(data);

  const result = await collection.insertOne(document);

  return {
    id: result.insertedId.toHexString(),
    ...document,
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
