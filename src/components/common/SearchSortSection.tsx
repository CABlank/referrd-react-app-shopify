import SearchIcon from "../icons/SearchIcon";
import SortIcon from "../icons/SortIcon";
import React from "react";

type SearchSortSectionProps = {
  onSearch: (value: string) => void;
  onSort: (value: string) => void;
};

const SearchSortSection = ({ onSearch, onSort }: SearchSortSectionProps) => {
  const handleSearchChange = (event: { target: { value: string } }) => {
    onSearch(event.target.value);
  };

  const handleSortChange = (event: { target: { value: string } }) => {
    onSort(event.target.value);
  };

  return (
    <div className="w-full flex sm:flex-row justify-end items-center gap-4">
      <div className="flex items-center px-3 py-1.5 rounded-lg bg-white border  w-[70%] sm:w-auto">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search Referrals or Campaign"
          className="w-60 text-[.8rem] sm:text-base text-left text-black/50"
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex items-center px-0 py-2 justify-center rounded-lg bg-white w-[30%] sm:w-auto">
        <select
          className="text-[.8rem] sm:text-base font-medium text-left text-black/80 w-full"
          onChange={handleSortChange}
        >
          <option value="date">Sort by Date</option>
          <option value="referrer">Sort by Referrer</option>
          <option value="campaign">Sort by Campaign</option>
        </select>
      </div>
    </div>
  );
};

export default SearchSortSection;
