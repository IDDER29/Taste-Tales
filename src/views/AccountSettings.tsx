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
    <div className="container mx-auto py-12 px-4 max-w-2xl space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Account settings</h1>

      <Card>
        <CardBody>
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
            <hr className="border-gray-100" />
            <p className="text-sm font-medium text-gray-700">Change password</p>
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
        <CardBody className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-gray-800">Export your data</p>
            <p className="text-sm text-gray-500">
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

      <Card className="border-red-100">
        <CardBody className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-red-700">Delete account</p>
            <p className="text-sm text-gray-500">
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
