export interface Product {
  id: string;
  name: string;
  tagline: string;
  creator: string;
  creatorInstagram: string;
  priceInr: number;
  taxPercent: number;
  activeVersion: string;
  minAndroid: string;
  testedDevices: string[];
  packageSize: string;
  architecture: string;
}

export interface Release {
  id: string;
  version: string;
  buildNumber: string;
  releaseDate: string;
  fileSizeMb: number;
  fileName: string;
  sha256: string;
  minAndroidVersion: string;
  targetAndroidVersion: string;
  architectures: string[];
  changelog: string[];
  isActive: boolean;
  isEmergencyDisabled: boolean;
  downloadCount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  productId: string;
  productName: string;
  productVersion: string;
  amount: number; // in paise
  currency: string;
  status: 'created' | 'paid' | 'failed' | 'refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentMethod?: 'UPI_QR' | 'RAZORPAY';
  utrNumber?: string;
  verifiedByOwner?: boolean;
  licenseKey: string;
  createdAt: string;
  paidAt?: string;
}

export interface UpiConfig {
  vpa: string;
  payeeName: string;
  accountHolder: string;
  bankName: string;
  qrAssetUrl: string;
  amount: number;
}

export interface AppConfig {
  appName: string;
  creatorName: string;
  creatorInstagram: string;
  productPriceInr: number;
  taxRatePercent: number;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  isKeylessMode: boolean;
  supportEmail: string;
  razorpayKeyId: string;
  hasRealKeys?: boolean;
  paymentMode: 'test' | 'live' | 'not_configured';
  activeRelease: Release | null;
  upiConfig?: UpiConfig;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  status: 'available' | 'planned';
  permissionsRequired?: string[];
  notes?: string;
  iconName?: string;
}

export interface FeatureCategory {
  id: string;
  title: string;
  kicker: string;
  description: string;
  items: FeatureItem[];
}

export interface AdminMetrics {
  totalOrders: number;
  paidOrdersCount: number;
  totalRevenueInr: number;
  totalDownloads: number;
  activeReleasesCount: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}
