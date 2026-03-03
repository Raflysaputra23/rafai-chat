/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useActionState, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Copy, Check, Trash2, Edit2, X,
  Code2, Terminal,
  MessageCircleMore,
  Key,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { Tables } from "@/types/types";
import Modal from "@/components/ui/modal";
import { createClient } from "@/lib/supabase/client";
import { formClusterValidation } from "@/lib/formValidation";
import ButtonForm from "@/components/loading/ButtonForm";
import crypto from "crypto";
import Link from "next/link";
import { toastError, toastSuccess } from "@/lib/toast";



type Cluster = Tables<"clusters">;

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [state, formAction]: any = useActionState(formClusterValidation, null);

  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCluster, setEditingCluster] = useState<Cluster | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [codeTab, setCodeTab] = useState<"javascript" | "python">("javascript");
  const [showModalCluster, setShowModalCluster] = useState({ show: false, cluster: "" });
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showModalApikey, setShowModalApikey] = useState<boolean>(false);
  const [apikey, setApikey] = useState<any[]>([]);

  const fetchClusters = async () => {
    if (user) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("clusters")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data) {
        setClusters(data);
        if (!selectedCluster && data.length > 0) setSelectedCluster(data[0]);
      } else {
        toastError("Cluster gagal dimuat!")
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchClusters();
      await getApikey();
    })();
  }, [user]);

  useEffect(() => {
    if (state) {
      if (state.success) {
        (async () => {
          try {
            const res = await handleSave();
            if (!res) throw "Data gagal disimpan";
            setMessage("Data berhasil disimpan");
            setError(false);
          } catch (error: unknown) {
            setMessage(error instanceof Error ? error.message : "Data gagal disimpan");
            setError(true);
          } finally {
            resetForm();
          }
        })();
      } else {
        setMessage(state.message)
        setError(true);
      }
    }
  }, [state]);


  const handleSave = async () => {
    if (!user) return;
    const supabase = createClient();

    if (editingCluster) {
      const { error } = await supabase
        .from("clusters")
        .update({ name, description, system_prompt: systemPrompt })
        .eq("id", editingCluster.id);
      if (error) {
        toastError("Cluster gagal diperbarui!");
        return false;
      }
      toastSuccess("Cluster berhasil diperbarui!");
    } else {
      const apikey = crypto.randomBytes(32).toString("hex");
      const { error } = await supabase
        .from("clusters")
        .insert({ name, description, system_prompt: systemPrompt, user_id: user.id, apikey });
      if (error) {
        toastError("Cluster gagal dibuat!");
        return false;
      }
      toastSuccess("Cluster berhasil dibuat!");
    }

    resetForm();
    fetchClusters();
    return true;
  };

  const handleDelete = async () => {
    const supabase = createClient();

    const { error } = await supabase.from("clusters")
      .delete()
      .eq("id", showModalCluster.cluster);
    if (error) {
      toastError("Cluster gagal dihapus!");
      return;
    }
    if (selectedCluster?.id === showModalCluster.cluster) setSelectedCluster(null);
    toastSuccess("Cluster berhasil dihapus!");
    fetchClusters();
    setShowModalCluster({ show: false, cluster: "" });
  };

  const generateToken = async () => {
    if (user) {
      const supabase = createClient();
      const apikey = crypto.randomBytes(32).toString("hex");
      const { error } = await supabase.from("apikeys").insert({ apikey, jenis: "biasa", id_user: user.id, limit: 100 });
      return error;
    }
  };

  const createApikey = async () => {
    if(apikey.length >= 5) {
      toastError("Anda hanya dapat membuat maksimal 5 api key!");
      return;
    }
    const error = await generateToken();
    if (error) {
      toastError("Api key gagal dibuat!");
      return;
    }
    toastSuccess("API key berhasil dibuat!");
    await getApikey();
    setShowModalApikey(false);
  }

  const handleDeleteApikey = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("apikeys").delete().eq("id", id);
    if (error) {
      toastError("Api key gagal dihapus!");
      return;
    }
    toastSuccess("API key berhasil dihapus!");
    await getApikey();
  }

  const getApikey = async () => {
    const supabase = createClient();
    if (user) {
      const { error, data } = await supabase.from("apikeys")
        .select("*")
        .eq("id_user", user.id)
      if (!error && data) {
        setApikey(data);
      }
    }
  }

  const handleEdit = (cluster: Cluster) => {
    setEditingCluster(cluster);
    setName(cluster.name);
    setDescription(cluster.description || "");
    setSystemPrompt(cluster.system_prompt);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCluster(null);
    setName("");
    setDescription("");
    setSystemPrompt("");
    const timeout = setTimeout(() => {
      setMessage(null);
      setError(false);
      clearTimeout(timeout);
    }, 4000);
  };

  const [copied, setCopied] = useState(false);
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toastSuccess("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const getJsCode = (cluster: Cluster) =>
    `const formdata = new FormData();
formdata.append("prompt", prompt);
formdata.append("instruksi, ${cluster.system_prompt}");

const response = await fetch("${process.env.NEXT_PUBLIC_URL_DOMAIN}/api/v1", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${cluster.apikey}"
  },
  body: formdata
});

if (res.status === 200) {
    const data = await res.json();
    return data.response;
}`;

  const getPyCode = (cluster: Cluster) =>
    `import requests

response = requests.post(
    "${process.env.NEXT_PUBLIC_URL_DOMAIN}/api/v1",
    headers={
        "Authorization": "Bearer ${cluster.apikey}"
    },
    json={
        "cluster_id": "${cluster.id}",
        "messages": [
            {"role": "user", "content": "Halo, apa kabar?"}
        ]
    }
)

data = response.json()
print(data["reply"])`;

  if (authLoading || loading) {
    return <LoadingScreen statusLoading={loading || authLoading} />
  }

  return (
    <div className="container mx-auto px-3 lg:px-6 py-8">
      <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cluster API</h1>
          <p className="text-muted-foreground text-sm">Buat dan kelola cluster chatbot kamu</p>
        </div>
        <div className="space-x-4 space-y-2">
          <Button variant="heroOutline" size={"lg"} onClick={() => setShowModalApikey(true)}>
            <Key className="w-4 h-4" /> Buat Apikey
          </Button>
          <Button variant="heroOutline" size={"lg"} onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="w-4 h-4" /> Buat Cluster
          </Button>
          <Button variant="heroOutline" size={"lg"} asChild >
            <Link href={"/chat"}>
              <MessageCircleMore className="w-4 h-4" /> Chatbot
            </Link>
          </Button>
        </div>
      </div>

      {/* Information Delete Cluster */}
      <Modal showForm={showModalCluster.show} size="md" resetForm={() => setShowModalCluster({ show: false, cluster: "" })}>
        <h1 className='text-xl font-black mb-2'>Hapus</h1>
        <p className='text-sm text-muted-foreground mb-4'>Apakah anda yakin ingin menghapus cluster ini?</p>
        <div className='flex justify-end gap-2'>
          <Button onClick={() => setShowModalCluster({ show: false, cluster: "" })} variant="hero" className="" size={"default"}>
            Tidak
          </Button>
          <Button onClick={handleDelete} variant="hero" className="bg-red-500 border  cursor-pointer hover:bg-red-500/80 text-foreground" size={"default"}>
            Hapus
          </Button>
        </div>
      </Modal>

      {/* Information Apikey */}
      <Modal showForm={showModalApikey} size="md" resetForm={() => setShowModalApikey(false)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">
            Buat Apikey
          </h3>
          <button onClick={() => setShowModalApikey(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <Button variant="hero" size={"sm"} className="text-sm" onClick={createApikey}>
          <Key className="w-4 h-4" /> Buat Apikey
        </Button>
        <div className="space-y-4 mt-6">
          <div className="space-y-2 relative">
            <Label className="text-foreground">Apikey Anda</Label>
            <div className="bg-background rounded-lg p-3 space-y-2 shadow">
              {apikey.length > 0 && apikey.map(a =>
                <div key={a.apikey} className="flex items-center gap-2">
                  <Input className="w-full" readOnly value={a.apikey} />
                  <Button variant={"heroOutline"}
                    onClick={() => copyCode(a.apikey)}
                    className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" onClick={() => copyCode(a.apikey)} />
                  </Button>
                  <Button variant={"heroOutline"}
                    onClick={() => handleDeleteApikey(a.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
              {apikey.length <= 0 && (
                <>
                  <h3 className="text-lg font-semibold text-foreground mb-2 text-center">Tidak ada apikey</h3>
                  <p className="text-muted-foreground text-sm text-center">Buat apikey pertama kamu untuk mulai menggunakan API Chatbot</p>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Create/Edit Form Modal */}
      <Modal showForm={showForm} size="lg" resetForm={resetForm}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">
            {editingCluster ? "Edit Cluster" : "Buat Cluster Baru"}
          </h3>
          <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        {message && <div className={`flex items-center justify-center ${(state?.success && !error) ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} p-4 rounded-md border mb-4`}>
          <p className={`text-xs ${(state?.success && !error) ? 'text-green-500/50' : 'text-red-500/50'}`}>{message}</p>
        </div>}

        <form action={formAction} className="space-y-6">
          <div className="space-y-2 relative">
            <Label className="text-foreground">Nama Cluster</Label>
            <Input
              placeholder="Contoh: Customer Support Bot"
              value={name}
              type="text"
              name="name"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <p className='text-xs text-destructive absolute -bottom-2.5 left-1'>{state?.error?.name}</p>

          </div>

          <div className="space-y-2 relative">
            <Label className="text-foreground">Deskripsi</Label>
            <Input
              placeholder="Deskripsi singkat tentang cluster ini"
              value={description}
              type="text"
              name="description"
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className='text-xs text-destructive absolute -bottom-2.5 left-1'>{state?.error?.description}</p>

          </div>

          <div className="space-y-2 relative">
            <Label className="text-foreground">Perintah Chatbot (System Prompt)</Label>
            <Textarea
              placeholder="Kamu adalah asisten customer support yang ramah dan membantu..."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              required
              name="system_prompt"
              rows={5}
              className="resize-none h-22 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-primary"
            />
            <p className='text-xs text-destructive absolute -bottom-4.5 left-1'>{state?.error?.system_prompt}</p>

          </div>

          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={resetForm}>
              Batal
            </Button>
            <ButtonForm variant="hero" style="flex-2" >
              {editingCluster ? "Simpan" : "Buat Cluster"}
            </ButtonForm>
          </div>
        </form>
      </Modal>

      {clusters.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Terminal className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Belum ada cluster</h3>
          <p className="text-muted-foreground text-sm mb-6">Buat cluster pertama kamu untuk mulai menggunakan API</p>
          <Button variant="hero" size={"lg"} onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> Buat Cluster Pertama
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cluster list */}
          <div className="lg:col-span-1 space-y-3">
            {clusters.map((cluster) => (
              <motion.div
                key={cluster.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-card border rounded-xl p-4 cursor-pointer transition-all hover:border-primary/50 ${selectedCluster?.id === cluster.id ? "border-primary shadow-lg shadow-primary/5" : "border-border"
                  }`}
                onClick={() => setSelectedCluster(cluster)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{cluster.name}</h4>
                    {cluster.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {cluster.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button variant={"heroOutline"}
                      onClick={(e) => { e.stopPropagation(); handleEdit(cluster); }}
                      className="p-1.5 rounded-lg hover:bg-yellow-500/10 text-muted-foreground hover:text-yellow-500 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant={"heroOutline"}
                      onClick={(e) => { e.stopPropagation(); setShowModalCluster({ show: true, cluster: cluster.id }); }}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <code className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground font-mono truncate">
                    {cluster.apikey.slice(0, 12)}...
                  </code>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Code preview */}
          <div className="lg:col-span-2">
            {selectedCluster ? (
              <motion.div
                key={selectedCluster.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="border-b border-border p-4">
                  <h3 className="font-bold text-foreground">{selectedCluster.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    System Prompt: <span className="text-foreground italic">&quot;{selectedCluster.system_prompt.slice(0, 80)}{selectedCluster.system_prompt.length > 80 ? '...' : ''}&quot;</span>
                  </p>
                </div>

                {/* Tab switcher */}
                <div className="border-b border-border flex items-center justify-between px-4">
                  <div className="flex">
                    <button
                      onClick={() => setCodeTab("javascript")}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${codeTab === "javascript"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <Code2 className="w-4 h-4 inline mr-1.5" />
                      request.js
                    </button>
                    <button
                      onClick={() => setCodeTab("python")}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${codeTab === "python"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <Terminal className="w-4 h-4 inline mr-1.5" />
                      request.py
                    </button>
                  </div>
                  <button
                    onClick={() => copyCode(codeTab === "javascript" ? getJsCode(selectedCluster) : getPyCode(selectedCluster))}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Disalin!" : "Salin"}
                  </button>
                </div>

                {/* Code block */}
                <div className="p-4 bg-secondary/30 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-primary">
                  <pre className="text-sm font-mono leading-relaxed">
                    <code className="text-foreground">
                      {codeTab === "javascript" ? getJsCode(selectedCluster) : getPyCode(selectedCluster)}
                    </code>
                  </pre>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                Pilih cluster untuk melihat kode API
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
