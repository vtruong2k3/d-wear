import React from "react";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime?: string;
  tags?: string[];
  cover?: string | null;
};

const SAMPLE_POSTS: Post[] = [
  {
    id: "1",
    title: "Top 7 Bộ Outfit Cổ Điển Cho Mùa Thu",
    excerpt:
      "Những món đồ timeless bạn cần có: coat, blazer, oxford shoes và cách phối hợp thanh lịch.",
    author: "D-Wear Team",
    date: "2025-08-09",
    readTime: "5 min",
    tags: ["Classic", "Outfit"],
    cover:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Hướng dẫn chăm sóc áo len wool đúng cách",
    excerpt:
      "Wool bền nếu bạn biết cách: giặt, phơi, và cất giữ để giữ form lâu dài.",
    author: "Nghĩa Trần",
    date: "2025-07-28",
    readTime: "4 min",
    tags: ["Care", "Fabric"],
    cover:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Phối màu be & nâu: Bí quyết tạo nét cổ điển",
    excerpt:
      "Kết hợp tông đất, tông kem cho outfit lịch lãm, phù hợp cả nam và nữ.",
    author: "Lan Phạm",
    date: "2025-07-15",
    readTime: "3 min",
    tags: ["Color", "Vintage"],
    cover:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80&auto=format&fit=crop",
  },
];

export default function BlogPage(): JSX.Element {
  const [query, setQuery] = React.useState("");
  const [activeTag, setActiveTag] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const PAGE_SIZE = 6;

  const tags = React.useMemo(
    () =>
      Array.from(
        new Set(SAMPLE_POSTS.flatMap((p) => (p.tags ? p.tags : [])))
      ).sort(),
    []
  );

  const filtered = SAMPLE_POSTS.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q));
    const matchesTag = !activeTag || (p.tags ?? []).includes(activeTag);
    return matchesQuery && matchesTag;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  return (
    <div className="min-h-screen bg-[#f0f0ee] py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content (no header/footer) */}
        <main className="lg:col-span-2 space-y-8">
          {/* HERO */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative h-56 md:h-72 lg:h-80">
              {/* Decorative hero (use image or keep subtle gradient) */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.45), rgba(255,255,255,0.45)), url('https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=1600&q=80&auto=format&fit=crop')",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-6">
                  <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#111827]">
                    D-Wear Blog
                  </h1>
                  <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                    Classic fashion & lifestyle — thanh lịch, tinh tế và vượt
                    thời gian.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="rounded-full w-10 h-10 bg-[#f9f9f9] border border-gray-100 flex items-center justify-center text-sm text-gray-400">
                  DW
                </div>
                <div className="text-sm text-gray-600">
                  <div className="font-medium text-gray-800">D-Wear</div>
                  <div className="text-xs">Classic fashion stories & tips</div>
                </div>
                <div className="ml-auto text-sm text-gray-500">
                  Updated • weekly
                </div>
              </div>
            </div>
          </section>

          {/* Controls: search + active tag (inline) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Tìm bài viết, tag, chủ đề..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setActiveTag(null);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-md text-sm ${
                  activeTag === null
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-200 text-gray-800"
                }`}
              >
                Tất cả
              </button>

              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setActiveTag((s) => (s === t ? null : t));
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-md text-sm ${
                    activeTag === t
                      ? "bg-gray-900 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Posts grid */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {paged.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-12 border rounded-lg bg-white">
                  Không tìm thấy bài viết.
                </div>
              ) : (
                paged.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm transform transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* image */}
                    <div className="w-full h-44 bg-gray-50">
                      {post.cover ? (
                        <img
                          src={post.cover}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          Ảnh
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-[#111827]">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        {post.excerpt}
                      </p>

                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          <span>{post.author}</span>
                          <span>•</span>
                          <time>
                            {new Date(post.date).toLocaleDateString()}
                          </time>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-sm text-gray-800 font-medium">
                            <a
                              href={`/blog/${post.id}`}
                              className="hover:underline"
                            >
                              Đọc tiếp →
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* tags */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(post.tags ?? []).map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2 py-1 rounded-md bg-[#faf9f8] border border-gray-100 text-gray-700"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-md border border-gray-200 disabled:opacity-50"
              >
                Prev
              </button>

              <div className="text-sm text-gray-600">
                Trang {page} / {totalPages}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-md border border-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* About card */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-[#faf9f8] border border-gray-100 flex items-center justify-center text-gray-500 font-medium">
                DW
              </div>
              <div>
                <div className="font-semibold text-gray-900">Về D-Wear</div>
                <p className="text-sm text-gray-600 mt-1">
                  Thương hiệu thời trang cổ điển: tinh tế, thanh lịch và bền bỉ.
                </p>
              </div>
            </div>
          </div>

          {/* Featured posts */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-900">
                Bài viết nổi bật
              </div>
            </div>

            <ul className="mt-3 space-y-3">
              {SAMPLE_POSTS.slice(0, 3).map((p) => (
                <li key={p.id} className="flex items-start gap-3">
                  <div className="w-14 h-10 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                    {p.cover ? (
                      <img
                        src={p.cover}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        Img
                      </div>
                    )}
                  </div>
                  <div>
                    <a
                      href={`/blog/${p.id}`}
                      className="text-sm font-medium text-gray-900 hover:underline"
                    >
                      {p.title}
                    </a>
                    <div className="text-xs text-gray-500">{p.readTime}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="text-sm font-semibold text-gray-900">Tags</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setActiveTag((s) => (s === t ? null : t));
                    setPage(1);
                  }}
                  className={`px-3 py-1 text-xs rounded-md ${
                    activeTag === t
                      ? "bg-gray-900 text-white"
                      : "bg-[#faf9f8] border border-gray-100 text-gray-800"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="text-sm font-semibold text-gray-900">
              Newsletter
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Đăng ký nhận các bài viết mới nhất từ D-Wear.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none"
                placeholder="Email của bạn"
              />
              <button className="px-3 py-2 rounded-md bg-gray-900 text-white">
                Gửi
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
