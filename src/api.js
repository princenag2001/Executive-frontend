import axios from 'axios';
import config from './config.json';
export default class ApiClass {
    // Base URL for the API (you can get the URL from a utility function or hardcode it here)
    static nodeUrl = config.API_URL; // You can change this to a static URL or dynamic URL from your utility function

    //****************************** Configrations of header and parameters ****************************** */

    static config(isToken = true, headers = null, parameters = null) {
        let defaultHeaders = {
            Accept: "application/json"
        };
        let merge = {};
        if (isToken) {
            let token = { Authorization: "Bearer " + localStorage.getItem("token") }
            merge = Object.assign(defaultHeaders, token)
        }
        merge = Object.assign(defaultHeaders, headers)
        return {
            headers: merge,
            params: parameters
        }
    }
    
    // Handle unauthentication and redirect to the login page
    static unauthenticateRedirect() {
        localStorage.removeItem('user'); // Remove user data from localStorage
        localStorage.removeItem('token'); // Remove token from localStorage
        window.location.replace('/login'); // Redirect to login page
    }

    // GET request (API to fetch data)
    static getNodeRequest(apiUrl, isToken = true, headers = null, params = null) {
        return axios
            .get(this.nodeUrl + apiUrl, this.config(isToken, headers, params))
            .then((result) => {
                return result;
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    this.unauthenticateRedirect(); // Handle unauthorized errors by redirecting to login
                }
                throw error; // Rethrow error if it's not a 401 error
            });
    }

    // POST request (API to send data)
    static postNodeRequest(apiUrl, isToken = true, formData = null, headers = null, params = null) {
        console.log(this.nodeUrl + apiUrl, formData, this.config(isToken, headers, params));
        return axios
            .post(this.nodeUrl + apiUrl, formData, this.config(isToken, headers, params))
            .then((result) => {
                return result;
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    this.unauthenticateRedirect(); // Handle unauthorized errors by redirecting to login
                }
                throw error; // Rethrow error if it's not a 401 error
            });
    }

    // PUT request (API to update data)
    static putNodeRequest(apiUrl, isToken = true, formData = null, headers = null, params = null) {
        return axios
            .put(this.nodeUrl + apiUrl, formData, this.config(isToken, headers, params))
            .then((result) => {
                return result;
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    this.unauthenticateRedirect(); // Handle unauthorized errors by redirecting to login
                }
                throw error; // Rethrow error if it's not a 401 error
            });
    }

    // DELETE request (API to delete data)
    static deleteNodeRequest(apiUrl, isToken = true, headers = null, params = null) {
        return axios
            .delete(this.nodeUrl + apiUrl, this.config(isToken, headers, params))
            .then((result) => {
                return result;
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    this.unauthenticateRedirect(); // Handle unauthorized errors by redirecting to login
                }
                throw error; // Rethrow error if it's not a 401 error
            });
    }
}
