import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDarkMode } from "./useDarkMode";

describe("useDarkMode", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    vi.stubGlobal("matchMedia", (_query: string) => ({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
  });

  it("initializes isDark to false when no storage and no system dark preference", () => {
    const { result } = renderHook(() => useDarkMode());
    act(() => {});
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it('initializes isDark to true when localStorage is "dark"', () => {
    localStorage.setItem("theme", "dark");
    const { result } = renderHook(() => useDarkMode());
    act(() => {});
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it('initializes isDark to false when localStorage is "light"', () => {
    localStorage.setItem("theme", "light");
    const { result } = renderHook(() => useDarkMode());
    act(() => {});
    expect(result.current.isDark).toBe(false);
  });

  it('toggle adds .dark class and saves "dark" to localStorage', () => {
    const { result } = renderHook(() => useDarkMode());
    act(() => result.current.toggle());
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it('toggle twice restores light mode and saves "light" to localStorage', () => {
    const { result } = renderHook(() => useDarkMode());
    act(() => result.current.toggle());
    act(() => result.current.toggle());
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
