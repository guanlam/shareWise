import React from "react";
import Select from "react-select";

// Generate options from an array of categories.
// Each category is assumed to have: id, name, icon, and color.
const generateCategoryOptions = (categories, iconMappings) =>
  categories.map((category) => ({
    label: (
      <div className="flex items-center gap-2">
        <div
          className="size-[2.5rem] flex items-center justify-center rounded-xl text-white"
          style={{ backgroundColor: category.color }}
        >
          {category.icon && iconMappings[category.icon]
            ? React.createElement(iconMappings[category.icon], { fontSize: "medium" })
            : "?"}
        </div>
        <span>{category.name}</span>
      </div>
    ),
    value: category.id,
    category, // attach the full category object for later use
  }));

// Custom SingleValue component displays the selected category (icon + name)
const CustomCategorySingleValue = ({ data, selectProps }) => {
  const { category } = data;
  const IconComponent =
    category.icon && selectProps.iconMappings[category.icon]
      ? selectProps.iconMappings[category.icon]
      : null;
  return (
    <div className="flex items-center gap-4 mt-[-1rem]">
      <div
        className="w-10 h-10 flex items-center justify-center rounded-xl text-white"
        style={{ backgroundColor: category.color }}
      >
        {IconComponent ? <IconComponent fontSize="medium" /> : "?"}
      </div>
      <span>{category.name}</span>
    </div>
  );
};

// Custom styles for react-select
const customStyles = (color) => ({
  
  control: (provided) => ({
    ...provided,
    border: "none",
    boxShadow: "none",
    background: "none",
    "&:hover": {
      border: "none",
    },
  }),
  menu: (provided) => ({
    ...provided,
    border: "none",
    borderRadius: "8px",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: "0",
  }),
  option: (provided, state) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: state.isSelected ? color : "transparent",
    color: 'black',
    border: state.isSelected ? "1px solid black" : "none",
    borderRadius: "1rem",
    "&:hover": {
      background: "#f0f0f0",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    background: "none",
   
    
  }),
});

const BudgetSelect = ({
  value,
  onChange,
  color,
  placeholder = "Choose Budget Category",
  isSearchable = false,
  categories, // Array of categories from API
  iconMappings, // Icon mapping for rendering icons
}) => {
  const options = generateCategoryOptions(categories, iconMappings);
  return (
    <Select
      options={options}
      onChange={onChange}
      getOptionLabel={(option) => option.label}
      placeholder={placeholder}
      value={value}
      isSearchable={isSearchable}
      // Pass extra props to custom components:
      iconMappings={iconMappings}
      color={color}
      components={{
        IndicatorSeparator: () => null,
        // Optionally, customize the dropdown layout:
        MenuList: (props) => (
          <div {...props.innerProps} className="grid grid-cols-1 sm:grid-cols-3">
            {props.children}
          </div>
        ),
        SingleValue: CustomCategorySingleValue,
      }}
      styles={customStyles(color)}
    />
  );
};

export default BudgetSelect;
