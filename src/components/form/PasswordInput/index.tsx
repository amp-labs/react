import { useState } from "react";
import { PasswordEyeIcon } from "src/assets/PasswordEyeIcon";
import { PasswordEyeSlashIcon } from "src/assets/PasswordEyeSlashIcon";
import { FormComponent } from "src/components/form";
import { Button } from "src/components/ui-base/Button";

export interface PasswordInputProps {
  id: string;
  name: string;
  placeholder?: string;
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
  value?: string;
  className?: string;
  isError?: boolean;
}

export function PasswordInput({
  id,
  name,
  placeholder = "Password",
  onChange,
  value,
  className,
  isError,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const onToggleShowHide = () => setShow((prevShow) => !prevShow);

  return (
    <div style={{ display: "flex", gap: ".5rem" }}>
      <FormComponent.Input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className={className}
        isError={isError}
      />
      <Button
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        style={{
          height: "2.5rem",
          width: "2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={onToggleShowHide}
        variant="ghost"
      >
        <span style={{ height: "1.5rem", width: "1.5rem" }}>
          {show ? <PasswordEyeSlashIcon /> : <PasswordEyeIcon />}
        </span>
      </Button>
    </div>
  );
}
