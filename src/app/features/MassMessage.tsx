import { MultiSelectFields } from "@/app/types";




type Props = {
  fields: MultiSelectFields[]
};

export const MassMessage = ({fields}: Props)=> {
  return (
    <div>
      <h2>MM</h2>
      <select defaultValue={""}>
      <option disabled value="" >Select a custom field:</option>
      {fields.map(option => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
    </div>
  )
}