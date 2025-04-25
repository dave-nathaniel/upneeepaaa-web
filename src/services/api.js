// API Service for UpNeeePaaa
// This file contains the base configuration for API calls and utility functions

const API_BASE_URL = 'https://upneeepaaa.com/API/api/v1';
// const API_BASE_URL = 'http://localhost:8000/api/v1';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  const data = await response.json();
  // Return the data property if it exists, otherwise return the entire response
  return data.data !== undefined ? data.data : data;
};

// Authentication API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/user/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (data.status !== 'success') {
      throw new Error(data.message || 'Authentication failed');
    }
    return {
      token: data.data.access,
      refreshToken: data.data.refresh,
      user: data.data.user
    };
  },

  signup: async (userData) => {
    // Transform the userData to match the expected format
    const requestData = {
      email: userData.email,
      name: userData.name,
      password: userData.password,
      phone: userData.phone
    };

    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    return handleResponse(response);
  },

  refreshToken: async (refreshToken) => {
    const response = await fetch(`${API_BASE_URL}/user/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    const data = await response.json();
    if (data.status !== 'success') {
      throw new Error(data.message || 'Token refresh failed');
    }
    return {
      token: data.data.access,
      refreshToken: data.data.refresh
    };
  },

  resetPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/user/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },
};

// Bill Payment API calls
export const billAPI = {
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/bills/bill-categories`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return handleResponse(response);
  },

  getBillers: async (categorySlug) => {
    const response = await fetch(`${API_BASE_URL}/bills/billers?category=${categorySlug}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return handleResponse(response);
  },

  getPackages: async (billerSlug) => {
    const response = await fetch(`${API_BASE_URL}/bills/bill-items/${billerSlug}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return handleResponse(response);
  },

  verifyCustomer: async (data) => {
    const response = await fetch(`${API_BASE_URL}/bills/validate-customer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({
        biller_id: data.billerId,
        item_id: data.packageId,
        customer_id: data.accountNumber
      }),
    });
    return handleResponse(response);
  },
};

// Payment API calls
export const paymentAPI = {
  getPaymentGateways: async () => {
    const response = await fetch(`${API_BASE_URL}/payments/payment-gateways`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return handleResponse(response);
  },

  createPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/payments/create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({
        item_id: paymentData.packageId,
        payment_gateway_id: paymentData.paymentGatewayId || 1, // Default to first gateway if not specified
        customer_id: paymentData.details,
        amount: parseFloat(paymentData.amount)
      }),
    });
    return handleResponse(response);
  },

  getTransactionHistory: async (filters = {}) => {
    const { status, page = 1, pageSize = 10 } = filters;
    let url = `${API_BASE_URL}/payments/transaction-history?page=${page}&page_size=${pageSize}`;
    if (status) {
      url += `&status_filter=${status}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return handleResponse(response);
  },

  // Subscription management
  getSubscriptionPlans: async () => {
    const response = await fetch(`${API_BASE_URL}/payments/subscription-plans`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return handleResponse(response);
  },

  createSubscription: async (subscriptionData) => {
    const response = await fetch(`${API_BASE_URL}/payments/create-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({
        bill_item_id: subscriptionData.billItemId,
        plan_id: subscriptionData.planId
      }),
    });
    return handleResponse(response);
  },

  getUserSubscriptions: async () => {
    const response = await fetch(`${API_BASE_URL}/payments/user-subscriptions`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return handleResponse(response);
  },

  cancelSubscription: async (subscriptionId) => {
    const response = await fetch(`${API_BASE_URL}/payments/cancel-subscription/${subscriptionId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return handleResponse(response);
  },

  reactivateSubscription: async (subscriptionId) => {
    const response = await fetch(`${API_BASE_URL}/payments/reactivate-subscription/${subscriptionId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return handleResponse(response);
  },
};

// User data API calls
export const userAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData) => {
    // Transform the profileData to match the expected format
    const requestData = {
      firstname: profileData.name ? profileData.name.split(' ')[0] : profileData.firstname,
      lastname: profileData.name ? profileData.name.split(' ').slice(1).join(' ') : profileData.lastname,
      phone: profileData.phone,
      date_of_birth: profileData.dateOfBirth || profileData.date_of_birth,
      address: profileData.address
    };

    const response = await fetch(`${API_BASE_URL}/user/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify(requestData),
    });
    return handleResponse(response);
  },

  changePassword: async (passwordData) => {
    const response = await fetch(`${API_BASE_URL}/user/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      }),
    });
    return handleResponse(response);
  },
};

// Dashboard data API calls
export const dashboardAPI = {
  getUsageData: async (timeRange) => {
    const response = await fetch(`${API_BASE_URL}/dashboard/usage?timeRange=${timeRange}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return handleResponse(response);
  },

  getTransactions: async () => {
    // Use the paymentAPI.getTransactionHistory function with default parameters
    return paymentAPI.getTransactionHistory();
  },
};

export default {
  auth: authAPI,
  bill: billAPI,
  user: userAPI,
  dashboard: dashboardAPI,
  payment: paymentAPI,
};
