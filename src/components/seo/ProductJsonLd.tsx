"use client";

import { useEffect } from "react";

type ProductJsonLdProps = {
  data: Record<string, unknown>;
};

export default function ProductJsonLd({ data }: ProductJsonLdProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "product-json-ld";
    script.textContent = JSON.stringify(data);

    const existing = document.head.querySelector("#product-json-ld");
    existing?.remove();
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [data]);

  return null;
}
