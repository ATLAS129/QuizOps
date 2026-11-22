import { Link } from "react-router";

const LoginPageComponent = ({
  handleSubmit,
  formData,
  setFormData,
}: {
  handleSubmit: React.SubmitEventHandler<HTMLFormElement>;
  formData: { email: string; password: string };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      email: string;
      password: string;
    }>
  >;
}) => {
  return (
    <div className="w-full max-w-md rounded-lg border border-border-color bg-bg-surface p-5 sm:p-7">
      <h1 className="text-left text-2xl font-semibold sm:text-3xl">
        Welcome back
      </h1>
      <h2 className="text-left text-sm text-text-muted">
        Sign in to pick up where you left off.
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-start gap-2 pt-3">
          <label htmlFor="email" className="text-text-muted">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((curr) => ({
                ...curr,
                email: e.target.value,
              }))
            }
            className="min-h-11 w-full rounded-lg border border-border-color bg-bg-background px-3 py-2 text-text-primary outline-none focus:border-accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
            placeholder="JohnDoe@example.com"
          />
        </div>
        <div className="flex flex-col items-start gap-2 pt-3">
          <label htmlFor="password" className="text-text-muted">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((curr) => ({
                ...curr,
                password: e.target.value,
              }))
            }
            className="min-h-11 w-full rounded-lg border border-border-color bg-bg-background px-3 py-2 text-text-primary outline-none focus:border-accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
            placeholder="••••••••"
          />
        </div>
        <button className="mt-5 flex min-h-11 w-full items-center justify-center rounded-lg bg-accent-primary px-4 py-2 text-white transition hover:bg-accent-hover">
          Login
        </button>
        <p className="pt-4 text-sm leading-6">
          Don't have an account yet?{" "}
          <Link
            to="/signup"
            className="text-accent-primary hover:text-accent-hover"
          >
            Create a new one
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPageComponent;
