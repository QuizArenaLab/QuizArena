"use client";

import Link from "next/link";
import { ROUTES } from '@/constants/routes';

interface AuthFooterLinkProps {
  text: string;
  linkText: string;
  href?: string;
}

export default function AuthFooterLink({ text, linkText, href }: AuthFooterLinkProps) {
  return (
    <p className="text-center text-sm text-navy/60">
      {text}{" "}
      <Link
        href={href || ROUTES.AUTH.SIGN_UP}
        className="font-medium text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors"
      >
        {linkText}
      </Link>
    </p>
  );
}
