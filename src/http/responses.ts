import { NextResponse } from "next/server";

// shorts
export const SuccessResponse = (
  data: unknown,
  code: number = 200
): NextResponse | never =>
  new NextResponse(JSON.stringify(data), { status: code });

export const ErrorResponse = (
  data: unknown,
  code: number = 500
): NextResponse | never =>
  new NextResponse(JSON.stringify(data), { status: code });
