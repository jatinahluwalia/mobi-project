import { useEffect, useState } from "react";
import UpdateForm from "../../components/form/UpdateForm";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { Typography } from "@mui/material";

const UpdateSelf = () => {
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
    <div className="p-5">
      <Typography variant="h2" marginBottom={5}>
        Update Profile
      </Typography>
      {data && (
        <UpdateForm
          email={data.email}
          fullName={data.fullName}
          phone={data.phone}
          url="/api/user"
        />
      )}
    </div>
  );
};

export default UpdateSelf;
