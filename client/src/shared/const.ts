export const API = "https://api.magnusfulton.com/instagram/";
export var API_HOST: string;
if (process.env.NODE_ENV === "development") {
  API_HOST = `${API}api`;
} else {
  API_HOST = "http://localhost:3000/instagram/api";
}