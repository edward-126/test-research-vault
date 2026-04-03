"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LINK_CATEGORIES, type LinkFilters } from "@/lib/types";
import { LoaderCircle, Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

const initialFilters: LinkFilters = {
  search: "",
  category: "",
  tag: "",
};

export function LinkFilters({ filters }: { filters: LinkFilters }) {
  const [values, setValues] = useState<LinkFilters>(filters);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setValues(filters);
  }, [filters]);

  useEffect(() => {
    if (
      values.search === filters.search &&
      values.category === filters.category &&
      values.tag === filters.tag
    ) {
      setIsPending(false);
    }
  }, [filters, values]);

  function navigate(nextValues: LinkFilters) {
    const params = new URLSearchParams();

    if (nextValues.search.trim()) {
      params.set("search", nextValues.search.trim());
    }

    if (nextValues.category.trim()) {
      params.set("category", nextValues.category.trim());
    }

    if (nextValues.tag.trim()) {
      params.set("tag", nextValues.tag.trim());
    }

    setIsPending(true);
    startTransition(() => {
      router.replace(
        params.toString() ? `${pathname}?${params.toString()}` : pathname
      );
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(values);
  }

  function handleReset() {
    setValues(initialFilters);
    navigate(initialFilters);
  }

  const hasActiveFilters = Boolean(
    filters.search || filters.category || filters.tag
  );

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-medium tracking-tight">
              Find saved research faster
            </h2>
            <p className="text-muted-foreground text-sm leading-6">
              Search by title, notes, or tags, then narrow the vault by category
              or a single tag.
            </p>
          </div>
          {hasActiveFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
            >
              <X />
              Clear filters
            </Button>
          ) : null}
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={values.search}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  search: event.target.value,
                }))
              }
              placeholder="Search title, notes, or tags"
              className="pl-9"
            />
          </div>

          <Select
            value={values.category || "all"}
            onValueChange={(value) =>
              setValues((current) => ({
                ...current,
                category: value === "all" ? "" : value,
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="all">All categories</SelectItem>
              {LINK_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={values.tag}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                tag: event.target.value,
              }))
            }
            placeholder="Filter by tag"
          />

          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? (
              <>
                <LoaderCircle className="animate-spin" />
                Applying
              </>
            ) : (
              <>
                <SlidersHorizontal />
                Apply
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
