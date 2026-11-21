import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { BirthDateInput } from "@/components/app/BirthDateInput";

function Harness({ initial = "", onValue }: { initial?: string; onValue: (v: string) => void }) {
  const [value, setValue] = useState(initial);
  return (
    <BirthDateInput
      value={value}
      minAge={18}
      onChange={(v) => {
        setValue(v);
        onValue(v);
      }}
    />
  );
}

const pick = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe("BirthDateInput", () => {
  it("emits an ISO date only once day, month and year are all chosen", () => {
    const values: string[] = [];
    render(<Harness onValue={(v) => values.push(v)} />);

    pick("Day", "7");
    pick("Month", "3");
    expect(values.at(-1)).toBe("");

    pick("Year", "1995");
    expect(values.at(-1)).toBe("1995-03-07");
  });

  it("only offers years that make the person at least the minimum age, newest first", () => {
    render(<Harness onValue={() => {}} />);
    const years = Array.from((screen.getByLabelText("Year") as HTMLSelectElement).options)
      .map((o) => o.value)
      .filter(Boolean);
    const newest = new Date().getFullYear() - 18;

    expect(years[0]).toBe(String(newest));
    expect(Number(years.at(-1))).toBe(newest - 102);
  });

  it("clears a day that does not exist in the chosen month", () => {
    const values: string[] = [];
    render(<Harness onValue={(v) => values.push(v)} />);

    pick("Day", "31");
    pick("Year", "1990");
    pick("Month", "2"); // February has no 31st

    expect(values.at(-1)).toBe("");
    expect((screen.getByLabelText("Day") as HTMLSelectElement).value).toBe("");
  });

  it("keeps 29 February in a leap year", () => {
    const values: string[] = [];
    render(<Harness onValue={(v) => values.push(v)} />);

    pick("Year", "1996");
    pick("Month", "2");
    pick("Day", "29");

    expect(values.at(-1)).toBe("1996-02-29");
  });

  it("shows a saved date", () => {
    render(<Harness initial="1988-11-02" onValue={() => {}} />);

    expect((screen.getByLabelText("Day") as HTMLSelectElement).value).toBe("2");
    expect((screen.getByLabelText("Month") as HTMLSelectElement).value).toBe("11");
    expect((screen.getByLabelText("Year") as HTMLSelectElement).value).toBe("1988");
  });
});
