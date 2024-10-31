"use client";
import { X, Minus, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import { useGlobalState } from "../../lib/context/globalContext";
import Image from "next/image";
import { useCart } from "../../lib/context/cartContext";

export default function CartComponent() {
  const { isSheetOpen, toggleCartSheet } = useGlobalState();
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } =
    useCart();

  return (
    <Sheet open={isSheetOpen} onOpenChange={toggleCartSheet}>
      <SheetContent className="w-full overflow-auto sm:max-w-sm">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="text-base font-semibold">
            Shopping Cart
          </SheetTitle>
          <p
            data-testid="cart-total-items"
            className="text-sm text-muted-foreground"
          >
            You have {totalItems} items in your cart.
          </p>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Your cart is empty
          </div>
        ) : (
          <div className="flex flex-col gap-5 py-6 overflow-y-auto overflow-x-hidden">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col xl:flex-row gap-4">
                <div className="flex-shrink-0 overflow-hidden rounded-md border">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    className="object-cover object-center h-full w-full xl:max-w-20"
                    onError={(e) => {
                      e.currentTarget.src = `/images/placeholder.png`;
                    }}
                    width={100}
                    height={100}
                    unoptimized
                  />
                </div>
                <div className="flex flex-1 gap-2 justify-between">
                  <div className="flex flex-col content-between justify-between">
                    <h3 className="text-xs xl:text-base font-semibold">
                      {item.name}
                    </h3>
                    <p
                      data-testid="cart-total-price"
                      className="text-xs xl:text-sm"
                    >
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <span
                      data-testid={`quantity-${item.id}`}
                      className="min-w-8 text-center"
                    >
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between text-base font-medium">
            <p>Total</p>
            <p>${totalPrice.toFixed(2)}</p>
          </div>
          <Button className="w-full" size="lg" disabled={items.length === 0}>
            Proceed to Checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
