import { useEffect, useState } from "react";
import UpdateForm from "../../components/form/UpdateForm";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

const UpdateSelf = () => {
  type User = {
    fullName: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  const [data, setData] = useState<User | null>();
  useEffect(() => {
    const getData = async () => {
      const res = await axios.get<User>("/api/user");
      const data = res.data;
      setData(data);
    };
    getData();
  }, []);
  const auth = useAuth();
  if (!auth.user) return null;
  return (
    data && (
      <UpdateForm
        email={data.email}
        fullName={data.fullName}
        phone={data.phone}
        url="/api/user"
      />
    )
  );
};

export default UpdateSelf;
