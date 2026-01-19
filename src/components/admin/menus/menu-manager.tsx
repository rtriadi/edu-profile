"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  ChevronRight,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  createMenu,
  updateMenu,
  deleteMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemVisibility,
  reorderMenuItems,
} from "@/actions/menus";

interface MenuItem {
  id: string;
  label: string;
  url: string | null;
  pageSlug: string | null;
  type: string;
  parentId: string | null;
  order: number;
  isVisible: boolean;
  openNew: boolean;
  icon: string | null;
  cssClass: string | null;
  children?: MenuItem[];
}

interface Menu {
  id: string;
  name: string;
  location: string;
  items: MenuItem[];
}

interface Page {
  id: string;
  title: string;
  slug: string;
}

interface MenuManagerProps {
  menus: Menu[];
  pages: Page[];
}

// Predefined system routes
const SYSTEM_ROUTES = [
  { label: "Beranda", url: "/", description: "Halaman utama" },
  { label: "Profil Sekolah", url: "/profil", description: "Informasi tentang sekolah" },
  { label: "Akademik", url: "/akademik", description: "Program akademik" },
  { label: "Berita", url: "/berita", description: "Berita dan artikel" },
  { label: "Galeri", url: "/galeri", description: "Galeri foto dan video" },
  { label: "Kontak", url: "/kontak", description: "Informasi kontak" },
  { label: "Pendaftaran", url: "/ppdb", description: "Pendaftaran siswa baru" },
  { label: "Fasilitas", url: "/fasilitas", description: "Fasilitas sekolah" },
  { label: "Ekstrakurikuler", url: "/ekstrakurikuler", description: "Kegiatan ekstrakurikuler" },
  { label: "Prestasi", url: "/prestasi", description: "Prestasi sekolah dan siswa" },
  { label: "Agenda", url: "/agenda", description: "Kalender kegiatan" },
  { label: "Pengumuman", url: "/pengumuman", description: "Pengumuman terbaru" },
] as const;

