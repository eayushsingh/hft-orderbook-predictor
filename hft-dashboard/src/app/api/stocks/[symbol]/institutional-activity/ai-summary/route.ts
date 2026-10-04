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
    const summary = repo.getAISummary(symbol);

    if (!summary) {
      return NextResponse.json(
        { error: `No AI summary available for stock '${symbol}'` },
        { status: 404 }
      );
    }

    return NextResponse.json(summary);
  } catch (error: any) {
    console.error("Error fetching AI summary:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
