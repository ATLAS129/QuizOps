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
    <div className="w-1/2 bg-bg-surface p-4 rounded-lg">
      <h1 className="text-3xl text-left">Welcome back!</h1>
      <h2 className="text-sm text-left text-text-muted">
        It's nice to see you again!
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
        <button className="w-full flex justify-center items-center mx-auto py-2 px-32 bg-accent-primary hover:bg-accent-hover cursor-pointer rounded-lg mt-5">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPageComponent;
