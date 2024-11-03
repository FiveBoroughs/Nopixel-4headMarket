export type Product = {
  id: string;
  title: string;
  price: number;
  show_price: boolean;
  stock: number;
  show_stock: boolean;
  image: string;
  warning?: string;
  categories?: string[];
  sort?: number;
  enabled: boolean;
  groups?: Group[];
  show_groups: boolean;
};

type nocoResponse = {
  list: Array<{
    Id: string;
    title: string;
    price: number;
    show_price: boolean;
    stock: number;
    show_stock: boolean;
    image: string;
    warning?: string;
    categories?: string;
    sort: number;
    enabled: boolean;
    groups?: string;
    show_groups: boolean;
  }>,
  pageInfo: PaginatedType
}

export type Group = {
  name: string;
  color: string;
}

export const GROUP_COLORS: Record<string, Group> = {
  'besties': { name: 'Besties', color: '#f472b6' },
  'sob': { name: 'SOB', color: '#64748b' },
  'cypress': { name: 'Cypress', color: '#431407' },
  'vagos': { name: 'Vagos', color: '#facc15' },
  'hades': { name: 'Hydra', color: '#dc2626' },
  'cl': { name: 'Chaos Legion', color: '#4d7c0f' },
  'hydra': { name: 'Hydra', color: '#4d7c0f' },
  'manor': { name: 'Manor', color: '#1e40af' },
};

import { Api, PaginatedType } from "nocodb-sdk";

const api = new Api({
    baseURL: "https://app.nocodb.com",
    headers: {
      "xc-token": process.env.NEXT_PUBLIC_NOCODB_API_KEY
    }
})

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await api.dbViewRow.list(
      "noco",
      "pe6zgj0h0il4hd5",
      "m6g5kr4wg9w282k",
      "vwfou4q9md9vbghh",
      {
        offset: 0,
        where: "(enabled,eq,true)"
      }
    );
    const products = (response as nocoResponse).list.map(record => ({
      id: record.Id,
      title: record.title,
      price: record.price,
      show_price: record.show_price,
      stock: record.stock,
      show_stock: record.show_stock,
      image: record.image,
      warning: record.warning,
      categories: record.categories ? record.categories.split(',').map(cat => cat.trim()) : undefined,
      sort: record.sort,
      enabled: record.enabled,
      groups: record.groups ? record.groups.split(',').map(g => GROUP_COLORS[g.trim()]) : undefined,
      show_groups: record.show_groups,
    })).filter(x => x.enabled).sort((x, y) => y.sort - x.sort);
    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw new Error('Failed to fetch products');
  }
}