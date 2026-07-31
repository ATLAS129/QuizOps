import { useState } from "react";
import { useSignup } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import SignupPageComponent from "../components/SignupPageComponent";

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    repeatPassword: "",
  });

  const { mutate } = useSignup();

  async function handleSubmit(e: any) {
    e.preventDefault();

    mutate(formData, { onSuccess: () => navigate("/", { replace: true }) });
  }

  return (
    <SignupPageComponent
      handleSubmit={handleSubmit}
      formData={formData}
      setFormData={setFormData}
    />
  );
};

export default SignupPage;
