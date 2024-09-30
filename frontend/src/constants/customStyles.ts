import { StylesConfig } from "react-select";

interface OptionType {
  value: string;
  label: string;
}

export const customStyles: StylesConfig<OptionType, false> = {
  control: (styles) => ({
    ...styles,
    width: "100%",
    maxWidth: "14rem",
    minWidth: "12rem",
    borderRadius: "5px",
    color: "#fff", // White text
    fontSize: "0.9rem",
    lineHeight: "1.75rem",
    backgroundColor: "#000", // Black background
    cursor: "pointer",
    border: "2px solid #fff", // White border
    boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)", // White shadow in all directions
    transition: "none", // No transition (removing smooth effects)
  }),
  option: (styles, { isSelected }) => ({
    ...styles,
    color: isSelected ? "#000" : "#fff", // Black text when selected, white otherwise
    backgroundColor: isSelected ? "#fff" : "#000", // White background when selected, black otherwise
    fontSize: "0.8rem",
    lineHeight: "1.75rem",
    cursor: "pointer",
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "#000", // Black background for the dropdown
    maxWidth: "14rem",
    border: "2px solid #fff", // White border
    borderRadius: "5px",
    boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)", // White shadow in all directions
    transition: "none", // No transition
  }),
  placeholder: (defaultStyles) => ({
    ...defaultStyles,
    color: "#fff", // White placeholder text
    fontSize: "0.8rem",
    lineHeight: "1.75rem",
  }),
  singleValue: (defaultStyles) => ({
    ...defaultStyles,
    color: "#fff", // White text for the selected value
  }),
};
