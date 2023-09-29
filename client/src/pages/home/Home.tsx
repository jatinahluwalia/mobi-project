import { Button } from "@mui/material";

const Home = () => {
  return (
    <main className="min-h-screen flex justify-center items-center bg-gray-300">
      <article className="p-5 rounded-lg bg-white shadow-md min-w-[300px] flex flex-col gap-5">
        <Button type="button" variant="contained" href="/login">
          Login
        </Button>
        <Button type="button" variant="contained" href="/signup">
          Signup
        </Button>
      </article>
    </main>
  );
};

export default Home;
