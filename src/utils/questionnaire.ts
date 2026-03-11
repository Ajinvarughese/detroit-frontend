import axios from "axios";
import { API_URL } from "../components/hooks/apiUrl";

export const fetchGeneratedQuestionnaire = async (payload: any) => {
    const res = await axios.post(`${API_URL}/questionnaire/ai/generate`, payload);
    return res.data;
}

export const deleteQuestionnaire = async (questionnaireId: string) => {
    await axios.delete(`${API_URL}/questionnaire/${questionnaireId}`);    
};