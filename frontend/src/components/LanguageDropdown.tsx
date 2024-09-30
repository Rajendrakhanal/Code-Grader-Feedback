import React from "react";
import Select from "react-select";
import { customStyles } from "../constants/customStyles";
import { languageOptions } from "../constants/languageOptions";
import { LanguageOption } from "../types/types";

interface LanguagesDropdownProps {
  onSelectChange: (selectedOption: LanguageOption) => void;
}

const LanguagesDropdown: React.FC<LanguagesDropdownProps> = ({
  onSelectChange,
}) => {
  return (
    <Select
      placeholder={`Filter By Category`}
      options={languageOptions}
      styles={customStyles}
      defaultValue={languageOptions[0]}
      onChange={(selectedOption) =>
        onSelectChange(selectedOption as LanguageOption)
      }
    />
  );
};

export default LanguagesDropdown;
