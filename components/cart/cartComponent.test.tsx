import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { Mock } from "vitest";
import CartComponent from "./cartComponent";
import { useGlobalState } from "../../lib/context/globalContext";
import { useCart } from "../../lib/context/cartContext";

const Mock = vi.fn();

// Define types for your contexts
interface GlobalState {
  isSheetOpen: boolean;
  toggleCartSheet: () => void;
  resetAllStates: () => void;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  brand: string;
}

interface CartContextType {
  items: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  totalItems: number;
  totalPrice: number;
  addToCart: (product: CartItem) => void;
  clearCart: () => void;
}

// Mock the modules
vi.mock("../../lib/context/globalContext", () => ({
  useGlobalState: vi.fn(),
}));

vi.mock("../../lib/context/cartContext", () => ({
  useCart: vi.fn(),
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe("CartComponent", () => {
  const mockToggleCartSheet = vi.fn();
  const mockUpdateQuantity = vi.fn();
  const mockRemoveFromCart = vi.fn();
  const mockAddToCart = vi.fn();
  const mockClearCart = vi.fn();

  // Mock cart items data
  const mockCartItems: CartItem[] = [
    {
      id: "1",
      name: "iPhone 14 Pro",
      price: 999.99,
      quantity: 2,
      imageUrl: "/iphone.jpg",
      brand: "Apple",
    },
    {
      id: "2",
      name: "Samsung Galaxy S23",
      price: 799.99,
      quantity: 1,
      imageUrl: "/samsung.jpg",
      brand: "Samsung",
    },
  ];

  const mockEmptyCart: CartContextType = {
    items: [],
    updateQuantity: mockUpdateQuantity,
    removeFromCart: mockRemoveFromCart,
    totalItems: 0,
    totalPrice: 0,
    addToCart: mockAddToCart,
    clearCart: mockClearCart,
  };

  const mockFilledCart: CartContextType = {
    items: mockCartItems,
    updateQuantity: mockUpdateQuantity,
    removeFromCart: mockRemoveFromCart,
    totalItems: 3,
    totalPrice: 2799.97,
    addToCart: mockAddToCart,
    clearCart: mockClearCart,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useGlobalState as Mock).mockImplementation(() => ({
      isSheetOpen: true,
      toggleCartSheet: mockToggleCartSheet,
      resetAllStates: vi.fn(),
    }));
  });

  describe("Cart with items", () => {
    beforeEach(() => {
      (useCart as Mock).mockImplementation(() => mockFilledCart);
    });

    it("calculates and displays correct totals", () => {
      render(<CartComponent />);
      expect(screen.getByTestId("cart-total-items")).toHaveTextContent(
        "You have 3 items in your cart."
      );
    });

    it("handles quantity updates for specific items", () => {
      render(<CartComponent />);

      const increaseButtons = screen.getAllByRole("button", {
        name: /increase quantity/i,
      });
      fireEvent.click(increaseButtons[0]);
      expect(mockUpdateQuantity).toHaveBeenCalledWith("1", 3);

      const decreaseButtons = screen.getAllByRole("button", {
        name: /decrease quantity/i,
      });
      fireEvent.click(decreaseButtons[1]);
      expect(mockUpdateQuantity).toHaveBeenCalledWith("2", 0);
    });

    it("handles removing specific items", () => {
      render(<CartComponent />);

      const removeButtons = screen.getAllByRole("button", {
        name: /remove item/i,
      });
      fireEvent.click(removeButtons[0]);
      expect(mockRemoveFromCart).toHaveBeenCalledWith("1");
    });
  });

  describe("Empty cart", () => {
    beforeEach(() => {
      (useCart as Mock).mockImplementation(() => mockEmptyCart);
    });

    it("displays empty cart state correctly", () => {
      render(<CartComponent />);
      expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
    });
  });
});
