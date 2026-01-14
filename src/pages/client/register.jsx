import { Link } from "react-router-dom";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoArrowBack } from "react-icons/io5";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name === "" || formData.email === "" || formData.password === "" || formData.confirmPassword === "") {
            setError("Vui lòng nhập đầy đủ thông tin để đăng ký!");
        } else {
            setError("");
            console.log(formData);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="absolute top-4 left-4">
                <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-primary">
                    <IoArrowBack size={20} />
                    <span className="text-sm font-medium">Quay lại trang chủ</span>
                </Link>
            </div>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/">
                    <img src="/logo-watchstore.webp" alt="Logo" className="mx-auto h-12 w-auto" />
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Đăng ký tài khoản
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Hoặc{' '}
                    <Link to="/login" className="font-medium text-primary hover:text-red-500">
                        đăng nhập nếu đã có tài khoản
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Họ và tên
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="Nhập họ và tên của bạn"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="Nhập email của bạn"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mật khẩu
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="Nhập mật khẩu"
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <AiOutlineEye className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Xác nhận mật khẩu
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="Xác nhận mật khẩu"
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <AiOutlineEye className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <p className="text-red-500 text-[12px]">{error}</p>

                        <div>
                            <button
                                onClick={handleSubmit}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Đăng ký
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
