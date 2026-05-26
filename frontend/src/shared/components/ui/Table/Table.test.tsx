import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  TableCell,
  TableEmptyRow,
  TableHeader,
  TableLoadingRow,
  TableRow,
  TableShell,
} from "./Table";

describe("TableShell", () => {
  it("renders children inside card wrapper", () => {
    render(<TableShell><span>content</span></TableShell>);
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});

describe("TableHeader", () => {
  it("renders children in a th element", () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHeader>Name</TableHeader>
          </tr>
        </thead>
      </table>,
    );
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
  });
});

describe("TableRow", () => {
  it("renders children in a tr element", () => {
    render(
      <table>
        <tbody>
          <TableRow>
            <td>cell</td>
          </TableRow>
        </tbody>
      </table>,
    );
    expect(screen.getByRole("cell", { name: "cell" })).toBeInTheDocument();
  });
});

describe("TableCell", () => {
  it("renders children in a td element", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>data</TableCell>
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByRole("cell", { name: "data" })).toBeInTheDocument();
  });

  it("applies colSpan attribute", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell colSpan={3}>data</TableCell>
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByRole("cell", { name: "data" })).toHaveAttribute("colspan", "3");
  });
});

describe("TableLoadingRow", () => {
  it("renders spinner row when isLoading is true", () => {
    render(
      <table>
        <tbody>
          <TableLoadingRow isLoading colSpan={3} />
        </tbody>
      </table>,
    );
    expect(screen.getByText("Fetching latest data…")).toBeInTheDocument();
  });

  it("renders nothing when isLoading is false", () => {
    render(
      <table>
        <tbody>
          <TableLoadingRow isLoading={false} colSpan={3} />
        </tbody>
      </table>,
    );
    expect(screen.queryByText("Fetching latest data…")).not.toBeInTheDocument();
  });
});

describe("TableEmptyRow", () => {
  it("renders default empty state when isEmpty is true", () => {
    render(
      <table>
        <tbody>
          <TableEmptyRow isEmpty colSpan={3} />
        </tbody>
      </table>,
    );
    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(screen.getByText("Try adjusting your filters.")).toBeInTheDocument();
  });

  it("renders nothing when isEmpty is false", () => {
    render(
      <table>
        <tbody>
          <TableEmptyRow isEmpty={false} colSpan={3} />
        </tbody>
      </table>,
    );
    expect(screen.queryByText("No results found")).not.toBeInTheDocument();
  });

  it("renders custom title and description", () => {
    render(
      <table>
        <tbody>
          <TableEmptyRow isEmpty colSpan={3} title="No users" description="Add some users" />
        </tbody>
      </table>,
    );
    expect(screen.getByText("No users")).toBeInTheDocument();
    expect(screen.getByText("Add some users")).toBeInTheDocument();
  });
});
