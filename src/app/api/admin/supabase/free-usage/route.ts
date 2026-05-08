import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STORAGE_LIMIT_BYTES = 1 * 1024 * 1024 * 1024; // 1 GB
const DATABASE_LIMIT_BYTES = 500 * 1024 * 1024; // 500 MB
const MAU_LIMIT = 50000;
const EGRESS_LIMIT_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB
const CACHED_EGRESS_LIMIT_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

async function querySingleNumber(sql: string): Promise<number | null> {
  try {
    const rows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(sql);
    if (!Array.isArray(rows) || rows.length === 0) return 0;
    const first = rows[0];
    const key = Object.keys(first)[0];
    return toNumber(first[key]);
  } catch {
    return null;
  }
}

function pct(used: number | null, limit: number): number | null {
  if (used == null) return null;
  return Math.min(Math.round((used / limit) * 100), 100);
}

export async function GET() {
  const bucket = process.env.STORAGE_BUCKET ?? "imoveis-fotos";

  const [storageUsedBytes, databaseUsedBytes, mauUsed] = await Promise.all([
    querySingleNumber(
      `select coalesce(sum((metadata->>'size')::bigint), 0) as used from storage.objects where bucket_id = '${bucket}' and (metadata->>'size') is not null`
    ),
    querySingleNumber("select pg_database_size(current_database()) as used"),
    querySingleNumber(
      "select count(*) as used from auth.users where coalesce(last_sign_in_at, created_at) >= date_trunc('month', now())"
    ),
  ]);

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    limits: {
      fileStorageBytes: STORAGE_LIMIT_BYTES,
      databaseBytes: DATABASE_LIMIT_BYTES,
      monthlyActiveUsers: MAU_LIMIT,
      egressBytes: EGRESS_LIMIT_BYTES,
      cachedEgressBytes: CACHED_EGRESS_LIMIT_BYTES,
      apiRequests: "unlimited",
    },
    usage: {
      fileStorageBytes: storageUsedBytes,
      databaseBytes: databaseUsedBytes,
      monthlyActiveUsers: mauUsed,
      egressBytes: null,
      cachedEgressBytes: null,
      apiRequests: null,
    },
    percentages: {
      fileStorage: pct(storageUsedBytes, STORAGE_LIMIT_BYTES),
      database: pct(databaseUsedBytes, DATABASE_LIMIT_BYTES),
      monthlyActiveUsers: pct(mauUsed, MAU_LIMIT),
    },
    notes: {
      egressBytes: "Nao disponivel em tempo real via API de projeto. Conferir Billing do Supabase.",
      cachedEgressBytes: "Nao disponivel em tempo real via API de projeto. Conferir Billing do Supabase.",
      apiRequests: "Plano free atual exibe API requests ilimitadas.",
    },
  });
}
