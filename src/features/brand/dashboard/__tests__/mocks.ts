// mocks.ts

export const mockMetrics = {
  totalClicks: 100,
  totalConversions: 50,
  conversionRate: 5,
  totalSpend: 1000,
  cpa: 20,
};

export const mockCampaigns = [
  {
    name: "Campaign 1",
    startDate: "2023-01-01T00:00:00Z",
    closeDate: "2023-02-01T00:00:00Z",
    amountFunded: 500,
    status: "Active",
  },
  {
    name: "Campaign 2",
    startDate: "2023-02-01T00:00:00Z",
    closeDate: "2023-03-01T00:00:00Z",
    amountFunded: 700,
    status: "Completed",
  },
];

export const mockCustomers = [
  {
    name: "John Doe",
    location: '{"city": "New York", "country": "USA"}',
    email: "john.doe@example.com",
    date_created: "2023-01-10T12:00:00Z",
  },
  {
    name: "Jane Smith",
    location: '{"city": "Los Angeles", "country": "USA"}',
    email: "jane.smith@example.com",
    date_created: "2023-02-15T12:00:00Z",
  },
];

export const mockConversions = [
  {
    date: "2023-01-10T12:00:00Z",
    referrer: "John Doe",
    conversion: "Signup",
    orders: 3,
  },
  {
    date: "2023-01-15T12:00:00Z",
    referrer: "Jane Smith",
    conversion: "Purchase",
    orders: 2,
  },
];

export const mockConversionColumns = [
  { title: "Date/Time", align: "center" },
  { title: "Referrer", align: "center" },
  { title: "Conversion", align: "center" },
  { title: "Orders", align: "center" },
];
