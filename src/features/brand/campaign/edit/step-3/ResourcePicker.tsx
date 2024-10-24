import React, { useState, useEffect } from "react";
import axios from "axios";
import SmallSpinner from "@/components/common/SmallSpinner"; // Assuming you have a spinner component

interface ResourcePickerProps {
  initialQuery: string;
  resourceType: string;
  onSelection: (selection: any[]) => void;
  selectedResources: any[];
  accessToken: string;
  appliesTo?: string;
}

const ResourcePicker: React.FC<ResourcePickerProps> = ({
  initialQuery,
  resourceType,
  onSelection,
  selectedResources,
  accessToken,
  appliesTo,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState<number[]>([]); // Track which collections are fetching products
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {}, [selectedResources]);

  const fetchResources = async () => {
    setLoading(true);

    try {
      let response;
      if (resourceType === "product") {
        response = await axios.get(`/api/shopify/products`, {
          params: {
            query: query || "",
            accessToken,
          },
        });
      } else if (resourceType === "collection") {
        response = await axios.get(`/api/shopify/collections`, {
          params: {
            query: query || "",
            accessToken,
          },
        });
      }

      if (response) {
        setResources(response.data);
      }
    } catch (error) {
      console.error(`Error fetching ${resourceType}s:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionSelection = async (collectionId: number) => {
    // Show spinner for this specific collection
    setFetchingProducts((prev) => [...prev, collectionId]);

    try {
      const response = await axios.get(`/api/shopify/products-from-collection`, {
        params: {
          collectionId,
          accessToken,
        },
      });

      const products = response.data;

      // Merge the newly fetched products into selectedResources without duplicates
      const updatedSelection = [...selectedResources, ...products].filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i
      );

      onSelection(updatedSelection); // Update selected products
    } catch (error) {
      console.error("Error fetching products from collection:", error);
    } finally {
      // Remove the collection from fetching state
      setFetchingProducts((prev) => prev.filter((id) => id !== collectionId));
    }
  };

  const handleResourceSelection = (resource: any) => {
    const resourceToSave = {
      id: resource.id,
      title: resource.title,
      image: resource.image?.src || "https://via.placeholder.com/100",
    };

    if (resourceType === "collection") {
      // If the selected resource is a collection, fetch its products
      if (!fetchingProducts.includes(resource.id)) {
        handleCollectionSelection(resource.id);
      }
    } else {
      // Otherwise, handle product selection normally
      if (selectedResources.some((r) => r.id === resource.id)) {
        onSelection(selectedResources.filter((r) => r.id !== resource.id));
      } else {
        onSelection([...selectedResources, resourceToSave]);
      }
    }
  };

  const handleRemoveSelectedResource = (id: number) => {
    onSelection(selectedResources.filter((resource) => resource.id !== id));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = resources.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages based on the number of resources and items per page
  const totalPages = Math.ceil(resources.length / itemsPerPage);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Left Column: Resource Fetching and Display */}
      <div>
        {appliesTo !== "all_products" && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">{`Search ${resourceType}s...`}</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${resourceType}s...`}
                autoComplete="off"
              />
            </div>

            <button
              onClick={fetchResources}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? `Loading ${resourceType}s...` : `Fetch ${resourceType}s`}
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
                        <p className="text-sm text-gray-500">{resource.product_type || ""}</p>
                      </div>

                      <div className="flex-shrink-0 ml-1">
                        <button
                          onClick={() => handleResourceSelection(resource)}
                          className={`px-2 py-2 rounded-lg ${
                            selectedResources.some((r) => r.id === resource.id)
                              ? "bg-red-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                          disabled={fetchingProducts.includes(resource.id)}
                        >
                          {fetchingProducts.includes(resource.id) ? (
                            <SmallSpinner /> // Spinner while fetching products for the collection
                          ) : selectedResources.some((r) => r.id === resource.id) ? (
                            "Deselect"
                          ) : (
                            "Select"
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No {resourceType}s found.</p>
              )}
            </div>

            {/* Page numbers for navigation */}
            <div className="mt-4 flex justify-center space-x-2">
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`px-3 py-1 rounded-lg ${
                    number === currentPage ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right Column: Selected Resources */}
      <div>
        {selectedResources.length > 0 && (
          <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">{`Selected products...`}</h3>
            <ul>
              {selectedResources.map((resource) => (
                <li key={resource.id} className="py-1 flex justify-between items-center">
                  <span>{resource.title}</span>
                  <button
                    onClick={() => handleRemoveSelectedResource(resource.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded-lg"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcePicker;
