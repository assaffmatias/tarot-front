export const adaptMessage = ({ _id, createdAt, from, media, message }) => {
  const format = {
    _id,
    text: message,
    createdAt,
    user: {
      _id: from._id,
      name: from.userName,
      avatar: from.img || "https://via.placeholder.com/150/150",
    },
    image: media.img,
    audio: media.audio,
  };

  return format;
};
