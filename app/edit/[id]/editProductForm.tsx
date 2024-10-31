import React, { useState } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditProducts } from "@/lib/api/services";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { useCategory } from "@/lib/context/category";

interface Specifications {
  [key: string]: string;
}

interface FormData {
  id?: string;
  name: string;
  brand: string;
  category: string;
  subCategory: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  specifications?: Specifications;
}

type props = {
  product: FormData;
};

interface FormErrors {
  name?: string;
  brand?: string;
  category?: string;
  subCategory?: string;
  price?: string;
  stock?: string;
  description?: string;
  imageUrl?: string;
}

export default function EditProductForm({ product }: props) {
  const router = useRouter();
  const params = useParams();

  const queryClient = useQueryClient();
  const productId = params.id as string;
  const { categories } = useCategory();
  const [formData, setFormData] = useState<FormData>({
    id: productId,
    name: product.name,
    brand: product.brand,
    price: product.price,
    stock: product.stock,
    description: product.description,
    imageUrl: product.imageUrl,
    category: product.category,
    subCategory: product.subCategory,
  });
  const [specifications, setSpecifications] = useState<Specifications>(
    product.specifications as Specifications
  );

  const [newSpec, setNewSpec] = useState<{ key: string; value: string }>({
    key: "",
    value: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.brand) newErrors.brand = "Brand is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subCategory)
      newErrors.subCategory = "Sub category is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (formData.stock < 0) newErrors.stock = "Stock cannot be negative";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.imageUrl) newErrors.imageUrl = "Image URL is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateProductMutation = useMutation({
    mutationFn: EditProducts,
    onSuccess: (data) => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["get_all_products"] });
      queryClient.invalidateQueries({
        queryKey: ["get_product_by_id", productId],
      });
      router.push("/");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      ...formData,
      specifications,
    };

    if (!validateForm()) return toast.error("Please fill all required fields");

    updateProductMutation.mutate(productData);
  };

  const handleAddSpecification = () => {
    if (newSpec.key && newSpec.value) {
      setSpecifications({
        ...specifications,
        [newSpec.key]: newSpec.value,
      });
      setNewSpec({ key: "", value: "" });
    }
  };

  const handleRemoveSpecification = (keyToRemove: string) => {
    const newSpecs = { ...specifications };
    delete newSpecs[keyToRemove];
    setSpecifications(newSpecs);
  };

  return (
    <div className="container mx-auto p-6 ">
      <Card>
        <CardHeader className="flex  flex-col-reverse lg:flex-row lg:items-center flex- justify-between">
          <CardTitle className="">Edit Product</CardTitle>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-xs px-0 lg:px-2 lg:text-sm self-end"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  className={errors.brand ? "border-red-500" : ""}
                />
                {errors.brand && (
                  <p className="text-sm text-red-500">{errors.brand}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      category: value,
                      subCategory: "",
                    }));
                  }}
                >
                  <SelectTrigger
                    className={errors.category ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(categories)?.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="subCategory">Sub Category</Label>
                <Select
                  value={formData.subCategory}
                  onValueChange={(value) => {
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      subCategory: value,
                    }));
                  }}
                  disabled={!formData.category}
                >
                  <SelectTrigger
                    className={errors.subCategory ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select sub category" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.category &&
                      categories[
                        formData.category as keyof typeof categories
                      ]?.map((subCategory) => (
                        <SelectItem key={subCategory} value={subCategory}>
                          {subCategory}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.subCategory && (
                  <p className="text-sm text-red-500">{errors.subCategory}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: parseInt(e.target.value),
                    })
                  }
                  className={errors.stock ? "border-red-500" : ""}
                />
                {errors.stock && (
                  <p className="text-sm text-red-500">{errors.stock}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={`min-h-[100px] ${
                  errors.description ? "border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className={errors.imageUrl ? "border-red-500" : ""}
              />
              {errors.imageUrl && (
                <p className="text-sm text-red-500">{errors.imageUrl}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Specifications</Label>
              <div className="lg:flex space-y-3 lg:space-y-0 gap-2">
                <Input
                  placeholder="Key"
                  value={newSpec.key}
                  onChange={(e) =>
                    setNewSpec({ ...newSpec, key: e.target.value })
                  }
                  className="w-full lg:w-1/3"
                />
                <Input
                  placeholder="Value"
                  value={newSpec.value}
                  onChange={(e) =>
                    setNewSpec({ ...newSpec, value: e.target.value })
                  }
                  className="w-full lg:w-1/3"
                />
                <Button
                  type="button"
                  onClick={handleAddSpecification}
                  disabled={!newSpec.key || !newSpec.value}
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              <div className="space-y-2 text-xs lg:text-base">
                {Object.entries(specifications)?.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 bg-gray-50 p-2 rounded"
                  >
                    <span className="font-medium flex-1">{key}:</span>
                    <span className="flex-1">{value}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSpecification(key)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 lg:flex-row justify-between lg:justify-end">
            <Button
              type="button"
              variant="outline"
              className="w-full lg:w-auto"
              onClick={() => router.push("/")}
            >
              Cancel
            </Button>
            <Button
              className="w-full lg:w-auto"
              disabled={updateProductMutation.isPending}
              type="submit"
            >
              {updateProductMutation.isPending
                ? "Updating..."
                : "Update Product"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
