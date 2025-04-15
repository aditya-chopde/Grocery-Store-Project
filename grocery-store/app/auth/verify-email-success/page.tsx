"use client";

import Link from "next/link";

export default function VerifyEmailSuccess() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md text-center">
      <h1 className="text-3xl font-bold mb-4">Email Verified Successfully!</h1>
      <p className="mb-6">
        Thank you for verifying your email. You can now{" "}
        <Link href="/auth/login" className="text-green-600 font-semibold">
          log in
        </Link>{" "}
        to your account.
      </p>
    </div>
  );
}
