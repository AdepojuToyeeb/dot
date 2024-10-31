"use client";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { GetProductsCategories } from "../api/services";
import { SortOrderEnum } from "../constants";
import { useSearchParams } from "next/navigation";

interface CategoryContextType {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSubCategory: string;
  setSelectedSubCategory: (subCategory: string) => void;
  categories: CategoryMap;
  isLoading: boolean;
  error: unknown;
  search: string;
  minPrice: number;
  maxPrice: number;
  sortBy: string;
  page: number;
  limit: number;
  order: SortOrderEnum;
  setSearch: (value: string) => void;
  setLimit: (value: number) => void;
  setPage: (value: number) => void;
  setMinPrice: (value: number) => void;
  setMaxPrice: (value: number) => void;
  setSortBy: (value: string) => void;
  setOrder: (value: SortOrderEnum) => void;
}

type ProviderProps = {
  children: ReactNode;
};

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

type CategoryMap = {
  [key: string]: string[];
};

export const CategoryProvider = ({ children }: ProviderProps) => {
  const searchParams = useSearchParams();

  // Initialize state with URL params if they exist
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "All"
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(
    searchParams.get("subcategory") || ""
  );

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(
    Number(searchParams.get("minPrice")) || 0
  );
  const [maxPrice, setMaxPrice] = useState(
    Number(searchParams.get("maxPrice")) || 2000
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 10);
  const [order, setOrder] = useState<SortOrderEnum>(
    (searchParams.get("order") as SortOrderEnum) || SortOrderEnum.ASC
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["get_all_categories"],
    queryFn: GetProductsCategories,
  });

  // Sync state with URL params whenever they change
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const subCategoryFromUrl = searchParams.get("subcategory");
    const searchFromUrl = searchParams.get("search");
    const minPriceFromUrl = searchParams.get("minPrice");
    const maxPriceFromUrl = searchParams.get("maxPrice");
    const sortByFromUrl = searchParams.get("sortBy");
    const pageFromUrl = searchParams.get("page");
    const limitFromUrl = searchParams.get("limit");
    const orderFromUrl = searchParams.get("order");

    // Only update if the values are different from current state
    if (categoryFromUrl !== null && categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
    if (
      subCategoryFromUrl !== null &&
      subCategoryFromUrl !== selectedSubCategory
    ) {
      setSelectedSubCategory(subCategoryFromUrl);
    }
    if (searchFromUrl !== null && searchFromUrl !== search) {
      setSearch(searchFromUrl);
    }
    if (minPriceFromUrl !== null && Number(minPriceFromUrl) !== minPrice) {
      setMinPrice(Number(minPriceFromUrl));
    }
    if (maxPriceFromUrl !== null && Number(maxPriceFromUrl) !== maxPrice) {
      setMaxPrice(Number(maxPriceFromUrl));
    }
    if (sortByFromUrl !== null && sortByFromUrl !== sortBy) {
      setSortBy(sortByFromUrl);
    }
    if (pageFromUrl !== null && Number(pageFromUrl) !== page) {
      setPage(Number(pageFromUrl));
    }
    if (limitFromUrl !== null && Number(limitFromUrl) !== limit) {
      setLimit(Number(limitFromUrl));
    }
    if (orderFromUrl !== null && orderFromUrl !== order) {
      setOrder(orderFromUrl as SortOrderEnum);
    }
  }, [searchParams]); // Re-run effect when URL params change

  // Compute categories
  const categories = useMemo(() => {
    const products = data?.products ?? [];

    if (!products) return { All: [] } as CategoryMap;

    const categoryMap = products.reduce(
      (
        acc: CategoryMap,
        product: { category: string | number; subCategory: string }
      ) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        if (!acc[product.category].includes(product.subCategory)) {
          acc[product.category].push(product.subCategory);
        }
        return acc;
      },
      { All: [] } as CategoryMap
    );

    return categoryMap;
  }, [data]);

  const value = {
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    categories,
    isLoading,
    error,
    search,
    minPrice,
    maxPrice,
    sortBy,
    order,
    setSearch,
    setMinPrice,
    setMaxPrice,
    setSortBy,
    limit,
    setLimit,
    page,
    setPage,
    setOrder,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("Context must be used within a CategoryProvider");
  }
  return context;
};
