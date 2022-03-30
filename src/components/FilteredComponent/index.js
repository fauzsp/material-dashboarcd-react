import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
function FilteredComponent({ filterText, onFilter, onClear }) {
  return (
    <MDBox style={{"display":"flex"}} width="12rem" ml="auto">
      <MDInput
        placeholder="Search..."
        size="small"
        className="tableInput"
        fullWidth
        id="search"
        value={filterText}
      onChange={onFilter}
        type="text"
      />
       <button onClick={onClear} className="tableSearchButton">X</button>
    </MDBox>
  );
}

export default FilteredComponent;
