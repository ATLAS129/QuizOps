import { useState } from "react";
import { useLogin } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import LoginPageComponent from "../components/LoginPageComponent";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const { mutate } = useLogin();

  async function handleSubmit(e: any) {
    e.preventDefault();

    mutate(formData, { onSuccess: () => navigate("/", { replace: true }) });
  }

  return (
    <LoginPageComponent
      handleSubmit={handleSubmit}
      formData={formData}
      setFormData={setFormData}
    />
  );
};

export default LoginPage;
