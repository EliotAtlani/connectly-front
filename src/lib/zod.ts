/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export const formDataToObject = (formData: FormData) => {
  const obj: Record<string, any> = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
};
// Define a Zod schema for the user data
export const userOnBoardingSchema = z.object({
  username: z.string().min(3, "Must be at least 3 characters"),
  image: z.number(),
});
