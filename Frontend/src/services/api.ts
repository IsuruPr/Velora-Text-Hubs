
// API service for making HTTP requests

export const API_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Base fetch function with authorization
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['x-auth-token'] = token;
  } else {
    console.warn('No auth token found for request to:', endpoint);
  }
  
  console.log(`API Request: ${options.method || 'GET'} ${endpoint}`, {
    hasToken: !!token,
    headers: Object.keys(headers)
  });
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  // Better error handling with status code and error message
  if (!response.ok) {
    console.error(`API request failed: ${response.status} ${response.statusText} for ${endpoint}`);
    let errorMessage = 'Unknown error occurred';
    let errorData;
    
    try {
      errorData = await response.json();
      errorMessage = errorData.message || `API request failed with status ${response.status}`;
    } catch (e) {
      console.error('Failed to parse error response as JSON:', e);
    }
    
    console.error('API Error details:', errorData);
    throw new Error(errorMessage);
  }
  
  return response.json();
};

// API functions
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials: { email: string; password: string }) => 
      fetchWithAuth('/users/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    
    register: (userData: { name: string; email: string; password: string }) => 
      fetchWithAuth('/users/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    
    getProfile: () => fetchWithAuth('/users/profile'),
  },
  
  // Products endpoints
  products: {
    getAll: (category?: string) => {
      const queryString = category && category !== 'all' ? `?category=${category}` : '';
      return fetchWithAuth(`/products${queryString}`);
    },
    
    getById: (id: string) => fetchWithAuth(`/products/${id}`),
  },
  
  // Cart endpoints
  cart: {
    getItems: () => fetchWithAuth('/cart'),
    
    addItem: (productId: string, quantity: number) => 
      fetchWithAuth('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      }),
    
    updateQuantity: (productId: string, quantity: number) => 
      fetchWithAuth(`/cart/update/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      }),
    
    removeItem: (productId: string) => 
      fetchWithAuth(`/cart/remove/${productId}`, {
        method: 'DELETE',
      }),
      
    syncCart: (items: Array<{ productId: string; quantity: number }>) => 
      fetchWithAuth('/cart/sync', {
        method: 'POST',
        body: JSON.stringify({ items }),
      }),
  },
  
  // Orders endpoints
  orders: {
    create: (orderData: {
      products: Array<{ product: string; quantity: number }>;
      shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
      };
    }) => 
      fetchWithAuth('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      }),
    
    getMyOrders: () => fetchWithAuth('/orders/my-orders'),
  },
  
  // Admin endpoints
  admin: {
    // Products management
    deleteProduct: (id: string) => 
      fetchWithAuth(`/products/${id}`, {
        method: 'DELETE',
      }),
    
    updateProduct: (id: string, productData: any) => 
      fetchWithAuth(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      }),
      
    // Orders management  
    getOrders: () => fetchWithAuth('/orders'),
    
    updateOrderStatus: (orderId: string, status: string) => 
      fetchWithAuth(`/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
      
    // Users management
    getUsers: () => {
      console.log('Fetching users with token:', getToken() ? 'Token exists' : 'No token');
      return fetchWithAuth('/users');
    },
    
    // Get a single user by ID
    getUserById: (userId: string) => {
      console.log('Fetching user details with token:', getToken() ? 'Token exists' : 'No token', 'for userId:', userId);
      return fetchWithAuth(`/users/${userId}`);
    },
    
    // Get summary data for dashboard
    getSummary: () => {
      console.log('Fetching dashboard summary data');
      return fetchWithAuth('/admin/summary');
    },
  },
  
  // Quotations endpoints
  quotations: {
    create: (quotationData: {
      name: string;
      email: string;
      phoneNumber: string;
      businessAddress: string;
      companyName: string;
      industrialExperience: string;
      qualification: string;
      productDetails: string;
    }) => 
      fetchWithAuth('/quotations', {
        method: 'POST',
        body: JSON.stringify(quotationData),
      }),
    
    getAll: (includeRejected = false) => 
      fetchWithAuth(`/quotations?includeRejected=${includeRejected}`),
    
    getById: (id: string) => fetchWithAuth(`/quotations/${id}`),
    
    approve: (id: string) => 
      fetchWithAuth(`/quotations/${id}/approve`, {
        method: 'PUT',
      }),
    
    reject: (id: string) => 
      fetchWithAuth(`/quotations/${id}/reject`, {
        method: 'PUT',
      }),
    
    update: (id: string, quotationData: any) => 
      fetchWithAuth(`/quotations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(quotationData),
      }),
  },
  
  // Suppliers endpoints
  suppliers: {
    getAll: () => fetchWithAuth('/suppliers'),
    
    getApprovedQuotations: () => fetchWithAuth('/suppliers/approved-quotations'),
    
    create: (supplierData: {
      quotationId: string;
      quantity: number;
      productName: string;
      productImage: string;
      productCode: string;
    }) => 
      fetchWithAuth('/suppliers', {
        method: 'POST',
        body: JSON.stringify(supplierData),
      }),
    
    getById: (id: string) => fetchWithAuth(`/suppliers/${id}`),
    
    update: (id: string, supplierData: any) => 
      fetchWithAuth(`/suppliers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(supplierData),
      }),
    
    delete: (id: string) => 
      fetchWithAuth(`/suppliers/${id}`, {
        method: 'DELETE',
      }),
  },
};

export default api;
