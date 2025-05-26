import React, { useEffect, useState } from 'react';
import Navbar from "../theme/navbar/Navbar.jsx";
import { processSteps, loanData } from './data.jsx';
import { ArrowForward } from '@mui/icons-material';
import Footer from "../../landing/Footer.jsx"
import { getUser } from '../hooks/LocalStorageUser.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router';

const LoanPage = ({ type }) => {
    const navigate = useNavigate();
    const data = loanData[type];
    const [formId, setFormId] = useState(null);

    if (!data) {
        return <div>Loan type not found.</div>;
    }

    const { hero, benefits } = data;

    const getForm = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/questionnaire/loan/${type}`);     
            const questionnaires = response.data;

            // Find the questionnaire where questionnaireType is "PRIMARY"
            const primaryQuestionnaire = questionnaires.find(q => q.questionnaireType === "PRIMARY");
            setFormId(primaryQuestionnaire.formUrlId);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getForm();
    }, [type]);

    return (
        <div className="font-sans">
            <Navbar />
            {/* Hero Section */}
            <section className="bg-gradient-to-tr from-green-700 to-green-400 text-white py-24 text-center px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="inline-flex items-center bg-white text-green-700 bg-opacity-20 rounded-full px-4 py-1 mb-6 text-lg font-semibold gap-2 justify-center mx-auto">
                        {hero.subtitle}
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4">
                        {hero.title.split('\n').map((line, idx) => (
                            <span key={idx}>{line}<br/></span>
                        ))}
                    </h1>
                    <p className="max-w-xl mx-auto opacity-90 mb-10 text-lg">
                        {hero.description}
                    </p>
                    {
                        getUser("user").role == "APPLICANT" && (
                            <button
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/questionnaire/form/${formId}`)}
                                className="bg-white text-green-700 font-bold px-10 py-3 rounded-full shadow-md hover:bg-gray-100 transition"
                            >
                                {hero.buttonText} <ArrowForward className="inline-block ml-2" />
                            </button>
                        )
                    }
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-gray-100 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-3">Why It Matters</h2>
                    <p className="text-gray-600 max-w-xl mx-auto mb-12 text-lg">
                        Learn the key benefits of this project type.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {benefits.map(({ icon, title, description }, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-xl">
                                <div className="bg-green-200 rounded-full w-20 h-20 flex items-center justify-center mb-5">
                                    {icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                                <p className="text-gray-600 text-sm">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20 px-4 max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-3">How to Get Involved</h2>
                <p className="text-gray-600 max-w-xl mx-auto mb-12 text-center text-lg">
                    Take action with our streamlined project support process.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {processSteps.map(({ step, title, description }) => (
                        <div key={step} className="relative bg-white rounded-xl shadow-md p-6 pl-16 cursor-pointer transition-transform hover:-translate-y-2 hover:shadow-lg">
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-16 bg-green-600 rounded-r-lg"></div>
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg select-none">
                                {step}
                            </div>
                            <h3 style={{marginLeft: "12px"}}  className="font-semibold text-lg mb-2">{title}</h3>
                            <p style={{marginLeft: "12px"}} className="text-gray-600 text-sm leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default LoanPage;
