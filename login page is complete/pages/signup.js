import 'bootstrap/dist/css/bootstrap.css';
import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const Signup = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  const handleGoogleSignup = async () => {
    try {
      await signIn('google', {
        callbackUrl: '/profile',
      });
    } catch (error) {
      console.log(error);
      alert('Error signing up with Google');
    }
  };


  const onSubmit = async (e) => {
    e.preventDefault();
    const { firstname, lastname, email, password } = e.target.elements;

    try {
        await axios.post("/api/auth/signup", {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          password: user.password,
        });
        router.push("/signin");
    } catch (error) {
        console.log(error);
        alert("Error signing up");
    }
};

  return (
    <main className="container">
      <h2 className="mb-4 text-center">Create an Account</h2>

      <div className="row">
        <div className="col">
          <button className="btn btn-outline-primary w-100" onClick={handleGoogleSignup}>
            Sign up with Google
          </button>
        </div>
      </div>

      <div className="text-center my-4">
        <div className="border-top w-100 my-2"></div>
        <p>Or, register with your email</p>
        <div className="border-top w-100 my-2"></div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-lg-6">
            <input
              className="form-control"
              value={user.firstname}
              onChange={(e) => setUser({ ...user, firstname: e.target.value })}
              placeholder="First name"
              name="firstname"
          
            />
            {errors.firstname && <p className="text-danger">{errors.firstname}</p>}
          </div>

          <div className="col-lg-6">
            <input
              className="form-control"
              value={user.lastname}
              onChange={(e) => setUser({ ...user, lastname: e.target.value })}
              placeholder="Last name"
              name="lastname"
            />
            {errors.lastname && <p className="text-danger">{errors.lastname}</p>}
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-lg-6">
            <input
              className="form-control"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Email"
              name="email"
            />
            {errors.email && <p className="text-danger">{errors.email}</p>}
          </div>

          <div className="col-lg-6">
            <input
              className="form-control"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              type="password"
              placeholder="Password"
              name="password"
            />
            {errors.password && <p className="text-danger">{errors.password}</p>}
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div className="form-check">
            <input
              id="default-checkbox"
              type="checkbox"
              className="form-check-input"
            />
            <label htmlFor="default-checkbox" className="form-check-label">
              Keep me signed in
            </label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Creating Account..." : "Create Account"}
          </button>
        </div>

        <div className="border-top pt-4 text-center">
          <p>
            Already have an account?{" "}
            <Link href="/signin">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};

export default Signup;