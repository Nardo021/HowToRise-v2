"use client";

import { useEffect, useState } from "react";

type Tutorial = {
  id: string;
  slug: string;
  status: "draft" | "published" | "offline";
  translations: Array<{
    locale: "zh" | "en";
    title: string;
    summary: string | null;
    contentMd: string;
  }>;
};

const initialForm = {
  slug: "",
  status: "draft",
  youtubeUrl: "",
  categorySlug: "",
  tagSlugs: "",
  zhTitle: "",
  zhSummary: "",
  zhContent: "",
  enTitle: "",
  enSummary: "",
  enContent: ""
};

export function AdminTutorialManager() {
  const [items, setItems] = useState<Tutorial[]>([]);
  const [form, setForm] = useState(initialForm);
  const [msg, setMsg] = useState("");
  const [mediaMsg, setMediaMsg] = useState("");

  async function reload() {
    const res = await fetch("/api/admin/tutorials");
    if (!res.ok) return;
    const data = await res.json();
    setItems(data.items ?? []);
  }

  useEffect(() => {
    void reload();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      slug: form.slug,
      status: form.status,
      youtubeUrl: form.youtubeUrl || undefined,
      categorySlug: form.categorySlug || undefined,
      tagSlugs: form.tagSlugs
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      zh: {
        title: form.zhTitle,
        summary: form.zhSummary,
        contentMd: form.zhContent
      },
      en: {
        title: form.enTitle,
        summary: form.enSummary,
        contentMd: form.enContent
      }
    };
    const res = await fetch("/api/admin/tutorials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setMsg("Saved.");
      setForm(initialForm);
      await reload();
      return;
    }
    setMsg("Save failed.");
  }

  return (
    <div>
      <h1>Content Management</h1>
      <form
        className="card"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const fileInput = form.elements.namedItem("image") as HTMLInputElement;
          const file = fileInput.files?.[0];
          if (!file) return;
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/admin/media", { method: "POST", body: fd });
          const data = await res.json();
          if (res.ok) {
            setMediaMsg(`Uploaded: ${data.media.originalPath}`);
            form.reset();
          } else {
            setMediaMsg("Media upload failed.");
          }
        }}
      >
        <h3>Media Upload (WebP)</h3>
        <input name="image" type="file" accept="image/*" />
        <button type="submit">Upload</button>
        {mediaMsg ? <p>{mediaMsg}</p> : null}
      </form>
      <form className="card" onSubmit={submit}>
        <input
          placeholder="slug"
          value={form.slug}
          onChange={(e) => setForm((v) => ({ ...v, slug: e.target.value }))}
        />
        <select
          value={form.status}
          onChange={(e) => setForm((v) => ({ ...v, status: e.target.value as typeof v.status }))}
        >
          <option value="draft">draft</option>
          <option value="published">published</option>
          <option value="offline">offline</option>
        </select>
        <input
          placeholder="youtube url (optional)"
          value={form.youtubeUrl}
          onChange={(e) => setForm((v) => ({ ...v, youtubeUrl: e.target.value }))}
        />
        <input
          placeholder="category slug (optional)"
          value={form.categorySlug}
          onChange={(e) => setForm((v) => ({ ...v, categorySlug: e.target.value }))}
        />
        <input
          placeholder="tag slugs comma separated"
          value={form.tagSlugs}
          onChange={(e) => setForm((v) => ({ ...v, tagSlugs: e.target.value }))}
        />
        <h3>中文</h3>
        <input
          placeholder="标题"
          value={form.zhTitle}
          onChange={(e) => setForm((v) => ({ ...v, zhTitle: e.target.value }))}
        />
        <textarea
          placeholder="摘要"
          value={form.zhSummary}
          onChange={(e) => setForm((v) => ({ ...v, zhSummary: e.target.value }))}
        />
        <textarea
          placeholder="Markdown 正文"
          value={form.zhContent}
          onChange={(e) => setForm((v) => ({ ...v, zhContent: e.target.value }))}
          rows={8}
        />
        <h3>English</h3>
        <input
          placeholder="Title"
          value={form.enTitle}
          onChange={(e) => setForm((v) => ({ ...v, enTitle: e.target.value }))}
        />
        <textarea
          placeholder="Summary"
          value={form.enSummary}
          onChange={(e) => setForm((v) => ({ ...v, enSummary: e.target.value }))}
        />
        <textarea
          placeholder="Markdown body"
          value={form.enContent}
          onChange={(e) => setForm((v) => ({ ...v, enContent: e.target.value }))}
          rows={8}
        />
        <button type="submit">Save</button>
        {msg ? <p>{msg}</p> : null}
      </form>

      <h2>Existing Tutorials</h2>
      {items.map((item) => (
        <article className="card" key={item.id}>
          <strong>{item.slug}</strong> - {item.status}
          <div>
            {item.translations.map((tr) => (
              <p key={tr.locale}>
                [{tr.locale}] {tr.title}
              </p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
