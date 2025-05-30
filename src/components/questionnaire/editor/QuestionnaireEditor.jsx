import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    IconButton,
    Typography,
    TextField,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
} from "@mui/material";
import { Home, Add, ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import Form from "../form/Form.jsx";
import { useParams } from "react-router";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router";

const QuestionnaireEditor = () => {
    const navigate = useNavigate();
    const debounceTimer = useRef(null);
    const { id } = useParams();
    const [questionnaireData, setQuestionnaireData] = useState(null);
    const [title, setTitle] = useState("Untitled Questionnaire");
    const [description, setDescription] = useState("Form description");
    const [loanCategoryOptions, setLoanCategoryOptions] = useState([]);
    const [selectedLoanCategory, setSelectedLoanCategory] = useState(null);
    const [questionnaireType, setQuestionnaireType] = useState("NORMAL"); // New field
    const [questions, setQuestions] = useState([]);
    const [showTemplates, setShowTemplates] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch Questionnaire Info
    useEffect(() => {
        const fetchQuestionnaire = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/questionnaire/form/${id}`);
                setQuestionnaireData(res.data);
                setTitle(res.data.title);
                setDescription(res.data.description);
                setSelectedLoanCategory(res.data.loanCategory);
                setQuestionnaireType(res.data.questionnaireType || "NORMAL"); // default fallback
            } catch (error) {
                navigate("/questionnaire");
            }
        };
        fetchQuestionnaire();
    }, [id]);

    // Fetch Questions
    useEffect(() => {
        if (!questionnaireData?.id) return;
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/question/questionnaire/${questionnaireData?.id}`);
                setQuestions(res.data);
            } catch (error) {
                console.error("Error fetching questions:", error);
                setQuestions([
                    {
                        questionnaireId: questionnaireData.id,
                        questionText: "Untitled Question",
                        questionType: "RADIO",
                        questionUUID: uuidv4(),
                    },
                ]);
            }
        };
        fetchQuestions();
    }, [questionnaireData]);

    // Fetch Loan Category Options
    useEffect(() => {
        const fetchLoanCategories = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/loan/categories");
                setLoanCategoryOptions(res.data);
            } catch (error) {
                console.error("Failed to fetch loan categories:", error);
            }
        };
        fetchLoanCategories();
    }, []);

    // Save questionnaire
    const handleSave = async () => {
        setIsLoading(true);
        const updated = {
            id: questionnaireData.id,
            title,
            description,
            loanCategory: selectedLoanCategory,
            questionnaireType, // Include new field
        };
        try {
            await axios.put(`http://localhost:8080/api/questionnaire`, updated);
        } catch (error) {
            console.error("Failed to save questionnaire:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(handleSave, 1500);
        return () => clearTimeout(debounceTimer.current);
    }, [title, description, selectedLoanCategory, questionnaireType]); // Watch new field

    // Add new question
    const addNewQuestion = async () => {
        const newQ = {
            questionnaire: { id: questionnaireData.id },
            questionText: "Untitled Question",
            questionType: "RADIO",
            questionUUID: uuidv4(),
        };
        try {
            const res = await axios.post(`http://localhost:8080/api/question`, newQ, {
                headers: { "Content-Type": "application/json" },
            });
            setQuestions((prev) => [...prev, res.data]);
        } catch (error) {
            console.error("Failed to add question:", error);
        }
    };

    // Remove question
    const removeQuestion = async (questionData) => {
        setQuestions((prev) => prev.filter((q) => q.questionUUID !== questionData.questionUUID));
        await axios.delete(`http://localhost:8080/api/question/${questionData.id}`);
    };

    return (
        <Box
            sx={{
                background: "#f0ebf8",
                color: "#2d2d2d",
                minHeight: "100vh",
                padding: "7rem 5%",
                display: "flex",
                flexDirection: "column",
                gap: 5,
            }}
        >
            {/* Top Bar */}
            <Box
                sx={{
                    position: "absolute",
                    top: 20,
                    width: "95%",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
                    zIndex: 100,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#fff",
                    p: "0.6rem 2%",
                    display: "flex",
                    borderRadius: 2,
                    alignItems: "center",
                }}
            >
                <IconButton onClick={() => navigate("/questionnaire")} sx={{ color: "#2D2D2D" }}>
                    <Home fontSize="large" />
                </IconButton>
                <Typography variant="inherit" sx={{ ml: 2 }}>Questionnaire Form</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Button loading={isLoading} disabled={isLoading} variant="outlined" onClick={handleSave}>Save</Button>
                <Button disabled={isLoading} onClick={() => navigate(`/questionnaire/preview/${id}`)} sx={{ ml: 2 }} variant="contained">Preview</Button>
            </Box>

            {/* Templates Dropdown */}
            <Box sx={{ background: "#fff", maxWidth: "800px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", width: "100%", mx: "auto", p: 3, borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Survey Templates</Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton onClick={() => setShowTemplates(!showTemplates)}>{showTemplates ? <ArrowDropUp /> : <ArrowDropDown />}</IconButton>
                </Box>
                {showTemplates && (
                    <Box sx={{ mt: 2 }}>
                        <Typography sx={{ m: 3, opacity: 0.6, textAlign: "center", width: "100%" }}>No templates available</Typography>
                    </Box>
                )}
            </Box>

            {/* Title, Description, Loan Category, Questionnaire Type */}
            <Box sx={{ background: "#fff", maxWidth: "800px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", width: "100%", mx: "auto", p: 3, borderRadius: 2 }}>
                <TextField fullWidth variant="standard" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Questionnaire title" inputProps={{ style: { fontSize: "1.5rem", fontWeight: "bold", padding: '15px 2px 4px 2px' } }} />
                <TextField fullWidth variant="standard" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mt: 2 }} inputProps={{ style: { padding: '15px 2px 4px 2px' } }} />

                <Select style={{ width: "100%", marginTop: "1.5rem" }} placeholder="Select Loan Category" value={selectedLoanCategory} onChange={setSelectedLoanCategory}>
                    {loanCategoryOptions.map((category) => (
                        <Select.Option style={{ padding: '15px 2px 15px 15px' }} key={category} value={category}>
                            {category.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </Select.Option>
                    ))}
                </Select>

                {/* New Field: Questionnaire Type */}
                <FormControl component="fieldset" sx={{ mt: 3 }}>
                    <FormLabel component="legend">Questionnaire Type</FormLabel>
                    <RadioGroup row value={questionnaireType} onChange={(e) => setQuestionnaireType(e.target.value)}>
                        <FormControlLabel value="NORMAL" control={<Radio />} label="Normal" />
                        <FormControlLabel value="PRIMARY" control={<Radio />} label="Primary" />
                    </RadioGroup>
                </FormControl>
            </Box>

            {/* Questions */}
            <AnimatePresence>
                {questions.map((q, index) => (
                    <motion.div key={q.questionUUID} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
                        <Form 
                            questionCount={index + 1} 
                            isLast={index >= questions.length-1}
                            questionData={q} 
                            questionnaireId={q.questionnaire?.id} 
                            onDelete={() => removeQuestion(q)} 
                            loanCategory={selectedLoanCategory}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
            {/* Add Question Button */}
            <Box sx={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
                <Button variant="contained" onClick={addNewQuestion} endIcon={<Add />}>Add Question</Button>
            </Box>
        </Box>
    );
};

export default QuestionnaireEditor;
