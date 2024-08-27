'use client'
import { ComponentProps, useState } from "react";
import { MultiSelectFields } from "@/app/types";
import { Select, MenuItem } from "@mui/material"; // Assuming you're using Material-UI's Select component

type Props = {
  fields: MultiSelectFields[]
};

export const MassMessage = ({ fields }: Props) => {
  const [values, setValues] = useState({
    customField: ""
  });

  const handleChangeValues: ComponentProps<typeof Select>["onChange"] = (
    event
  ) => {
    const field = event.target.name;
    setValues({
      ...values,
      [field]: event.target.value,
    });
  };

  console.log(values)

  return (
    <div>
      <h2>MM</h2>
      <Select
        value={values.customField}
        onChange={handleChangeValues}
        name="customField"
        displayEmpty
        renderValue={(selected) => {
          const selectedField = fields.find(
            (field) => field.id === selected
          );
          if (!selected) {
            return <div>Select a custom field</div>;
          }
          return selectedField?.name || "Select a custom field";
        }}
      >
        {fields.map(option => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
