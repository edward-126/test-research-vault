import { LinkFilters } from "@/components/link-filters";
import { LinkForm } from "@/components/link-form";
import { LinkList } from "@/components/link-list";
import { listLinks } from "@/lib/research-links";
import type { LinkFilters as LinkFiltersType, LinkItem } from "@/lib/types";

export const dynamic = "force-dynamic";

function getSearchParamValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters: LinkFiltersType = {
    search: getSearchParamValue(resolvedSearchParams.search),
    category: getSearchParamValue(resolvedSearchParams.category),
    tag: getSearchParamValue(resolvedSearchParams.tag),
  };
  let links: LinkItem[] = [];
  let setupError = "";

  try {
    links = await listLinks(filters);
  } catch (error) {
    console.error("Failed to load research links", error);
    setupError =
      error instanceof Error
        ? error.message
        : "Unable to connect to MongoDB for the shared vault.";
  }

  return (
    <section className="relative min-h-dvh py-18 md:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 md:px-6 lg:px-0">
        <div className="grid gap-6 xl:grid-cols-12 xl:items-start">
          <div className="xl:col-span-5">
            <LinkForm />
          </div>
          <div className="space-y-4 xl:col-span-7">
            <LinkFilters filters={filters} />
            <LinkList links={links} setupError={setupError} filters={filters} />
          </div>
        </div>
      </div>
    </section>
  );
}
