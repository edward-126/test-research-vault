import { createLink, listLinks } from "@/lib/research-links";
import type { CreateLinkInput, LinkFilters } from "@/lib/types";
import { validateLinkInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

function getFilterValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters: LinkFilters = {
    search: getFilterValue(searchParams.get("search") ?? undefined),
    category: getFilterValue(searchParams.get("category") ?? undefined),
    tag: getFilterValue(searchParams.get("tag") ?? undefined),
  };

  try {
    const links = await listLinks(filters);
    return Response.json({ links, filters });
  } catch (error) {
    console.error("Failed to load research links", error);

    return Response.json(
      { message: "Unable to load links right now." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let body: Partial<CreateLinkInput> | null = null;

  try {
    body = (await request.json()) as Partial<CreateLinkInput>;
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const input: CreateLinkInput = {
    url: String(body?.url ?? ""),
    title: String(body?.title ?? ""),
    notes: String(body?.notes ?? ""),
    category: String(body?.category ?? ""),
    tags: Array.isArray(body?.tags) ? body.tags.map((tag) => String(tag)) : [],
  };

  const validation = validateLinkInput(input);

  if (!validation.data) {
    return Response.json(
      {
        message: "Please fix the highlighted fields and try again.",
        fieldErrors: validation.errors,
      },
      { status: 400 }
    );
  }

  try {
    const link = await createLink(validation.data);

    return Response.json(
      {
        message: "Research link saved to the vault.",
        link,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create research link", error);

    return Response.json(
      {
        message:
          "The link could not be saved right now. Check your MongoDB env vars and try again.",
      },
      { status: 500 }
    );
  }
}
