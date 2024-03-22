"use client";

import { ROUTES } from "@/constants/routes";
import { redirect } from "next/navigation";

export default function Home() {
  return redirect(ROUTES.OVERVIEW);
}
