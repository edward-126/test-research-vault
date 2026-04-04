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
import {
  DEFAULT_LINK_SORT,
  LINK_CATEGORIES,
  LINK_SORT_OPTIONS,
  LINK_STATUSES,
  type LinkFilters,
} from "@/lib/types";
import { LoaderCircle, Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

const initialFilters: LinkFilters = {
  search: "",
  category: "",
  tag: "",
  status: "",
  favorite: "",
  sort: DEFAULT_LINK_SORT,
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
    if (JSON.stringify(values) === JSON.stringify(filters)) {
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

    if (nextValues.status.trim()) {
      params.set("status", nextValues.status.trim());
    }

    if (nextValues.favorite.trim()) {
      params.set("favorite", nextValues.favorite.trim());
    }

    if (nextValues.sort !== DEFAULT_LINK_SORT) {
      params.set("sort", nextValues.sort);
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
    filters.search ||
    filters.category ||
    filters.tag ||
    filters.status ||
    filters.favorite ||
    filters.sort !== DEFAULT_LINK_SORT
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border bg-card rounded-xl border p-4"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-medium tracking-tight">
              Find and prioritize research faster
            </h2>
            <p className="text-muted-foreground text-sm leading-6">
              Combine content filters with workflow controls to keep the Sprint
              3 vault easier to review and demo.
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

        <div className="grid gap-3 md:grid-cols-2">
          <div className="relative md:col-span-2 xl:col-span-1">
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

          <Select
            value={values.status || "all"}
            onValueChange={(value) =>
              setValues((current) => ({
                ...current,
                status: value === "all" ? "" : value,
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="all">All statuses</SelectItem>
              {LINK_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={values.favorite || "all"}
            onValueChange={(value) =>
              setValues((current) => ({
                ...current,
                favorite: value === "all" ? "" : value,
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All items" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="all">All items</SelectItem>
              <SelectItem value="true">Favorites only</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={values.sort}
            onValueChange={(value) =>
              setValues((current) => ({
                ...current,
                sort: value as LinkFilters["sort"],
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent position="popper">
              {LINK_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
