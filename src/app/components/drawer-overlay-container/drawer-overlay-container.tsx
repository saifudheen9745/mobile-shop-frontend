"use client";
import { useRef, ReactNode, RefObject } from "react";

interface DrawerOverlayContainerProps {
  children: (container: HTMLElement | null) => ReactNode;
}

export function DrawerOverlayContainer({ children }: DrawerOverlayContainerProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      {children(ref.current)}
    </div>
  );
}
