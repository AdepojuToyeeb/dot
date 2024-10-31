"use client";

import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useCategory } from "@/lib/context/category";
import { SortOrderEnum } from "@/lib/constants";

export default function ProductFilters() {
  const {
    search,
    maxPrice,
    minPrice,
    setMinPrice,
    sortBy,
    setSortBy,
    setMaxPrice,
    order,
    setOrder,
    setSearch,
  } = useCategory();
  const [priceError, setPriceError] = useState("");

  const validatePriceUpdate = (newMin: number, newMax: number) => {
    switch (true) {
      case newMin < 0 || newMax < 0:
        return "Price cannot be negative.";
      case newMin > newMax && newMax !== 0:
        return "Minimum price cannot be greater than maximum price.";
      case newMax < newMin && newMin !== 0:
        return "Maximum price cannot be less than minimum price.";
      default:
        return null;
    }
  };

  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMinPrice = Number(e.target.value);
    const validationError = validatePriceUpdate(newMinPrice, maxPrice);

    if (validationError) {
      setPriceError(validationError);
      setMinPrice(newMinPrice);
    } else {
      setPriceError("");
      setMinPrice(newMinPrice);
    }
  };

  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMaxPrice = Number(e.target.value);
    const validationError = validatePriceUpdate(minPrice, newMaxPrice);

    if (validationError) {
      setPriceError(validationError);
      setMaxPrice(newMaxPrice);
    } else {
      setPriceError("");
      setMaxPrice(newMaxPrice);
    }
  };

  return (
    <Card className="bg-gray-50">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 items-start gap-4">
            {/* Search */}
            <div className="col-span-1 md:col-span-2">
              <Input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white"
              />
            </div>

            {/* Price Range */}
            <div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  className={`w-20 bg-white ${
                    priceError ? "border-red-500" : ""
                  }`}
                  min={0}
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="number"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  className={`w-20 bg-white ${
                    priceError ? "border-red-500" : ""
                  }`}
                  min={0}
                />
              </div>
              {priceError && (
                <p className="text-red-500 text-xs mt-2">{priceError}</p>
              )}
            </div>
            {/* Validation Message */}

            {/* Sort By */}
            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between items-center">
              {/* Order */}
              <Select value={order} onValueChange={setOrder}>
                <SelectTrigger className="w-[200px] bg-white">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SortOrderEnum.ASC}>Ascending</SelectItem>
                  <SelectItem value={SortOrderEnum.DESC}>Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
