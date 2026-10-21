import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthForm } from "@/components/site/AuthForm";
import { loginSchema } from "@/lib/validation/auth";

afterEach(cleanup);

describe("Account access deferred until Django", () => {
  it("does not submit account credentials while account access is deferred", () => {
    const onSubmit = vi.fn();
    render(<AuthForm title="Log in" schema={loginSchema} fields={[
      { name: "email", label: "Email" }, { name: "password", label: "Password" },
    ]} submitLabel="Log in" onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "person@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
    const form = screen.getByLabelText("Email").closest("form");
    if (!form) throw new Error("Missing account form");
    fireEvent.submit(form);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not permit Google sign-in while account access is deferred", () => {
    const onSubmit = vi.fn();
    render(<AuthForm title="Log in" schema={loginSchema} fields={[]} submitLabel="Log in" onSubmit={onSubmit} plannedGoogle />);
    const google = screen.getByRole("button", { name: /Continue with Google/ });
    expect(google).toBeDisabled();
    fireEvent.click(google);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});