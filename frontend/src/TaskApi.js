import axios from "axios";

// APIエンドポイントのベースURL
const API_BASE_URL = "/api";

// タスクデータをフェッチする関数
export const fetchData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    console.log("GET tasks");
    return response.data;
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return null;
  }
};

// タスクデータを更新する関数
export const updateData = async (parentTasks) => {
  try {
    console.log("PUT tasks Start");
    console.log(parentTasks);
    const response = await axios.put(`${API_BASE_URL}/tasks`, {
      tasks: parentTasks,
    });
    console.log("PUT tasks End");
    return response.data;
  } catch (error) {
    console.error("An error occurred while updating data:", error);
    return null;
  }
};
