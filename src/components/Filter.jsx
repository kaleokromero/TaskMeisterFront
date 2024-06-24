const Filter = ({ filterText, onFilterChange }) => {
    return (
      <form>
       <input
       type="text"
       placeholder="Search..."
       value={filterText}
       onChange={(e) => {
       onFilterChange(e.target.value)}}/>
      </form>
    )
  }
  export default Filter