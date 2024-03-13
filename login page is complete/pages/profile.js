import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import Link from 'next/link'; 

//handle link to dashboard going to line78-83

const Profile = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(""); 

  const handleLogout = async () => {
    await signOut({ redirect: false, callbackUrl: '/' });
    router.push('/');
  };

  useEffect(() => {
    const handleNetworkChange = async () => {
      if (status === 'authenticated') {
        await signOut({ callbackUrl: '/' });
      }
    };

    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, [status]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?._id) {
      axios.get(`/api/users/${session.user._id}`)
        .then(response => {
          setUserDetails(response.data);
        })
        .catch(error => {
          console.error("Failed to fetch user details", error);
          setError("Failed to fetch user details.");
        });
    } 
   
  }, [session, status]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
        <div className="container">
          <h1>Profile</h1>
          <p>Error: {error}</p>
          <button className="btn btn-primary" onClick={() => router.push('/signin')}>
            Back to Sign In
          </button>
        </div>
      );
  }

  return (
    <div className="container">
      <h1>Profile</h1>
      {userDetails ? (
        <div>
          <p><strong>Name:</strong> {userDetails.firstname} {userDetails.lastname}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p><strong>Phone:</strong> {userDetails.phone || 'Not provided'}</p>
          <p><strong>Address:</strong> {userDetails.address ? `${userDetails.address.street}, ${userDetails.address.city}` : 'Not provided'}</p>
          <Link href="/edit-profile"><a>Edit Profile</a></Link>
          <Link href="/"><a>Back to home</a></Link>
          {userDetails.role === 'admin' && (
            <Link href="/admin_dashboard">
              <a>Administration Dashboard</a>
            </Link>
          )}
              <button onClick={handleLogout} className="btn btn-primary mt-3">Log Out</button>
        </div>
      ) : (
        <>
          {status === 'unauthenticated' && (
            <>
              <p>Please sign in to view your profile.</p>
              <button onClick={() => router.push('/signin')} className="btn btn-primary">
                Sign In
              </button>            
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;