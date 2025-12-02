/**
 * Utility functions for form handling
 */

export const formatHour = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  let formattedValue = "";
  if (cleaned.length <= 2) {
    formattedValue = cleaned;
  } else {
    formattedValue = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
  }
  return formattedValue;
};

export const handleHourChange = (fieldName: string) => (form: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
  const { value } = e.target;
  const formattedValue = formatHour(value);
  form.setFieldsValue({
    [fieldName]: formattedValue,
  });
};

