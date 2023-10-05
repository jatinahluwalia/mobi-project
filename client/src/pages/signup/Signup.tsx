import SignupForm from "../../components/form/SignupForm";
import { motion } from "framer-motion";

const Signup = () => {
  return (
    <main className="min-h-screen flex flex-col place-content-center bg-gray-300 ">
      <div className="grow grid grid-cols-2 w-[min(1000px,100%)] mx-auto">
        <motion.img
          src="/mobi.png"
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ duration: 1 }}
          className="m-auto"
        />
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 1 }}
          className="m-auto"
        >
          <SignupForm url="/api/user/signup" />
        </motion.div>
      </div>
    </main>
  );
};

export default Signup;
