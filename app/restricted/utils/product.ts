export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  warning?: string;
  categories?: string[];
  sort?: number;
  enabled: boolean;
  show_price: boolean;
  group?: string[];
};

type AirtableResponse = {
  records: Array<{
    id: string;
    fields: {
      title: string;
      price: number;
      image: string;
      warning?: string;
      categories?: string[];
      sort: number;
      enabled: boolean;
      show_price: boolean;
      group?: string[];
    };
  }>;
};

export async function getProducts(): Promise<Product[]> {
  const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
  const tableId = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_ID;
  const apiKey = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;

  if (!baseId || !tableId || !apiKey) {
    throw new Error('Missing Airtable configuration');
  }

  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${tableId}`,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      cache: 'no-store'
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const data: AirtableResponse = await response.json();

  return data.records.map(record => ({
    id: record.id,
    ...record.fields
  })).filter(x  => x.enabled).sort((x, y) => y.sort - x.sort);
}