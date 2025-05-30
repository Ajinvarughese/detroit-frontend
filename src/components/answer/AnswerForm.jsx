import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
  LinearProgress,
  Paper,
} from '@mui/material';
import { Select } from 'antd';
import { useNavigate, useParams } from 'react-router';
import { getUser } from '../hooks/LocalStorageUser';
import { toCamelCase } from '../hooks/EnumToString';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const { Option } = Select;

const AnswerForm = ({ preview = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [questionnaire, setQuestionnaire] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notEligible, setNotEligible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/questionnaire/u/form/${id}`);
        setQuestionnaire(response.data);
        const fetchedQuestions = response.data.questions.map((q) => ({
          id: q.id,
          text: q.questionText,
          type: q.questionType,
          options: q.choices.map((choice) => ({
            id: choice.id,
            text: choice.choiceText,
          })),
        }));
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (qid, value) => {
    setResponses((prev) => ({ ...prev, [qid]: value }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const submission = Object.values(responses).flatMap((response) => {
      if (Array.isArray(response)) {
        return response.map((res) => ({
          user: { id: getUser("user").id },
          choice: res.choiceId ? { id: res.choiceId } : null,
          answerText: res.value
        }));
      } else {
        return {
          user: { id: getUser("user").id },
          choice: response.choiceId ? { id: response.choiceId } : null,
          answerText: response.value
        };
      }
    });

    if(!preview) {
      try {
        const param = {
          questionnaire: { id: questionnaire.id },
          user: { id: getUser("user").id },
          answers: submission
        };
        console.log(param);
        const res = await axios.post("http://localhost:8080/api/loan", param, {
          'Content-type': 'application/json'
        });
        navigate(`/loan/application/${toCamelCase(questionnaire.loanCategory)}/${res.data.loanUUID}`);
      } catch (error) {
        if (error.response && error.response.status === 406) {
          console.log("Not acceptable");
          setNotEligible(true);
        } else {
          console.error('Error submitting data:', error);
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  if (notEligible) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Paper elevation={6} sx={{ p: 4, maxWidth: 500, textAlign: 'center', borderRadius: 3 }}>
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" color="error" gutterBottom>
            Not Eligible
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Unfortunately, you are not eligible for this loan due to not meeting the sustainability criteria.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/loan/${toCamelCase(questionnaire.loanCategory)}`)}
          >
            Go Back
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!questions.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  const question = questions[currentIndex];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(https://img.freepik.com/free-vector/subtle-rombus-white-gray-pattern-background_1017-25098.jpg)',
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper elevation={6} sx={{ 
          width: 500, 
          p: 4, 
          borderRadius: 3 
        }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Button onClick={handlePrev} disabled={currentIndex === 0} startIcon={<ArrowBackIcon />}>
            Back
          </Button>
          <Box sx={{ flexGrow: 1, ml: 2 }}>
            <LinearProgress
              variant="determinate"
              value={((currentIndex + 1) / questions.length) * 100}
            />
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom>{question.text}</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          {question.type === 'TEXT'
            ? 'Please enter your answer here.'
            : question.type === 'RADIO'
            ? 'Please select an option.'
            : question.type === 'FILE'
            ? 'Please upload your file here.'
            : question.type === 'CHECKBOX'
            ? 'Please select all that apply.'
            : question.type === 'DROPDOWN'
            ? 'Please select an option from the dropdown.'
            : ''}
        </Typography>

        {/* Render different input types */}
        {question.type === 'TEXT' && (
          <TextField
            fullWidth
            variant="outlined"
            value={responses[question.id]?.value || ''}
            onChange={(e) => handleChange(question.id, { value: e.target.value })}
          />
        )}
        {question.type === 'RADIO' && (
          <FormControl component="fieldset">
            <RadioGroup
              value={responses[question.id]?.choiceId || ''}
              onChange={(e) =>
                handleChange(question.id, {
                  choiceId: parseInt(e.target.value),
                  value: question.options.find((o) => o.id === parseInt(e.target.value)).text,
                })
              }
            >
              {question.options.map((opt) => (
                <FormControlLabel key={opt.id} value={opt.id} control={<Radio />} label={opt.text} />
              ))}
            </RadioGroup>
          </FormControl>
        )}
        {question.type === 'CHECKBOX' && (
          <FormControl component="fieldset">
            {question.options.map((opt) => (
              <FormControlLabel
                key={opt.id}
                control={
                  <Checkbox
                    checked={responses[question.id]?.some((res) => res.choiceId === opt.id) || false}
                    onChange={(e) => {
                      const prevChoices = responses[question.id] || [];
                      const updatedChoices = e.target.checked
                        ? [...prevChoices, { choiceId: opt.id, value: opt.text }]
                        : prevChoices.filter((res) => res.choiceId !== opt.id);
                      handleChange(question.id, updatedChoices);
                    }}
                  />
                }
                label={opt.text}
              />
            ))}
          </FormControl>
        )}
        {question.type === 'FILE' && (
          <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
            Upload File
            <input
              type="file"
              hidden
              onChange={(e) => handleChange(question.id, { file: e.target.files[0] })}
            />
          </Button>
        )}
        {question.type === 'DROPDOWN' && (
          <Select
            style={{ width: '100%', height: 54 }}
            placeholder="Select an option"
            value={responses[question.id]?.choiceId || undefined}
            onChange={(value) => {
              const selectedOption = question.options.find((opt) => opt.id === value);
              handleChange(question.id, { choiceId: selectedOption.id, value: selectedOption.text });
            }}
          >
            {question.options.map((opt) => (
              <Option style={{padding: "15px 10px", borderRadius: '0', borderTop:"1px solid #ccc"}} key={opt.id} value={opt.id}>{opt.text}</Option>
            ))}
          </Select>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleNext}
          disabled={
            !responses[question.id] ||
            (question.type === 'CHECKBOX' && responses[question.id].length === 0)
          }
        >
          {currentIndex === questions.length - 1 ? 'Submit' : 'Continue'}
        </Button>
      </Paper>
    </Box>
  );
};

export default AnswerForm;
