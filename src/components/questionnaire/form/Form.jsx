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
    Button,
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

const styles = {
    input: {
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
        },
        '& input[type=number]': {
            MozAppearance: 'textfield',
        }
    }
};


const Form = ({ questionData, loanCategory, questionCount, isLast=false, onDelete, questionnaireId }) => {
    const [question, setQuestion] = useState(questionData?.questionText || "Untitled Question");
    const [questionType, setQuestionType] = useState(questionData?.questionType || "RADIO");
    const [options, setOptions] = useState([]);
    const [rules, setRules] = useState({});
    const debounceTimer = useRef(null);
    const hasFetchedRef = useRef(false);


    const fetchRules = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/rules/${loanCategory}`);
            setRules(res.data);
        } catch (error) {
            console.error("Error fetching rules:", error);
        }
    }

    useEffect(() => {
        fetchRules();
    },[loanCategory]);

    const fetchOptions = async () => {
        if (hasFetchedRef.current || !questionData.id) return;
        hasFetchedRef.current = true;

        try {
            const res = await axios.get(`http://localhost:8080/api/choices/question/${questionData.id}`);
            let fetchedOptions = res.data.map(choice => ({
                id: choice.id,
                choiceText: choice.choiceText,
                score: choice.score
            }));

            if (fetchedOptions.length === 0) {
                const payload = {
                    question: { id: questionData.id },
                    choiceText: "Option 1",
                    score: 0
                };

                const created = await axios.post("http://localhost:8080/api/choices", payload, {
                    headers: { "Content-Type": "application/json" },
                });

                fetchedOptions = [{
                    id: created.data.id,
                    choiceText: created.data.choiceText,
                    score: created.data.score
                }];
            }

            setOptions(fetchedOptions);
        } catch (error) {
            console.error("Error fetching/creating default options:", error);
        }
    };

    useEffect(() => {
        if (questionData?.id) fetchOptions();
    }, [questionData?.id]);

    const handleSave = async () => {
        if (!questionData?.id) return;

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
                if (!choice.choiceText?.trim()) return;
                const payload = {
                    question: { id: questionData.id },
                    choiceText: choice.choiceText.trim(),
                    score: Number(choice.score) || 0,
                    id: choice.id
                };

                await axios.put("http://localhost:8080/api/choices", payload, {
                    headers: { "Content-Type": "application/json" },
                });
            }));
        } catch (error) {
            console.error("Auto-save failed:", error);
        }
    };

    useEffect(() => {
        if (!questionData?.id || !options.length) return;
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(handleSave, 1500);
        return () => clearTimeout(debounceTimer.current);
    }, [question, questionType, options]);

    const handleOptionChange = (index, value, isScore = false) => {
        const updated = [...options];
        if (isScore) {
            updated[index].score = value;
        } else {
            updated[index].choiceText = value;
        }
        setOptions(updated);
    };

    const addOption = async () => {
        try {
            const payload = {
                question: { id: questionData.id },
                choiceText: `Option ${options.length + 1}`,
                score: 0
            };
            const res = await axios.post("http://localhost:8080/api/choices", payload, {
                headers: { "Content-Type": "application/json" },
            });
            setOptions([...options, { id: res.data.id, choiceText: res.data.choiceText, score: res.data.score }]);
        } catch (error) {
            console.error("Failed to add option:", error);
        }
    };

    const removeOption = async (index) => {
        const toRemove = options[index];
        console.log(toRemove);
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
            <Box key={option.id || index} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                {InputControl && <InputControl disabled />}
                <TextField
                    variant="outlined"
                    placeholder="Enter option"
                    value={option.choiceText}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    sx={{ flex: 1, mr: 1 }}
                />
                <TextField
                    variant="outlined"
                    type="number"
                    value={option.score}
                    label="score"
                    onChange={(e) => handleOptionChange(index, e.target.value, true)}
                    InputProps={{
                        inputProps: {
                            style: { width: 50, MozAppearance: 'textfield' },
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            step: "any",
                        },
                    }}
                    sx={{ ...styles.input, flex: 1, maxWidth: "10%", minWidth: "70px", mr: 1 }}
                />
                <IconButton onClick={() => removeOption(index)}>
                    <Delete />
                </IconButton>
            </Box>
        );
    };

    const defaultQuestion = async (val) => {
        if (!questionData?.id) {
            console.error("Question ID not found.");
            return;
        }

        let choices = [];
        removeOption(0);
        if (val === 'sector') {
            setQuestion("What sector from below most suits your project?");
            setQuestionType("DROPDOWN");
            const sectors = [...new Set(rules.map(rule => rule.sector))];

            // Create options in backend
            choices = await Promise.all(sectors.map(async (sector) => {
                const payload = {
                    question: { id: questionData.id },
                    choiceText: sector,
                    score: 0
                };
                const res = await axios.post("http://localhost:8080/api/choices", payload, {
                    headers: { "Content-Type": "application/json" },
                });
                return { id: res.data.id, choiceText: res.data.choiceText, score: res.data.score };
            }));
        } else if (val === 'activity') {
            setQuestion("What activity from below most suits your project?");
            setQuestionType("DROPDOWN");
            const activities = [...new Set(rules.map(rule => rule.activityName))];

            choices = await Promise.all(activities.map(async (activity) => {
                const payload = {
                    question: { id: questionData.id },
                    choiceText: activity,
                    score: 0
                };
                const res = await axios.post("http://localhost:8080/api/choices", payload, {
                    headers: { "Content-Type": "application/json" },
                });
                return { id: res.data.id, choiceText: res.data.choiceText, score: res.data.score };
            }));
        }
        setOptions(choices);
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
            {
                isLast &&
                (
                    <Box 
                        sx={{
                            background: "#fff",
                            maxWidth: "800px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                            width: "100%",
                            mx: "auto",
                            p: "2rem",
                            pt: "0.5rem",
                            borderRadius: 2,
                            mb: 2
                        }}
                    >
                        <Typography sx={{opacity: 0.7}} variant="caption">You can ask built in questions like from below.</Typography>
                        <Box
                            sx={{
                                mt: 2,
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 2,
                            }}
                        >
                            <Button variant="outlined" onClick={() => defaultQuestion("sector")}>What sector?</Button>
                            <Button variant="outlined" onClick={() => defaultQuestion("activity") }>What activity?</Button>
                        </Box>
                    </Box>
                )
            }
        </motion.div>
    );
};

export default Form;
