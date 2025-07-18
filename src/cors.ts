import { NextResponse } from "next/server";

export function allowCors(): NextResponse{
     const res = NextResponse.next();
    
      // console.log("url", req.nextUrl);
    
      // add the CORS headers to the response
      res.headers.append("Access-Control-Allow-Credentials", "true");
      res.headers.append("Access-Control-Allow-Origin", "*"); // replace this your actual origin
      res.headers.append(
        "Access-Control-Allow-Methods",
        "GET,DELETE,PATCH,POST,PUT"
      );
      res.headers.append(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
      );

      return res
}