import React from 'react';
import Select from 'react-select';

// Generate options from the provided iconList prop
const generateIconOptions = (iconList) =>
  Object.keys(iconList).map((iconName) => ({
    label: (
      <div className="all-center">
        {React.createElement(iconList[iconName], { fontSize: 'medium' })}
      </div>
    ),
    value: iconName,
  }));

// Custom SingleValue component to display the selected icon with the background color.
// We pass the iconList through selectProps.
const CustomSingleValue = ({ data, selectProps }) => {
  const IconComponent = selectProps.iconList[data.value];
  return (
    <div
      className="size-[2.5rem] all-center mt-[-1.5rem] rounded-xl text-white"
      style={{ backgroundColor: selectProps.color }}
    >
      <IconComponent fontSize="medium" />
    </div>
  );
};

// Custom styles for react-select, using the provided color for highlighting.
const customStyles = (color) => ({
  control: (provided) => ({
    ...provided,
    border: 'none',
    boxShadow: 'none',
    background: 'none',
    '&:hover': {
      border: 'none',
    },
  }),
  menu: (provided) => ({
    ...provided,
    border: 'none',
    
  }),
  menuList: (provided) => ({
    ...provided,
    padding: '0',
  }),
  option: (provided, state) => ({
    ...provided,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: state.isSelected ? color : 'transparent',
    color: state.isSelected ? 'white' : 'black',
    '&:hover': {
      background: '#f0f0f0',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    background: 'none',
  }),
});

// The reusable IconSelect component.
// It accepts iconList (an object mapping icon names to components) as a prop.
const IconSelect = ({
  value,
  onChange,
  color,
  placeholder = 'Choose icon',
  isSearchable = false,
  iconList,
}) => {
  const options = generateIconOptions(iconList);
  return (
    <Select
      options={options}
      onChange={onChange}
      getOptionLabel={(option) => option.label}
      placeholder={placeholder}
      value={value}
      isSearchable={isSearchable}
      // Pass iconList and color as additional props via selectProps.
      iconList={iconList}
      color={color}
      components={{
        IndicatorSeparator: () => null,
        MenuList: (props) => (
          <div {...props.innerProps} className="grid grid-cols-4 sm:grid-cols-6">
            {props.children}
          </div>
        ),
        SingleValue: CustomSingleValue,
      }}
      styles={customStyles(color)}
    />
  );
};

export default IconSelect;
