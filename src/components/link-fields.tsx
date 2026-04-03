import { Badge } from "@/components/ui/badge";
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
import { LINK_CATEGORIES, type LinkInput } from "@/lib/types";

export type LinkFieldValues = {
  url: string;
  title: string;
  notes: string;
  category: string;
  tagsInput: string;
  tags: string[];
};

export type LinkFieldErrors = Partial<Record<keyof LinkInput, string>>;

type FieldProps = {
  htmlFor: string;
  label: string;
  error?: string;
  children: React.ReactNode;
};

export function parseTagsInput(value: string) {
  const seen = new Set<string>();

  return value
    .split(/[\n,]/)
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .filter((tag) => {
      const normalized = tag.toLocaleLowerCase();

      if (seen.has(normalized)) {
        return false;
      }

      seen.add(normalized);
      return true;
    });
}

export function formatTagsInput(tags: string[]) {
  return tags.join(", ");
}

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

export function LinkFields({
  values,
  errors,
  onValueChange,
  onCategoryChange,
}: {
  values: LinkFieldValues;
  errors: LinkFieldErrors;
  onValueChange: (field: keyof LinkFieldValues, value: string) => void;
  onCategoryChange: (value: string) => void;
}) {
  return (
    <>
      <Field htmlFor="url" label="Research URL" error={errors.url}>
        <Input
          id="url"
          type="url"
          value={values.url}
          onChange={(event) => onValueChange("url", event.target.value)}
          placeholder="https://example.com/paper"
          aria-invalid={Boolean(errors.url)}
        />
      </Field>

      <div className="grid gap-5 md:grid-cols-5">
        <div className="md:col-span-3">
          <Field htmlFor="title" label="Title" error={errors.title}>
            <Input
              id="title"
              type="text"
              value={values.title}
              onChange={(event) => onValueChange("title", event.target.value)}
              placeholder="Understanding distributed systems"
              aria-invalid={Boolean(errors.title)}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field htmlFor="category" label="Category" error={errors.category}>
            <Select value={values.category} onValueChange={onCategoryChange}>
              <SelectTrigger
                id="category"
                className="w-full"
                aria-invalid={Boolean(errors.category)}
              >
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent position="popper">
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

      <Field htmlFor="notes" label="Notes" error={errors.notes}>
        <Textarea
          id="notes"
          value={values.notes}
          onChange={(event) => onValueChange("notes", event.target.value)}
          rows={5}
          placeholder="Why is this source useful? Key takeaways, methodology, or critique."
          className="min-h-24 resize-y"
        />
      </Field>

      <Field htmlFor="tags" label="Tags" error={errors.tags}>
        <Input
          id="tags"
          type="text"
          value={values.tagsInput}
          onChange={(event) => onValueChange("tagsInput", event.target.value)}
          placeholder="AI, literature review, methodology"
          aria-invalid={Boolean(errors.tags)}
        />
        <p className="text-muted-foreground text-xs leading-5">
          Separate tags with commas. Tags help with filtering and faster search.
        </p>
        {values.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {values.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </Field>
    </>
  );
}
