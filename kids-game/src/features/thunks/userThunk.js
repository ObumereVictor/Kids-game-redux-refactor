import customAxios from "../../utils/axios";
import Cookies from "js-cookie";
import { logoutUser } from "../user/userSlice";
import { clearGame } from "../game/gameSlice";

const registerUserThunk = async (details, thunkAPI) => {
  try {
    const response = await customAxios.post("/api/v2/register", details);
    return response.data;
  } catch (error) {
    if (error.response.status === 404) {
      return thunkAPI.rejectWithValue("Cannot register User. Try Again!!!");
    }
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

const resendVerficationEmailThunk = async (email, thunkAPI) => {
  try {
    const response = await customAxios.post(`/api/v2/verify-email/${email}`, {
      email,
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue("Cannot send mail. Try again later");
  }
};

const sendResetPasswordMailThunk = async (email, thunkAPI) => {
  try {
    const response = await customAxios.post("/api/v2/forgot-password", {
      email,
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue("Request reset email failed!!");
  }
};

const loginUserThunk = async (userDetails, thunkAPI) => {
  try {
    const response = await customAxios.post("/api/v2/login", userDetails);

    Cookies.set("token", response.data.token);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

const uploadImageThunk = async (image, thunkAPI) => {
  try {
    const response = await customAxios.post("/api/v2/upload-image", image, {
      headers: {
        "Content-Type":
          "multipart/form-data boundary=------qttp0cNbWTsYJreJevWnSg43qdkpp1ZI",
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};
const completeProfileThunk = async (name, thunkAPI) => {
  try {
    const { profilePic, difficulty, token } = thunkAPI.getState().user.user;
    const response = await customAxios.patch(
      `/api/v2/update-profile`,
      {
        profilePic,
        difficulty,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

const clearStoreThunk = async (message, thunkAPI) => {
  try {
    thunkAPI.dispatch(logoutUser(message));
    thunkAPI.dispatch(clearGame);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject();
  }
};

const updatePasswordThunk = async (details, thunkAPI) => {
  const { token, newPassword } = details;
  try {
    const response = await customAxios.post(
      `/api/v2/reset-password/${token}`,
      details
    );

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export {
  loginUserThunk,
  registerUserThunk,
  resendVerficationEmailThunk,
  sendResetPasswordMailThunk,
  uploadImageThunk,
  completeProfileThunk,
  clearStoreThunk,
  updatePasswordThunk,
};
