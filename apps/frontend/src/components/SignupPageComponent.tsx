import { Link } from "react-router";

const SignupPageComponent = ({
  handleSubmit,
  formData,
  setFormData,
}: {
  handleSubmit: React.SubmitEventHandler<HTMLFormElement>;
  formData: {
    email: string;
    name: string;
    password: string;
    repeatPassword: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      email: string;
      name: string;
      password: string;
      repeatPassword: string;
    }>
  >;
}) => {
  return (
    <div className="w-full max-w-md rounded-lg border border-border-color bg-bg-surface p-5 sm:p-7">
      <h1 className="text-left text-2xl font-semibold sm:text-3xl">
        Create an account
      </h1>
      <h2 className="text-left text-sm text-text-muted">
        Make quizzes from the material you’re studying.
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
          <label htmlFor="name" className="text-text-muted">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((curr) => ({
                ...curr,
                name: e.target.value,
              }))
            }
            className="min-h-11 w-full rounded-lg border border-border-color bg-bg-background px-3 py-2 text-text-primary outline-none focus:border-accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
            placeholder="John Doe"
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
        <div className="flex flex-col items-start gap-2 pt-3">
          <label htmlFor="repeat-password" className="text-text-muted">
            Confirm password
          </label>
          <input
            type="password"
            id="repeat-password"
            value={formData.repeatPassword}
            onChange={(e) =>
              setFormData((curr) => ({
                ...curr,
                repeatPassword: e.target.value,
              }))
            }
            className="min-h-11 w-full rounded-lg border border-border-color bg-bg-background px-3 py-2 text-text-primary outline-none focus:border-accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
            placeholder="••••••••"
          />
        </div>
        <button className="mt-5 flex min-h-11 w-full items-center justify-center rounded-lg bg-accent-primary px-4 py-2 text-white transition hover:bg-accent-hover">
          Signup
        </button>
        <p className="pt-4 text-sm leading-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-accent-primary hover:text-accent-hover"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPageComponent;
