//app/signin/page.js
import 'bootstrap/dist/css/bootstrap.css'; 
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"


const Signin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState({ email: "", password: "" });


  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signIn('google', {
        callbackUrl: '/profile',
        prompt: 'consent',
      });
      if (result && result.error) {
        setErrorMessage(result.error);
      }
    } catch (error) {
      console.error('Sign in error', error);
      setErrorMessage('An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: user.email,
        password: user.password,
      });

      if (result.error) {
        setErrorMessage(result.error);
      } else {
        router.push('/profile');
      }
    } catch (error) {
      console.error("Sign in error", error);
      setErrorMessage("An error occurred during sign in.");
    } finally {
      setLoading(false); 
    }
  };
  return (
    <div className="container py-5">
      <h1>{loading ? "Processing..." : "Sign In"}</h1>
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <h2 className="text-center mb-4">Login to Your Account</h2>
          <div className="row">
            <div className="col">
            <button
                className="btn btn-outline-primary w-100 mb-2"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </button>
            </div>
          </div>
          <div className="text-center my-4">
            <span className="text-muted">Or, login with your email</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-12">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email address"
                  name="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                />
              </div>
              <div className="col-12">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  name="password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <Link href="/forgot-password">
                <a className="text-decoration-none">Forgot Password?</a>
              </Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                Log In
              </button>
            </div>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            
            <div className="border-top pt-4 text-center">
              <p className="mb-0">
                Don't have an account?{' '}
                <Link href="/signup">
                  <a>Sign Up</a>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;