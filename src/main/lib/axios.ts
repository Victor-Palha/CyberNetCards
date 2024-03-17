import axios from "axios";
import { env } from "../../shared/constants/config";

export const API = axios.create({
    baseURL: env.API_SERVER,
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    },
})