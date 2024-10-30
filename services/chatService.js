import { api } from "../axios";

export const sendMsg = async ({ msg, _id }) => {
  
  try {
    const msgFormat = {
      message: msg.text,
      from: msg.user._id,
      to: msg.to,
    };
    const response = await api.POST(`/messages/${_id}`, msgFormat);
  } catch (error) {
    console.warn(error);
  }
};
