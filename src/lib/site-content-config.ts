export interface SiteContent {
  hero: {
    image: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
  };
  footer: {
    logo: string;
    text: string;
    email: string;
    phone: string;
    instagram: string;
  };
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    image: "/slider/Slider image 1.jpeg",
    title: "Elegant kurtis for every day.",
    subtitle:
      "Explore handcrafted kurtis designed for comfort, beauty, and effortless style.",
    buttonText: "Shop Kurtis",
    buttonLink: "/shop?category=kurtis",
  },
  footer: {
    logo: "Weदेसी",
    text: "Timeless Indian craftsmanship, made modern. Considered pieces for a considered life.",
    email: "hello@wedesi.com",
    phone: "+91 98765 43210",
    instagram: "@wedesi",
  },
};
