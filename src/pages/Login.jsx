import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

function Login() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Admin Login</h1>
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">Login with Google</button>
    </div>
  );
}

export default Login;
