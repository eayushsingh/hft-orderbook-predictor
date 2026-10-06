import { NextRequest, NextResponse } from "next/server";
import { InstitutionalRepository } from "@/lib/institutional/repository/institutionalRepository";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    const repo = new InstitutionalRepository();
    const results = repo.searchStocks(query);

    return NextResponse.json({ query, results });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: "Internal Server Error", message: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
