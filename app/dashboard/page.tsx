"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Plus, Copy, Check, Trash2, Edit2, LogOut, X,
  Code2, Terminal,
  ChartBar,
} from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
// import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
// import { LoadingScreen } from "@/components/loading/LoadingScreen";
import Link from "next/link";
import { Tables } from "@/types/types";

type Cluster = Tables<"clusters">;

const Dashboard = () => {
//   const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCluster, setEditingCluster] = useState<Cluster | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [codeTab, setCodeTab] = useState<"javascript" | "python">("javascript");

//   useEffect(() => {
//     if (!authLoading && !user) router.push("/auth");
//   }, [user, authLoading, navigate]);

//   useEffect(() => {
//     if (user) fetchClusters();
//   }, [user]);

//   const fetchClusters = async () => {
//     const { data, error } = await supabase
//       .from("clusters")
//       .select("*")
//       .order("created_at", { ascending: false });
//     if (error) {
//       toast({ title: "Error", description: error.message, variant: "destructive" });
//     } else {
//       setClusters(data || []);
//       if (!selectedCluster && data && data.length > 0) setSelectedCluster(data[0]);
//     }
//     setLoading(false);
//   };

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;

//     if (editingCluster) {
//       const { error } = await supabase
//         .from("clusters")
//         .update({ name, description, system_prompt: systemPrompt })
//         .eq("id", editingCluster.id);
//       if (error) {
//         toast({ title: "Error", description: error.message, variant: "destructive" });
//         return;
//       }
//       toast({ title: "Cluster diperbarui!" });
//     } else {
//       const { error } = await supabase
//         .from("clusters")
//         .insert({ name, description, system_prompt: systemPrompt, user_id: user.id });
//       if (error) {
//         toast({ title: "Error", description: error.message, variant: "destructive" });
//         return;
//       }
//       toast({ title: "Cluster dibuat!" });
//     }

//     resetForm();
//     fetchClusters();
//   };

//   const handleDelete = async (id: string) => {
//     const { error } = await supabase.from("clusters").delete().eq("id", id);
//     if (error) {
//       toast({ title: "Error", description: error.message, variant: "destructive" });
//       return;
//     }
//     if (selectedCluster?.id === id) setSelectedCluster(null);
//     toast({ title: "Cluster dihapus!" });
//     fetchClusters();
//   };

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
  };

  const [copied, setCopied] = useState(false);
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getJsCode = (cluster: Cluster) =>
    `const response = await fetch("https://api.rafai.dev/v1/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${cluster.api_key}"
  },
  body: JSON.stringify({
    cluster_id: "${cluster.id}",
    messages: [
      { role: "user", content: "Halo, apa kabar?" }
    ]
  })
});

const data = await response.json();
console.log(data.reply);`;

  const getPyCode = (cluster: Cluster) =>
    `import requests

response = requests.post(
    "https://api.rafai.dev/v1/chat",
    headers={
        "Content-Type": "application/json",
        "Authorization": "Bearer ${cluster.api_key}"
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

//   if (authLoading || loading) {
//     return <LoadingScreen statusLoading={loading || authLoading} />
//   }

  return (
    <div className="min-h-screen bg-background dark">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">RafAI</span>
          </Link>
          <Button variant="default" className="bg-red-500/50 border border-red-500 cursor-pointer hover:bg-red-500/80 text-foreground" size={"lg"}>
            <LogOut className="w-4 h-4 mr-2" /> Keluar
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cluster API</h1>
            <p className="text-muted-foreground text-sm">Buat dan kelola cluster chatbot kamu</p>
          </div>
          <div className="space-x-4">
            <Button variant="heroOutline" size={"lg"}  onClick={() => { resetForm(); setShowForm(true); }}>
                <ChartBar className="w-4 h-4 mr-2" /> Chatbot
            </Button>
            <Button variant="heroOutline" size={"lg"}>
                <Plus className="w-4 h-4 mr-2" /> Buat Cluster
            </Button>
          </div>
        </div>

        {/* Create/Edit Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground">
                    {editingCluster ? "Edit Cluster" : "Buat Cluster Baru"}
                  </h3>
                  <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form  className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Nama Cluster</Label>
                    <Input
                      placeholder="Contoh: Customer Support Bot"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Deskripsi</Label>
                    <Input
                      placeholder="Deskripsi singkat tentang cluster ini"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Perintah Chatbot (System Prompt)</Label>
                    <Textarea
                      placeholder="Kamu adalah asisten customer support yang ramah dan membantu..."
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      required
                      rows={5}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" className="flex-1" onClick={resetForm}>
                      Batal
                    </Button>
                    <Button type="submit" variant="hero" className="flex-1">
                      {editingCluster ? "Simpan" : "Buat Cluster"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cluster list */}
            <div className="lg:col-span-1 space-y-3">
              {clusters.map((cluster) => (
                <motion.div
                  key={cluster.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-card border rounded-xl p-4 cursor-pointer transition-all hover:border-primary/50 ${
                    selectedCluster?.id === cluster.id ? "border-primary shadow-lg shadow-primary/5" : "border-border"
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
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(cluster); }}
                        className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <Button variant={"heroOutline"}
                        // onClick={(e) => { e.stopPropagation(); handleDelete(cluster.id); }}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <code className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground font-mono truncate">
                      {cluster.api_key.slice(0, 12)}...
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
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                          codeTab === "javascript"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Code2 className="w-4 h-4 inline mr-1.5" />
                        request.js
                      </button>
                      <button
                        onClick={() => setCodeTab("python")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                          codeTab === "python"
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
                  <div className="p-4 bg-secondary/30 overflow-x-auto">
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
    </div>
  );
};

export default Dashboard;
