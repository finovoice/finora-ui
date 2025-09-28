"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getOrganisationAPI,
  updateOrganisationAPI,
  type Organisation,
  type OrganisationUpdateRequest,
} from "@/services/settings";
import { Button } from "@/components/ui/button";
import { Pencil, Loader2 } from "lucide-react";
import OrgEditDialog from "@/components/org-edit-dialog";
import { useAtom } from "jotai";
import { USER_DATA_KEY, userAtom } from "@/hooks/user-atom";
import { useSetAtom } from "jotai/index";

/**
 * OrganisationDetails component
 * - Fetches organisation data using getOrganisationAPI
 * - Displays loading and error states
 * - Opens OrgEditDialog for editing (no inline edit)
 */
export default function OrganisationDetails() {
  const [data, setData] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orgOpen, setOrgOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user] = useAtom(userAtom);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const organisationId = user?.organisation as number;
        const res = await getOrganisationAPI(organisationId);
        if (!cancelled) {
          setData(res);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? "Failed to load organisation");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user?.organisation]);

  const createdUpdated = useMemo(() => {
    if (!data) return null;
    const created = new Date(data.created_at);
    const updated = new Date(data.updated_at);
    return {
      created: created.toLocaleString(),
      updated: updated.toLocaleString(),
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-6 py-6 text-[#667085]">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading organisation...
      </div>
    );
  }

  if (error && !data) {
    return <div className="px-6 py-6 text-sm text-red-600">{error}</div>;
  }

  if (!data) return null;

  return (
    <div className="rounded-lg border border-[#e4e7ec] bg-white">
      <div className="flex items-center justify-between border-b border-[#e4e7ec] px-4 py-3">
        <h2 className="text-sm font-medium text-[#344054]">About</h2>
        <Button
          variant="outline"
          onClick={() => setOrgOpen(true)}
          className="inline-flex items-center gap-2 border-[#e4e7ec] bg-white text-[#344054] hover:bg-[#f2f4f7] h-8 px-3"
        >
          <Pencil className="h-4 w-4" /> Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 px-6 py-6">
        {/* Logo */}
        <div className="space-y-2">
          <div className="text-xs text-[#667085]">Logo</div>
          <div className="h-12 w-12 rounded-md bg-[#f2f4f7] flex items-center justify-center overflow-hidden">
            {data.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.logo_url}
                alt="logo"
                className="h-12 w-12 object-cover"
              />
            ) : (
              <span className="text-[#667085] text-lg font-semibold">
                {data.name?.[0]?.toUpperCase() ?? "?"}
              </span>
            )}
          </div>
        </div>

        {/* Org name */}
        <div className="space-y-2">
          <div className="text-xs text-[#667085]">Org name</div>
          <div className="text-sm">{data.name}</div>
        </div>

        {/* License Number */}
        <div className="space-y-2">
          <div className="text-xs text-[#667085]">
            SEBI Registered License Number
          </div>
          <div className="text-sm">{data.license_number}</div>
        </div>

        {/* Registered address */}
        <div className="space-y-2">
          <div className="text-xs text-[#667085]">Registered address</div>
          <div className="text-sm">{data.address}</div>
        </div>

        {/* Owner name */}
        <div className="space-y-2">
          <div className="text-xs text-[#667085]">Owner name</div>
          <div className="text-sm">{data.owner_name}</div>
        </div>

        {/* WhatsApp number */}
        <div className="space-y-2">
          <div className="text-xs text-[#667085]">WhatsApp number</div>
          <div className="text-sm">{data.whatsapp_number}</div>
        </div>

        {/* Signature */}
        <div className="space-y-2">
          <div className="text-xs text-[#667085]">Sign</div>
          {data.signature_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.signature_url}
              alt="signature"
              className="h-10 w-24 object-contain"
            />
          ) : (
            <div className="h-10 w-24 bg-[#f2f4f7]" aria-label="signature" />
          )}
        </div>

        {/* GST Number (optional) */}
        <div className="space-y-2">
          <div className="text-xs text-[#667085]">GST Number</div>
          <div className="text-sm">{data.gst_optional ?? "-"}</div>
        </div>

        {/* SEBI score (optional) */}
        <div className="space-y-2">
          <div className="text-xs text-[#667085]">SEBI Score</div>
          <div className="text-sm">{data.sebi_score ?? "-"}</div>
        </div>

        {/* Timestamps */}
        {createdUpdated && (
          <div className="space-y-1 md:col-span-3 text-xs text-[#98a2b3]">
            <div>Created at: {createdUpdated.created}</div>
            <div>Last updated: {createdUpdated.updated}</div>
          </div>
        )}
      </div>

      {/* Edit Organisation Dialog */}
      <OrgEditDialog
        open={orgOpen}
        onOpenChange={(v) => setOrgOpen(v)}
        initial={data}
        onSave={async (payload: OrganisationUpdateRequest) => {
          if (!data) return;
          try {
            setSaving(true);
            const updated = await updateOrganisationAPI(data.id, payload);
            setData(updated);
            setOrgOpen(false);
          } catch (e: any) {
            setError(e?.message ?? "Failed to update organisation");
          } finally {
            setSaving(false);
          }
        }}
      />
    </div>
  );
}
