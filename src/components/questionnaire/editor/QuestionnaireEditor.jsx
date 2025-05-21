import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    IconButton,
    Typography,
    TextField,
    Button,
} from "@mui/material";
import { Home, Add, ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import Form from "../form/Form.jsx";
import { useParams } from "react-router";
import axios from "axios";
import { Select } from "antd";

const QuestionnaireEditor = () => {
    const debounceTimer = useRef(null);
    const { id } = useParams();
    const [questionnaireData, setQuestionnaireData] = useState(null);
    const [title, setTitle] = useState("Untitled Questionnaire");
    const [description, setDescription] = useState("Form description");
    const [loanCategoryOptions, setLoanCategoryOptions] = useState([]);
    const [selectedLoanCategory, setSelectedLoanCategory] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [showTemplates, setShowTemplates] = useState(false);

    // Fetch Questionnaire Info
    useEffect(() => {
        const fetchQuestionnaire = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/questionnaire/form/${id}`);
                setQuestionnaireData(res.data);
                setTitle(res.data.title);
                setDescription(res.data.description);
                setSelectedLoanCategory(res.data.loanCategory);
            } catch (error) {
                console.error("Error fetching questionnaire:", error);
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
                        questionUUID: uuidv4()
                    }
                ]);
            }
        };
        fetchQuestions();
    }, [questionnaireData]);

    // Fetch Loan Category Options
    useEffect(() => {
        const fetchLoanCategories = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/loans/categories");
                setLoanCategoryOptions(res.data); // expects an array
            } catch (error) {
                console.error("Failed to fetch loan categories:", error);
            }
        };
        fetchLoanCategories();
    }, []);

    // Save questionnaire
    const handleSave = async () => {
        const updated = {
            id: questionnaireData.id,
            title,
            description,
            loanCategory: selectedLoanCategory,
        };
        console.log("Updated:", updated);
        try {
            const response = await axios.put(`http://localhost:8080/api/questionnaire`, updated);
            console.log("Saved:", response.data);
        } catch (error) {
            console.error("Failed to save questionnaire:", error);
        }
    };

    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(handleSave, 1500);
        return () => clearTimeout(debounceTimer.current);
    }, [title, description, selectedLoanCategory]);
    

    // Add new question
    const addNewQuestion = async () => {
        const newQ = {
            questionnaire: {
                id: questionnaireData.id,
            },
            questionText: "Untitled Question",
            questionType: "RADIO",
            questionUUID: uuidv4()
        };

        try {
            const res = await axios.post(
                `http://localhost:8080/api/question`,
                newQ,
                { headers: { 'Content-Type': 'application/json' } }
            );
            setQuestions(prev => [...prev, res.data]);
        } catch (error) {
            console.error("Failed to add question:", error);
        }
    };

    // Remove question locally
    const removeQuestion = (questionUUID) => {
        setQuestions(prev => prev.filter(q => q.questionUUID !== questionUUID));
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
                <IconButton onClick={() => window.location.href = "/"} sx={{ color: "#2D2D2D" }}>
                    <Home fontSize="large" />
                </IconButton>
                <Typography variant="inherit" sx={{ ml: 2 }}>
                    Questionnaire Form
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Button variant="contained" onClick={handleSave}>Save</Button>
                <Button variant="contained">Publish</Button>
            </Box>

            {/* Templates Dropdown */}
            <Box
                sx={{
                    background: "#fff",
                    maxWidth: "800px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    width: "100%",
                    mx: "auto",
                    transition: "0.3s ease",
                    p: 3,
                    borderRadius: 2,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                        Survey Templates
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton onClick={() => setShowTemplates(!showTemplates)}>
                        {showTemplates ? <ArrowDropUp /> : <ArrowDropDown />}
                    </IconButton>
                </Box>
                {showTemplates && (
                    <Box sx={{ mt: 2 }}>
                        <Typography
                            sx={{
                                m: 3,
                                opacity: 0.6,
                                textAlign: "center",
                                width: "100%",
                            }}
                        >
                            No templates available
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Title, Description, Loan Category */}
            <Box
                sx={{
                    background: "#fff",
                    maxWidth: "800px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    width: "100%",
                    mx: "auto",
                    transition: "0.3s ease",
                    p: 3,
                    borderRadius: 2,
                }}
            >
                <TextField
                    fullWidth
                    variant="standard"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Questionnaire title"
                    inputProps={{
                        style: { fontSize: "1.5rem", fontWeight: "bold", padding: '15px 2px 4px 2px' },
                    }}
                />
                <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mt: 2 }}
                    inputProps={{
                        style: { padding: '15px 2px 4px 2px' },
                    }}
                />

                <Select
                    style={{ width: "100%", marginTop: "1.5rem"}}
                    placeholder="Select Loan Category"
                    value={selectedLoanCategory}
                    onChange={setSelectedLoanCategory}
                >
                    {loanCategoryOptions.map((category) => (
                        <Select.Option style={{ padding: '15px 2px 15px 15px' }} key={category} value={category}>
                            {category}
                        </Select.Option>
                    ))}
                </Select>
            </Box>

            {/* Questions */}
            <AnimatePresence>
                {questions.map((q, index) => (
                    <motion.div
                        key={q.questionUUID}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Form
                            questionCount={index + 1}
                            questionData={q}
                            questionnaireId={q.questionnaire?.id}
                            onDelete={() => removeQuestion(q.questionUUID)}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Add Question Button */}
            <Box
                sx={{
                    maxWidth: "800px",
                    margin: "0 auto",
                    width: "100%",
                }}
            >
                <Button variant="contained" onClick={addNewQuestion} endIcon={<Add />}>
                    Add Question
                </Button>
            </Box>
        </Box>
    );
};

export default QuestionnaireEditor;
