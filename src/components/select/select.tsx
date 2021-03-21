import React from 'react';
import ReactSelect, { components } from 'react-select';
import SelectStyle from './select.style';
import { MenuDown } from 'assets/icons/MenuDown';
import {Arrow} from './select.style'

type SelectProps = {
  className?: string;
  labelText?: string;
  as?: string;
  name?: string;
  value?: any;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  props?: any;
};

const Select: React.FC<SelectProps> = ({
  className,
  labelText,
  labelPosition,
  ...props
}) => {
  // Add all classes to an array
  const addAllClasses = ['pickbazar__select'];

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

  const position = labelPosition || 'top';

  const customStyles = {
    input: base => ({
      ...base,
      width: 50
    })
  };

  const DropdownIndicator = (
    props
  ) => {
    return (
      <components.DropdownIndicator {...props}>
        <Arrow>
          <MenuDown />
        </Arrow>
      </components.DropdownIndicator>
    );
  };

  return (
    <SelectStyle className={addAllClasses.join(' ')}>
      {position === 'left' || position === 'right' || position === 'top'
        ? LabelField
        : ''}

      <ReactSelect
        className="select-field__wrapper"
        classNamePrefix="select"
        styles={customStyles}
        components={{ DropdownIndicator }}
        {...props}
      />
      {position === 'bottom' && LabelField}
    </SelectStyle>
  );
};

Select.defaultProps = {
  as: 'div',
  labelPosition: 'top',
};

export default Select;
