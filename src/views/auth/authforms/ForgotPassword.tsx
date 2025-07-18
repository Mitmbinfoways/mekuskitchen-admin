import { useState } from 'react';
import { Button, Label, TextInput, Alert } from 'flowbite-react';
import FullLogo from 'src/layouts/full/shared/logo/FullLogo';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { SendOtp, ResetPassword } from 'src/AxiosConfig/AxiosConfig';

const gradientStyle = {
  background:
    'linear-gradient(45deg, rgba(238, 119, 82, 0.2), rgba(231, 60, 126, 0.2), rgba(35, 166, 213, 0.2), rgba(35, 213, 171, 0.5))',
  backgroundSize: '400% 400%',
  animation: 'gradient 15s ease infinite',
  height: '100vh',
};

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendOtp = async () => {
    setErrorMsg('');
    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    setIsLoading(true);
    try {
      const res = await SendOtp(email);
      localStorage.setItem('otp', res.data.data);
      setStep(2);
    } catch (error) {
      setErrorMsg('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setErrorMsg('');
    if (otp.length < 4) {
      setErrorMsg('OTP must be at least 4 characters');
      return;
    }
    setIsLoading(true);
    try {
      const originalOtp = localStorage.getItem('otp');
      if (otp === originalOtp) {
        setStep(3);
      } else {
        setErrorMsg('Invalid OTP');
      }
    } catch (error) {
      setErrorMsg('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setErrorMsg('');
    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords don't match");
      return;
    }
    setIsLoading(true);
    try {
      await ResetPassword({ email, newPassword });
      setSuccessMsg('Password updated successfully');
      navigate('/auth/login');
    } catch (error) {
      setErrorMsg('Reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={gradientStyle} className="relative overflow-hidden h-screen">
      <div className="flex h-full justify-center items-center px-4">
        <div className="rounded-xl shadow-md bg-white dark:bg-darkgray p-6 w-full max-w-md border-none">
          <div className="flex flex-col gap-8 w-full">
            <div className="mx-auto">
              <FullLogo />
            </div>
            <div className="flex flex-col gap-2">
              {successMsg && (
                <Alert color="success" id="success-message">
                  {successMsg}
                </Alert>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="email" className="mb-2 block">
                      Email
                    </Label>
                    <TextInput
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      aria-describedby="email-error"
                    />
                  </div>
                  <Button
                    className="mt-4 w-full bg-primary"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    isProcessing={isLoading}
                  >
                    Send OTP
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="otp" className="mb-2 block">
                      Enter OTP
                    </Label>
                    <TextInput
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      aria-describedby="otp-error"
                    />
                  </div>
                  <Button
                    className="mt-4 w-full bg-primary"
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                    isProcessing={isLoading}
                  >
                    Verify OTP
                  </Button>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <TextInput
                      id="userpwd"
                      type={showNewPassword ? 'text' : 'password'}
                      sizing="md"
                      placeholder="Enter New Password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <HiEyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <HiEye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <TextInput
                      id="userpwd"
                      type={showConfirmPassword ? 'text' : 'password'}
                      sizing="md"
                      required
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <HiEyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <HiEye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <Button
                    className="mt-4 w-full bg-primary"
                    onClick={handleResetPassword}
                    disabled={isLoading}
                    isProcessing={isLoading}
                  >
                    Reset Password
                  </Button>
                </div>
              )}
              {errorMsg && (
                <Alert color="failure" id="error-message">
                  {errorMsg}
                </Alert>
              )}
              <div className="flex justify-center">
                <Link to="/auth/login">
                  <p className="flex items-center text-primary text-sm text-center mt-5">
                    <IoIosArrowRoundBack className="text-lg mr-1" />
                    Back To Login
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
