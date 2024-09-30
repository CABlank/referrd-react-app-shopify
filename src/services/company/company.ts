const API_URL = process.env.NEXT_PUBLIC_API_URL;

//  interfaces for the data structures
export interface Company {
  id?: number;
  name: string;
  domain: string;
  logo: string | File | null;
  logoUrl?: string;
  date_created: string | number | Date;
  UUID: string;
}

// Helper function to make API requests
const fetchFromAPI = async <T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type":
      options.body instanceof FormData
        ? "multipart/form-data"
        : "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  const data = await response.json();
  return data.data;
};

// Fetch all companies
export const fetchCompanies = (token: string): Promise<Company[]> =>
  fetchFromAPI<Company[]>("/items/company", token);

// Fetch a specific company by ID
export const fetchCompany = async (
  id: number,
  token: string
): Promise<Company> => {
  const company = await fetchFromAPI<Company>(`/items/company/${id}`, token);

  if (company.logo) {
    const logoResponse = await fetch(`${API_URL}/files/${company.logo}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!logoResponse.ok) {
      throw new Error("Failed to fetch logo");
    }

    const logoData = await logoResponse.json();
    company.logoUrl = `${API_URL}/assets/${company.logo}/${logoData.data.filename_download}?access_token=${token}`;
  }

  return company;
};

// Create a new company
export const createCompany = (company: Company, token: string): Promise<Company> =>
  fetchFromAPI<Company>("/items/company", token, {
    method: "POST",
    body: JSON.stringify(company),
  });


// Update an existing company
export const updateCompany = (company: Company, token: string): Promise<void> =>
  fetchFromAPI<void>(`/items/company/${company.id}`, token, {
    method: "PATCH",
    body: JSON.stringify(company),
  });

// Delete a company
export const deleteCompany = (id: number, token: string): Promise<void> =>
  fetchFromAPI<void>(`/items/company/${id}`, token, {
    method: "DELETE",
  });

// Upload a file
export const uploadFile = async (
  file: File,
  token: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  const data = await response.json();
  return data.data.id; // Return the ID of the uploaded file
};

// Fetch companies with their logos
export const fetchCompaniesWithLogo = async (
  token: string
): Promise<Company[]> => {
  const companies = await fetchCompanies(token);

  const companiesWithLogo = await Promise.all(
    companies.map(async (company) => {
      if (company.logo) {
        try {
          const logoResponse = await fetch(`${API_URL}/files/${company.logo}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!logoResponse.ok) {
            throw new Error("Failed to fetch logo");
          }

          const logoData = await logoResponse.json();
          company.logoUrl = `${API_URL}/assets/${company.logo}/${logoData.data.filename_download}?access_token=${token}`;
        } catch (error) {
          console.error(
            `Error fetching logo for company ${company.id}:`,
            error
          );
        }
      }
      return company;
    })
  );

  return companiesWithLogo;
};

// Fetch the URL of the first company
export const fetchCompanyUrl = async (token: string): Promise<string> => {
  const companies = await fetchCompanies(token);

  if (companies.length === 0) {
    console.error("No companies found");
    throw new Error("No companies found");
  }

  const company = companies[0]; // Get the first company
  return company.domain; // Return the company's domain (URL)
};

// services/company.ts
// Fetch the URLs of all companies
export const fetchCompanyUrls = async (token: string): Promise<string[]> => {
  const response = await fetch(`${API_URL}/items/company`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch company URLs`);
  }

  const responseData = await response.json();

  // Check if response data is structured as expected
  if (!responseData.data || !Array.isArray(responseData.data)) {
    throw new Error("Invalid response format");
  }

  // Extract the domain from each company object
  const companyDomains = responseData.data.map(
    (company: Company) => company.domain
  );

  return companyDomains;
};

// Fetch the company id
export const fetchCompanyId = async (token: string): Promise<string> => {
  const companies = await fetchCompanies(token);

  if (companies.length === 0) {
    console.error("No companies found");
    throw new Error("No companies found");
  }

  const company = companies[0]; // Get the first company
  return company.UUID!; // Return the company's id
};
