import { createLink, listLinks } from "@/lib/research-links";
import type { CreateLinkInput } from "@/lib/types";
import { validateCreateLinkInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const links = await listLinks();
    return Response.json({ links });
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
  };

  const validation = validateCreateLinkInput(input);

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
