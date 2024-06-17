import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  loginUserThunk,
  registerUserThunk,
  resendVerficationEmailThunk,
  sendResetPasswordMailThunk,
  uploadImageThunk,
  completeProfileThunk,
  clearStoreThunk,
  updatePasswordThunk,
} from "../thunks/userThunk";

import { toast } from "react-toastify";
import Cookies from "js-cookie";

import {
  addUserToLocalStorage,
  removeUserFromLocalStorage,
  getUserFromLocalStorage,
} from "../../utils";

const userInputs = {
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  age: "",
  username: "",
  terms: false,
  showTerms: false,
};
const initialState = {
  login: true,
  loading: false,
  ...userInputs,
  openModal: {
    show: false,
    msg: "",
  },
  registerData: {
    email: "",
    userId: "",
  },
  user: getUserFromLocalStorage(),
  profileEditing: false,
};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  registerUserThunk
);

export const resendVerficationEmail = createAsyncThunk(
  "user/resendVerificationEmail",
  resendVerficationEmailThunk
);

export const resetUserPassword = createAsyncThunk(
  "user/resetPassword",
  sendResetPasswordMailThunk
);
export const loginUser = createAsyncThunk("user/loginUser", loginUserThunk);

export const uploadImage = createAsyncThunk(
  "user/uploadImage",
  uploadImageThunk
);

export const completeProfile = createAsyncThunk(
  "user/completeProfile",
  completeProfileThunk
);

export const clearStore = createAsyncThunk("user/clearStore", clearStoreThunk);

export const updatePassword = createAsyncThunk(
  "user/UpdatePassword",
  updatePasswordThunk
);

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSignUp: (state) => {
      state = state.login = !state.login;
    },
    getUserInputs: (state, { payload }) => {
      const { name, value } = payload;
      if (name === "difficulty") {
        return { ...state, user: { ...state.user, [name]: value } };
      }
      return { ...state, [name]: value };
    },
    handleTerms: (state) => {
      state = state.showTerms = !state.showTerms;
    },
    handleModal: (state) => {
      state.openModal.show = !state.openModal.show;
      state.registerData.email = "";
      state.login = true;
      state.registerData.userId = "";
    },
    handleEditProfile: (state) => {
      state = state.profileEditing = !state.profileEditing;
    },
    logoutUser: () => {
      Cookies.remove("token");

      toast.success("Logging out..");
      removeUserFromLocalStorage();
      return { ...initialState, user: null };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state = state.loading = true;
    });

    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      toast.success(payload.msg);

      return {
        ...userInputs,
        ...initialState,
        login: false,
        loading: false,
        openModal: {
          ...state.openModal,
          show: true,
          msg: `Check ${
            state.registerData.email || state.email
          } for a link to verify your account.`,
        },
        registerData: {
          ...state.registerData,
          email: payload.email,
          userId: payload.userId,
        },
      };
    });

    // REGISTER USER BUILDER
    builder.addCase(registerUser.rejected, function (state, { payload }) {
      toast.error(payload);

      return { ...userInputs, ...initialState, login: false, loading: false };
    });

    // RESEND VERIFICATION MAIL
    builder.addCase(resendVerficationEmail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(resendVerficationEmail.fulfilled, (state, { payload }) => {
      state.loading = false;
      toast.success(payload.msg);
    });
    builder.addCase(resendVerficationEmail.rejected, (state, { payload }) => {
      state.loading = false;
      toast.error(payload);
    });

    // RESET USER PASSWORD
    builder.addCase(resetUserPassword.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(resetUserPassword.fulfilled, (state, { payload }) => {
      toast.success(payload.msg);
      state.loading = false;
      state.openModal = {
        ...state.openModal,
        show: true,
        msg: `Check ${
          state.registerData.email || state.email
        } for a reset password link to reset your password`,
      };
    });
    builder.addCase(resetUserPassword.rejected, (state, { payload }) => {
      toast.error(payload);
      state.loading = false;
    });

    // LOGIN USER
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      let {
        verified,
        email,
        userId,
        completedProfile,
        token,
        username,
        age,
        profilePic,
        difficulty,
        role,
      } = payload;
      let userData = {
        verified,
        email,
        userId,
        completedProfile,
        token,
        username,
        age,
        profilePic,
        difficulty,
        role,
      };
      if (verified === false) {
        toast.info("Please verify your account ");
        state.registerData.email = state.registerData.email || state.email;
        state.user = { ...state.user, ...userData };
        state.openModal = {
          ...state.openModal,
          show: true,
          msg: `Please Click on re-send verification link to get a new link`,
        };
      }

      if (verified && payload.completedProfile === false) {
        toast.info("Please complete your profile");
        state.user = {
          ...state.user,
          ...userData,
        };
      }
      if (completedProfile) {
        toast.success("Log in Successfully..");
        userData = { ...userData };
        state.user = { ...state.user, ...userData };
        addUserToLocalStorage(userData);
      }
    });
    builder.addCase(loginUser.rejected, (state, { payload }) => {
      state.loading = false;
      toast.error(payload);
    });
    builder.addCase(uploadImage.pending, (state) => {});
    builder.addCase(uploadImage.fulfilled, (state, { payload }) => {
      const { image } = payload;
      // toast.success(msg);
      state = state.user.profilePic = image;
      // addUserToLocalStorage(state.user);
    });
    builder.addCase(uploadImage.rejected, (state, { payload }) => {
      toast.error(payload);
    });

    // COMPLETE PROFILE
    builder.addCase(completeProfile.pending, (state) => {
      state = state.loading = true;
    });
    builder.addCase(completeProfile.fulfilled, (state, { payload }) => {
      state = state.loading = false;
      // removeUserFromLocalStorage();
      // const user = { ...state.user, difficulty: payload.difficulty };
      // addUserToLocalStorage(state.user);
    });
    builder.addCase(completeProfile.rejected, (state, { payload }) => {
      toast.error(payload);
      state = state.loading = false;
    });

    builder.addCase(clearStore.rejected, () => {
      toast.error("There was an error..");
    });

    builder.addCase(updatePassword.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updatePassword.fulfilled, (state) => {
      state.loading = false;
      toast.success("Your password was changed successfully!. Please Login");
    });
    builder.addCase(updatePassword.rejected, (state, { payload }) => {
      state.loading = false;
      toast.error(payload);
    });
  },
});

export const {
  setSignUp,
  getUserInputs,
  handleTerms,
  handleModal,
  handleEditProfile,
  logoutUser,
} = UserSlice.actions;
export default UserSlice.reducer;
