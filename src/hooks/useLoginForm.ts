import { FormEvent, useState } from "react";

interface UseLoginFormOptions {
  onSubmit: (username: string, password: string) => Promise<void>;
  onInputChange?: () => void;
}

export const useLoginForm = ({ onSubmit, onInputChange }: UseLoginFormOptions) => {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(form.username, form.password);
  };

  const handleFieldChange = (field: "username" | "password", value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    onInputChange?.();
  };

  return { form, handleSubmit, handleFieldChange };
};
