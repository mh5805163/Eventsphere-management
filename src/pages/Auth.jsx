import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/DemoAuth";
import { Button } from "../components/ui";
import { demoStore } from "../services/demoStore";
import { photos } from "./Home";
export default function Auth({ mode }) {
  const { authenticate } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetLink, setResetLink] = useState("");
  const signup = mode === "register";
  const forgot = mode === "forgot";
  const reset = mode === "reset";
  async function tryDemo(role) {
    setBusy(true);
    setError("");
    try {
      const account = await authenticate("login", {
        email: `${role}@eventsphere.test`,
        password: "EventSphere123!",
      });
      navigate(`/dashboard/${account.role}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    if (signup) body.consent = body.consent === "on";
    if (reset) body.token = params.get("token");
    try {
      if (forgot || reset) {
        const data = await demoStore(`/auth/${mode}`, { method: "POST", body });
        setSuccess(data.message);
        setResetLink(data.resetLink || "");
      } else {
        const user = await authenticate(mode, body);
        toast.success(
          `Welcome${signup ? "" : " back"}, ${user.name.split(" ")[0]}.`,
        );
        navigate(`/dashboard/${user.role}`);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="grid min-h-[720px] md:grid-cols-2">
      <div className="relative hidden md:block">
        <img
          className="absolute h-full w-full object-cover"
          src={photos.flowers}
          alt="An elegant gathering"
        />
        <div className="absolute inset-0 bg-ink/25" />
        <div className="absolute bottom-16 left-12 right-12 text-white">
          <p className="text-[10px] uppercase tracking-[.25em]">
            Your next chapter starts here
          </p>
          <h2 className="mt-4 text-6xl">
            A world of moments.
            <br />
            <em className="font-normal">A place for you.</em>
          </h2>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="eyebrow">Welcome to EventSphere</p>
          <h1 className="my-4 text-5xl">
            {signup
              ? "Make yourself at home."
              : forgot
                ? "A fresh start."
                : reset
                  ? "Your new password."
                  : "Lovely to see you again."}
          </h1>
          <p className="mb-8 text-sm leading-7 text-muted">
            {signup
              ? "Join a community of people making extraordinary things happen."
              : forgot
                ? "Create a local demo reset link. Try the full flow here without sending an email."
                : reset
                  ? "Choose a strong password for your account."
                  : "Sign in and pick up where your next experience begins."}
          </p>
          {success ? (
            <div className="panel" role="status">
              <p className="text-sm leading-7">{success}</p>
              {resetLink && (
                <Button asChild className="mt-5">
                  <Link to={resetLink}>
                    Open demo reset link <ArrowUpRight size={14} />
                  </Link>
                </Button>
              )}
              <Link to="/login" className="mt-5 block text-rose-dark underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-5">
              {signup && (
                <label>
                  Your name
                  <input
                    name="name"
                    required
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                  />
                </label>
              )}
              {!reset && (
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                  />
                </label>
              )}
              {!forgot && (
                <label>
                  Password
                  <div className="relative mt-2">
                    <input
                      name="password"
                      type={show ? "text" : "password"}
                      required
                      minLength={signup || reset ? 10 : 1}
                      maxLength={100}
                      pattern={
                        signup || reset
                          ? "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{10,100}"
                          : undefined
                      }
                      autoComplete={
                        signup || reset ? "new-password" : "current-password"
                      }
                      className="pr-12!"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-3 top-3"
                      aria-label={show ? "Hide password" : "Show password"}
                    >
                      {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {(signup || reset) && (
                    <span className="mt-2 block text-[10px] text-muted">
                      At least 10 characters, with uppercase, lowercase, and a
                      number.
                    </span>
                  )}
                </label>
              )}
              {signup && (
                <>
                  <label>
                    I'm here to…
                    <select
                      name="role"
                      defaultValue={
                        params.get("role") === "exhibitor"
                          ? "exhibitor"
                          : "attendee"
                      }
                    >
                      <option value="attendee">Discover & attend events</option>
                      <option value="exhibitor">Showcase my brand</option>
                      <option value="admin">Organize experiences (demo)</option>
                    </select>
                  </label>
                  <label className="flex items-start gap-2 text-xs font-normal">
                    <input
                      name="consent"
                      type="checkbox"
                      required
                      className="mt-0.5"
                    />
                    <span>
                      I agree to the processing of my account data described in
                      the{" "}
                      <Link to="/privacy" className="underline">
                        privacy notice
                      </Link>
                      .
                    </span>
                  </label>
                </>
              )}
              {error && (
                <p
                  role="alert"
                  className="rounded bg-red-50 p-3 text-xs leading-6 text-red-800"
                >
                  {error}
                </p>
              )}
              {mode === "login" && (
                <Link
                  to="/forgot-password"
                  className="text-right text-xs text-rose-dark"
                >
                  Forgot password?
                </Link>
              )}
              <Button disabled={busy}>
                {busy
                  ? "One moment…"
                  : signup
                    ? "Create your account"
                    : forgot
                      ? "Create demo reset link"
                      : reset
                        ? "Update password"
                        : "Sign in"}
                <ArrowUpRight size={14} />
              </Button>
            </form>
          )}
          {mode === "login" && (
            <div className="mt-7 rounded-xl border border-rose/20 bg-blush/50 p-4">
              <p className="mb-3 text-[10px] uppercase tracking-widest text-rose-dark">
                Explore a sample account
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["admin", "Organizer"],
                  ["exhibitor", "Exhibitor"],
                  ["attendee", "Attendee"],
                ].map(([role, label]) => (
                  <Button
                    key={role}
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => tryDemo(role)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              <p className="mt-3 text-[10px] leading-5 text-muted">
                Frontend demonstration. Use sample details, not a real account
                password. Changes stay in this browser.
              </p>
            </div>
          )}
          {!forgot && !reset && (
            <p className="mt-6 text-center text-xs text-muted">
              {signup
                ? "Already part of the community?"
                : "New to EventSphere?"}{" "}
              <Link
                className="text-rose-dark underline"
                to={signup ? "/login" : "/register"}
              >
                {signup ? "Sign in" : "Join us"}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
