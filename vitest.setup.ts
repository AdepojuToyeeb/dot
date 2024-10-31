import "@testing-library/jest-dom";

// Mock Next.js router
vi.mock("next/router", () => require("next-router-mock"));
vi.mock("next/navigation", () => require("next-router-mock"));
