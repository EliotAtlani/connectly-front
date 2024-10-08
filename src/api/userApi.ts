/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "@/lib/apiService";
import { buildZodError } from "@/lib/utils";
import { userOnBoardingSchema } from "@/lib/zod";
import { z } from "zod";

export const saveOnBoardedUser = async (data: {
  userId: string;
  image: number;
  username: string;
}) => {
  try {
    // Validate the data against the schema
    userOnBoardingSchema.parse(data);

    const response = await apiService.post("/users/onboard-user", data);
    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const errorObj = buildZodError(error);
      console.error("Validation error:", errorObj);
      throw new Error(errorObj);
    } else {
      // Handle other errors
      console.error("Error creating user:", error);
      throw new Error(error.response.data.message);
    }
  }
};
