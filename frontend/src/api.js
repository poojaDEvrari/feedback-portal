// src/api.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

export const downloadFeedback = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/feedback/download", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "feedbacks.json");
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading feedback:", error);
        throw error;
    }
};

const apiKey = 'AIzaSyAzvIrpQ4_F1d7X6lBwtzJCdMqZdvm7_tw';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 11000,
  responseMimeType: "text/plain",
};

export const generateLearningPath = async (domain, level, description) => {
  const prompt = `Generate a learning path for the domain "${domain}", level "${level}", and description "${description}".`;

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  try {
    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error fetching the learning path:", error);
    throw error;
  }
};
