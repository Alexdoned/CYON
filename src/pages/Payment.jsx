import React, { useState, useEffect } from 'react';
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { initScrollAnimations, AnimatedSection } from '../utils/animations.jsx';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  const [registration, setRegistration] = useState(null);
  const [diocesanAccount, setDiocesan] = useState(null);
  const [loadingDiocesan, setLoadingDiocesan] = useState(true);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const regId = urlParams.get('registrationId') || localStorage.getItem('pendingRegistrationId');

    if (regId) {
      setRegistrationId(regId);
      fetchRegistrationAndDiocesan(regId);
    } else {
      setError('No registration found. Please complete registration first.');
      setLoadingDiocesan(false);
    }

    initScrollAnimations();
  }, []);

  const fetchRegistrationAndDiocesan = async (regId) => {
    try {
      // Fetch registration details
      const regResponse = await axios.get(`${API_URL}/register/${regId}`);
      const reg = regResponse.data.data;
      setRegistration(reg);

      // Fetch Jalingo diocesan account (single account for all payments)
      const diocResponse = await axios.get(`${API_URL}/diocesan/jalingo`);
      setDiocesan(diocResponse.data.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoadingDiocesan(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      const paymentData = {
        registrationId,
        amount: 50.00,
        paymentMethod,
        email: formData.email,
        ...(paymentMethod === 'card' && {
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          cardholderName: formData.cardholderName
        })
      };

      const response = await axios.post(`${API_URL}/payment/process`, paymentData);

      if (response.data.message === 'Payment processed successfully') {
        setIsSuccess(true);
        // Clear any pending registration ID
        localStorage.removeItem('pendingRegistrationId');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (error && !registrationId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Required</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/register'}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your registration payment has been processed successfully.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <AnimatedSection animation="animate-on-scroll-scale">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift">
            {/* Header */}
            <div className="bg-green-600 text-white p-6">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                Registration Payment
              </h1>
              <p className="mt-2 text-green-100">Complete your registration by making the payment</p>
            </div>

            {/* Payment Form */}
            <div className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Payment Details</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-700">Registration Fee</span>
                    <span className="font-semibold text-gray-900">$50.00</span>
                  </div>
                </div>
              </div>

              {/* Diocesan Account Information */}
              {loadingDiocesan ? (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-600">
                  Loading diocesan account information...
                </div>
              ) : diocesanAccount ? (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Pay to Diocesan Account</h2>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">Diocese:</span>
                        <span className="text-gray-900 font-semibold">{diocesanAccount.dioceseName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">Account Holder:</span>
                        <span className="text-gray-900">{diocesanAccount.accountHolderName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">Account Number:</span>
                        <span className="text-gray-900 font-mono">{diocesanAccount.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">Bank:</span>
                        <span className="text-gray-900">{diocesanAccount.bankName}</span>
                      </div>
                      {diocesanAccount.swiftCode && (
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">SWIFT Code:</span>
                          <span className="text-gray-900">{diocesanAccount.swiftCode}</span>
                        </div>
                      )}
                      {diocesanAccount.routingNumber && (
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">Routing Number:</span>
                          <span className="text-gray-900">{diocesanAccount.routingNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              <form onSubmit={handlePayment} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Credit/Debit Card</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">PayPal</span>
                    </label>
                  </div>
                </div>

                {/* Card Details */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        name="cardholderName"
                        value={formData.cardholderName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* PayPal Placeholder */}
                {paymentMethod === 'paypal' && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You will be redirected to PayPal to complete your payment.</p>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                    >
                      Continue with PayPal
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                {paymentMethod === 'card' && (
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        Pay $50.00
                      </>
                    )}
                  </button>
                )}
              </form>

              {/* Security Note */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Your payment information is secure and encrypted.</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Payment;