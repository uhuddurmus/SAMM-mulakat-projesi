import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {setList} from './features/listSlice'
import { useDispatch } from "react-redux";

export const fetchNavsData = async () => {
    try {
        const response = await axios.get("https://localhost:7009/api/Points");
        const nav = response.data;
        
        return nav

    } catch (error: any) {
        console.error("Failed Fetch Data:", error);
        // Handle error
        toast.error(error.message, {
            position: "top-right",
        });
        return []
    }
}
