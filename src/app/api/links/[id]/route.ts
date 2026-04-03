import { deleteLink, isValidLinkId, updateLink } from "@/lib/research-links";
import type { UpdateLinkInput } from "@/lib/types";
import { validateLinkInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getRouteId(context: RouteContext) {
  const { id } = await context.params;
  return id;
}

export async function PATCH(request: Request, context: RouteContext) {
  const id = await getRouteId(context);

  if (!isValidLinkId(id)) {
    return Response.json({ message: "Invalid link id." }, { status: 400 });
  }

  let body: Partial<UpdateLinkInput> | null = null;

  try {
    body = (await request.json()) as Partial<UpdateLinkInput>;
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const input: UpdateLinkInput = {
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
    const link = await updateLink(id, validation.data);

    if (!link) {
      return Response.json({ message: "Link not found." }, { status: 404 });
    }

    return Response.json({
      message: "Research link updated.",
      link,
    });
  } catch (error) {
    console.error("Failed to update research link", error);

    return Response.json(
      { message: "The link could not be updated right now." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const id = await getRouteId(context);

  if (!isValidLinkId(id)) {
    return Response.json({ message: "Invalid link id." }, { status: 400 });
  }

  try {
    const deleted = await deleteLink(id);

    if (!deleted) {
      return Response.json({ message: "Link not found." }, { status: 404 });
    }

    return Response.json({ message: "Research link deleted." });
  } catch (error) {
    console.error("Failed to delete research link", error);

    return Response.json(
      { message: "The link could not be deleted right now." },
      { status: 500 }
    );
  }
}
