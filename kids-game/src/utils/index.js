import { toast } from "react-toastify";
import {
  addUserToLocalStorage,
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
} from "./localStorage";

// EMAIL VALIDATOR
const emailValidator = (email) => {
  // eslint-disable-next-line
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  if (!emailRegex.test(email)) {
    toast.error("Enter a Valid email Address");
    return false;
  }
  return email;
};

export {
  emailValidator,
  addUserToLocalStorage,
  removeUserFromLocalStorage,
  getUserFromLocalStorage,
};
