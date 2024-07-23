import './Filter.css'
const Filter = ({ filterText, onFilterChange }) => {
    return (
      <form className="search">
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