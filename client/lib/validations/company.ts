import { z } from "zod";

export const companyFormSchema = z.object({
    name: z
        .string()
        .min(2, "Company name must be at least 2 characters")
        .max(100, "Company name must not exceed 100 characters"),
    shortDescription: z
        .string()
        .min(10, "Short description must be at least 10 characters")
        .max(200, "Short description must not exceed 200 characters"),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters")
        .max(2000, "Description must not exceed 2000 characters"),
    photo: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => !file || file.size <= 5 * 1024 * 1024,
            "File size must be less than 5MB"
        )
        .refine(
            (file) => !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type),
            "Only .jpg, .png, and .webp formats are supported"
        ),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;