import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// email
// : 
// "sreeragknd@gmail.com"
// family_name
// : 
// "O"
// given_name
// : 
// "Sreerag"
// id
// : 
// "105856178930177836941"
// name
// : 
// "Sreerag O"
// picture
// : 
// "https://lh3.googleusercontent.com/a/ACg8ocKfyPLYr9g88XEtYsV1r3NA9QOZ72mBsAS-KOOra2qTTvgMgwCL=s96-c"
// verified_email
// : 
// true

function LoginButton() {
    const [user, setUser] = useState<any>(null);
    const [googleResponse, setGoogleResponse] = useState<any>(null);
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: (googleResponse) => {
            setGoogleResponse(googleResponse);
            const google_token = googleResponse.access_token;
            localStorage.setItem('google_token', google_token);
        },
        onError: (error) => console.log('Login Failed:', error),
        scope: 'https://www.googleapis.com/auth/gmail.readonly'
    });

    useEffect(() => {
        const fetchData = async () => {
            if (googleResponse && googleResponse.access_token) {
                try {
                    const userinfoRes = await axios.get(
                        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json`,
                        {
                            headers: {
                                Authorization: `Bearer ${googleResponse.access_token}`,
                                Accept: 'application/json'
                            }
                        }
                    );

                    // Assuming userinfoRes.data contains user information
                    setUser(userinfoRes.data);
                    console.log(userinfoRes.data);

                    // Navigate to another page if needed
                    // navigate('/some-page');

                } catch (error) {
                    console.log(error);
                }
            }
        };

        fetchData();
    }, [googleResponse]);

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <button
                onClick={() => login()}
                className='relative bg-[#4285f4] hover:bg-[#3e77f3] w-full h-12 text-white font-bold py-2 px-1 rounded flex items-center'
            >
                <FcGoogle className="h-10 w-10 bg-white rounded p-2" />
                <span className="pl-10">Continue with your Google Account</span>
            </button>
            {user && (
                <div className='mt-4 p-4 border border-gray-300 rounded'>
                    <h2 className='text-lg font-bold'>User Info</h2>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Token:</strong> {googleResponse.access_token}</p>
                </div>
            )}
        </GoogleOAuthProvider>
    );
}

export default LoginButton;
