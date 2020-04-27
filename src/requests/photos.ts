export const API_HOST = "http://localhost:8080";

export const getAllPhotos = async () => fetch(`${API_HOST}/photos`);
export const uploadPhoto = async (content: string) =>
  fetch(`${API_HOST}/photo`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
export const deletePhoto = async (id: string) => fetch(`${API_HOST}/photo/${id}`, { method: "DELETE" });
