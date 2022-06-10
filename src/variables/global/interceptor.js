import axios from "axios";
import Functions from "../functions";

const INTERCEPTOR = axios.interceptors.response.use(response => {
    if (response.data && response.data.success && response.data.success === false) {
        Functions.errorSwal(response.data.message);
    }
    return Promise.resolve(response);
}, error => {
    if (!error.response)
        Functions.errorSwal(error.message);
    switch (error.response.status) {
        case 400:
        case 401:
        case 403:
        case 500:
            Functions.errorSwal(error.response.data.message);
            break;
    }
    return Promise.reject(error);
});

export default INTERCEPTOR;