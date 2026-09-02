
import axios from "axios";

export function api() {
    const http = axios.create({
  baseURL: 'http://192.168.1.161:8000/api/',
  headers: {
    'content-type': 'application/json'
    }
});

}
