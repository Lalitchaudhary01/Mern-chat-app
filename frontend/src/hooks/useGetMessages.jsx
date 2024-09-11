import React, {useEffect} from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages } from '../redux/messageSlice';


const useGetMessages = async () => {
    const {selectedUser} = useSelector(store=>store.user);
    const dispatch = useDispatch();
    useEffect(() => { 
        const fetchMessages = async () => {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get(`http://localhost:8080/api/v1/message/${selectedUser._id}`);
                console.log(res);
                dispatch(setMessages(res.data));

            } catch (error) {
                console.error(error);
            }
        }
        fetchMessages();
    }
    , [selectedUser]);
  
}

export default useGetMessages
