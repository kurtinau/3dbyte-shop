import React from "react";
import ReactSelect, { components } from "react-select";
import SelectStyle from "./select.style";
import { MenuDown } from "assets/icons/MenuDown";
import { Arrow } from "./select.style";
import { VaraiantType } from "components/product-details/product-details";

type OptionType = { [k in string]: any };
type OptionsType = Array<OptionType>;

type SelectProps = {
  className?: string;
  labelText?: string;
  as?: string;
  name?: string;
  value?: any;
  labelPosition?: "top" | "bottom" | "left" | "right";
  options?: OptionsType;
  defaultValue?: VaraiantType;
  onChange?: (value: VaraiantType) => void;
  menuPlacement?: string;
  isValid?: boolean;
  props?: any;
};

const Select: React.FC<SelectProps> = ({
  className,
  labelText,
  labelPosition,
  isValid,
  defaultValue,
  ...props
}) => {
  // Add all classes to an array
  const addAllClasses = ["pickbazar__select"];

  // Add label position class
  if (labelPosition) {
    addAllClasses.push(`label_${labelPosition}`);
  }

  // className prop checking
  if (className) {
    addAllClasses.push(className);
  }

  const LabelField = labelText && (
    <span className="pickbazar__field-label">{labelText}</span>
  );

  const position = labelPosition || "top";

  const customStyles = {
    input: (base) => ({
      ...base,
      width: 80,
    }),
    control: (base, state) => ({
      ...base,
      // state.isFocused can display different borderColor if you need it
      borderColor: state.isFocused ?
        '#ddd' : isValid ?
        '#ddd' : 'red',
      // overwrittes hover style
      '&:hover': {
        borderColor: state.isFocused ?
          '#ddd' : isValid ?
          '#ddd' : 'red'
      }
    })
  };

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <Arrow>
          <MenuDown />
        </Arrow>
      </components.DropdownIndicator>
    );
  };

  return (
    <SelectStyle className={addAllClasses.join(" ")}>
      {position === "left" || position === "right" || position === "top"
        ? LabelField
        : ""}

      <ReactSelect
        className="select-field__wrapper"
        classNamePrefix="select"
        styles={customStyles}
        components={{ DropdownIndicator }}
        defaultValue={defaultValue}
        {...props}
      />
      {position === "bottom" && LabelField}
    </SelectStyle>
  );
};

Select.defaultProps = {
  as: "div",
  labelPosition: "top",
};

export default Select;
