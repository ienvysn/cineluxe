import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").max(50, "Email cannot exceed 50 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").max(32, "Password cannot exceed 32 characters"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(25, "Name cannot exceed 25 characters"),
  email: z.string().email("Invalid email address").max(50, "Email cannot exceed 50 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").max(32, "Password cannot exceed 32 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const movieBookingSchema = z.object({
  showtimeId: z.string(),
  seats: z.array(z.string()).min(1, "Please select at least one seat"),
  paymentMethod: z.enum(["esewa", "paypal", "CARD"]),
});
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").max(50, "Email cannot exceed 50 characters"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "Code must be exactly 6 digits"),
  password: z.string().min(6, "Password must be at least 6 characters").max(32, "Password cannot exceed 32 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
