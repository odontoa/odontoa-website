"use client";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

export const AnimatedTooltip = ({
  items,
  className,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: string;
  }[];
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center", className)}>
      {items.map((item, index) => (
        <div
          className="relative"
          key={item.name}
                      style={{ 
              zIndex: index + 1,
              marginLeft: index > 0 ? '-10px' : '0'
            }}
        >
          <Image
            height={100}
            width={100}
            src={item.image}
            alt={item.name}
            className="object-cover object-top rounded-full h-8 w-8 border-2 border-background"
            style={{ 
              margin: 0,
              padding: 0
            }}
          />
        </div>
      ))}
    </div>
  );
}; 