"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { GetSingleProduct } from "@/lib/api/services";
import EditProductForm from "@/app/edit/[id]/editProductForm";
import { FormContentLoader } from "@/components/ui/cardContentLoader";

export default function Component() {
  const params = useParams();
  const productId = params.id as string;

  const { data: productData, isLoading: isProductLoading } = useQuery({
    queryKey: ["get_product_by_id", productId],
    queryFn: () => GetSingleProduct(+productId),
  });

  if (isProductLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center">
        <FormContentLoader />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center">
        <p>Product not found</p>
      </div>
    );
  }

  return <EditProductForm product={productData} />;
}
