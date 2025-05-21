import { Delete } from "@mui/icons-material";
import {
    Box,
    IconButton,
    Typography,
    TextField,
    MenuItem,
    Checkbox,
    Radio,
    Select,
    FormControl,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const QUESTION_TYPES = {
    Text: "TEXT",
    Radio: "RADIO",
    Checkboxes: "CHECKBOX",
    Dropdown: "DROPDOWN",
};

const Form = ({ questionData, questionCount, onDelete, questionnaireId }) => {
    const [question, setQuestion] = useState(questionData?.questionText || "Untitled Question");
    const [questionType, setQuestionType] = useState(questionData?.questionType || "RADIO");
    const [options, setOptions] = useState([]);
    const debounceTimer = useRef(null);

    // Fetch options from DB or add default one
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/choices/question/${questionData.id}`);
                let fetchedOptions = res.data.map(choice => ({
                    id: choice.id,
                    choiceText: choice.choiceText
                }));

                // If no options found, create Option 1 in DB
                if (fetchedOptions.length === 0) {
                    const defaultPayload = {
                        question: { id: questionData.id },
                        choiceText: "Option 1"
                    };
                    const defaultRes = await axios.post("http://localhost:8080/api/choices", defaultPayload, {
                        headers: { "Content-Type": "application/json" },
                    });
                    fetchedOptions = [{
                        id: defaultRes.data.id,
                        choiceText: defaultRes.data.choiceText
                    }];
                }

                setOptions(fetchedOptions);
            } catch (error) {
                console.error("Error fetching/creating default options:", error);
            }
        };

        if (questionData.id) fetchOptions();
    }, [questionData.id]);

    const handleSave = async () => {
        try {
            const questionPayload = {
                questionnaire: { id: questionnaireId },
                id: questionData.id,
                questionUUID: questionData.questionUUID,
                questionText: question,
                questionType: questionType,
            };
            await axios.put("http://localhost:8080/api/question", questionPayload, {
                headers: { "Content-Type": "application/json" },
            });

            await Promise.all(options.map(async (choice) => {
                const payload = {
                    question: { id: questionData.id },
                    choiceText: choice.choiceText
                };

                if (typeof choice.id === "number") {
                    // Update existing choice
                    await axios.put("http://localhost:8080/api/choices", { ...payload, id: choice.id }, {
                        headers: { "Content-Type": "application/json" },
                    });
                }
            }));
        } catch (error) {
            console.error("Auto-save failed:", error);
        }
    };

    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(handleSave, 1500);
        return () => clearTimeout(debounceTimer.current);
    }, [question, questionType, options]);

    const handleOptionChange = (index, value) => {
        const updated = [...options];
        updated[index].choiceText = value;
        setOptions(updated);
    };

    const addOption = async () => {
        try {
            const payload = {
                question: { id: questionData.id },
                choiceText: `Option ${options.length + 1}`
            };
            const res = await axios.post("http://localhost:8080/api/choices", payload, {
                headers: { "Content-Type": "application/json" },
            });
            setOptions([...options, { id: res.data.id, choiceText: res.data.choiceText }]);
        } catch (error) {
            console.error("Failed to add option:", error);
        }
    };

    const removeOption = async (index) => {
        const toRemove = options[index];
        try {
            await axios.delete(`http://localhost:8080/api/choices/${toRemove.id}`);
            setOptions(options.filter((_, i) => i !== index));
        } catch (error) {
            console.error("Failed to delete choice:", error);
        }
    };

    const renderOptionInput = (option, index) => {
        const InputControl =
            questionType === "CHECKBOX" ? Checkbox :
            questionType === "RADIO" ? Radio :
            null;

        return (
            <Box key={option.id} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                {InputControl && <InputControl disabled />}
                <TextField
                    variant="outlined"
                    placeholder="Enter option"
                    value={option.choiceText}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    sx={{ flex: 1, mr: 1 }}
                />
                <IconButton onClick={() => removeOption(index)}>
                    <Delete />
                </IconButton>
            </Box>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
        >
            <Box
                sx={{
                    background: "#fff",
                    maxWidth: "800px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    width: "100%",
                    mx: "auto",
                    p: 3,
                    borderRadius: 2,
                    mb: 2,
                }}
            >
                <FormControl sx={{ width: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="overline" sx={{ opacity: 0.5 }}>
                            Question {questionCount}
                        </Typography>
                        <IconButton onClick={onDelete}>
                            <Delete />
                        </IconButton>
                    </Box>

                    <Box sx={{ border: "1px solid #ccc", borderRadius: 2, mt: 1, p: 2 }}>
                        <TextField
                            fullWidth
                            placeholder="Enter question"
                            variant="outlined"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />

                        <Select
                            value={questionType}
                            onChange={(e) => setQuestionType(e.target.value)}
                            variant="outlined"
                            sx={{ mt: 1, width: "100%" }}
                        >
                            {Object.entries(QUESTION_TYPES).map(([label, value]) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>

                        <Box sx={{ mt: 2 }}>
                            {options.map((option, index) => renderOptionInput(option, index))}
                        </Box>

                        <Typography
                            onClick={addOption}
                            sx={{
                                color: "#1a73e8",
                                cursor: "pointer",
                                fontSize: "0.9rem",
                                mt: 2,
                            }}
                        >
                            + Add option
                        </Typography>
                    </Box>
                </FormControl>
            </Box>
        </motion.div>
    );
};

export default Form;
