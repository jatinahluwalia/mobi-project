import SignupForm from "../../components/form/SignupForm";
import { motion } from "framer-motion";

const Signup = () => {
  return (
    <main className="min-h-screen flex flex-col place-content-center bg-white">
      <div className="grow grid grid-cols-2 w-[min(900px,100%)] mx-auto gap-5">
        <motion.img
          src="/mobi.png"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="m-auto"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex items-center justify-center"
        >
          <SignupForm url="/api/user/signup" />
        </motion.div>
      </div>
    </main>
  );
};

export default Signup;
