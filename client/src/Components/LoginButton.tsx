import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useOAuth } from '../Contexts/OAuthContext';

function LoginButton() {
    const { setUser, token, setToken } = useOAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const login = useGoogleLogin({
        onSuccess: (googleResponse) => {
            const google_token = googleResponse.access_token;
            localStorage.setItem('google_token', google_token);
            setToken(google_token);
        },
        onError: (error) => console.log('Login Failed:', error),
        scope: 'https://www.googleapis.com/auth/gmail.readonly'
    });

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                setLoading(true);
                try {
                    const userinfoRes = await axios.get(
                        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                Accept: 'application/json'
                            }
                        }
                    );
                    setUser(userinfoRes.data);
                    navigate('/home');
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [token, setUser]);

    return (
        <div className="w-full max-w-lg md:max-w-1xl lg:max-w-2xl rounded-lg mx-auto mt-10 p-4 shadow-lg bg-white">
            <Header />
            <Introduction />

            <div className='w-full flex justify-center'>
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                    <button
                        onClick={() => login()}
                        className="relative bg-[#4285f4] hover:bg-[#3e77f3]h-12 text-white font-bold py-2 px-2 rounded flex items-center justify-center"
                    >
                        <FcGoogle className="h-10 w-10 bg-white rounded p-2" />
                        <span className="pl-2 sm:text-sm text-base">
                            <span className="">Sign up With Google</span>
                        </span>
                    </button>
                </GoogleOAuthProvider>
            </div>

            {loading && (
                <div className="mt-4 text-center text-blue-500">
                    Loading your information...
                </div>
            )}

            <Footer />
        </div>
    );
}

function Header() {
    return (
        <header className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Welcome To Email Classifier!</h1>
        </header>
    );
}

function Introduction() {
    return (
        <section className="text-center mb-6">
            <p className="text-gray-600">
                Sign in with your Google account to access your dashboard and personalized settings.
            </p>
        </section>
    );
}

function Footer() {
    return (
        <footer className="mt-6 text-center text-gray-500">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
        </footer>
    );
}

export default LoginButton;
