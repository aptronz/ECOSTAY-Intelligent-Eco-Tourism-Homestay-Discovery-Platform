import { useState } from "react";
import { Leaf, LockKeyhole } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";

/**
 * Login Page
 *
 * Wireframe-ready authentication screen using the shared UI controls.
 *
 * @returns {React.ReactElement}
 */
export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    window.setTimeout(() => navigate("/dashboard"), 600);
  };

  return (
    <main className="grid min-h-[calc(100vh-74px)] bg-white dark:bg-[#0f1d18] lg:grid-cols-[1fr_1fr]">
      <section className="relative hidden overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=88"
          alt="Sunlight through a protected forest"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative flex h-full max-w-xl flex-col justify-end p-12 text-white">
          <Leaf className="mb-5 text-lime" size={38} />
          <h1 className="font-display text-5xl">Return to journeys that matter.</h1>
          <p className="mt-4 max-w-md leading-7 text-white/75">Save conscious stays, revisit itineraries, and see the local impact of every trip.</p>
        </div>
      </section>
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-forest text-lime dark:bg-lime dark:text-forest">
            <LockKeyhole size={21} />
          </span>
          <h1 className="mt-6 font-display text-4xl text-forest dark:text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sign in to continue planning lighter journeys.</p>
          <div className="mt-8 space-y-5">
            <Input label="Email address" type="email" placeholder="you@example.com" required autoComplete="email" />
            <Input label="Password" type="password" placeholder="Enter your password" required autoComplete="current-password" helperText="Use at least 8 characters." />
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" className="accent-[#2e7d32]" />Remember me</label>
            <button type="button" className="font-bold text-leaf hover:underline">Forgot password?</button>
          </div>
          <Button type="submit" size="lg" loading={loading} className="mt-7 w-full">Sign in</Button>
          <p className="mt-6 text-center text-sm text-slate-500">New to ECOSTAY? <Link to="/explore" className="font-bold text-leaf hover:underline">Explore first</Link></p>
        </form>
      </section>
    </main>
  );
}
