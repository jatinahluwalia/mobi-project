import SignupForm from "../../components/form/SignupForm";

const Signup = () => {
  return (
    <main className="min-h-screen flex justify-center items-center bg-gray-300">
      <SignupForm url="/api/user/signup" />
    </main>
  );
};

export default Signup;
