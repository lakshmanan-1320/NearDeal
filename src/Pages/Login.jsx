import { useState } from 'react';
import logo from '../assets/logo.svg';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../Redux/Api/apiConfig';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Function to handle email input change and remove any spaces (backup)
    const handleEmailChange = (e) => {
        const value = e.target.value.replace(/\s/g, ''); // Remove any spaces as a fallback
        setEmail(value);
    };

    // Function to prevent space key from being entered
    const handleKeyDown = (e) => {
        if (e.key === ' ') {
            e.preventDefault(); // Block space key
            // toast.warn('Spaces are not allowed in the email field.');
        }
    };

    // Function to handle form submission
    const handleSubmit = async () => {
    try {
        setLoading(true);
        if (!email) {
            throw new Error('Email cannot be empty');
        }

        const response = await fetch(`${BASE_URL}merchantLogin.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.token) {
            Cookies.set('user_token', data.token, { expires: 2 });
            toast.success('Login successful!');
            window.location.href = '/app/booking';
            // navigate('/booking'); 
        } else {
            throw new Error('No token received from server');
        }
    } catch (error) {
        console.error('Error:', error);
        toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="bg-grad">
            <nav className="navbar navbar-expand-sm navbar-light p-4">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="mynavbar">
                        <img src={logo} className="logo-img" alt="logo" />
                        <ul className="navbar-nav me-auto"></ul>
                    </div>
                    <button className="btn px-0" type="button" style={{ color: 'rgba(0, 0, 0, 0.50)' }}>
                        <Link style={{ textDecoration: 'none' }} to='https://neardl.com'>Go to Website</Link>
                    </button>
                </div>
            </nav>

            <div className="container-fluid" id="form">
                <div className="login-form">
                    <div className="col-lg-4"></div>
                    <div className="col-lg-4 col-sm-12 px-5">
                        <h2 className="form-header" style={{ textAlign: 'center' }}>Merchant Login</h2>
                        <input
                            type="email"
                            className="form-control-plaintext formFields mt-3"
                            placeholder="Email"
                            id="emailLogin"
                            name="email"
                            value={email}
                            onChange={handleEmailChange} 
                            onKeyDown={handleKeyDown} 
                            pattern="[^\s@]+@[^\s@]+\.[^\s@]+" 
                            required
                        />
                        <input
                            type="password"
                            className="form-control-plaintext formFields my-2"
                            placeholder="Password"
                            id="passLogin"
                            name="pass"
                            value={password}
                            onChange={(e) => setPassword(e.target.value.trimStart())}
                            required
                        />
                        <div className="d-grid">
                            <button
                                type="button"
                                id="loginSubmit"
                                className="btn btn-dark btn-block"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                Login
                                {loading && <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>}
                            </button>
                        </div>
                        <div className="d-grid">
                            <Link
                                to="/signup"
                                type="button"
                                className="btn btn-outline-dark btn-block my-4"
                                style={{ textDecoration: 'none' }}
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                    <div className="col-lg-4"></div>
                </div>
            </div>
        </div>
    );
};

export default Login;