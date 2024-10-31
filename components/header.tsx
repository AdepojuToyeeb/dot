"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/context/cartContext";
import { useGlobalState } from "@/lib/context/globalContext";

export default function Header() {
  const { totalItems } = useCart();
  const { toggleCartSheet } = useGlobalState();
  return (
    <div className="sticky top-0 z-10 flex p-8 py-4 justify-between items-center mb-8 bg-white shadow-md">
      <h1 className="text-2xl font-bold">Test App</h1>
      <Button onClick={toggleCartSheet} variant="ghost" className="relative">
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {totalItems > 99 ? "99+" : totalItems}
          </div>
        )}
      </Button>
    </div>
  );
}
