import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Heart } from 'lucide-react';
import { signInWithGoogle } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'patient',
            createdAt: new Date().toISOString(),
          });
        }
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = (e: FormEvent) => {
    e.preventDefault();
    // For now, we'll just show an alert since only Google Auth is configured
    alert("Email/Password login is currently being configured. Please use Google Sign-in for now.");
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-[#f8fcfc] px-4 py-12 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 space-y-8 border border-gray-50"
      >
        <div className="text-center space-y-6">
          <div className="bg-[#008080] w-20 h-20 rounded-[24px] flex items-center justify-center mx-auto shadow-lg shadow-teal-100">
            <Heart className="h-10 w-10 text-white fill-current" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 font-medium">Enter your details to access your dashboard</p>
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#008080] transition-colors" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-14 pr-5 py-5 bg-gray-50 border-none rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#008080] focus:bg-white transition-all font-medium"
              placeholder="Email address"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#008080] transition-colors" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-14 pr-5 py-5 bg-gray-50 border-none rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#008080] focus:bg-white transition-all font-medium"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-[#008080] text-white py-5 rounded-2xl font-bold hover:bg-[#006666] shadow-xl shadow-teal-100 transition-all active:scale-[0.98]"
          >
            <span>Sign In</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400 font-medium">Or continue with</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-100 py-5 rounded-2xl hover:bg-gray-50 transition-all font-bold text-gray-700 disabled:opacity-50 active:scale-[0.98]"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-6 w-6" />
          <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
        </button>
      </motion.div>
    </div>
  );
}
