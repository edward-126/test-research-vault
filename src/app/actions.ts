"use server";

import { revalidatePath } from "next/cache";
import { createLink } from "../lib/research-links";
import type { CreateLinkInput } from "../lib/types";
import {
  validateCreateLinkInput,
  type CreateLinkFieldErrors,
} from "../lib/validation";

export type CreateLinkActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: CreateLinkFieldErrors;
  values: CreateLinkInput;
};

export const initialCreateLinkActionState: CreateLinkActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: {
    url: "",
    title: "",
    notes: "",
    category: "",
  },
};

export async function createLinkAction(
  _previousState: CreateLinkActionState,
  formData: FormData
): Promise<CreateLinkActionState> {
  const values: CreateLinkInput = {
    url: String(formData.get("url") ?? ""),
    title: String(formData.get("title") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    category: String(formData.get("category") ?? ""),
  };

  const validation = validateCreateLinkInput(values);

  if (!validation.data) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors: validation.errors,
      values,
    };
  }

  try {
    await createLink(validation.data);
    revalidatePath("/");

    return {
      status: "success",
      message: "Research link saved to the vault.",
      fieldErrors: {},
      values: initialCreateLinkActionState.values,
    };
  } catch (error) {
    console.error("Failed to create research link", error);

    return {
      status: "error",
      message:
        "The link could not be saved right now. Check your MongoDB env vars and try again.",
      fieldErrors: {},
      values,
    };
  }
}
