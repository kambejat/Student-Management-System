import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

const Login: React.FC = () => {
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    return null;
  }

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  const {
    loginUser,
    fieldErrors,
    setFieldErrors,
    isServerError,
    setIsServerError,
  }: any = authContext;
  
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setFieldErrors((prevErrors: any) => ({ ...prevErrors, [name]: "" }));
    setIsServerError(false);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors: Partial<FormErrors> = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      await loginUser(formData, rememberMe);
    } else {
      setFieldErrors(validationErrors);
    }
  };

  const validateForm = (): Partial<FormErrors> => {
    const errors: FormErrors = {};
    if (!formData.username) {
      errors.username = "Username is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  return (
    <section className="bg-gray-50 h-screen dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          {isServerError && <div className="text-red-500 text-sm mb-4">{isServerError}</div>}
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-1.5"
                  placeholder="Email or Username"
                  required
                />
                {fieldErrors.username && <p className="text-red-500 text-sm">{fieldErrors.username}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-1.5"
                  placeholder="••••••••"
                  required
                />
                {fieldErrors.password && <p className="text-red-500 text-sm">{fieldErrors.password}</p>}
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  Remember me
                </label>
              </div>
              <button type="submit" className="w-full text-white bg-green-700 rounded-lg p-1.5">
                Sign in
              </button>
              <p className="text-sm">
                Don’t have an account yet? <Link to="/register">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
