import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useSidebar } from "./useSidebar";

describe("useSidebar", () => {
  it("initializes with collapsed=false and mobileOpen=false", () => {
    const { result } = renderHook(() => useSidebar());
    expect(result.current.collapsed).toBe(false);
    expect(result.current.mobileOpen).toBe(false);
  });

  it("toggleCollapsed sets collapsed to true then false", () => {
    const { result } = renderHook(() => useSidebar());
    act(() => result.current.toggleCollapsed());
    expect(result.current.collapsed).toBe(true);
    act(() => result.current.toggleCollapsed());
    expect(result.current.collapsed).toBe(false);
  });

  it("openMobile sets mobileOpen to true", () => {
    const { result } = renderHook(() => useSidebar());
    act(() => result.current.openMobile());
    expect(result.current.mobileOpen).toBe(true);
  });

  it("closeMobile sets mobileOpen to false", () => {
    const { result } = renderHook(() => useSidebar());
    act(() => result.current.openMobile());
    act(() => result.current.closeMobile());
    expect(result.current.mobileOpen).toBe(false);
  });
});
