"use client";

import { startTransition, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LINK_CATEGORIES, type CreateLinkInput } from "@/lib/types";
import { cn } from "@/lib/utils";

type FormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Partial<Record<keyof CreateLinkInput, string>>;
  values: CreateLinkInput;
};

const initialFormState: FormState = {
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

type FieldProps = {
  htmlFor: string;
  label: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ htmlFor, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <span className="text-sm text-rose-600 dark:text-rose-400">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export function LinkForm() {
  const [state, setState] = useState<FormState>(initialFormState);
  const [isPending, setIsPending] = useState(false);
  const [categoryValue, setCategoryValue] = useState(
    initialFormState.values.category
  );
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values: CreateLinkInput = {
      url: String(formData.get("url") ?? ""),
      title: String(formData.get("title") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      category: String(formData.get("category") ?? ""),
    };

    setIsPending(true);

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as {
        message?: string;
        fieldErrors?: FormState["fieldErrors"];
      };

      if (!response.ok) {
        setState({
          status: "error",
          message:
            data.message ?? "Please fix the highlighted fields and try again.",
          fieldErrors: data.fieldErrors ?? {},
          values,
        });
        setCategoryValue(values.category);
        return;
      }

      setState({
        ...initialFormState,
        status: "success",
        message: data.message ?? "Research link saved to the vault.",
      });
      formRef.current?.reset();
      setCategoryValue("");
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to save link from form", error);

      setState({
        status: "error",
        message:
          "The link could not be saved right now. Check your connection and try again.",
        fieldErrors: {},
        values,
      });
      setCategoryValue(values.category);
    } finally {
      setIsPending(false);
    }
  }

  const values = {
    ...initialFormState.values,
    ...state.values,
  };

  return (
    <Card className="">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-medium tracking-tight">
          Capture a research link
        </CardTitle>
        <p className="text-muted-foreground max-w-2xl text-sm leading-6">
          Save the source, add quick notes, and keep the team&apos;s research
          vault organized from day one.
        </p>
      </CardHeader>

      <CardContent className="mt-4">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col items-stretch gap-4"
        >
          <input type="hidden" name="category" value={categoryValue} />
          <Field
            htmlFor="url"
            label="Research URL"
            error={state.fieldErrors.url}
          >
            <Input
              id="url"
              type="url"
              name="url"
              placeholder="https://example.com/paper"
              defaultValue={values.url}
              aria-invalid={Boolean(state.fieldErrors.url)}
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-5">
            <div className="md:col-span-3">
              <Field
                htmlFor="title"
                label="Title"
                error={state.fieldErrors.title}
              >
                <Input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Understanding distributed systems"
                  defaultValue={values.title}
                  aria-invalid={Boolean(state.fieldErrors.title)}
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field
                htmlFor="category"
                label="Category"
                error={state.fieldErrors.category}
              >
                <Select value={categoryValue} onValueChange={setCategoryValue}>
                  <SelectTrigger
                    id="category"
                    className="w-full"
                    aria-invalid={Boolean(state.fieldErrors.category)}
                  >
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent position={"popper"}>
                    {LINK_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>

          <Field htmlFor="notes" label="Notes" error={state.fieldErrors.notes}>
            <Textarea
              id="notes"
              name="notes"
              rows={5}
              placeholder="Why is this source useful? Key takeaways, methodology, or critique."
              defaultValue={values.notes}
              className="min-h-24 resize-y"
            />
          </Field>

          <div className="border-border flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div
              className={cn(
                "rounded-lg px-1.5 py-1 text-sm",
                state.status === "success" &&
                  "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
                state.status === "error" &&
                  "bg-destructive/10 text-destructive",
                state.status === "idle" && "bg-muted text-muted-foreground"
              )}
            >
              {state.message || "Saved links will appear in the shared vault."}
            </div>
            <Button type="submit" size="lg" className="" disabled={isPending}>
              {isPending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus />
                  Save Link
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
