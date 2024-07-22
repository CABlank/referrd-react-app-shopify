import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="w-full flex justify-between flex-col lg:flex-row items-center px-8 py-3 bg-gray-200 border-t border-gray-300 sticky left-0 lg:left-unset">
      <p className="text-sm font-medium text-gray-600">
        Showing {Math.min(totalItems, currentPage * itemsPerPage)} of{" "}
        {totalItems} results
      </p>
      <div className="flex items-center justify-center gap-2">
        <button
          className={`p-2 rounded-full ${
            currentPage === 1 ? "text-gray-400" : "text-gray-600"
          } hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <FaArrowLeft />
        </button>
        <div className="flex items-center">
          {Array.from({ length: totalPages }, (_, i) => (
            <span
              key={i}
              className={`block w-2 h-2 rounded-full ${
                i + 1 === currentPage ? "bg-gray-600" : "bg-gray-400"
              } mx-1`}
            ></span>
          ))}
        </div>
        <button
          className={`p-2 rounded-full ${
            currentPage === totalPages ? "text-gray-400" : "text-gray-600"
          } hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
