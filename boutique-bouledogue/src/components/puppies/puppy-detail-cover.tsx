"use client";

import Image from "next/image";
import { useState } from "react";
import { CHIOT_COVER_PLACEHOLDER, isRemoteImageUrl } from "@/lib/chiot-media";

type Props = {
  src: string;
  alt: string;
};

export function PuppyDetailCover({ src, alt }: Props) {
  const [imgSrc, setImgSrc] = useState(src);

  const onFail = () => {
    if (imgSrc !== CHIOT_COVER_PLACEHOLDER) setImgSrc(CHIOT_COVER_PLACEHOLDER);
  };

  if (isRemoteImageUrl(imgSrc)) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        className="aspect-[4/5] w-full object-cover sm:min-h-[28rem] lg:aspect-auto lg:min-h-[32rem]"
        width={1200}
        height={1400}
        onError={onFail}
      />
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={1200}
      height={1400}
      className="aspect-[4/5] w-full object-cover sm:min-h-[28rem] lg:aspect-auto lg:min-h-[32rem]"
      decoding="async"
      onError={onFail}
    />
  );
}
