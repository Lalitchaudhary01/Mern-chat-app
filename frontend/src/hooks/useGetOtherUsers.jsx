import { useEffect } from "react";
import axios from "../api/axios"; // ✅ use custom axios instance
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";

const useGetOtherUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        const res = await axios.get(`/api/v1/user/`);
        console.log(res);
        dispatch(setOtherUsers(res.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchOtherUsers();
  }, []);
};

export default useGetOtherUsers;
