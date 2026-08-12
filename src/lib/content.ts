import settings from "../../content/settings.json";
import services from "../../content/services.json";
import testimonials from "../../content/testimonials.json";
import faq from "../../content/faq.json";
import gallery from "../../content/gallery.json";
import about from "../../content/about.json";

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Business {
  name: string;
  legalName: string;
  tagline: string;
  phone: string;
  phoneRaw: string;
  email: string;
  address: Address;
  serviceArea: string[];
  hours: { days: string; hours: string }[];
  yearsExperience: number;
  doorsInstalled: number;
  googleRating: number;
  reviewCount: number;
  licensedInsured: boolean;
  emergency247: boolean;
  warrantyYears: number;
  /** Link to the business's Google reviews (empty → Maps search fallback). */
  googleReviewsUrl?: string;
}

export interface Seo {
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  keywords: string[];
}

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  excerpt: string;
  description: string;
  features: string[];
  image: string;
  featured: boolean;
}

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface GalleryItem {
  title: string;
  category: string;
  image: string;
  /** Optional "before" photo — when set, the gallery renders a
   *  draggable before/after comparison slider. */
  beforeImage?: string;
  description: string;
}

export interface AboutContent {
  heading: string;
  story: string;
  values: { title: string; text: string }[];
  certifications: string[];
}

export const getBusiness = (): Business => settings.business as Business;
export const getSeo = (): Seo => settings.seo as Seo;
export const getServices = (): Service[] => services.items as Service[];
export const getService = (slug: string): Service | undefined =>
  getServices().find((s) => s.slug === slug);
export const getFeaturedServices = (): Service[] =>
  getServices().filter((s) => s.featured);
export const getTestimonials = (): Testimonial[] =>
  testimonials.items as Testimonial[];
export const getFaq = (): FaqItem[] => faq.items as FaqItem[];
export const getGallery = (): GalleryItem[] => gallery.items as GalleryItem[];
export const getAbout = (): AboutContent => about as AboutContent;
