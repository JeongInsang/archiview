import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useEffect, useState } from "react";
import { getCompanyList } from "../../api/commonsAPI";
import { useSelector, useDispatch } from "react-redux";
import { updateCompany } from "../../store/slice/replySlice";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CheckboxesTags() {
  const [companies, setCompanies] = useState([]);

  const { selectedCompany } = useSelector((state) => state.reply);
  const dispatch = useDispatch();

  function handlebox(value) {
    let companyName = "";
    let companyId = "";
    if (value !== null) {
      companyName = value.name;
      companyId = value.id;
    }
    dispatch(
      updateCompany({
        selectedCompany: {
          id: companyId,
          name: companyName,
        },
      })
    );
  }

  useEffect(() => {
    const getCompany = async () => {
      await getCompanyList((res) => {
        setCompanies(res.data.data);
      });
    };
    getCompany();
  }, []);

  return (
    <Autocomplete
      id="company"
      freeSolo
      options={companies}
      getOptionLabel={(option) => option.name}
      value={{
        id: selectedCompany.id || "",
        name: selectedCompany.name || "",
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            checked={selected || option.name == selectedCompany.name}
          />
          {option.name}
        </li>
      )}
      onChange={(e, value) => {
        handlebox(value);
      }}
      sx={{
        width: 462,
        paddingBottom: "9px",
        padding: "10px",
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="회사명"
          placeholder="회사명을 입력해주세요"
        />
      )}
    />
  );
}
