import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Category from "./category";
import { useCategory } from "../../lib/context/category";
import { useRouter, useSearchParams } from "next/navigation";

// Mock the hooks and context
vi.mock("../../lib/context/category");
vi.mock("next/navigation");

describe("Category Component", () => {
  const mockCategories = {
    All: [],
    Category1: ["SubCategory1", "SubCategory2"],
    Category2: ["SubCategory3", "SubCategory4"],
  };

  const mockUseCategory = useCategory as ReturnType<typeof vi.fn>;
  const mockUseRouter = useRouter as ReturnType<typeof vi.fn>;
  const mockUseSearchParams = useSearchParams as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockUseCategory.mockReturnValue({
      selectedCategory: "",
      setSelectedCategory: vi.fn(),
      selectedSubCategory: "",
      setSelectedSubCategory: vi.fn(),
      categories: mockCategories,
      isLoading: false,
    });

    mockUseRouter.mockReturnValue({
      push: vi.fn(),
    });

    mockUseSearchParams.mockReturnValue({
      entries: () => [],
    });
  });

  it("renders categories and subcategories", () => {
    render(<Category />);

    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Category1")).toBeInTheDocument();
    expect(screen.getByText("Category2")).toBeInTheDocument();
  });

  it("handles category click", () => {
    const { setSelectedCategory, setSelectedSubCategory } = mockUseCategory();
    const { push } = mockUseRouter();

    render(<Category />);

    fireEvent.click(screen.getByText("Category1"));

    expect(setSelectedCategory).toHaveBeenCalledWith("Category1");
    expect(setSelectedSubCategory).toHaveBeenCalledWith("");
    expect(push).toHaveBeenCalledWith("/?category=Category1");
  });

  it("handles subcategory click", () => {
    mockUseCategory.mockReturnValue({
      ...mockUseCategory(),
      selectedCategory: "Category1",
    });

    const { setSelectedSubCategory } = mockUseCategory();
    const { push } = mockUseRouter();

    render(<Category />);

    fireEvent.click(screen.getByText("Category1"));
    fireEvent.click(screen.getByText("SubCategory1"));

    expect(setSelectedSubCategory).toHaveBeenCalledWith("SubCategory1");
    expect(push).toHaveBeenCalledWith(
      "/?category=Category1&subcategory=SubCategory1"
    );
  });

  it("renders loader when isLoading is true", () => {
    mockUseCategory.mockReturnValue({
      ...mockUseCategory(),
      isLoading: true,
    });

    render(<Category />);

  });
});
