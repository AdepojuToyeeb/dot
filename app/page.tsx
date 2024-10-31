"use client";
import { Button } from "@/components/ui/button";
import Category from "@/components/category/category";
import ProductsList from "@/components/products-list";
import ProductFilters from "@/components/product-filter";
import { useRouter } from "next/navigation";
import CartComponent from "@/components/cart/cartComponent";

export default function ProductsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto w-full px-4 py-6">
      <div className="xl:flex gap-8">
        <div className="flex-1 space-y-8">
          <div className="flex justify-between items-center">
            <p>All Products</p>
            <Button
              onClick={() => {
                router.push("/add-product");
              }}
            >
              Add Products
            </Button>
          </div>
          <ProductFilters />
          <ProductsList />
          <CartComponent />
        </div>
      </div>
    </div>
  );
}
