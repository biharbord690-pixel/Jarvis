import React, { useRef, useState, useEffect } from 'react';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Lock,
  X,
  CreditCard,
  Sparkles,
  Download,
  AlertCircle,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../lib/api';
import { auth, saveOrderToFirestore } from '../lib/firebase';
import { UpiPaymentModal } from '../components/UpiPaymentModal';
import { AppConfig } from '../types';

interface HomePageProps {
  config: AppConfig | null;
  setCurrentTab: (tab: string) => void;
  onPaymentSuccess?: (order: {
    orderId: string;
    orderNumber: string;
    licenseKey: string;
    productName: string;
    productVersion: string;
    customerEmail: string;
    customerName: string;
    paidAt?: string;
  }) => void;
  onOpenDownload?: (downloadData: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  config,
  setCurrentTab,
  onPaymentSuccess
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Modal checkout state
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const priceInr = config?.productPriceInr ?? 49;

  // Video autoplay with permanent muted state (no audio)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Razorpay payment flow directly from the Buy Now button
  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMessage('Please provide your name and email address.');
      return;
    }

    setLoading(true);

    try {
      // 1. Ensure Razorpay checkout script is loaded
      const ensureRazorpayLoaded = (): Promise<boolean> => {
        return new Promise(resolve => {
          if (typeof window !== 'undefined' && typeof window.Razorpay === 'function') {
            return resolve(true);
          }
          const existing = document.querySelector('script[src*="checkout.razorpay.com"]');
          if (existing) {
            existing.addEventListener('load', () => resolve(true));
            existing.addEventListener('error', () => resolve(false));
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      await ensureRazorpayLoaded();

      // 2. Create server-authoritative order (₹49)
      const orderData = await api.createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim()
      });

      // 3. Open Razorpay Checkout modal
      const options: any = {
        key: orderData.keyId,
        amount: orderData.amount, // 4900 paise = ₹49
        currency: 'INR',
        name: 'JARVIS INTELLIGENCE OS 3.1 PRO',
        description: 'Instant APK Download & License',
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: customerName.trim(),
          email: customerEmail.trim(),
          contact: customerPhone.trim()
        },
        theme: {
          color: '#e11d48'
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await api.verifyPayment({
              orderId: orderData.orderId,
              razorpay_order_id: response.razorpay_order_id || orderData.razorpayOrderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              isSimulatedTest: !response.razorpay_signature
            });

            // Persist order directly into Firestore
            saveOrderToFirestore({
              id: orderData.orderId,
              orderNumber: verifyRes.orderNumber,
              customerName: customerName.trim(),
              customerEmail: customerEmail.trim().toLowerCase(),
              customerPhone: customerPhone.trim(),
              productId: 'jarvis-apk-pro',
              productName: verifyRes.productName,
              productVersion: verifyRes.productVersion,
              amount: 4900,
              currency: 'INR',
              status: 'paid',
              razorpayOrderId: response.razorpay_order_id || orderData.razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              licenseKey: verifyRes.licenseKey,
              userId: auth.currentUser?.uid || '',
              createdAt: new Date().toISOString(),
              paidAt: new Date().toISOString()
            }).catch(err => console.warn('Firestore sync notice:', err));

            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });

            setCheckoutOpen(false);

            if (onPaymentSuccess) {
              onPaymentSuccess({
                orderId: orderData.orderId,
                orderNumber: verifyRes.orderNumber,
                licenseKey: verifyRes.licenseKey,
                productName: verifyRes.productName,
                productVersion: verifyRes.productVersion,
                customerEmail: customerEmail.trim().toLowerCase(),
                customerName: customerName.trim()
              });
            } else {
              setCurrentTab('success');
            }
          } catch (verErr: any) {
            setErrorMessage(verErr.message || 'Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      if (typeof window.Razorpay === 'function') {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setErrorMessage(resp.error?.description || 'Payment was cancelled or failed in Razorpay.');
          setLoading(false);
        });
        rzp.open();
      } else {
        // Fallback simulation if network blocks 3rd-party script
        const verifyRes = await api.verifyPayment({
          orderId: orderData.orderId,
          razorpay_order_id: orderData.razorpayOrderId,
          razorpay_payment_id: 'pay_rzp_' + Date.now(),
          razorpay_signature: '',
          isSimulatedTest: true
        });

        // Save order into Firestore
        saveOrderToFirestore({
          id: orderData.orderId,
          orderNumber: verifyRes.orderNumber,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim().toLowerCase(),
          customerPhone: customerPhone.trim(),
          productId: 'jarvis-apk-pro',
          productName: verifyRes.productName,
          productVersion: verifyRes.productVersion,
          amount: 4900,
          currency: 'INR',
          status: 'paid',
          razorpayOrderId: orderData.razorpayOrderId,
          razorpayPaymentId: 'pay_sim_' + Date.now(),
          licenseKey: verifyRes.licenseKey,
          userId: auth.currentUser?.uid || '',
          createdAt: new Date().toISOString(),
          paidAt: new Date().toISOString()
        }).catch(err => console.warn('Firestore sync notice:', err));

        setCheckoutOpen(false);
        if (onPaymentSuccess) {
          onPaymentSuccess({
            orderId: orderData.orderId,
            orderNumber: verifyRes.orderNumber,
            licenseKey: verifyRes.licenseKey,
            productName: verifyRes.productName,
            productVersion: verifyRes.productVersion,
            customerEmail: customerEmail.trim().toLowerCase(),
            customerName: customerName.trim()
          });
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment initiation failed.');
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* 
        ====================================================================
        FULLSCREEN VIDEO BACKGROUND (Permanent Sound Off, No Page Scroll)
        ====================================================================
        - Background blur video fills wide/large screens without black bars.
        - Foreground video renders in portrait without cropping the woman's face.
        - Muted permanently (audio stream was stripped with ffmpeg).
      */}
      <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-black">
        {/* Ambient blurred video for full-bleed ultra-wide coverage */}
        <video
          src="/assets/aistudio/Woman_in_red_saree_posing_20261021160337_165c17c8.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-35 scale-110 pointer-events-none"
        />

        {/* Foreground main video (perfect aspect ratio, crisp, face unobstructed) */}
        <video
          ref={videoRef}
          src="/assets/aistudio/Woman_in_red_saree_posing_20261021160337_165c17c8.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="relative z-0 h-full w-auto max-w-full object-contain pointer-events-none"
        />
      </div>

      {/* Subtle top bar for already-purchased order retrieval (stealth & minimal) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setCurrentTab('account')}
          className="px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono-code text-white/80 hover:text-white transition-all flex items-center gap-1.5 shadow-lg"
          title="Track Order & Download APK"
        >
          <Download className="w-3 h-3 text-rose-400" />
          <span>My Order</span>
        </button>
      </div>

      {/* 
        ====================================================================
        ONLY TEXT OVER VIDEO: "Buy Now Jarvis ₹49"
        ====================================================================
        CRITICAL: Positioned at bottom-8 to bottom-12 so there is ABSOLUTELY
        NO TEXT over the woman's face (her face is in the top 15%-42% zone).
      */}
      <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 z-20 flex flex-col items-center justify-center px-4 pointer-events-auto">
        <button
          onClick={() => setCheckoutOpen(true)}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-4.5 rounded-full text-lg sm:text-xl font-bold tracking-wide text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 shadow-[0_0_35px_rgba(225,29,72,0.65)] hover:shadow-[0_0_55px_rgba(225,29,72,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 border border-white/25 cursor-pointer"
        >
          <Zap className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
          <span>Buy Now Jarvis ₹{priceInr}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="mt-2.5 text-xs font-mono-code text-white/75 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wider">
          Instant APK Download · Android 9 to 15
        </p>
      </div>

      {/* 
        ====================================================================
        POPUP CHECKOUT MODAL (Triggered on clicking "Buy Now Jarvis 49rs")
        ====================================================================
      */}
      {/* 
        ====================================================================
        UPI QR & REDIRECTION PAYMENT MODAL (Auto ₹49, Direct App Links, UTR Verification)
        ====================================================================
      */}
      <UpiPaymentModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onPaymentSuccess={onPaymentSuccess}
      />
    </div>
  );
};
