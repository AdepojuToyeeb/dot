"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { GetAllProducts } from "@/lib/api/services";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { ShoppingCart, Star, X } from "lucide-react";
import { useCategory } from "@/lib/context/category";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useCart } from "@/lib/context/cartContext";
import { toast } from "sonner";
import Pagination from "./pagination";
import { useRouter } from "next/navigation";
import CardSkeletonComponent from "./ui/cardContentLoader";

export default function ProductsList() {
  const {
    selectedCategory,
    maxPrice,
    minPrice,
    search,
    selectedSubCategory,
    sortBy,
    order,
    page,
    setLimit,
    setPage,
    limit,
  } = useCategory();

  const { addToCart, removeFromCart, items } = useCart();
  const router = useRouter();
  const { value: debouncedSearch } = useDebounce(search, 500);
  const { data, isLoading } = useQuery({
    queryKey: [
      "get_all_products",
      {
        selectedCategory,
        maxPrice,
        debouncedSearch,
        minPrice,
        selectedSubCategory,
        sortBy,
        order,
        limit,
        page,
      },
    ],
    queryFn: () =>
      GetAllProducts({
        category: selectedCategory === "All" ? undefined : selectedCategory,
        maxPrice: maxPrice || undefined,
        search: debouncedSearch || undefined,
        sort: sortBy || undefined,
        subCategory: selectedSubCategory || undefined,
        minPrice: minPrice || undefined,
        order: order || undefined,
        limit: limit,
        page: page,
      }),
  });

  const isInCart = (productId: string | number) => {
    return items.some((item) => item.id === productId);
  };

  const handleCartAction = (product: any) => {
    if (isInCart(product.id)) {
      removeFromCart(product.id);
      toast.warning(`${product.name} removed from cart`);
    } else {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: product.quantity,
      });
      toast.success(`${product.name} added to cart`);
    }
  };

  if (isLoading) {
    const loadingItems = Array(6).fill(null);

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingItems.map((_, index) => (
            <CardSkeletonComponent key={index} />
          ))}
        </div>
      </>
    );
  }

  if (!data?.products || data.products.length === 0) {
    return (
      <Card className="w-full p-6">
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <ShoppingCart className="h-12 w-12 text-gray-400" />
          <h3 className="text-xl font-semibold">No products found</h3>
          <p className="text-gray-500">
            We couldn't find any products matching your criteria
          </p>
         
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.products?.map(
          (product: {
            id: string;
            imageUrl: string;
            name: string;
            rating: string;
            reviews: string;
            brand: string;
            price: number;
          }) => (
            <Card key={product.id}>
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={300}
                height={200}
                priority={true}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = `/images/placeholder.png`;
                }}
                unoptimized
              />
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{product.rating}</span>
                  <span className="text-gray-500">
                    ({product.reviews} reviews)
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">{product.brand}</p>
                <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="flex flex-col lg:flex-row gap-3">
                <Button
                  className="w-full flex items-center gap-2"
                  onClick={() => router.push(`/${product.id}`)}
                  variant="default"
                >
                  View Details{" "}
                </Button>
                <Button
                  className="w-full flex items-center gap-2"
                  onClick={() => handleCartAction(product)}
                  variant={isInCart(product.id) ? "destructive" : "default"}
                >
                  {isInCart(product.id) ? (
                    <>
                      <X className="h-4 w-4" />
                      Remove from Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )
        )}
      </div>
      <Pagination
        currentPage={page}
        totalPages={data?.totalPages}
        pageSize={limit}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setLimit(newSize);
          setPage(1);
        }}
      />
    </div>
  );
}
