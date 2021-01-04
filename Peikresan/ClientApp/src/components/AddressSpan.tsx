import React from "react";

interface IAddressSpanProps{
  state: string,
  city: string,
  district: string,
  mobile: number,
  name: string,
  description:string,
  level:string,
  unit:string,
  number:string,
  postalCode:number
}

const AddressSpan:(IAddressSpanProps)=>JSX.Element = ({
  state,
  city,
  district,
  mobile,
  name,
  description,
  level,
  unit,
  number,
  postalCode,
}) => (
  <React.Fragment>
    <div>
      {state + ", " + city + ", " + district + ", موبایل: " + mobile}
      {name && name > 0 && ", گیرنده: " + name}
    </div>
    <div>
      {description}
      {level && level.length > 0 && ", طبقه: " + level}
      {unit && unit.length > 0 && ", واحد: " + unit}
      {number && number.length > 0 && ", پلاک: " + number}
      {postalCode && postalCode.length > 0 && ", کدپستی: " + postalCode}
    </div>
  </React.Fragment>
);

export default AddressSpan;
