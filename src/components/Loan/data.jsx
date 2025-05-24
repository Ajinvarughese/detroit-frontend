import { Spa, TrendingUp, Public, Forest as Eco, Opacity, WaterDrop, Cloud, Recycling, DeleteSweep } from "@mui/icons-material";

// Shared process steps
export const processSteps = [
    { step: "1", title: "Submit Project", description: "Share your project goals and expected outcomes." },
    { step: "2", title: "Expert Review", description: "Our specialists assess impact and viability." },
    { step: "3", title: "Approval & Support", description: "Receive funding and resources to execute your plan." },
    { step: "4", title: "Monitoring & Impact", description: "Track improvements and long-term benefits." }
];

// Data for each loan type
export const loanData = {
    biodiversity: {
        hero: {
            subtitle: "Biodiversity Conservation",
            title: "Preserve Nature,\nProtect Our Future",
            highlight: "Protect Our Future",
            description: "Join us in safeguarding biodiversity through impactful projects that restore natural habitats, protect endangered species, and promote ecosystem health.",
            buttonText: "Check Project Eligibility"
        },
        benefits: [
            {
                icon: <Spa className="text-green-500" style={{ fontSize: 40 }} />,
                title: "Preserve Ecosystems",
                description: "Support biodiversity by maintaining balanced and resilient ecosystems."
            },
            {
                icon: <Eco className="text-green-600" style={{ fontSize: 40 }} />,
                title: "Enhance Natural Capital",
                description: "Investing in biodiversity projects ensures long-term natural wealth and resources."
            },
            {
                icon: <TrendingUp className="text-green-700" style={{ fontSize: 40 }} />,
                title: "Boost Climate Resilience",
                description: "Healthy ecosystems act as natural buffers against climate change impacts."
            },
            {
                icon: <Public className="text-green-800" style={{ fontSize: 40 }} />,
                title: "Global Responsibility",
                description: "Contribute to global efforts in preserving habitats and species diversity."
            }
        ]
    },
    water: {
        hero: {
            subtitle: "Water Project Loan",
            title: "Secure Clean Water,\nEmpower Communities",
            highlight: "Empower Communities",
            description: "Support projects that provide clean and safe water to communities, ensuring health, sustainability, and resilience against water scarcity.",
            buttonText: "Check Water Project Eligibility"
        },
        benefits: [
            {
                icon: <Opacity className="text-blue-500" style={{ fontSize: 40 }} />,
                title: "Clean Water Access",
                description: "Provide safe and clean water for all."
            },
            {
                icon: <WaterDrop className="text-blue-600" style={{ fontSize: 40 }} />,
                title: "Resilient Water Systems",
                description: "Build infrastructure that withstands climate challenges."
            },
            {
                icon: <TrendingUp className="text-blue-700" style={{ fontSize: 40 }} />,
                title: "Community Health",
                description: "Support projects that enhance water quality and hygiene."
            },
            {
                icon: <Public className="text-blue-800" style={{ fontSize: 40 }} />,
                title: "Sustainable Resource Management",
                description: "Promote responsible water use and long-term resource availability."
            }
        ]
    },
    climateAdaptation: {
        hero: {
            subtitle: "Climate Adaptation Loan",
            title: "Adapt for Tomorrow,\nBuild Resilience",
            highlight: "Build Resilience",
            description: "Fund initiatives that prepare communities and ecosystems for the impacts of climate change.",
            buttonText: "Check Climate Adaptation Eligibility"
        },
        benefits: [
            {
                icon: <Cloud className="text-indigo-500" style={{ fontSize: 40 }} />,
                title: "Climate Preparedness",
                description: "Develop strategies to adapt to climate challenges."
            },
            {
                icon: <Eco className="text-indigo-600" style={{ fontSize: 40 }} />,
                title: "Protect Ecosystems",
                description: "Safeguard biodiversity and habitats from climate impacts."
            },
            {
                icon: <TrendingUp className="text-indigo-700" style={{ fontSize: 40 }} />,
                title: "Community Resilience",
                description: "Strengthen local capacity to face climate risks."
            },
            {
                icon: <Public className="text-indigo-800" style={{ fontSize: 40 }} />,
                title: "Sustainable Development",
                description: "Promote economic stability through climate-smart solutions."
            }
        ]
    },
    climateMitigation: {
        hero: {
            subtitle: "Climate Mitigation Loan",
            title: "Reduce Emissions,\nShape a Greener Future",
            highlight: "Shape a Greener Future",
            description: "Invest in projects that lower carbon footprints, drive renewable energy, and foster sustainable practices.",
            buttonText: "Check Climate Mitigation Eligibility"
        },
        benefits: [
            {
                icon: <Eco className="text-green-600" style={{ fontSize: 40 }} />,
                title: "Carbon Reduction",
                description: "Cut greenhouse gas emissions and combat climate change."
            },
            {
                icon: <TrendingUp className="text-green-700" style={{ fontSize: 40 }} />,
                title: "Energy Efficiency",
                description: "Support the shift to clean, efficient energy systems."
            },
            {
                icon: <Spa className="text-green-500" style={{ fontSize: 40 }} />,
                title: "Natural Solutions",
                description: "Promote reforestation and sustainable land management."
            },
            {
                icon: <Public className="text-green-800" style={{ fontSize: 40 }} />,
                title: "Global Leadership",
                description: "Take part in a worldwide effort for a low-carbon economy."
            }
        ]
    },
    pollutionPrevention: {
        hero: {
            subtitle: "Pollution Prevention Loan",
            title: "Prevent Pollution,\nProtect Our Planet",
            highlight: "Protect Our Planet",
            description: "Support projects that minimize pollution, improve air and water quality, and promote healthier environments for communities and ecosystems.",
            buttonText: "Check Pollution Prevention Eligibility"
        },
        benefits: [
            {
                icon: <DeleteSweep className="text-red-500" style={{ fontSize: 40 }} />,
                title: "Pollution Control",
                description: "Implement technologies and practices that reduce harmful emissions and discharges."
            },
            {
                icon: <TrendingUp className="text-red-600" style={{ fontSize: 40 }} />,
                title: "Healthier Communities",
                description: "Improve air and water quality to protect public health."
            },
            {
                icon: <Public className="text-red-700" style={{ fontSize: 40 }} />,
                title: "Environmental Protection",
                description: "Safeguard ecosystems from industrial and urban pollution."
            },
            {
                icon: <Eco className="text-red-800" style={{ fontSize: 40 }} />,
                title: "Sustainable Growth",
                description: "Foster economic development while minimizing environmental impact."
            }
        ]
    },
    circularEconomy: {
        hero: {
            subtitle: "Circular Economy Loan",
            title: "Rethink Waste,\nDrive Sustainable Growth",
            highlight: "Drive Sustainable Growth",
            description: "Empower projects that advance circular economy models, focusing on reducing, reusing, and recycling materials for a sustainable future.",
            buttonText: "Check Circular Economy Eligibility"
        },
        benefits: [
            {
                icon: <Recycling className="text-orange-500" style={{ fontSize: 40 }} />,
                title: "Resource Efficiency",
                description: "Maximize resource use and minimize waste generation."
            },
            {
                icon: <TrendingUp className="text-orange-600" style={{ fontSize: 40 }} />,
                title: "Innovative Recycling",
                description: "Support innovative solutions for material reuse and recycling."
            },
            {
                icon: <Eco className="text-orange-700" style={{ fontSize: 40 }} />,
                title: "Sustainable Production",
                description: "Promote manufacturing practices that close resource loops."
            },
            {
                icon: <Public className="text-orange-800" style={{ fontSize: 40 }} />,
                title: "Circular Economy",
                description: "Shift towards a regenerative economic model that prioritizes sustainability."
            }
        ]
    }
};
