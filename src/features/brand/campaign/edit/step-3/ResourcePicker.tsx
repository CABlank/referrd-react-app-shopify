import React, { useState, useEffect } from "react";
import axios from "axios";

interface ResourcePickerProps {
  initialQuery: string;
  resourceType: string;
  onSelection: (selection: any[]) => void;
  selectedResources: any[];
  accessToken: string;
}

const ResourcePicker: React.FC<ResourcePickerProps> = ({
  initialQuery,
  resourceType,
  onSelection,
  selectedResources,
  accessToken,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState(resourceType);
  const itemsPerPage = 5;

  useEffect(() => {}, [selectedResources]);

  const fetchResources = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`/api/shopify/products`, {
        params: {
          query: query || "",
          accessToken,
        },
      });
      setResources(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResourceSelection = (resource: any) => {
    const resourceToSave = {
      id: resource.id,
      title: resource.title,
      image: resource.image?.src || "https://via.placeholder.com/100",
    };

    if (selectedResources.some((r) => r.id === resource.id)) {
      onSelection(selectedResources.filter((r) => r.id !== resource.id));
    } else {
      onSelection([...selectedResources, resourceToSave]);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = resources.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Select Resource Type</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="product">Product</option>
          <option value="collection">Collection</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Search Resources</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${selectedType}s...`}
          autoComplete="off"
        />
      </div>

      <button
        onClick={fetchResources}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? `Loading ${selectedType}s...` : `Fetch ${selectedType}s`}
      </button>

      <div className="mt-4 bg-white p-4 rounded-lg shadow-lg">
        {currentItems.length > 0 ? (
          <div className="space-y-4">
            {currentItems.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center justify-between border p-4 rounded-lg shadow-sm"
              >
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  <img
                    src={resource.image?.src || "https://via.placeholder.com/100"}
                    alt={resource.image?.alt || resource.title}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>

                <div className="ml-4 flex-grow flex flex-col justify-center">
                  <p className="font-semibold text-base">{resource.title}</p>
                  <p className="text-sm text-gray-500">{resource.product_type}</p>
                </div>

                <div className="flex-shrink-0 ml-1">
                  <button
                    onClick={() => handleResourceSelection(resource)}
                    className={`px-2 py-2 rounded-lg ${
                      selectedResources.some((r) => r.id === resource.id)
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {selectedResources.some((r) => r.id === resource.id) ? "Deselect" : "Select"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No {selectedType}s found.</p>
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() =>
            currentPage < Math.ceil(resources.length / itemsPerPage) &&
            setCurrentPage(currentPage + 1)
          }
          disabled={currentPage >= Math.ceil(resources.length / itemsPerPage)}
          className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {selectedResources.length > 0 && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Selected Resources</h3>
          <ul>
            {selectedResources.map((resource) => (
              <li key={resource.id} className="py-1">
                {resource.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResourcePicker;
