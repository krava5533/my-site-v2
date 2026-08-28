import { z } from "zod";

export const quoteRequestSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  company: z.string().optional(),
  projectType: z.string().min(1, "Please select a project type"),
  projectLocation: z.string().min(2, "Please enter a project location"),
  projectSize: z.string().optional(),
  materialInterest: z.string().optional(),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().optional(),
  product: z.string().optional(),
});

export const sampleRequestSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  products: z.array(z.string()).min(1, "Please select at least one product"),
  quantity: z.string().optional(),
  projectType: z.string().optional(),
  shippingAddress: z.string().min(5, "Please enter a shipping address"),
  timeline: z.string().optional(),
  message: z.string().optional(),
});

export const projectUploadSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().min(1, "Please select a project type"),
  projectLocation: z.string().optional(),
  projectStage: z.string().optional(),
  estimatedSize: z.string().optional(),
  budgetRange: z.string().optional(),
  preferredMaterials: z.string().optional(),
  preferredStyle: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().optional(),
});

export const appointmentSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  projectType: z.string().optional(),
  guests: z.string().optional(),
  message: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5, "Please enter a message"),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type SampleRequestInput = z.infer<typeof sampleRequestSchema>;
export type ProjectUploadInput = z.infer<typeof projectUploadSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
