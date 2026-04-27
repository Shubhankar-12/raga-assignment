import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

type Props = {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
};

export function Avatar({ src, name, size = 40, className }: Props) {
  const [errored, setErrored] = React.useState(false);
  const showImage = !!src && !errored;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 font-semibold text-brand-700",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {showImage ? (
        <Image
          src={src!}
          alt={name}
          width={size}
          height={size}
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
          unoptimized
        />
      ) : (
        <span>{initials(name)}</span>
      )}
    </span>
  );
}
