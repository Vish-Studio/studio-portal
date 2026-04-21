import { useAuth } from '../components/authprovider/authprovider';
import { LogIn } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F9] px-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-12 rounded-[32px] border border-gray-200 shadow-sm">
        <div className="text-center">
          <h2 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight">VISH <span className="font-medium text-gray-500 text-3xl">STUDIO</span></h2>
          <p className="mt-4 text-sm font-semibold text-gray-500 uppercase tracking-widest">
            Client Portal
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={login}
            className="group relative w-full flex justify-center py-4 px-4 font-bold text-sm rounded-[16px] text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all shadow-md"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-4">
              <LogIn className="h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-colors" aria-hidden="true" />
            </span>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
