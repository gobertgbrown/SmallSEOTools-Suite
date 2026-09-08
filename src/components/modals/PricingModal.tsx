import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  X,
  Check,
  Crown,
  ShieldCheck,
  CreditCard,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react";

export const PricingModal: React.FC = () => {
  const { pricingModalOpen, setPricingModalOpen, user, triggerUpgrade } = useApp();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<"Pro Starter" | "Pro Business">("Pro Starter");
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");

  if (!pricingModalOpen) return null;

  const handleCheckout = () => {
    setIsProcessingCheckout(true);
    setTimeout(() => {
      setIsProcessingCheckout(false);
      triggerUpgrade(selectedPlan);
      setCheckoutSuccess(true);
      setTimeout(() => {
        setCheckoutSuccess(false);
        setPricingModalOpen(false);
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setPricingModalOpen(false)}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-900 to-slate-800 text-white text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-3">
            <Crown className="w-3.5 h-3.5" />
            <span>SmallSEOTools Pro Memberships</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Unlock Unlimited High-Speed Processing
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2">
            No ads, 30,000+ words per plagiarism check, batch file processing, and persistent cloud audit reports.
          </p>

          {/* Billing Cycle Switch */}
          <div className="inline-flex items-center bg-slate-800/80 p-1 rounded-full border border-slate-700 mt-6 text-xs">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                billingCycle === "monthly" ? "bg-emerald-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1 ${
                billingCycle === "yearly" ? "bg-emerald-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Yearly (Save 30%)</span>
              <span className="text-[10px] bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded-full font-extrabold">
                -30%
              </span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {checkoutSuccess ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Subscription Activated!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Congratulations! You are now subscribed to {selectedPlan}. Your limits have been expanded immediately.
            </p>
          </div>
        ) : (
          <div className="p-6 sm:p-8 space-y-8">
            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Free Plan */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  user.plan === "Free"
                    ? "border-emerald-500 bg-emerald-50/20"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Free Forever</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Basic utility access</p>
                  </div>
                  {user.plan === "Free" && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Current Plan
                    </span>
                  )}
                </div>
                <div className="text-2xl font-black text-slate-900 mt-4">$0</div>
                <span className="text-[11px] text-slate-400">No card required</span>

                <ul className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1,000 words per check</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Access to all 90+ basic tools</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <X className="w-3.5 h-3.5" />
                    <span>Ad-supported interface</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <X className="w-3.5 h-3.5" />
                    <span>Batch file processing</span>
                  </li>
                </ul>
              </div>

              {/* 2. Pro Starter */}
              <div
                onClick={() => setSelectedPlan("Pro Starter")}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                  selectedPlan === "Pro Starter"
                    ? "border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20 shadow-md"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Pro Starter</h3>
                    <p className="text-xs text-slate-500 mt-0.5">For writers & bloggers</p>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-4">
                  {billingCycle === "monthly" ? "$9.99" : "$6.99"}
                  <span className="text-xs font-normal text-slate-500"> / month</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  {billingCycle === "yearly" ? "Billed $83.88 annually" : "Billed monthly"}
                </span>

                <ul className="mt-4 space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>10,000 words per scan</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>100% Ad-Free Experience</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Unlimited Saved Cloud Reports</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Deep AI Rewriting Models</span>
                  </li>
                </ul>
              </div>

              {/* 3. Pro Business */}
              <div
                onClick={() => setSelectedPlan("Pro Business")}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedPlan === "Pro Business"
                    ? "border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20 shadow-md"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Pro Business</h3>
                    <p className="text-xs text-slate-500 mt-0.5">For agencies & teams</p>
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-4">
                  {billingCycle === "monthly" ? "$24.99" : "$17.99"}
                  <span className="text-xs font-normal text-slate-500"> / month</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  {billingCycle === "yearly" ? "Billed $215.88 annually" : "Billed monthly"}
                </span>

                <ul className="mt-4 space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>30,000 words per scan</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Batch URL & File Auditing</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>REST API Key Access</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>24/7 Dedicated Support</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Payment Gateway Checkout Form */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Secure Payment Gateway (256-Bit SSL)
                </h4>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      paymentMethod === "card"
                        ? "bg-white text-emerald-700 shadow-xs border border-slate-200"
                        : "text-slate-500"
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod("paypal")}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      paymentMethod === "paypal"
                        ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                        : "text-slate-500"
                    }`}
                  >
                    PayPal
                  </button>
                </div>
              </div>

              {paymentMethod === "card" ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-600 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Expires / CVC</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-1/2 p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs"
                      />
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-1/2 p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-2">
                  You will be safely routed to PayPal to approve your subscription with automatic renewal protection.
                </p>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cancel anytime with 1 click in your account settings.</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessingCheckout}
                  className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Crown className="w-4 h-4" />
                  <span>
                    {isProcessingCheckout
                      ? "Authorizing Payment..."
                      : `Subscribe to ${selectedPlan}`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
