"use client";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useCategory } from "../../lib/context/category";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { CategoryContentLoader } from "../ui/cardContentLoader";

export default function Category() {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    categories,
    isLoading,
  } = useCategory();

  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (params: { [key: string]: string | null }) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      // Update or remove each parameter
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      });

      return current.toString();
    },
    [searchParams]
  );

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory("");

    const params =
      category === "All"
        ? { category: null, subcategory: null }
        : { category, subcategory: null };

    const queryString = createQueryString(params);
    router.push(`/${queryString ? `?${queryString}` : ""}`);
  };

  const handleSubCategoryClick = (subCategory: string) => {
    setSelectedSubCategory(subCategory);

    const queryString = createQueryString({
      category: selectedCategory,
      subcategory: subCategory,
    });

    router.push(`/?${queryString}`);
  };

  if (isLoading) {
    return (
      <>
        <CategoryContentLoader />
      </>
    );
  }
  return (
    <div className="w-64 flex-shrink-0">
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.keys(categories).map((category) => (
              <div key={category}>
                <Button
                  variant={selectedCategory === category ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </Button>
                {selectedCategory === category &&
                  categories[category as keyof typeof categories].map((sub) => (
                    <Button
                      key={sub}
                      variant={
                        selectedSubCategory === sub ? "secondary" : "ghost"
                      }
                      className="w-full justify-start pl-10 text-sm"
                      onClick={() => handleSubCategoryClick(sub)}
                    >
                      {sub}
                    </Button>
                  ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
