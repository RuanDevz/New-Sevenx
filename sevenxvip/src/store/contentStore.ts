import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* =======================
   TIPOS EXISTENTES
======================= */

type LinkItem = {
  id: string;
  name: string;
  category: string;
  postDate: string;
  slug: string;
  preview?: string;
  thumbnail?: string;
  createdAt: string;
  contentType?: string;
};

type Category = {
  id: string;
  name: string;
  category: string;
};

type FilterState = {
  searchName: string;
  selectedCategory: string;
  selectedMonth: string;
  dateFilter: string;
};

type ContentCache = {
  links: LinkItem[];
  categories: Category[];
  currentPage: number;
  totalPages: number;
  hasMoreContent: boolean;
  filters: FilterState;
  timestamp: number;
};

/* =======================
   PREVIEW CACHE (NOVO)
======================= */

type PreviewItem = {
  image: string;
  name: string;
};

type PreviewCache = Record<string, PreviewItem>;

/* =======================
   STORE
======================= */

type ContentStore = {
  // Cache por tipo de conteúdo
  caches: {
    asian: ContentCache | null;
    western: ContentCache | null;
    banned: ContentCache | null;
    unknown: ContentCache | null;
    vipAsian: ContentCache | null;
    vipWestern: ContentCache | null;
    vipBanned: ContentCache | null;
    vipUnknown: ContentCache | null;
  };

  // Preview cache (por slug)
  previewCache: PreviewCache;

  // Cache actions
  setCache: (contentType: keyof ContentStore['caches'], data: ContentCache) => void;
  getCache: (contentType: keyof ContentStore['caches']) => ContentCache | null;
  clearCache: (contentType: keyof ContentStore['caches']) => void;
  clearAllCaches: () => void;
  isCacheValid: (contentType: keyof ContentStore['caches'], filters: FilterState) => boolean;
  appendToCache: (
    contentType: keyof ContentStore['caches'],
    newLinks: LinkItem[],
    newPage: number
  ) => void;

  // Preview actions (NOVO)
  setPreview: (slug: string, image: string, name: string) => void;
  getPreview: (slug: string) => PreviewItem | null;
};

/* =======================
   CONFIG
======================= */

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const areFiltersEqual = (f1: FilterState, f2: FilterState): boolean => {
  return (
    f1.searchName === f2.searchName &&
    f1.selectedCategory === f2.selectedCategory &&
    f1.selectedMonth === f2.selectedMonth &&
    f1.dateFilter === f2.dateFilter
  );
};

/* =======================
   STORE IMPLEMENTATION
======================= */

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      caches: {
        asian: null,
        western: null,
        banned: null,
        unknown: null,
        vipAsian: null,
        vipWestern: null,
        vipBanned: null,
        vipUnknown: null,
      },

      previewCache: {},

      /* ========= CACHE ========= */

      setCache: (contentType, data) => {
        set((state) => ({
          caches: {
            ...state.caches,
            [contentType]: data,
          },
        }));
      },

      getCache: (contentType) => {
        const cache = get().caches[contentType];
        if (!cache) return null;

        const now = Date.now();
        if (now - cache.timestamp > CACHE_DURATION) {
          get().clearCache(contentType);
          return null;
        }

        return cache;
      },

      clearCache: (contentType) => {
        set((state) => ({
          caches: {
            ...state.caches,
            [contentType]: null,
          },
        }));
      },

      clearAllCaches: () => {
        set({
          caches: {
            asian: null,
            western: null,
            banned: null,
            unknown: null,
            vipAsian: null,
            vipWestern: null,
            vipBanned: null,
            vipUnknown: null,
          },
        });
      },

      isCacheValid: (contentType, filters) => {
        const cache = get().getCache(contentType);
        if (!cache) return false;
        return areFiltersEqual(cache.filters, filters);
      },

      appendToCache: (contentType, newLinks, newPage) => {
        const cache = get().caches[contentType];
        if (!cache) return;

        set((state) => ({
          caches: {
            ...state.caches,
            [contentType]: {
              ...cache,
              links: [...cache.links, ...newLinks],
              currentPage: newPage,
              hasMoreContent: newPage < cache.totalPages,
              timestamp: Date.now(),
            },
          },
        }));
      },

      /* ========= PREVIEW ========= */

      setPreview: (slug, image, name) => {
        set((state) => ({
          previewCache: {
            ...state.previewCache,
            [slug]: { image, name },
          },
        }));
      },

      getPreview: (slug) => {
        return get().previewCache[slug] ?? null;
      },
    }),
    {
      name: 'content-cache-storage',
      partialize: (state) => ({
        caches: state.caches,
        previewCache: state.previewCache, // mantém preview entre páginas
      }),
    }
  )
);