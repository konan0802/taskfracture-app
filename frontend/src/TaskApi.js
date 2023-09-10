import axios from "axios";

// APIエンドポイントのベースURL
const API_BASE_URL = "/api";

// タスクデータをフェッチする関数
export const fetchData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return null;
  }
};

// タスクデータを更新する関数
export const updateData = async (parentTasks) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/tasks`, {
      tasks: parentTasks,
    });
    return response.data;
  } catch (error) {
    console.error("An error occurred while updating data:", error);
    return null;
  }
};
