import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, signup, googleSignIn } = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        reset();
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            await googleSignIn();
            if (!isLogin) {
                navigate('/onboarding');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to sign in with Google: ' + err.message);
        }
        setLoading(false);
    };

    const onSubmit = async (data) => {
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(data.email, data.password);
                navigate('/');
            } else {
                await signup(data.email, data.password);
                navigate('/onboarding');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to ' + (isLogin ? 'log in' : 'create an account') + ': ' + err.message);
        }
        setLoading(false);
    };

    const Logo = () => (
        <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="font-bold text-white text-xl">S</span>
            </div>
            <span className="font-bold text-2xl text-gray-900 tracking-tight">StudyMate</span>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl opacity-60 mix-blend-multiply filter animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-3xl opacity-60 mix-blend-multiply filter animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100/50 rounded-full blur-3xl opacity-60 mix-blend-multiply filter animate-blob animation-delay-4000"></div>
            </div>

            <div className="w-full max-w-md z-10 mx-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/50"
                >
                    <div className="p-8">
                        <Logo />

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                {isLogin ? 'Enter your credentials to access your account' : 'Start your productivity journey today'}
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                                </div>
                            </div>

                            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                                <Input
                                    label="Email address"
                                    type="email"
                                    {...register("email", { required: "Email is required" })}
                                    error={errors.email?.message}
                                    placeholder="you@example.com"
                                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                />

                                <div className="space-y-1">
                                    <Input
                                        label="Password"
                                        type="password"
                                        {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                                        error={errors.password?.message}
                                        placeholder="••••••••"
                                        className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    />
                                    {isLogin && (
                                        <div className="flex justify-end">
                                            <button type="button" className="text-xs text-primary hover:text-primary/80">Forgot password?</button>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    fullWidth
                                    loading={loading}
                                    className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white shadow-lg shadow-primary/25 rounded-lg py-2.5 font-semibold"
                                >
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                </Button>
                            </form>
                        </div>
                    </div>

                    <div className="bg-gray-50/50 p-4 text-center border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={toggleMode}
                                className="font-semibold text-primary hover:text-primary/80 transition-colors"
                            >
                                {isLogin ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </motion.div>

                <p className="text-center text-xs text-gray-400 mt-8">
                    By clicking continue, you agree to our <a href="#" className="hover:text-gray-600">Terms of Service</a> and <a href="#" className="hover:text-gray-600">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
};

export default Auth;
