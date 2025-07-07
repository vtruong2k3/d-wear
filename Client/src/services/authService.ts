import axios from "axios";

export const loginWithGoogle = async (accessToken: string) => {
  const response = await axios.post("api/auth/google", {
    access_token: accessToken,
  });
  return response.data;
};
