"use client";

import { useState } from "react";
import { UtensilsCrossed } from "lucide-react";

export function MealThumbnail({
  src,
  alt,
  className,
  iconClassName,
}: {
  src: string | null;
  alt: string;
  className: string;
  iconClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-peach-100 text-[#c17a52] ${className}`}>
        <UtensilsCrossed className={iconClassName ?? "h-5 w-5"} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary external recipe-site images, can't be predeclared in next/image's remotePatterns
    <img src={src} alt={alt} onError={() => setFailed(true)} className={`object-cover ${className}`} />
  );
}
