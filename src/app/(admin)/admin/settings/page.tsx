import { Metadata } from "next";
import { SettingsTabs } from "@/components/admin/settings/settings-tabs";

export const metadata: Metadata = {
  title: "Pengaturan",
  description: "Pengaturan website",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">
          Konfigurasi dan pengaturan website
        </p>
      </div>

      <SettingsTabs />
    </div>
  );
}
