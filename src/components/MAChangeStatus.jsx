// actions/userActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { updateUserStatusStart, updateUserStatusSuccess, updateUserStatusFailure } from "../redux/";

export const updateUserStatus = createAsyncThunk(
  'user/updateUserStatus',
  async (userId, { dispatch }) => {
    try {
      dispatch(updateUserStatusStart());
      const response = await axios.put(`http://localhost:3000/api/user/updateStatus/${userId}`);
      if (response.data.isSuccessfull) {
        dispatch(updateUserStatusSuccess(response.data.user));
      } else {
        dispatch(updateUserStatusFailure(response.data.message));
      }
    } catch (error) {
      dispatch(updateUserStatusFailure(error.message));
    }
  }
);
