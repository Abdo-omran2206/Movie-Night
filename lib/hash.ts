import Hashids from "hashids";

const hashids = new Hashids(process.env.NEXT_PUBLIC_HASH_SALT!, 8);

export function encodeId(id: number) {
  return hashids.encode(id);
}

export function decodeId(hash: string): string | undefined {
  const decoded = hashids.decode(hash);
  if (decoded.length === 0) return undefined;
  return decoded[0].toString();
}