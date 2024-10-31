"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Star, StarHalf, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DeleteProducts, GetSingleProduct } from "@/lib/api/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCart } from "@/lib/context/cartContext";
import { toast } from "sonner";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [isDeleting, setIsDeleting] = useState(false);
  const { addToCart, removeFromCart, items } = useCart();
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

  const deleteProductsMutation = useMutation({
    mutationFn: DeleteProducts,
    onSuccess: () => {
      toast.success("submitted address Information");
      queryClient.invalidateQueries({ queryKey: ["get_all_products"] });
      router.push("/");
    },
  });

  const { data: product, isLoading } = useQuery({
    queryKey: [
      `get_single_products ${id}`,
      {
        id,
      },
    ],
    queryFn: () => GetSingleProduct(+id),
  });

  const handleDelete = async () => {
    deleteProductsMutation.mutate(+id);
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    return stars;
  };

  if (isLoading) {
    return <p>Loading..</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          {/* Back Navigation */}
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.imageUrl}
                onError={(e) => {
                  e.currentTarget.src = `/images/placeholder.png`;
                }}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Category Breadcrumb */}
              <div className="text-xs xl:text-sm">
                <Link
                  href={`/?category=${product.category}`}
                  className="text-blue-600 hover:underline"
                >
                  {product.category.toUpperCase()}
                </Link>
                {" > "}
                <Link
                  href={`/?category=${product.category}&subcategory=${product.subCategory}`}
                  className="text-blue-600 hover:underline"
                >
                  {product.subCategory.toUpperCase()}
                </Link>
              </div>

              {/* Product Title */}
              <h1 className="text-xl xl:text-3xl font-bold">{product.name}</h1>

              {/* Description */}
              <p className="text-sm xl:text-base text-gray-600">
                {product.description}
              </p>

              {/* Price and Stock */}
              <div className="flex items-baseline gap-4">
                <span className="xl:text-3xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-gray-600">In stock: {product.stock}</span>
              </div>

              {/* Rating */}
              <div className="flex text-sm xl:text-base items-center gap-2">
                <div className="flex">{renderRatingStars(product.rating)}</div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Specifications */}
              <div>
                <h2 className="text-base xl:text-xl font-semibold mb-4">
                  Specifications:
                </h2>
                <dl className="grid grid-cols-2 gap-4">
                  {Object.entries(product?.specifications).map(
                    ([key, value]) => (
                      <div className="text-sm xl:text-base" key={key}>
                        <dt className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1")}:
                        </dt>
                        <dd className="text-gray-600">{String(value)}</dd>
                      </div>
                    )
                  )}
                </dl>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col xl:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="w-full xl:w-1/4"
                  variant={isInCart(product.id) ? "destructive" : "default"}
                  onClick={() => handleCartAction(product)}
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
                  )}{" "}
                </Button>
                <Button
                  size="lg"
                  className="w-full xl:w-1/4"
                  variant="outline"
                  onClick={() => router.push(`/edit/${product.id}`)}
                >
                  Edit Product
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="lg"
                      variant="destructive"
                      disabled={isDeleting}
                      className="w-full xl:w-1/4"
                    >
                      Delete Product
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the product and remove it from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        {deleteProductsMutation.isPending
                          ? "Deleting..."
                          : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
