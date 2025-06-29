import { useEffect, useState } from 'react';
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { Login } from 'src/AxiosConfig/AxiosConfig';
import { login } from 'src/Store/Slices/AdminUser';
import { useDispatch } from 'react-redux';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const AuthLogin = () => {
  const [uniqueId, setUniqueId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedId = localStorage.getItem('remembered_uniqueId');
    const storedPwd = localStorage.getItem('remembered_password');

    if (storedId && storedPwd) {
      setUniqueId(storedId);
      setPassword(storedPwd);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg('');

    try {
      const response = await Login({ uniqueId, password });
      const { token, admin } = response.data.data;
      dispatch(login(response.data.data));
      if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('admin', JSON.stringify(admin));
      }
      navigate('/');
    } catch (error: any) {
      setErrorMsg(error.response?.data?.errorData || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <div className="mb-2 block">
          <Label value="Unique Id" />
        </div>
        <TextInput
          id="uniqueId"
          type="text"
          sizing="md"
          required
          value={uniqueId}
          onChange={(e) => setUniqueId(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <div className="mb-2 block">
          <Label value="Password" />
        </div>
        <div className="relative">
          <TextInput
            id="userpwd"
            type={showPassword ? 'text' : 'password'}
            sizing="md"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <HiEyeOff className="h-5 w-5 text-gray-500" />
            ) : (
              <HiEye className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>
      <div className="flex justify-between my-5">
        <div className="flex items-center gap-2">
          <Checkbox
            id="accept"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="checkbox"
          />
          <Label htmlFor="accept" className="opacity-90 font-normal cursor-pointer">
            Remember Me
          </Label>
        </div>
        <Link to="/auth/forgot-password" className="text-primary text-sm font-medium">
          Forgot Password?
        </Link>
      </div>
      {errorMsg && <p className="text-red-600 text-sm mb-3">{errorMsg}</p>}
      <Button type="submit" className="w-full bg-primary text-white rounded-xl">
        Sign in
      </Button>
    </form>
  );
};

export default AuthLogin;
