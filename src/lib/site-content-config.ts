export interface BannerItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  enabled: boolean;
}

export interface CollectionItem {
  id: string;
  image: string;
  name: string;
  description: string;
  link: string;
}

export interface CategoryImageItem {
  id: string;
  name: string;
  image: string;
  link: string;
}

export interface PromoSectionItem {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  enabled: boolean;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    images: string[];
    primaryImage: string;
  };
  banners: BannerItem[];
  collections: CollectionItem[];
  categoryImages: CategoryImageItem[];
  promoSections: PromoSectionItem[];
  footer: {
    logo: string;
    description: string;
    email: string;
    phone: string;
    instagram: string;
    copyright: string;
  };
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    title: "Elegant kurtis for every day.",
    subtitle:
      "Explore handcrafted kurtis designed for comfort, beauty, and effortless style.",
    buttonText: "Shop Kurtis",
    buttonLink: "/shop?category=kurtis",
    images: ["/slider/Slider image 1.jpeg", "/slider/Slider image 2.jpeg", "/slider/Slider image 3.jpeg"],
    primaryImage: "/slider/Slider image 1.jpeg",
  },
  banners: [
    {
      id: "banner-1",
      title: "New Weekend Edit",
      description: "A fresh set of premium kurtis for elevated everyday dressing.",
      image: "/slider/Slider image 2.jpeg",
      link: "/shop?tag=new-arrival",
      enabled: true,
    },
  ],
  collections: [
    {
      id: "collection-1",
      image: "/slider/Slider image 3.jpeg",
      name: "Kurtis Edit",
      description: "Thoughtfully curated silhouettes for effortless styling.",
      link: "/shop?category=kurtis",
    },
  ],
  categoryImages: [
    {
      id: "category-1",
      name: "Kurtis",
      image: "/slider/Slider image 1.jpeg",
      link: "/shop?category=kurtis",
    },
  ],
  promoSections: [
    {
      id: "promo-1",
      title: "Minimal, expressive, wearable.",
      description: "Browse our newest premium essentials and elevate your everyday wardrobe.",
      image: "/slider/Slider image 4.jpeg",
      buttonText: "Shop Now",
      buttonLink: "/shop",
      enabled: true,
    },
  ],
  footer: {
    logo: "Weदेसी",
    description: "Timeless Indian craftsmanship, made modern. Considered pieces for a considered life.",
    email: "hello@wedesi.com",
    phone: "+91 98765 43210",
    instagram: "@wedesi",
    copyright: "© 2026 Weदेसी. All rights reserved.",
  },
};
