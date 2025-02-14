import { io } from "socket.io-client";

const socket = io("http://localhost:5001", { autoConnect: false }); // Do not auto-connect

export default socket;
