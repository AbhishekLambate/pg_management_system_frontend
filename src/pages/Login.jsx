import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login(username, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Background with abstract shapes */}
            <div className="login-bg-container">
                <div className="login-bg-shape bg-shape-1" />
                <div className="login-bg-shape bg-shape-2" />
            </div>

            <div className="glass-panel p-8 login-card">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400">Sign in to manage your PG</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Username"
                        type="text"
                        placeholder="unique_username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <div className="p-4 bg-red-400/10 border border-red-400/20 rounded text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    <p>Enter your unique username and password</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
