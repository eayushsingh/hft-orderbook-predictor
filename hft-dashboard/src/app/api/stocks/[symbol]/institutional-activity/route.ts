import { NextRequest, NextResponse } from "next/server";
import { InstitutionalRepository } from "@/lib/institutional/repository/institutionalRepository";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    if (!symbol) {
      return NextResponse.json({ error: "Stock symbol is required" }, { status: 400 });
    }

    const repo = new InstitutionalRepository();
    const data = repo.getInstitutionalActivity(symbol);

    if (!data) {
      return NextResponse.json(
        {
          error: `Stock with symbol '${symbol}' not found or insufficient data available`,
          confidence: "INSUFFICIENT_DATA",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error fetching institutional activity:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
