import { PageTransition } from "@/shared/layout/PageTransition";
import { ReactNode } from "react";

export default function UserTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
