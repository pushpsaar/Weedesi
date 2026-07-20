import SiteContentEditor from "@/components/admin/SiteContentEditor";

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl text-dark">Website Content</h1>
        <p className="text-sm text-dark/60">
          Update hero content, banners, contact details, and footer messaging without editing code.
        </p>
      </div>

      <SiteContentEditor />
    </div>
  );
}
