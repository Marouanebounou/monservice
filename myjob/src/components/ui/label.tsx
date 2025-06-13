import React from "react";

export const Label = ({ className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label
      className={`block mb-1 text-sm font-medium text-gray-700 ${className}`}
      {...props}
    />
  );
};
