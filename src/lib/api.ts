import { AppConfig, Order, Release, AdminMetrics, AuditLog } from '../types';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const api = {
  // Fetch system config and active release
  async getConfig(): Promise<AppConfig> {
    const res = await fetch('/api/config');
    if (!res.ok) throw new Error('Failed to load system configuration');
    return res.json();
  },

  // Create payment order (server-authoritative pricing)
  async createOrder(data: { customerName: string; customerEmail: string; customerPhone?: string }): Promise<{
    orderId: string;
    orderNumber: string;
    razorpayOrderId: string;
    amount: number;
    basePrice: number;
    taxAmount: number;
    totalInr: number;
    currency: string;
    keyId: string;
    isTestMode: boolean;
  }> {
    const res = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create payment order');
    }
    return res.json();
  },

  // Verify payment signature
  async verifyPayment(payload: {
    orderId: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    isSimulatedTest?: boolean;
  }): Promise<{
    success: boolean;
    orderNumber: string;
    licenseKey: string;
    productName: string;
    productVersion: string;
  }> {
    const res = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Payment verification failed');
    }
    return res.json();
  },

  // Dynamic UPI QR generator
  async generateUpiQr(orderId?: string, amount: number = 49): Promise<{
    success: boolean;
    upiUri: string;
    phonepeUri: string;
    gpayUri: string;
    paytmUri: string;
    qrDataUrl: string;
    vpa: string;
    payeeName: string;
    accountHolder: string;
    bankName: string;
    amount: number;
  }> {
    const res = await fetch('/api/payment/generate-upi-qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, amount })
    });
    if (!res.ok) throw new Error('Failed to generate UPI QR code');
    return res.json();
  },

  // Verify UPI Payment with 12-digit UTR reference number
  async verifyUpiPayment(data: {
    orderId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    utrNumber: string;
  }): Promise<{
    success: boolean;
    message: string;
    orderId: string;
    orderNumber: string;
    licenseKey: string;
    productName: string;
    productVersion: string;
    customerEmail: string;
    customerName: string;
    utrNumber: string;
    mediafireUrl: string;
  }> {
    const res = await fetch('/api/payment/upi-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to verify UPI payment');
    }
    return res.json();
  },

  // Fetch Order
  async getOrder(orderId: string): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  // Fetch customer orders by email
  async getCustomerOrders(email: string): Promise<Order[]> {
    const res = await fetch(`/api/customer/orders?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error('Failed to retrieve customer orders');
    return res.json();
  },

  // Request secure time-limited download token
  async requestDownloadToken(orderId: string, email?: string): Promise<{
    downloadUrl: string;
    mediafireUrl?: string;
    expiresAt: number;
    validMinutes: number;
    version: string;
    fileName: string;
    fileSizeMb: number;
    sha256: string;
  }> {
    const res = await fetch('/api/download/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, email })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Download authorization failed');
    }
    return res.json();
  },

  // Submit Support Ticket
  async submitSupportTicket(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    orderNumber?: string;
  }): Promise<{ success: boolean; ticketId: string; message: string }> {
    const res = await fetch('/api/support/ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit ticket');
    return res.json();
  },

  // Admin authentication
  async adminLogin(secretKey: string): Promise<{ success: boolean; token: string }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secretKey })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Authentication rejected');
    }
    return res.json();
  },

  // Admin Dashboard Overview
  async getAdminOverview(token: string): Promise<{
    metrics: AdminMetrics;
    settings: any;
    recentOrders: Order[];
    releases: Release[];
    recentAuditLogs: AuditLog[];
  }> {
    const res = await fetch('/api/admin/overview', {
      headers: { 'X-Admin-Token': token }
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  // Admin toggle emergency release killswitch
  async toggleEmergencyRelease(id: string, token: string): Promise<any> {
    const res = await fetch(`/api/admin/releases/${id}/toggle-emergency`, {
      method: 'POST',
      headers: { 'X-Admin-Token': token }
    });
    if (!res.ok) throw new Error('Failed to toggle release');
    return res.json();
  },

  // Admin update settings
  async updateAdminSettings(settings: any, token: string): Promise<any> {
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': token
      },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // Admin add release
  async createRelease(data: any, token: string): Promise<Release> {
    const res = await fetch('/api/admin/releases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': token
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create release');
    return res.json();
  },

  // Admin simulate test webhook
  async simulateWebhook(orderId: string, token: string): Promise<any> {
    const res = await fetch('/api/admin/test-webhook-simulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': token
      },
      body: JSON.stringify({ orderId })
    });
    if (!res.ok) throw new Error('Failed to simulate webhook');
    return res.json();
  },

  // Admin get Razorpay credentials status
  async getRazorpayKeys(token: string): Promise<{
    hasKeys: boolean;
    keyId: string;
    maskedSecret: string;
    hasWebhook: boolean;
    mode: 'live' | 'test' | 'not_configured';
  }> {
    const res = await fetch('/api/admin/razorpay-keys', {
      headers: { 'X-Admin-Token': token }
    });
    if (!res.ok) throw new Error('Failed to fetch credentials status');
    return res.json();
  },

  // Owner configure Razorpay credentials directly (stored safely in backend server only)
  async configureGateway(data: { keyId: string; keySecret: string }): Promise<{
    success: boolean;
    verified: boolean;
    message: string;
    keyId: string;
    mode: 'live' | 'test';
  }> {
    const res = await fetch('/api/gateway/configure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to configure Razorpay gateway');
    }
    return res.json();
  },

  // Admin save & verify Razorpay credentials
  async saveRazorpayKeys(data: { keyId: string; keySecret: string; webhookSecret?: string }, token: string): Promise<{
    success: boolean;
    verified: boolean;
    message: string;
    keyId: string;
    mode: 'live' | 'test';
  }> {
    const res = await fetch('/api/admin/razorpay-keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': token
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to save credentials');
    }
    return res.json();
  },

  async getMediafireLink(token: string): Promise<{ mediafireDownloadUrl: string }> {
    const res = await fetch('/api/admin/mediafire-link', {
      headers: { 'X-Admin-Token': token }
    });
    if (!res.ok) throw new Error('Failed to retrieve MediaFire link');
    return res.json();
  },

  async saveMediafireLink(mediafireDownloadUrl: string, token: string): Promise<{
    success: boolean;
    message: string;
    mediafireDownloadUrl: string;
  }> {
    const res = await fetch('/api/admin/mediafire-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': token
      },
      body: JSON.stringify({ mediafireDownloadUrl })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update MediaFire link');
    }
    return res.json();
  }
};


