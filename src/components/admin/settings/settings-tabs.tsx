"use client";

import { useState } from "react";
import { Loader2, Save, Globe, Palette, Mail, Shield } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SettingsTabs() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Pengaturan berhasil disimpan");
    setIsLoading(false);
  };

  return (
    <Tabs defaultValue="general" className="space-y-6">
      <TabsList>
        <TabsTrigger value="general" className="gap-2">
          <Globe className="h-4 w-4" />
          Umum
        </TabsTrigger>
        <TabsTrigger value="seo" className="gap-2">
          <Globe className="h-4 w-4" />
          SEO
        </TabsTrigger>
        <TabsTrigger value="theme" className="gap-2">
          <Palette className="h-4 w-4" />
          Tema
        </TabsTrigger>
        <TabsTrigger value="email" className="gap-2">
          <Mail className="h-4 w-4" />
          Email
        </TabsTrigger>
        <TabsTrigger value="security" className="gap-2">
          <Shield className="h-4 w-4" />
          Keamanan
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Umum</CardTitle>
            <CardDescription>
              Konfigurasi dasar website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nama Website</Label>
                <Input
                  id="siteName"
                  defaultValue="EduProfile CMS"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteTagline">Tagline</Label>
                <Input
                  id="siteTagline"
                  defaultValue="Sistem Manajemen Konten Profil Sekolah"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="language">Bahasa Default</Label>
                <Select defaultValue="id" disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">Bahasa Indonesia</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Zona Waktu</Label>
                <Select defaultValue="Asia/Jakarta" disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Jakarta">WIB (Jakarta)</SelectItem>
                    <SelectItem value="Asia/Makassar">WITA (Makassar)</SelectItem>
                    <SelectItem value="Asia/Jayapura">WIT (Jayapura)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="maintenance" />
              <Label htmlFor="maintenance">Mode Maintenance</Label>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="seo">
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan SEO</CardTitle>
            <CardDescription>
              Optimasi mesin pencari
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                placeholder="Judul yang muncul di hasil pencarian"
                maxLength={70}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">Maksimal 70 karakter</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                placeholder="Deskripsi yang muncul di hasil pencarian"
                maxLength={160}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">Maksimal 160 karakter</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Meta Keywords</Label>
              <Input
                id="metaKeywords"
                placeholder="sekolah, pendidikan, profil sekolah"
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gaId">Google Analytics ID</Label>
                <Input
                  id="gaId"
                  placeholder="G-XXXXXXXXXX"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gscId">Google Search Console</Label>
                <Input
                  id="gscId"
                  placeholder="Verification code"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogImage">Default OG Image URL</Label>
              <Input
                id="ogImage"
                type="url"
                placeholder="https://..."
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="theme">
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Tema</CardTitle>
            <CardDescription>
              Kustomisasi tampilan website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Warna Primary</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    defaultValue="#3B82F6"
                    className="w-16 h-10 p-1"
                    disabled={isLoading}
                  />
                  <Input
                    defaultValue="#3B82F6"
                    placeholder="#3B82F6"
                    className="flex-1"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Warna Secondary</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    defaultValue="#10B981"
                    className="w-16 h-10 p-1"
                    disabled={isLoading}
                  />
                  <Input
                    defaultValue="#10B981"
                    placeholder="#10B981"
                    className="flex-1"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preset Tema</Label>
              <div className="grid grid-cols-4 gap-4">
                {["PAUD/TK", "SD", "SMP", "SMA/SMK"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    className="p-4 border rounded-lg text-center hover:border-primary transition-colors"
                  >
                    <div className="font-medium">{level}</div>
                    <div className="text-xs text-muted-foreground">Preset tema</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="darkMode" />
              <Label htmlFor="darkMode">Aktifkan Dark Mode Toggle</Label>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Email</CardTitle>
            <CardDescription>
              Konfigurasi pengiriman email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  placeholder="smtp.gmail.com"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  placeholder="587"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  placeholder="user@gmail.com"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fromEmail">Email Pengirim</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  placeholder="noreply@sekolah.sch.id"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromName">Nama Pengirim</Label>
                <Input
                  id="fromName"
                  placeholder="Sekolah Contoh"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="emailNotif" defaultChecked />
              <Label htmlFor="emailNotif">Kirim notifikasi email saat ada pesan baru</Label>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Keamanan</CardTitle>
            <CardDescription>
              Konfigurasi keamanan website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  Tambahkan lapisan keamanan ekstra untuk login
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Login Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Kirim notifikasi email saat ada login baru
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Session Timeout</h4>
                <p className="text-sm text-muted-foreground">
                  Otomatis logout setelah tidak aktif
                </p>
              </div>
              <Select defaultValue="60">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 menit</SelectItem>
                  <SelectItem value="60">1 jam</SelectItem>
                  <SelectItem value="120">2 jam</SelectItem>
                  <SelectItem value="480">8 jam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">reCAPTCHA</h4>
                <p className="text-sm text-muted-foreground">
                  Aktifkan reCAPTCHA pada form publik
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Pengaturan
            </>
          )}
        </Button>
      </div>
    </Tabs>
  );
}
