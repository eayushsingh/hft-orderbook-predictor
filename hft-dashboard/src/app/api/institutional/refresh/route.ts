import { NextRequest, NextResponse } from "next/server";
import { InstitutionalRepository } from "@/lib/institutional/repository/institutionalRepository";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const symbol = body.symbol || "RELIANCE";

    const repo = new InstitutionalRepository();
    const updated = repo.getInstitutionalActivity(symbol);

    return NextResponse.json({
      status: "SUCCESS",
      refreshedAt: new Date().toISOString(),
      symbol,
      score: updated?.score,
      classification: updated?.classification,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: "Refresh Failed", message: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
