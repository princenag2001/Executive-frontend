import Cookies from "js-cookie";

const persistedStore = {
  user: () => JSON.parse(localStorage.getItem("user")),
  token: () => Cookies.get("token") ? true : false, // Get token from cookies
};
// Console log to check values
console.log("User:", persistedStore.user());
console.log("Token:", persistedStore.token()); // Check if token is retrieved
export default persistedStore;

  