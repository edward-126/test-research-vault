import { LinkForm } from "@/components/link-form";
import { LinkList } from "@/components/link-list";
import { listLinks } from "@/lib/research-links";
import type { LinkItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  let links: LinkItem[] = [];
  let setupError = "";

  try {
    links = await listLinks();
  } catch (error) {
    console.error("Failed to load research links", error);
    setupError =
      error instanceof Error
        ? error.message
        : "Unable to connect to MongoDB for the shared vault.";
  }

  return (
    <section className="relative flex min-h-dvh items-center justify-center py-24">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-4 lg:px-0">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-4">
          <div className="lg:col-span-7">
            <LinkForm />
          </div>
          <div className="lg:col-span-5">
            <LinkList links={links} setupError={setupError} />
          </div>
        </div>
      </div>
    </section>
  );
}
