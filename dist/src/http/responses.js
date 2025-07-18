import { NextResponse } from "next/server";
// shorts
export const SuccessResponse = (data, code = 200) => new NextResponse(JSON.stringify(data), { status: code });
export const ErrorResponse = (data, code = 500) => new NextResponse(JSON.stringify(data), { status: code });
