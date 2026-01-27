"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface SideDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  container?: HTMLElement | null;
  overlay?: boolean;
}

export function SideDrawer({
  open,
  onOpenChange,
  title,
  children,
  container,
  overlay = true
}: SideDrawerProps) {

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal container={container}>
        <AnimatePresence>
          {open && (
            <>
              {overlay && (
                <Dialog.Overlay asChild>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
                  />
                </Dialog.Overlay>
              )}

              <Dialog.Content asChild>
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.25 }}
                  className="absolute top-0 right-0 h-full bg-white shadow-2xl border-l border-slate-100 flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                    <Dialog.Close asChild>
                      <button className="p-2 hover:bg-slate-100 rounded-full transition">
                        <X className="w-5 h-5" />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Content Scroll Area */}
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {children}
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
