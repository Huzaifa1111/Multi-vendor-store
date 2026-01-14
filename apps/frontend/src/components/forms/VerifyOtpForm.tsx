'use client';

import { useState, useEffect, useRef } from 'react';

interface VerifyOtpFormProps {
  email: string;
  onVerify: (email: string, otp: string) => Promise<void>;
  onResend: (email: string) => Promise<void>;
}

export default function VerifyOtpForm({ email, onVerify, onResend }: VerifyOtpFormProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const pastedArray = pastedData.split('');

    const newOtp = [...otp];
    pastedArray.forEach((char, index) => {
      if (index < 6 && /^\d$/.test(char)) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    const lastFilledIndex = Math.min(pastedArray.length, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      await onVerify(email, otpString);
      setSuccess('Verification successful!');
    } catch (err: any) {
      setError(err.message || 'The code you entered is invalid.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    try {
      await onResend(email);
      setCountdown(60);
      setSuccess('A new code has been sent.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend the code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
            <span>{success}</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-center mb-6">
          Security Code
        </label>

        <div className="flex justify-between items-center max-w-sm mx-auto gap-2 md:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-16 md:w-14 md:h-20 text-center text-3xl font-black border-2 border-gray-100 rounded-2xl outline-none focus:border-black focus:ring-4 focus:ring-gray-50 transition-all duration-200 bg-gray-50/50 focus:bg-white text-black"
              disabled={isLoading}
              placeholder="•"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.join('').length !== 6}
          className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-gray-200"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Verifying...</span>
            </>
          ) : (
            <span>Confirm Email</span>
          )}
        </button>

        <div className="text-center pt-2">
          {countdown > 0 ? (
            <p className="text-sm text-gray-400 font-medium">
              Resend code in <span className="text-black font-bold">{countdown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-700 font-bold border-b-2 border-blue-600 pb-0.5 transition-all text-sm disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="px-4 py-2 bg-gray-50 rounded-full flex items-center space-x-2">
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Code expires in 10:00</span>
        </div>
      </div>
    </form>
  );
}