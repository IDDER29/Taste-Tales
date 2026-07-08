"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Button,
  Card,
  CardBody,
  Field,
  Input,
  useToast,
  useConfirm,
} from "../components/ui";

export default function AccountSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const confirm = useConfirm();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/account");
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "");
      setEmail(session.user.email ?? "");
    }
  }, [session]);

  if (!session?.user) return null;

  const saveProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body: Record<string, unknown> = { name };
      if (email && email !== session.user?.email) body.email = email;
      if (newPassword) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
      }
      const res = await fetch("/api/v1/account", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast({
          title: "Couldn't save changes",
          description: data?.error?.message,
          variant: "error",
        });
        return;
      }
      toast({ title: "Profile updated", variant: "success" });
      setCurrentPassword("");
      setNewPassword("");
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    const ok = await confirm({
      title: "Delete your account?",
      description:
        "This permanently removes your recipes, reviews, and saved items. This can't be undone.",
      confirmLabel: "Delete account",
      danger: true,
    });
    if (!ok) return;
    const res = await fetch("/api/v1/account", { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Your account has been deleted.", variant: "success" });
      await signOut({ callbackUrl: "/" });
    } else {
      toast({ title: "Could not delete account", variant: "error" });
    }
  };

  return (
    <div className="container-page max-w-2xl space-y-6 py-12 lg:py-16">
      <header>
        <span className="eyebrow">Your account</span>
        <h1 className="mt-3 font-display text-4xl font-semibold text-sand-950">
          Account settings
        </h1>
        <p className="mt-2 text-sand-600">
          Manage your profile, password, and data.
        </p>
      </header>

      <Card>
        <CardBody className="p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-sand-950">
            Profile
          </h2>
          <form onSubmit={saveProfile} className="space-y-4">
            <Field label="Name" htmlFor="name">
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Email" htmlFor="email" hint="Changing your email requires re-verification.">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <hr className="border-sand-100" />
            <p className="text-sm font-semibold text-sand-800">Change password</p>
            <Field label="Current password" htmlFor="currentPassword">
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Field>
            <Field label="New password" htmlFor="newPassword" hint="At least 8 characters. Leave blank to keep your current password.">
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Field>
            <Button type="submit" loading={saving}>
              Save changes
            </Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="font-semibold text-sand-900">Export your data</p>
            <p className="text-sm text-sand-500">
              Download your profile, recipes, reviews, and saves as JSON.
            </p>
          </div>
          <a href="/api/v1/account/export">
            <Button variant="outline" type="button">
              Export
            </Button>
          </a>
        </CardBody>
      </Card>

      <Card className="border-red-200 bg-red-50/40">
        <CardBody className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="font-semibold text-red-700">Delete account</p>
            <p className="text-sm text-sand-500">
              Permanently delete your account and all of your content.
            </p>
          </div>
          <Button variant="danger" type="button" onClick={deleteAccount}>
            Delete
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
