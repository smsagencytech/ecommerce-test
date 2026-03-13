import Image from "next/image";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/woocommerce";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { category: categoryId } = await searchParams;

  const [products, categories] = await Promise.all([
    getProducts(categoryId),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground font-display">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 h-16 max-w-5xl mx-auto">
          <button className="flex items-center justify-center size-10">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Link href="/">
            <h1 className="text-xl font-bold tracking-[0.2em] uppercase cursor-pointer">Dakar Élégance</h1>
          </Link>
          <button className="flex items-center justify-center size-10">
            <span className="material-symbols-outlined">shopping_bag</span>
          </button>
        </div>

        {/* Categories Nav */}
        <div className="flex gap-4 px-4 py-3 overflow-x-auto hide-scrollbar max-w-5xl mx-auto">
          <Link
            href="/"
            className={`flex h-9 shrink-0 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors ${!categoryId ? "bg-primary text-white" : "bg-card border border-border hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
          >
            Tout
          </Link>
          {categories.map((category: { id: number; name: string }) => (
            <Link
              key={category.id}
              href={`/?category=${category.id}`}
              className={`flex h-9 shrink-0 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors ${categoryId === String(category.id)
                ? "bg-primary text-white"
                : "bg-card border border-border hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto pb-24 px-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: { id: number; name: string; images: { src: string }[]; price: string; short_description: string; description: string; permalink: string }, index: number) => (
            <div key={product.id} className="flex flex-col gap-4 group">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
                <Image
                  src={product.images?.[0]?.src || "/placeholder.png"}
                  alt={product.name}
                  fill
                  priority={index === 0}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-4 right-4">
                  <button className="size-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                    <span className="material-symbols-outlined text-slate-900 text-xl">favorite</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <span className="text-lg font-bold text-primary">
                    {Number(product.price).toLocaleString()} FCFA
                  </span>
                </div>
                <div
                  className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: product.short_description || product.description }}
                />
                <a
                  href={`https://wa.me/221770000000?text=${encodeURIComponent(`Bonjour, je souhaite commander : ${product.name} (${product.permalink})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-semibold transition-all hover:bg-slate-800 dark:hover:bg-slate-200 active:scale-95"
                >
                  <span className="material-symbols-outlined text-xl">chat</span>
                  Commander sur WhatsApp
                </a>
              </div>
            </div>
          ))}

          {/* Fallback if no products */}
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">inventory_2</span>
              <p className="text-slate-500">Aucun produit trouvé dans cette catégorie.</p>
            </div>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-t border-border">
        <div className="flex justify-around items-center h-20 max-w-2xl mx-auto px-4 pb-4 pt-2">
          <Link className="flex flex-col items-center gap-1 text-primary" href="/">
            <span className="material-symbols-outlined text-2xl fill-1">storefront</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Boutique</span>
          </Link>
          <a className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500" href="#">
            <span className="material-symbols-outlined text-2xl">favorite</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Favoris</span>
          </a>
          <a className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500" href="#">
            <span className="material-symbols-outlined text-2xl">person</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Compte</span>
          </a>
          <a className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500" href="#">
            <span className="material-symbols-outlined text-2xl">info</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">À Propos</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
