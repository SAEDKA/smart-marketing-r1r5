import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

describe("Render optimizations (re-render fix)", () => {
  it("AnimatedCounter renders the formatted final value on first paint", () => {
    render(<AnimatedCounter value={43000} />);
    expect(screen.getByText("43,000")).toBeDefined();
  });

});
