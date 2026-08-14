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
    <div className="w-1/2 bg-bg-surface p-4 rounded-lg">
      <h1 className="text-3xl text-left">Welcome to my app!</h1>
      <h2 className="text-sm text-left text-text-muted">
        I hope my app will make your study easier😊
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
            className="w-full border-border-color border rounded-lg px-2 py-2"
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
            className="w-full border-border-color border rounded-lg px-2 py-2"
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
            className="w-full border-border-color border rounded-lg px-2 py-2"
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
            className="w-full border-border-color border rounded-lg px-2 py-2"
            placeholder="••••••••"
          />
        </div>
        <button className="w-full flex justify-center items-center mx-auto py-2 px-32 text-white bg-accent-primary hover:bg-accent-hover cursor-pointer rounded-lg mt-5">
          Signup
        </button>
        <p className="pt-4 text-sm">
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
