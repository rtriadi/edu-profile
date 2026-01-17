"use client";

import { useState, useEffect } from "react";
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
import {
  getThemeSettings,
  saveThemeSettings,
  getSeoSettings,
  saveSeoSettings,
  getEmailSettings,
  saveEmailSettings,
  getGeneralSettings,
  saveGeneralSettings,
  type ThemeSettings,
  type SeoSettings,
  type EmailSettings,
  type GeneralSettings,
} from "@/actions/settings";

export function SettingsTabs() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Theme settings state
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    accentColor: "#8B5CF6",
    fontFamily: "Geist",
    headerStyle: "default",
    footerStyle: "default",
    customCss: "",
  });

  // SEO settings state
  const [seoSettings, setSeoSettings] = useState<SeoSettings>({
    siteTitle: "",
    siteDescription: "",
    siteKeywords: "",
    ogImage: "",
    googleAnalyticsId: "",
    googleTagManagerId: "",
    facebookPixelId: "",
    robotsTxt: "",
  });

  // Email settings state
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    smtpSecure: false,
    fromEmail: "",
    fromName: "",
    contactEmail: "",
    ppdbNotifyEmail: "",
  });

  // General settings state
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: "EduProfile CMS",
    siteTagline: "Sistem Manajemen Konten Profil Sekolah",
    language: "id",
    timezone: "Asia/Jakarta",
    maintenanceMode: false,
  });

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const [theme, seo, email, general] = await Promise.all([
          getThemeSettings(),
          getSeoSettings(),
          getEmailSettings(),
          getGeneralSettings(),
        ]);

        if (theme) setThemeSettings({ ...themeSettings, ...theme });
        if (seo) setSeoSettings({ ...seoSettings, ...seo });
        if (email) setEmailSettings({ ...emailSettings, ...email });
        if (general) setGeneralSettings({ ...generalSettings, ...general });
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadSettings();
  }, []);

  const handleSaveTheme = async () => {
    setIsLoading(true);
    const result = await saveThemeSettings(themeSettings);
    if (result.success) {
      toast.success("Pengaturan tema berhasil disimpan");
    } else {
      toast.error(result.error || "Gagal menyimpan pengaturan tema");
    }
    setIsLoading(false);
  };

  const handleSaveSeo = async () => {
    setIsLoading(true);
    const result = await saveSeoSettings(seoSettings);
    if (result.success) {
      toast.success("Pengaturan SEO berhasil disimpan");
    } else {
      toast.error(result.error || "Gagal menyimpan pengaturan SEO");
    }
    setIsLoading(false);
  };

  const handleSaveEmail = async () => {
    setIsLoading(true);
    const result = await saveEmailSettings(emailSettings);
    if (result.success) {
      toast.success("Pengaturan email berhasil disimpan");
    } else {
      toast.error(result.error || "Gagal menyimpan pengaturan email");
    }
    setIsLoading(false);
  };

  const handleSaveGeneral = async () => {
    setIsLoading(true);
    const result = await saveGeneralSettings(generalSettings);
    if (result.success) {
      toast.success("Pengaturan umum berhasil disimpan");
    } else {
      toast.error(result.error || "Gagal menyimpan pengaturan umum");
    }
    setIsLoading(false);
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
                  value={generalSettings.siteName}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, siteName: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteTagline">Tagline</Label>
                <Input
                  id="siteTagline"
                  value={generalSettings.siteTagline}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, siteTagline: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="language">Bahasa Default</Label>
                <Select
                  value={generalSettings.language}
                  onValueChange={(value) =>
                    setGeneralSettings({ ...generalSettings, language: value })
                  }
                  disabled={isLoading}
                >
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
                <Select
                  value={generalSettings.timezone}
                  onValueChange={(value) =>
                    setGeneralSettings({ ...generalSettings, timezone: value })
                  }
                  disabled={isLoading}
                >
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
              <Switch
                id="maintenance"
                checked={generalSettings.maintenanceMode}
                onCheckedChange={(checked) =>
                  setGeneralSettings({ ...generalSettings, maintenanceMode: checked })
                }
              />
              <Label htmlFor="maintenance">Mode Maintenance</Label>
            </div>

            <div className="pt-4">
              <Button onClick={handleSaveGeneral} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Pengaturan Umum
                  </>
                )}
              </Button>
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
                value={seoSettings.siteTitle || ""}
                onChange={(e) =>
                  setSeoSettings({ ...seoSettings, siteTitle: e.target.value })
                }
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
                value={seoSettings.siteDescription || ""}
                onChange={(e) =>
                  setSeoSettings({ ...seoSettings, siteDescription: e.target.value })
                }
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
                value={seoSettings.siteKeywords || ""}
                onChange={(e) =>
                  setSeoSettings({ ...seoSettings, siteKeywords: e.target.value })
                }
                placeholder="sekolah, pendidikan, profil sekolah"
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gaId">Google Analytics ID</Label>
                <Input
                  id="gaId"
                  value={seoSettings.googleAnalyticsId || ""}
                  onChange={(e) =>
                    setSeoSettings({ ...seoSettings, googleAnalyticsId: e.target.value })
                  }
                  placeholder="G-XXXXXXXXXX"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gtmId">Google Tag Manager ID</Label>
                <Input
                  id="gtmId"
                  value={seoSettings.googleTagManagerId || ""}
                  onChange={(e) =>
                    setSeoSettings({ ...seoSettings, googleTagManagerId: e.target.value })
                  }
                  placeholder="GTM-XXXXXXX"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogImage">Default OG Image URL</Label>
              <Input
                id="ogImage"
                type="url"
                value={seoSettings.ogImage || ""}
                onChange={(e) =>
                  setSeoSettings({ ...seoSettings, ogImage: e.target.value })
                }
                placeholder="https://..."
                disabled={isLoading}
              />
            </div>

            <div className="pt-4">
              <Button onClick={handleSaveSeo} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Pengaturan SEO
                  </>
                )}
              </Button>
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
                    value={themeSettings.primaryColor || "#3B82F6"}
                    onChange={(e) =>
                      setThemeSettings({ ...themeSettings, primaryColor: e.target.value })
                    }
                    className="w-16 h-10 p-1"
                    disabled={isLoading}
                  />
                  <Input
                    value={themeSettings.primaryColor || "#3B82F6"}
                    onChange={(e) =>
                      setThemeSettings({ ...themeSettings, primaryColor: e.target.value })
                    }
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
                    value={themeSettings.secondaryColor || "#10B981"}
                    onChange={(e) =>
                      setThemeSettings({ ...themeSettings, secondaryColor: e.target.value })
                    }
                    className="w-16 h-10 p-1"
                    disabled={isLoading}
                  />
                  <Input
                    value={themeSettings.secondaryColor || "#10B981"}
                    onChange={(e) =>
                      setThemeSettings({ ...themeSettings, secondaryColor: e.target.value })
                    }
                    placeholder="#10B981"
                    className="flex-1"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accentColor">Warna Accent</Label>
              <div className="flex gap-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={themeSettings.accentColor || "#8B5CF6"}
                  onChange={(e) =>
                    setThemeSettings({ ...themeSettings, accentColor: e.target.value })
                  }
                  className="w-16 h-10 p-1"
                  disabled={isLoading}
                />
                <Input
                  value={themeSettings.accentColor || "#8B5CF6"}
                  onChange={(e) =>
                    setThemeSettings({ ...themeSettings, accentColor: e.target.value })
                  }
                  placeholder="#8B5CF6"
                  className="flex-1 max-w-xs"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preset Tema</Label>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { name: "PAUD/TK", primary: "#F472B6", secondary: "#FBBF24" },
                  { name: "SD", primary: "#3B82F6", secondary: "#10B981" },
                  { name: "SMP", primary: "#6366F1", secondary: "#14B8A6" },
                  { name: "SMA/SMK", primary: "#1E3A8A", secondary: "#059669" },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() =>
                      setThemeSettings({
                        ...themeSettings,
                        primaryColor: preset.primary,
                        secondaryColor: preset.secondary,
                      })
                    }
                    className="p-4 border rounded-lg text-center hover:border-primary transition-colors"
                  >
                    <div className="flex justify-center gap-1 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.secondary }}
                      />
                    </div>
                    <div className="font-medium text-sm">{preset.name}</div>
                    <div className="text-xs text-muted-foreground">Preset tema</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customCss">Custom CSS</Label>
              <Textarea
                id="customCss"
                value={themeSettings.customCss || ""}
                onChange={(e) =>
                  setThemeSettings({ ...themeSettings, customCss: e.target.value })
                }
                placeholder="/* Custom CSS */\n.my-class { ... }"
                rows={6}
                className="font-mono text-sm"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Tambahkan CSS kustom untuk mempersonalisasi tampilan website
              </p>
            </div>

            <div className="pt-4">
              <Button onClick={handleSaveTheme} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Pengaturan Tema
                  </>
                )}
              </Button>
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
                  value={emailSettings.smtpHost || ""}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, smtpHost: e.target.value })
                  }
                  placeholder="smtp.gmail.com"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={emailSettings.smtpPort || 587}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, smtpPort: parseInt(e.target.value) })
                  }
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
                  value={emailSettings.smtpUser || ""}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, smtpUser: e.target.value })
                  }
                  placeholder="user@gmail.com"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={emailSettings.smtpPassword || ""}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })
                  }
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
                  value={emailSettings.fromEmail || ""}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, fromEmail: e.target.value })
                  }
                  placeholder="noreply@sekolah.sch.id"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromName">Nama Pengirim</Label>
                <Input
                  id="fromName"
                  value={emailSettings.fromName || ""}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, fromName: e.target.value })
                  }
                  placeholder="Sekolah Contoh"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email Penerima Kontak</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={emailSettings.contactEmail || ""}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, contactEmail: e.target.value })
                  }
                  placeholder="admin@sekolah.sch.id"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ppdbNotifyEmail">Email Notifikasi PPDB</Label>
                <Input
                  id="ppdbNotifyEmail"
                  type="email"
                  value={emailSettings.ppdbNotifyEmail || ""}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, ppdbNotifyEmail: e.target.value })
                  }
                  placeholder="ppdb@sekolah.sch.id"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="smtpSecure"
                checked={emailSettings.smtpSecure || false}
                onCheckedChange={(checked) =>
                  setEmailSettings({ ...emailSettings, smtpSecure: checked })
                }
              />
              <Label htmlFor="smtpSecure">Gunakan SSL/TLS</Label>
            </div>

            <div className="pt-4">
              <Button onClick={handleSaveEmail} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Pengaturan Email
                  </>
                )}
              </Button>
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
    </Tabs>
  );
}
