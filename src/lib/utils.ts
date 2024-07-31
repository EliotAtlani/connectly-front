/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { UserData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildZodError(error: z.ZodError<any>): string {
  const keyError = error.errors[0].path[0];
  const msgError = error.errors[0].message;
  return `The ${keyError} ${msgError.toLowerCase()}`;
}

export function getUser(): UserData | null {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function updateUser(user: UserData) {
  localStorage.setItem("user", JSON.stringify(user));
}
