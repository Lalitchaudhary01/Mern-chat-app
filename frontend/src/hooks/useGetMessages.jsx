import React, { useEffect } from "react";
import axios from "../api/axios"; // ✅ use custom axios instance
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const useGetMessages = () => {
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/v1/message/${selectedUser._id}`);
        console.log(res);
        dispatch(setMessages(res.data));
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedUser?._id) fetchMessages();
  }, [selectedUser]);
};

export default useGetMessages;
