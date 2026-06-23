"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Modal, Button, Textarea, useToast } from "./ui";

interface ReportButtonProps {
  recipeId: string;
  // Hide for the owner/admin (they manage the recipe directly).
  hidden?: boolean;
}

// Lets a signed-in user flag a recipe for moderation.
export default function ReportButton({ recipeId, hidden }: ReportButtonProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!session?.user || hidden) return null;

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/recipes/${recipeId}/report`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        toast({ title: "Report submitted. Thank you.", variant: "success" });
        setOpen(false);
        setReason("");
      } else {
        const data = await res.json().catch(() => null);
        toast({
          title: "Could not submit report",
          description: data?.error?.message,
          variant: "error",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-gray-400 hover:text-red-500"
      >
        Report
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Report this recipe"
        description="Tell us what's wrong (spam, unsafe, offensive, etc.)."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={submitting}
              disabled={reason.trim().length < 3}
              onClick={submit}
            >
              Submit report
            </Button>
          </>
        }
      >
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="Describe the problem…"
        />
      </Modal>
    </>
  );
}
