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
  group?: string[];
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
    categories?: string[];
    sort: number;
    enabled: boolean;
    group?: string[];
  }>,
  pageInfo: PaginatedType
}
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
      categories: record.categories,
      sort: record.sort,
      enabled: record.enabled,
      group: record.group
    })).filter(x => x.enabled).sort((x, y) => y.sort - x.sort);

    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw new Error('Failed to fetch products');
  }
}