import React, { useEffect, useState } from 'react';
import './Questionnaire.css';
import Navbar from "../theme/navbar/Navbar.jsx";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router";

const templates = [
    { title: "Blank form", color: "#f0f0f0", icon: "📄" },
    { title: "Contact Information", color: "#c8e6c9", icon: "🧑" },
    { title: "RSVP", color: "#ffe0b2", icon: "✨" },
    { title: "Party Invite", color: "#ffccbc", icon: "🎉" },
    { title: "T-Shirt Sign Up", color: "#e1bee7", icon: "👕" },
];

const cardColors = [
    "#e3f2fd", "#fce4ec", "#e8f5e9", "#fff3e0", "#ede7f6", "#f3e5f5", "#e0f7fa", "#fffde7", "#f9fbe7", "#f1f8e9",
    "#e0f2f1", "#f1f8e9", "#e8f5e9", "#fce4ec", "#f3e5f5", "#ede7f6", "#e1f5fe", "#e3f2fd", "#f9fbe7", "#fff9c4",
    "#ffe0b2", "#ffccbc", "#dcedc8", "#c8e6c9", "#b2dfdb", "#b3e5fc", "#b2ebf2", "#c5cae9", "#d1c4e9", "#f8bbd0",
    "#ffccbc", "#ffe082", "#e6ee9c", "#80deea", "#a5d6a7", "#d7ccc8", "#cfd8dc", "#ffecb3", "#f0f4c3", "#fce4ec",
    "#e1bee7", "#d1c4e9", "#c8e6c9", "#b3e5fc", "#e0f2f1", "#f9fbe7", "#f3e5f5", "#f8bbd0", "#c5cae9", "#e6ee9c"
];

function Questionnaire() {
    const navigate = useNavigate();
    const [forms, setForms] = useState([]);
    const [deletingForms, setDeletingForms] = useState([]);
    const [creating, setCreating] = useState(false); // NEW

    const formResponse = async () => {
        const response = await axios.get("http://localhost:8080/api/questionnaire");
        setForms(response.data.reverse());
    };

    useEffect(() => {
        formResponse();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreating(true); // NEW
        const questionnaireParms = {
            formUrlId: uuidv4(),
            title: "Untitled Form",
            description: "Form description",
        };
        try {
            const response = await axios.post("http://localhost:8080/api/questionnaire", questionnaireParms, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const questionParms = {
                questionnaire: {
                    id: response.data.id,
                },
                questionText: "Untitled Question",
                questionType: "CHECKBOX",
                questionUUID: uuidv4(),
            }
            await axios.post("http://localhost:8080/api/question", questionParms, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            navigate("/questionnaire/editor/" + response.data.formUrlId);   
        } catch (error) {
            console.error("Error posting data:", error);
            setCreating(false); // Hide on error
        }
    };

    const handleDelete = async (form) => {
        setDeletingForms(prev => [...prev, form.id]);

        setTimeout(async () => {
            try {
                await axios.delete(`http://localhost:8080/api/questionnaire/${form.id}`);
                setForms(prev => prev.filter(f => f.id !== form.id));
                setDeletingForms(prev => prev.filter(id => id !== form.id));
            } catch (error) {
                console.error("Error deleting form:", error);
            }
        }, 300); // match CSS transition
    };

    return (
        <div>
            {creating && (
                <div className="creating-overlay">
                    <div className="spinner" />
                    <span className="creating-text">Creating Form...</span>
                </div>
            )}
            <Navbar style={{ position: "relative" }} isDark />
            <div className="template-section">
                <h3>Start a new form</h3>
                <div className="template-grid">
                    {templates.map((tpl, index) => (
                        <div onClick={handleSubmit} key={index} className="template-card" style={{ backgroundColor: tpl.color }}>
                            <div className="form-preview">{tpl.icon}</div>
                            <p>{tpl.title}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="recent-section">
                <h3>Recent forms</h3>
                {forms.length === 0 ? (
                    <p className="no-forms">No forms yet</p>
                ) : (
                    <div className="form-grid">
                        {forms.map((form, index) => (
                            <div
                                key={index}
                                className={`form-card-wrapper ${deletingForms.includes(form.id) ? 'fade-out' : ''}`}
                            >
                                <div
                                    className="form-card"
                                    style={{ backgroundColor: cardColors[index % cardColors.length] }}
                                >
                                    {deletingForms.includes(form.id) && (
                                        <div className="deleting-overlay">
                                            <div className="spinner" />
                                            <span className="deleting-text">Deleting...</span>
                                        </div>
                                    )}
                                    <div className="delete-icon" onClick={() => handleDelete(form)}>
                                        <DeleteIcon />
                                    </div>
                                    <div className="form-content" onClick={() => navigate(`/questionnaire/editor/${form.formUrlId}`)}>
                                        <div className="form-icon">📄</div>
                                        <div className="form-info">
                                            <h4>{form.title}</h4>
                                            <p>{form.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Questionnaire;