export function MenuManager({ menus: initialMenus, pages }: MenuManagerProps) {
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(
    initialMenus[0]?.id || null
  );
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingMenu, setIsAddingMenu] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "menu" | "item"; id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [menuForm, setMenuForm] = useState({ name: "", location: "" });
  const [itemForm, setItemForm] = useState({
    label: "",
    type: "link" as string,
    url: "",
    pageSlug: "",
    parentId: "",
    isVisible: true,
    openNew: false,
    icon: "",
  });

  const selectedMenu = menus.find((m) => m.id === selectedMenuId);

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleCreateMenu = async () => {
    if (!menuForm.name || !menuForm.location) {
      toast.error("Nama dan lokasi menu diperlukan");
      return;
    }

    setIsLoading(true);
    const result = await createMenu(menuForm);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
      setIsAddingMenu(false);
      setMenuForm({ name: "", location: "" });
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteMenu = async () => {
    if (!deleteTarget || deleteTarget.type !== "menu") return;

    setIsLoading(true);
    const result = await deleteMenu(deleteTarget.id);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
      setDeleteTarget(null);
      if (selectedMenuId === deleteTarget.id) {
        setSelectedMenuId(menus.find((m) => m.id !== deleteTarget.id)?.id || null);
      }
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const handleCreateItem = async () => {
    if (!selectedMenuId || !itemForm.label) {
      toast.error("Label menu diperlukan");
      return;
    }

    setIsLoading(true);
    const result = await createMenuItem(selectedMenuId, {
      label: itemForm.label,
      type: itemForm.type as "link" | "page" | "dropdown" | "megamenu" | "route",
      url: (itemForm.type === "link" || itemForm.type === "route") ? itemForm.url : undefined,
      pageSlug: itemForm.type === "page" ? itemForm.pageSlug : undefined,
      parentId: itemForm.parentId || undefined,
      order: 0,
      isVisible: itemForm.isVisible,
      openNew: itemForm.openNew,
      icon: itemForm.icon || undefined,
    });
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
      setIsAddingItem(false);
      setItemForm({
        label: "",
        type: "link",
        url: "",
        pageSlug: "",
        parentId: "",
        isVisible: true,
        openNew: false,
        icon: "",
      });
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    setIsLoading(true);
    const result = await updateMenuItem(editingItem.id, {
      label: itemForm.label,
      type: itemForm.type as "link" | "page" | "dropdown" | "megamenu" | "route",
      url: (itemForm.type === "link" || itemForm.type === "route") ? itemForm.url : undefined,
      pageSlug: itemForm.type === "page" ? itemForm.pageSlug : undefined,
      isVisible: itemForm.isVisible,
      openNew: itemForm.openNew,
      icon: itemForm.icon || undefined,
    });
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
      setEditingItem(null);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteTarget || deleteTarget.type !== "item") return;

    setIsLoading(true);
    const result = await deleteMenuItem(deleteTarget.id);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
      setDeleteTarget(null);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const handleToggleVisibility = async (itemId: string) => {
    const result = await toggleMenuItemVisibility(itemId);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const openEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({
      label: item.label,
      type: item.type,
      url: item.url || "",
      pageSlug: item.pageSlug || "",
      parentId: item.parentId || "",
      isVisible: item.isVisible,
      openNew: item.openNew,
      icon: item.icon || "",
    });
  };

  const getAllItems = (items: MenuItem[]): MenuItem[] => {
    const result: MenuItem[] = [];
    for (const item of items) {
      result.push(item);
      if (item.children) {
        result.push(...getAllItems(item.children));
      }
    }
    return result;
  };

  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id}>
        <div
          className={`flex items-center gap-2 py-2 px-3 rounded-md hover:bg-muted/50 group ${
            depth > 0 ? "ml-6" : ""
          }`}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.id)}
              className="p-0.5 hover:bg-muted rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}

          <span className="flex-1 font-medium">{item.label}</span>

          {item.type === "page" && item.pageSlug && (
            <Badge variant="secondary" className="text-xs">
              /{item.pageSlug}
            </Badge>
          )}
          {item.type === "link" && item.url && (
            <Badge variant="outline" className="text-xs">
              {item.openNew && <ExternalLink className="h-3 w-3 mr-1" />}
              Link
            </Badge>
          )}
          {item.type === "route" && item.url && (
            <Badge variant="default" className="text-xs">
              {item.url}
            </Badge>
          )}
          {item.type === "dropdown" && (
            <Badge variant="outline" className="text-xs">Dropdown</Badge>
          )}

          {!item.isVisible && (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditItem(item)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleVisibility(item.id)}>
                {item.isVisible ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Sembunyikan
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Tampilkan
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteTarget({ type: "item", id: item.id })}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l-2 border-muted ml-4">
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Menu List */}
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Menu</CardTitle>
          <Dialog open={isAddingMenu} onOpenChange={setIsAddingMenu}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Menu Baru</DialogTitle>
                <DialogDescription>
                  Buat menu baru untuk digunakan di website
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nama Menu</Label>
                  <Input
                    value={menuForm.name}
                    onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                    placeholder="Contoh: Menu Header"
                  />
                </div>
                <div>
                  <Label>Lokasi</Label>
                  <Select
                    value={menuForm.location}
                    onValueChange={(v) => setMenuForm({ ...menuForm, location: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="header">Header</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingMenu(false)}>
                  Batal
                </Button>
                <Button onClick={handleCreateMenu} disabled={isLoading}>
                  Simpan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-1">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted ${
                selectedMenuId === menu.id ? "bg-muted" : ""
              }`}
              onClick={() => setSelectedMenuId(menu.id)}
            >
              <div>
                <p className="font-medium">{menu.name}</p>
                <p className="text-xs text-muted-foreground">{menu.location}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setDeleteTarget({ type: "menu", id: menu.id })}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus Menu
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
          {menus.length === 0 && (
            <div className="text-center py-6 space-y-2">
              <p className="text-sm text-muted-foreground">
                Belum ada menu
              </p>
              <p className="text-xs text-muted-foreground">
                Klik tombol + untuk membuat menu baru
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Menu Items */}
      <Card className="lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg">
              {selectedMenu?.name || "Pilih Menu"}
            </CardTitle>
            <CardDescription>
              {selectedMenu
                ? `${selectedMenu.items.length} item di menu ini`
                : "Pilih menu dari daftar di samping"}
            </CardDescription>
          </div>
          {selectedMenu && (
            <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Item Menu</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={itemForm.label}
                      onChange={(e) => setItemForm({ ...itemForm, label: e.target.value })}
                      placeholder="Contoh: Beranda"
                    />
                  </div>
                  <div>
                    <Label>Tipe</Label>
                    <Select
                      value={itemForm.type}
                      onValueChange={(v) => setItemForm({ ...itemForm, type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="link">Link External</SelectItem>
                        <SelectItem value="page">Halaman CMS</SelectItem>
                        <SelectItem value="route">Rute Sistem</SelectItem>
                        <SelectItem value="dropdown">Dropdown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {itemForm.type === "link" && (
                    <div>
                      <Label>URL</Label>
                      <Input
                        value={itemForm.url}
                        onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  )}
                  {itemForm.type === "page" && (
                    <div>
                      <Label>Halaman</Label>
                      <Select
                        value={itemForm.pageSlug}
                        onValueChange={(v) => setItemForm({ ...itemForm, pageSlug: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih halaman" />
                        </SelectTrigger>
                        <SelectContent>
                          {pages.map((page) => (
                            <SelectItem key={page.id} value={page.slug}>
                              {page.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {itemForm.type === "route" && (
                    <div>
                      <Label>Rute Sistem</Label>
                      <Select
                        value={itemForm.url}
                        onValueChange={(v) => {
                          const route = SYSTEM_ROUTES.find(r => r.url === v);
                          setItemForm({ 
                            ...itemForm, 
                            url: v,
                            label: itemForm.label || route?.label || ""
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih rute sistem" />
                        </SelectTrigger>
                        <SelectContent>
                          {SYSTEM_ROUTES.map((route) => (
                            <SelectItem key={route.url} value={route.url}>
                              <div className="flex flex-col">
                                <span>{route.label}</span>
                                <span className="text-xs text-muted-foreground">{route.url}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pilih halaman sistem yang sudah tersedia di website
                      </p>
                    </div>
                  )}
                  <div>
                    <Label>Parent (Opsional)</Label>
                    <Select
                      value={itemForm.parentId || "_none"}
                      onValueChange={(v) => setItemForm({ ...itemForm, parentId: v === "_none" ? "" : v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tidak ada (Root)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">Tidak ada (Root)</SelectItem>
                        {selectedMenu &&
                          getAllItems(selectedMenu.items)
                            .filter((i) => i.type === "dropdown")
                            .map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.label}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={itemForm.isVisible}
                        onCheckedChange={(v) => setItemForm({ ...itemForm, isVisible: v })}
                      />
                      <Label>Tampilkan</Label>
                    </div>
                    {itemForm.type === "link" && (
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={itemForm.openNew}
                          onCheckedChange={(v) => setItemForm({ ...itemForm, openNew: v })}
                        />
                        <Label>Buka di tab baru</Label>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleCreateItem} disabled={isLoading}>
                    Simpan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {selectedMenu ? (
            selectedMenu.items.length > 0 ? (
              <div className="space-y-1">
                {selectedMenu.items.map((item) => renderMenuItem(item))}
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Belum ada item di menu ini
                </p>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Klik "Tambah Item" untuk menambahkan navigasi. Gunakan tipe "Rute Sistem" untuk halaman bawaan seperti Beranda, Berita, dll.
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-8 space-y-3">
              <p className="text-sm text-muted-foreground">
                Pilih menu untuk melihat dan mengelola item
              </p>
              <p className="text-xs text-muted-foreground">
                Klik salah satu menu di panel kiri untuk mulai mengedit
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item Menu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Label</Label>
              <Input
                value={itemForm.label}
                onChange={(e) => setItemForm({ ...itemForm, label: e.target.value })}
              />
            </div>
            <div>
              <Label>Tipe</Label>
              <Select
                value={itemForm.type}
                onValueChange={(v) => setItemForm({ ...itemForm, type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="link">Link External</SelectItem>
                  <SelectItem value="page">Halaman CMS</SelectItem>
                  <SelectItem value="route">Rute Sistem</SelectItem>
                  <SelectItem value="dropdown">Dropdown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {itemForm.type === "link" && (
              <div>
                <Label>URL</Label>
                <Input
                  value={itemForm.url}
                  onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
                />
              </div>
            )}
            {itemForm.type === "page" && (
              <div>
                <Label>Halaman</Label>
                <Select
                  value={itemForm.pageSlug}
                  onValueChange={(v) => setItemForm({ ...itemForm, pageSlug: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih halaman" />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.map((page) => (
                      <SelectItem key={page.id} value={page.slug}>
                        {page.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {itemForm.type === "route" && (
              <div>
                <Label>Rute Sistem</Label>
                <Select
                  value={itemForm.url}
                  onValueChange={(v) => {
                    const route = SYSTEM_ROUTES.find(r => r.url === v);
                    setItemForm({ 
                      ...itemForm, 
                      url: v,
                      label: itemForm.label || route?.label || ""
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih rute sistem" />
                  </SelectTrigger>
                  <SelectContent>
                    {SYSTEM_ROUTES.map((route) => (
                      <SelectItem key={route.url} value={route.url}>
                        <div className="flex flex-col">
                          <span>{route.label}</span>
                          <span className="text-xs text-muted-foreground">{route.url}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Pilih halaman sistem yang sudah tersedia di website
                </p>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={itemForm.isVisible}
                  onCheckedChange={(v) => setItemForm({ ...itemForm, isVisible: v })}
                />
                <Label>Tampilkan</Label>
              </div>
              {itemForm.type === "link" && (
                <div className="flex items-center gap-2">
                  <Switch
                    checked={itemForm.openNew}
                    onCheckedChange={(v) => setItemForm({ ...itemForm, openNew: v })}
                  />
                  <Label>Buka di tab baru</Label>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Batal
            </Button>
            <Button onClick={handleUpdateItem} disabled={isLoading}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === "menu"
                ? "Apakah Anda yakin ingin menghapus menu ini? Semua item di dalamnya juga akan terhapus."
                : "Apakah Anda yakin ingin menghapus item menu ini? Semua sub-item juga akan terhapus."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteTarget?.type === "menu" ? handleDeleteMenu : handleDeleteItem}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
