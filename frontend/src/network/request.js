import axios from 'axios'
// import store from '../vuex/store'
import router from "../router";

axios.defaults.withCredentials=true;

const service = axios.create({
    baseURL: "http://" + location.hostname + ":3000", // api base_url
    timeout: 15000,
});

service.interceptors.response.use(
    res => {
        return res;
    },
    error => {
        if (error) {
            if (!error.response) {
                return console.log('Error', error.response);
            }
            const status = error.response.status;
            const errorText = error.response.data.message;

            if (status === 403) {
                alert("Authentication failed");
                router.push({path: '/signin'});
            } else {
                alert(errorText);
                // console.log(errorText);
                // store.dispatch("setError",errorText);
            }
        }
        // throw error;
        return Promise.reject(error);
    }
);

export default service
