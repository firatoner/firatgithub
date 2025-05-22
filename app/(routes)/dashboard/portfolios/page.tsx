"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { supabase } from "@/lib/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { content } from "@/context/language-content";
import { useLanguage } from "@/context/LanguageContext";

export default function MyPortfoliosPage() {
  const router = useRouter();

  const goToAssets = (portfolioId: string) => {
    router.push(`/dashboard/portfolios/${portfolioId}/assets`);
  };

  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPortfolio, setCurrentPortfolio] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { language } = useLanguage();
  const t = content[language];
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  console.log("✅ BASE URL:", BASE);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetchWithAuth(`${BASE}/portfolios`);
      const data = await res.json();
      setPortfolios(data);
    };
    load();
  }, []);

  const refresh = async () => {
    const res = await fetchWithAuth(`${BASE}/portfolios`);
    const data = await res.json();
    setPortfolios(data);
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setName("");
    setDescription("");
    setShowForm(true);
  };

  const openEditModal = (portfolio: any) => {
    setIsEditing(true);
    setCurrentPortfolio(portfolio);
    setName(portfolio.name);
    setDescription(portfolio.description || "");
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("İsim boş olamaz");
      return;
    }

    const endpoint = isEditing
      ? `${BASE}/portfolios/${currentPortfolio.id}`
      : `${BASE}/portfolios`;

    const method = isEditing ? "PUT" : "POST";

    const res = await fetchWithAuth(endpoint, {
      method,
      body: JSON.stringify({ name, description }),
    });

    if (!res.ok) {
      const err = await res.json();
      toast.error(err.message);
      return;
    }

    toast.success(
      `Portföy başarıyla ${isEditing ? "güncellendi" : "oluşturuldu"}.`
    );
    setShowForm(false);
    await refresh();
  };

  const handleDelete = async (id: number) => {
    const res = await fetchWithAuth(`${BASE}/portfolios/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      toast.error("Silinemedi");
      return;
    }

    toast.success("Portföy başarıyla silindi.");
    await refresh();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t.myPortfolio}</h1>
        <Button onClick={openCreateModal}>{t.portfolioAdd}</Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {portfolios.map((p) => (
          <div
            key={p.id}
            className="border p-4 rounded-xl bg-white dark:bg-black dark:border-white shadow hover:shadow-md transition"
          >
            <div
              onClick={() => goToAssets(p.id)}
              className="block cursor-pointer p-2 rounded transition"
            >
              <h2 className="font-semibold text-lg">{p.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {p.description}
              </p>
            </div>

            <div className="flex gap-4 mt-4">
              <Button variant="outline" onClick={() => openEditModal(p)}>
                <Pencil />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t.deletePortfolio}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t.deletePortfolioDescription}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(p.id)}>
                      {t.yesDelete}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? t.editPortfolio : t.newPortfolio}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t.name}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">{t.description}</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button onClick={handleSubmit}>
              {isEditing ? "Kaydet" : "Oluştur"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
