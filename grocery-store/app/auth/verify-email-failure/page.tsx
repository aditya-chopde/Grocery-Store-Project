"use client";

import Link from "next/link";

export default function VerifyEmailFailure() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md text-center">
      <h1 className="text-3xl font-bold mb-4 text-red-600">Email Verification Failed</h1>
      <p className="mb-6">
        The verification link is invalid or has expired. Please try registering again or contact support.
      </p>
      <Link href="/auth/register" className="text-green-600 font-semibold">
        Register
      </Link>
    </div>
  );
}
