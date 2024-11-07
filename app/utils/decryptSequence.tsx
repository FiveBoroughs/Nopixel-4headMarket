export type DecryptSequence = {
  id: number;
  emojis: string[];
};

type nocoResponse = {
  list: object[]
  pageInfo: PaginatedType
}
import { Api, PaginatedType } from "nocodb-sdk";

const api = new Api({
    baseURL: "https://app.nocodb.com",
    headers: {
      "xc-token": process.env.NEXT_PUBLIC_NOCODB_API_KEY
    }
});

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
};

export async function getDecryptSequence(): Promise<DecryptSequence> {
  try {
    const response = await api.dbViewRow.list(
      "noco",
      "pe6zgj0h0il4hd5",
      "mdrgcqf5kiexfrf",
      "vwnafsylhi67w0i0",
      {
        offset: 0,
        where: `(date,eq,exactDate,${getTodayDate()})`
      }
    );
    const decryptSequence = (response as nocoResponse).list.map((record: any) => ({
      id: record.Id as number,
      emojis: [].concat(record.emoji_1 || []).concat(record.emoji_2 || []).concat(record.emoji_3 || []).concat(record.emoji_4 || [])
    }));

    return decryptSequence[0];
  } catch (error) {
    console.error('Failed to fetch decryptSequence:', error);
    throw new Error('Failed to fetch products');
  }
};