import { ObjectId } from "mongodb";
import { getDatabase } from "./mongodb";
import type { LinkItem } from "./types";
import type { NormalizedCreateLinkInput } from "./validation";

const COLLECTION_NAME = "links";

type LinkDocument = {
  _id?: ObjectId;
  url: string;
  title: string;
  notes: string;
  category: LinkItem["category"];
  createdAt: Date;
};

function getLinksCollection() {
  return getDatabase().then((database) =>
    database.collection<LinkDocument>(COLLECTION_NAME)
  );
}

export function buildLinkDocument(data: NormalizedCreateLinkInput) {
  return {
    ...data,
    createdAt: new Date(),
  };
}

export async function listLinks(): Promise<LinkItem[]> {
  const collection = await getLinksCollection();
  const documents = await collection
    .find({}, { sort: { createdAt: -1 } })
    .toArray();

  return documents.map((document) => ({
    id: document._id.toHexString(),
    url: document.url,
    title: document.title,
    notes: document.notes,
    category: document.category,
    createdAt: document.createdAt,
  }));
}

export async function createLink(data: NormalizedCreateLinkInput) {
  const collection = await getLinksCollection();
  const document = buildLinkDocument(data);

  const result = await collection.insertOne(document);

  return {
    id: result.insertedId.toHexString(),
    ...document,
  };
}
