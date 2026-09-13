/* ============================================================
   INTERVIEWPREP
   Main application logic

   IMPORTANT:
   - No localStorage
   - No sessionStorage
   - No backend
   - All session information exists only in JavaScript memory
   - Refreshing the page resets the session
   ============================================================ */


/* ============================================================
   DOM REFERENCES
   ============================================================ */

const setupScreen = document.getElementById("setupScreen");
const practiceScreen = document.getElementById("practiceScreen");
const summaryScreen = document.getElementById("summaryScreen");

const setupForm = document.getElementById("setupForm");

const sectorSelect = document.getElementById("sector");
const interviewTypeSelect = document.getElementById("interviewType");
const experienceSelect = document.getElementById("experienceLevel");
const timerSetting = document.getElementById("timerSetting");

const randomPracticeButton =
    document.getElementById("randomPracticeButton");

const randomSummaryButton =
    document.getElementById("randomSummaryButton");

const finishSessionButton =
    document.getElementById("finishSessionButton");

const newSessionButton =
    document.getElementById("newSessionButton");

const previousButton =
    document.getElementById("previousButton");

const nextButton =
    document.getElementById("nextButton");

const questionCard =
    document.getElementById("questionCard");

const questionText =
    document.getElementById("questionText");

const questionCategory =
    document.getElementById("questionCategory");

const questionLevel =
    document.getElementById("questionLevel");

const tipText =
    document.getElementById("tipText");

const outlineText =
    document.getElementById("outlineText");

const tipsPanel =
    document.getElementById("tipsPanel");

const showTipsButton =
    document.getElementById("showTipsButton");

const answerText =
    document.getElementById("answerText");

const wordCount =
    document.getElementById("wordCount");

const answerStatus =
    document.getElementById("answerStatus");

const timerElement =
    document.getElementById("timer");

const timerContainer =
    document.getElementById("timerContainer");

const progressText =
    document.getElementById("progressText");

const progressBar =
    document.getElementById("progressBar");

const currentSector =
    document.getElementById("currentSector");

const currentInterviewType =
    document.getElementById("currentInterviewType");

const currentExperience =
    document.getElementById("currentExperience");

const evaluationCard =
    document.getElementById("evaluationCard");

const confidenceButtons =
    document.querySelectorAll(".confidence-button");

const confidenceLabel =
    document.getElementById("confidenceLabel");

const attemptedCount =
    document.getElementById("attemptedCount");

const averageConfidence =
    document.getElementById("averageConfidence");

const averageTime =
    document.getElementById("averageTime");

const confidenceChart =
    document.getElementById("confidenceChart");

const reviewAnswersButton =
    document.getElementById("reviewAnswersButton");

const reviewAnswers =
    document.getElementById("reviewAnswers");

const reviewArrow =
    document.getElementById("reviewArrow");

const voiceAssistantButton =
    document.getElementById("voiceAssistantButton");

const voiceModal =
    document.getElementById("voiceModal");

const closeVoiceModal =
    document.getElementById("closeVoiceModal");

const modalVoiceButton =
    document.getElementById("modalVoiceButton");

const voiceStatus =
    document.getElementById("voiceStatus");

const readQuestionButton =
    document.getElementById("readQuestionButton");

const voiceAnswerButton =
    document.getElementById("voiceAnswerButton");

const themeButton =
    document.getElementById("themeButton");

const toast =
    document.getElementById("toast");


/* ============================================================
   APPLICATION STATE
   ============================================================ */

/*
    These variables intentionally exist only in memory.

    Nothing is stored in:
    - localStorage
    - sessionStorage
    - cookies
    - IndexedDB
*/

let currentSession = {

    sector: "",
    interviewType: "",
    experience: "",

    questions: [],

    currentIndex: 0,

    timerSeconds: 120,

    questionStartTime: null,

    timerInterval: null,

    confidence: null,

    randomMode: false
};


/*
    Every answer is stored here during the current session.

    Example:

    {
        question: "...",
        answer: "...",
        rating: 4,
        timestamp: Date,
        timeTaken: 82
    }
*/

let sessionAnswers = [];


/*
    Used by the voice recognition feature.
*/

let recognition = null;
let isListening = false;


/*
    Prevents repeated save operations when a timer
    automatically ends a question.
*/

let questionSavedForCurrentIndex = false;


/* ============================================================
   QUESTION BANK
   ============================================================

   Instead of writing 1,000+ repetitive objects manually,
   this application uses a large structured question system.

   Every combination receives:

       Sector
          ↓
       Interview Type
          ↓
       Experience Level
          ↓
       8 questions

   The generated question bank is stored in:

       questionBank[sector][interviewType][level]

   Each generated question contains:

       {
           question,
           tips,
           sampleAnswerOutline
       }

   The question templates are intentionally reusable so that
   you can easily expand the application later.
   ============================================================ */


/* ============================================================
   SECTOR-SPECIFIC FOCUS
   ============================================================ */

const sectorFocus = {

    "Software Engineering":
        "software development, programming, applications and engineering practices",

    "IT/Networking":
        "IT infrastructure, networking, systems administration and troubleshooting",

    "Consulting":
        "business problems, clients, structured problem-solving and recommendations",

    "Finance":
        "financial analysis, business performance, risk and financial decision-making",

    "Marketing":
        "customers, campaigns, branding, content, acquisition and marketing performance",

    "HR":
        "people, recruitment, employee experience, policies and workplace situations",

    "Sales":
        "customers, prospecting, negotiation, revenue and relationship management",

    "Data Science":
        "data analysis, statistics, machine learning and data-driven decision-making",

    "Cloud/DevOps":
        "cloud infrastructure, automation, deployment, reliability and DevOps practices",

    "Customer Support":
        "customers, troubleshooting, communication, service quality and issue resolution",

    "Generic/Other":
        "professional responsibilities, teamwork, problem-solving and workplace situations"

};


/* ============================================================
   BEHAVIORAL QUESTION TEMPLATES
   ============================================================ */

const behavioralTemplates = [

    {
        q: "Tell me about a time you faced a difficult problem related to {focus}. How did you solve it?",
        tip: "Use STAR: Situation, Task, Action and Result. Focus most of your answer on what YOU did.",
        outline: "• Situation/context\n• Your responsibility\n• Actions you personally took\n• Result\n• What you learned"
    },

    {
        q: "Tell me about a time you made a mistake while working on {focus}. What happened?",
        tip: "Do not hide the mistake. Show ownership, corrective action and learning.",
        outline: "• Briefly explain the mistake\n• Impact\n• How you fixed it\n• Preventive action\n• Lesson learned"
    },

    {
        q: "Describe a situation where you had to work with someone whose approach differed from yours.",
        tip: "Demonstrate emotional intelligence rather than criticizing the other person.",
        outline: "• Difference in approaches\n• Why it mattered\n• Communication used\n• Compromise/collaboration\n• Outcome"
    },

    {
        q: "Tell me about a time you had to learn something quickly to succeed in {focus}.",
        tip: "Choose a concrete example and explain your learning strategy.",
        outline: "• What you needed to learn\n• Why time was limited\n• Resources/method used\n• How you applied it\n• Result"
    },

    {
        q: "Describe a time when you had competing priorities. How did you decide what to do first?",
        tip: "Explain your prioritization criteria instead of simply saying you worked harder.",
        outline: "• List competing priorities\n• Urgency/impact assessment\n• Prioritization method\n• Communication\n• Final result"
    },

    {
        q: "Tell me about a time you received difficult or unexpected feedback.",
        tip: "Show that you can accept useful criticism without becoming defensive.",
        outline: "• Feedback context\n• Initial reaction\n• What you learned\n• Changes made\n• Long-term result"
    },

    {
        q: "Give an example of when you took initiative in a {focus}-related situation.",
        tip: "Choose an example where nobody had to repeatedly tell you what to do.",
        outline: "• Problem/opportunity noticed\n• Initiative taken\n• Actions\n• Impact\n• What motivated you"
    },

    {
        q: "Tell me about an achievement you are particularly proud of.",
        tip: "Quantify the result where possible and explain your individual contribution.",
        outline: "• Goal\n• Challenge\n• Your contribution\n• Measurable result\n• Why it matters"
    }

];


/* ============================================================
   TECHNICAL QUESTION TEMPLATES
   ============================================================ */

const technicalTemplates = {

    "Software Engineering": [

        ["How would you design a maintainable application for {focus}?", "Discuss separation of concerns, modularity and testing.", "• Requirements\n• Architecture\n• Modules\n• Data flow\n• Testing\n• Maintainability"],

        ["Explain how you would debug a difficult production issue in {focus}.", "Show a systematic debugging process rather than guessing.", "• Reproduce/observe\n• Logs\n• Metrics\n• Hypotheses\n• Isolate root cause\n• Fix\n• Verify"],

        ["How would you improve the performance of a slow {focus} application?", "Start by measuring before optimizing.", "• Define performance metric\n• Profile\n• Find bottleneck\n• Optimize\n• Benchmark\n• Monitor"],

        ["What testing strategy would you use for a {focus} project?", "Mention multiple test levels and automation.", "• Unit tests\n• Integration tests\n• End-to-end tests\n• Edge cases\n• CI automation"],

        ["How would you review another developer's code?", "Balance correctness, readability, maintainability and security.", "• Understand intent\n• Correctness\n• Design\n• Readability\n• Security\n• Tests\n• Constructive feedback"],

        ["Explain an approach to handling failures in a {focus} system.", "Discuss graceful failure and observability.", "• Failure scenarios\n• Detection\n• Logging\n• Recovery\n• Retry/fallback\n• Monitoring"],

        ["How would you design an API for a {focus} application?", "Explain resources, endpoints, validation and error handling.", "• Requirements\n• Resources\n• HTTP methods\n• Validation\n• Authentication\n• Errors\n• Documentation"],

        ["How would you make a {focus} application secure?", "Cover authentication, authorization, input validation and data protection.", "• Threat model\n• Authentication\n• Authorization\n• Input validation\n• Encryption\n• Secrets\n• Monitoring"]

    ],

    "IT/Networking": [

        ["How would you troubleshoot a connectivity problem in {focus}?", "Use a layered and systematic troubleshooting process.", "• Clarify symptom\n• Physical/link checks\n• IP configuration\n• DNS\n• Routing\n• Firewall\n• Test fix"],

        ["Explain how DNS works and why it matters in {focus}.", "Walk through name resolution from client to DNS response.", "• Client request\n• Resolver\n• DNS hierarchy\n• Record lookup\n• Response\n• Caching"],

        ["How would you diagnose a slow network in {focus}?", "Separate bandwidth, latency, packet loss and endpoint issues.", "• Define symptoms\n• Ping\n• Traceroute\n• Interface metrics\n• Packet loss\n• Congestion\n• Root cause"],

        ["Explain the difference between TCP and UDP and when you would use each.", "Compare reliability, ordering, overhead and use cases.", "• TCP properties\n• UDP properties\n• Reliability\n• Performance\n• Examples"],

        ["How would you secure a small enterprise network?", "Discuss layered security rather than one security product.", "• Segmentation\n• Firewall\n• Authentication\n• Updates\n• Monitoring\n• Backups\n• Policies"],

        ["What is subnetting and why is it useful?", "Explain address efficiency, organization and routing.", "• Network/host bits\n• CIDR\n• Subnets\n• Example\n• Practical benefit"],

        ["How would you investigate intermittent packet loss?", "Look for patterns rather than assuming the network is always broken.", "• Reproduce\n• Time pattern\n• Ping tests\n• Interface counters\n• Routing\n• Congestion\n• Hardware"],

        ["How would you document an IT/network infrastructure environment?", "Good documentation should help another engineer operate the environment.", "• Network diagram\n• IP inventory\n• Devices\n• Configurations\n• Dependencies\n• Procedures"]

    ],

    "Data Science": [

        ["How would you approach a new data science problem?", "Start with the business objective before selecting a model.", "• Business question\n• Data sources\n• Target\n• EDA\n• Baseline\n• Model\n• Evaluation"],

        ["How would you handle missing data in a dataset?", "The right approach depends on why the data is missing.", "• Measure missingness\n• Understand cause\n• Delete/impute\n• Feature indicators\n• Validate impact"],

        ["How would you detect overfitting in a machine learning model?", "Compare training and validation behavior and use appropriate validation.", "• Train/validation split\n• Learning curves\n• Cross-validation\n• Regularization\n• Simplify model"],

        ["How would you explain a machine learning model to a non-technical stakeholder?", "Connect technical behavior to business outcomes.", "• Business objective\n• Simple intuition\n• Important features\n• Metrics\n• Limitations\n• Recommendation"],

        ["How would you evaluate an imbalanced classification model?", "Accuracy alone can be misleading.", "• Class distribution\n• Precision\n• Recall\n• F1\n• ROC/PR metrics\n• Threshold selection"],

        ["How would you improve the quality of a data pipeline?", "Think about validation, monitoring and reproducibility.", "• Input validation\n• Transformations\n• Data quality checks\n• Monitoring\n• Testing\n• Documentation"],

        ["What steps would you take before training a model on a new dataset?", "Demonstrate disciplined preprocessing.", "• Understand schema\n• Explore distributions\n• Missing values\n• Outliers\n• Leakage\n• Encoding\n• Split data"],

        ["How would you determine whether a model is useful in production?", "Business value matters as much as model metrics.", "• Offline metrics\n• Baseline\n• Business KPI\n• Cost\n• Reliability\n• Monitoring\n• Feedback"]

    ],

    "Cloud/DevOps": [

        ["How would you design a reliable cloud architecture for {focus}?", "Discuss availability, scaling, monitoring and failure recovery.", "• Requirements\n• Architecture\n• Availability zones/regions\n• Scaling\n• Security\n• Monitoring\n• Disaster recovery"],

        ["How would you troubleshoot a failed deployment?", "Follow deployment evidence from pipeline to infrastructure.", "• Pipeline logs\n• Build\n• Artifacts\n• Configuration\n• Permissions\n• Infrastructure\n• Rollback"],

        ["Explain CI/CD and why it is useful.", "Connect automation to faster and safer software delivery.", "• Code commit\n• Build\n• Tests\n• Artifact\n• Deployment\n• Verification\n• Rollback"],

        ["How would you reduce cloud infrastructure costs?", "Optimize based on measured usage rather than blindly reducing resources.", "• Usage analysis\n• Rightsizing\n• Autoscaling\n• Storage lifecycle\n• Reserved/committed options\n• Monitoring"],

        ["How would you secure cloud infrastructure?", "Use identity-first and defense-in-depth principles.", "• IAM\n• Least privilege\n• Network controls\n• Encryption\n• Secrets\n• Logging\n• Monitoring"],

        ["How would you monitor a production cloud application?", "Cover infrastructure, application and business signals.", "• Metrics\n• Logs\n• Traces\n• Alerts\n• Dashboards\n• SLOs\n• Incident response"],

        ["What would you do if a production service became unavailable?", "Prioritize restoration first, then root-cause analysis.", "• Detect\n• Assess impact\n• Communicate\n• Mitigate\n• Restore\n• Root cause\n• Prevention"],

        ["How would you automate repetitive infrastructure tasks?", "Infrastructure as code and automation should be repeatable and reviewable.", "• Identify task\n• Automation tool\n• Version control\n• Idempotency\n• Testing\n• Monitoring"]

    ]

};


/*
   Generic technical templates are used for sectors where
   highly specialized technical questions would not make sense.
*/

const genericTechnicalTemplates = [

    ["What are the most important technical concepts someone working in {focus} should understand?", "Select fundamentals and explain why they matter.", "• Core concepts\n• Practical examples\n• Common mistakes\n• Business relevance"],

    ["How would you troubleshoot a difficult problem related to {focus}?", "Explain a repeatable diagnostic process.", "• Define problem\n• Gather evidence\n• Form hypotheses\n• Test\n• Fix\n• Verify"],

    ["How would you improve an inefficient process in {focus}?", "Measure the current process before proposing improvements.", "• Current state\n• Bottleneck\n• Root cause\n• Improvement\n• Measurement"],

    ["What tools or technologies would you use when working with {focus}?", "Choose tools based on requirements rather than popularity.", "• Requirement\n• Tool choice\n• Trade-off\n• Example\n• Validation"],

    ["How would you ensure quality when delivering work related to {focus}?", "Explain checks, validation and review.", "• Requirements\n• Validation\n• Testing\n• Review\n• Documentation"],

    ["What are common risks when working with {focus}?", "Mention technical, operational and business risks.", "• Risk identification\n• Impact\n• Likelihood\n• Mitigation\n• Monitoring"],

    ["How would you explain a complex {focus} concept to a beginner?", "Use a simple analogy followed by a practical example.", "• Simple definition\n• Analogy\n• Example\n• Common misunderstanding"],

    ["Describe a technical project involving {focus} that you would be interested in building.", "Show that you can connect technology with a useful outcome.", "• Problem\n• Users\n• Technology\n• Architecture/process\n• Success metric"]

];


/* ============================================================
   HR / GENERAL QUESTIONS
   ============================================================ */

const hrTemplates = [

    {
        q: "Tell me about yourself and your professional background.",
        tip: "Keep it relevant to the role. Present → Past → Future is a useful structure.",
        outline: "• Current background\n• Relevant education/experience\n• Key strengths\n• Relevant achievement\n• Why this role"
    },

    {
        q: "Why are you interested in this role?",
        tip: "Connect your skills and interests to the actual responsibilities of the role.",
        outline: "• What attracts you\n• Relevant skills\n• Career direction\n• Why this role\n• Contribution"
    },

    {
        q: "Why should we hire you?",
        tip: "Give 2–3 evidence-backed reasons instead of generic qualities.",
        outline: "• Relevant skills\n• Evidence/example\n• Role fit\n• Learning ability\n• Expected contribution"
    },

    {
        q: "What are your greatest strengths?",
        tip: "Choose strengths that matter for the role and support each with evidence.",
        outline: "• Strength\n• Example\n• Result\n• Relevance to role"
    },

    {
        q: "What is one professional weakness you are currently improving?",
        tip: "Choose a genuine but manageable weakness and show your improvement plan.",
        outline: "• Weakness\n• Impact\n• Awareness\n• Improvement strategy\n• Progress"
    },

    {
        q: "Where do you see yourself professionally in the next few years?",
        tip: "Show ambition while keeping your goals realistic and connected to the role.",
        outline: "• Skills to develop\n• Responsibilities\n• Career direction\n• Contribution"
    },

    {
        q: "How do you handle stress or pressure at work?",
        tip: "Explain your process for staying effective rather than claiming you never feel stressed.",
        outline: "• Stress trigger\n• Prioritization\n• Communication\n• Coping method\n• Result"
    },

    {
        q: "What questions would you ask us at the end of an interview?",
        tip: "Ask questions that demonstrate curiosity about the role, team and expectations.",
        outline: "• Role expectations\n• Team\n• Success metrics\n• Learning\n• Next steps"
    }

];


/* ============================================================
   CASE STUDY QUESTIONS
   ============================================================ */

const caseTemplates = [

    {
        q: "A company asks you to improve an underperforming area related to {focus}. How would you approach the problem?",
        tip: "Do not jump immediately to solutions. Clarify the problem and structure your analysis.",
        outline: "• Clarify objective\n• Define KPI\n• Segment problem\n• Analyze causes\n• Generate options\n• Prioritize\n• Recommend"
    },

    {
        q: "Imagine performance in {focus} has declined by 20%. How would you investigate?",
        tip: "Use a hypothesis-driven approach and divide the problem into logical buckets.",
        outline: "• Confirm metric\n• Establish timeline\n• Segment data\n• Hypotheses\n• Test hypotheses\n• Root cause\n• Action"
    },

    {
        q: "A client wants to invest heavily in improving {focus}. How would you determine whether the investment is justified?",
        tip: "Compare expected benefits against cost, risk and alternatives.",
        outline: "• Objective\n• Current baseline\n• Benefits\n• Costs\n• Risks\n• Alternatives\n• ROI/recommendation"
    },

    {
        q: "How would you prioritize three competing initiatives related to {focus}?",
        tip: "Create explicit prioritization criteria.",
        outline: "• Impact\n• Effort\n• Urgency\n• Risk\n• Strategic fit\n• Ranking\n• Recommendation"
    },

    {
        q: "A stakeholder disagrees with your recommendation about {focus}. What would you do?",
        tip: "Separate disagreement from the underlying evidence.",
        outline: "• Understand concern\n• Restate objective\n• Evidence\n• Alternatives\n• Trade-offs\n• Decision"
    },

    {
        q: "How would you identify the root cause of a recurring problem in {focus}?",
        tip: "Avoid treating symptoms as causes.",
        outline: "• Define recurring issue\n• Collect evidence\n• Segment cases\n• Root-cause analysis\n• Validate\n• Fix\n• Monitor"
    },

    {
        q: "You have limited information but must make a recommendation about {focus}. What would you do?",
        tip: "Make assumptions explicit and explain how you would validate them.",
        outline: "• Known facts\n• Unknowns\n• Assumptions\n• Quick analysis\n• Risks\n• Recommendation\n• Validation plan"
    },

    {
        q: "How would you present a complex {focus} recommendation to a senior decision-maker?",
        tip: "Lead with the answer and support it with concise evidence.",
        outline: "• Executive summary\n• Recommendation\n• Evidence\n• Financial/operational impact\n• Risks\n• Next steps"
    }

];


/* ============================================================
   MIXED QUESTION TEMPLATES
   ============================================================ */

const mixedTemplates = [

    ...behavioralTemplates.slice(0, 2),

    ...hrTemplates.slice(0, 2),

    ...caseTemplates.slice(0, 2),

    {
        q: "What is one important challenge currently affecting {focus}, and how would you approach it?",
        tip: "Combine industry knowledge with a structured problem-solving approach.",
        outline: "• Challenge\n• Why it matters\n• Root causes\n• Options\n• Recommendation\n• Risks"
    },

    {
        q: "Describe a project or situation where you had to combine technical knowledge with communication skills.",
        tip: "Show both execution ability and stakeholder awareness.",
        outline: "• Situation\n• Technical challenge\n• Communication challenge\n• Actions\n• Result\n• Learning"
    }

];


/* ============================================================
   LEVEL MODIFIERS
   ============================================================ */

const levelModifiers = {

    "Fresher/Entry-level": {
        intro:
            "At an entry level, ",
        focus:
            "Show fundamentals, learning ability, practical examples from projects, coursework, internships or training, and willingness to improve."
    },

    "Mid-level": {
        intro:
            "At a mid-level, ",
        focus:
            "Show independent ownership, practical judgment, measurable results, collaboration and the ability to handle ambiguity."
    },

    "Senior": {
        intro:
            "At a senior level, ",
        focus:
            "Show leadership, strategic thinking, trade-off decisions, mentoring, business impact and ownership of complex outcomes."
    }

};


/* ============================================================
   CONVERT TEMPLATE INTO QUESTION OBJECT
   ============================================================ */

function createQuestion(template, sector, level) {

    const focus = sectorFocus[sector];

    const modifier = levelModifiers[level];

    let question;
    let tips;
    let outline;

    if (Array.isArray(template)) {

        question = template[0];
        tips = template[1];
        outline = template[2];

    } else {

        question = template.q;
        tips = template.tip;
        outline = template.outline;

    }


    question = question.replaceAll(
        "{focus}",
        focus
    );


    return {

        question,

        tips:
            `${modifier.intro}${tips} ${modifier.focus}`,

        sampleAnswerOutline:
            outline

    };

}


/* ============================================================
   GET TECHNICAL TEMPLATES FOR SECTOR
   ============================================================ */

function getTechnicalTemplates(sector) {

    if (technicalTemplates[sector]) {

        return technicalTemplates[sector];

    }

    return genericTechnicalTemplates;

}


/* ============================================================
   GENERATE QUESTION BANK
   ============================================================ */

const questionBank = {};


/*
    Supported categories.
*/

const allSectors = Object.keys(sectorFocus);

const allInterviewTypes = [
    "Behavioral",
    "Technical",
    "HR/General",
    "Case Study",
    "Mixed"
];

const allLevels = [
    "Fresher/Entry-level",
    "Mid-level",
    "Senior"
];


/*
    Generate the complete bank.

    Result:

    questionBank[
        sector
    ][
        interviewType
    ][
        level
    ]

    Each combination has exactly 8 questions.
*/

allSectors.forEach(sector => {

    questionBank[sector] = {};

    allInterviewTypes.forEach(type => {

        questionBank[sector][type] = {};

        allLevels.forEach(level => {

            let templates;


            switch (type) {

                case "Behavioral":
                    templates = behavioralTemplates;
                    break;

                case "Technical":
                    templates =
                        getTechnicalTemplates(sector);
                    break;

                case "HR/General":
                    templates = hrTemplates;
                    break;

                case "Case Study":
                    templates = caseTemplates;
                    break;

                case "Mixed":
                    templates = mixedTemplates;
                    break;

                default:
                    templates = mixedTemplates;

            }


            /*
                Every template set contains 8 questions.
            */

            questionBank[sector][type][level] =
                templates
                    .slice(0, 8)
                    .map(template =>
                        createQuestion(
                            template,
                            sector,
                            level
                        )
                    );

        });

    });

});


/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */


/*
    Show one application screen.
*/

function showScreen(screen) {

    [
        setupScreen,
        practiceScreen,
        summaryScreen
    ].forEach(item => {

        item.classList.remove("active-screen");

    });

    screen.classList.add("active-screen");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/*
    Display toast notification.
*/

let toastTimeout;

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/*
    Format seconds as MM:SS.
*/

function formatTime(seconds) {

    seconds = Math.max(
        0,
        Math.floor(seconds)
    );

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;

}


/*
    Calculate words.
*/

function countWords(text) {

    const trimmed = text.trim();

    if (!trimmed) {
        return 0;
    }

    return trimmed.split(/\s+/).length;

}


/*
    Shuffle array without modifying original.
*/

function shuffle(array) {

    const result = [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            result[i],
            result[j]
        ] = [
            result[j],
            result[i]
        ];

    }

    return result;

}


/* ============================================================
   SESSION START
   ============================================================ */

setupForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const sector =
            sectorSelect.value;

        const interviewType =
            interviewTypeSelect.value;

        const experience =
            experienceSelect.value;

        let seconds =
            Number(timerSetting.value);


        if (
            !sector ||
            !interviewType ||
            !experience
        ) {

            showToast(
                "Please select all interview preferences."
            );

            return;

        }


        /*
            Protect against unreasonable timer values.
        */

        if (
            Number.isNaN(seconds) ||
            seconds < 30 ||
            seconds > 600
        ) {

            showToast(
                "Timer must be between 30 and 600 seconds."
            );

            timerSetting.focus();

            return;

        }


        currentSession = {

            sector,

            interviewType,

            experience,

            questions:
                shuffle(
                    questionBank[
                        sector
                    ][
                        interviewType
                    ][
                        experience
                    ]
                ),

            currentIndex: 0,

            timerSeconds: seconds,

            questionStartTime: null,

            timerInterval: null,

            confidence: null,

            randomMode: false

        };


        sessionAnswers = [];

        questionSavedForCurrentIndex = false;


        /*
            Update practice header.
        */

        currentSector.textContent =
            sector;

        currentInterviewType.textContent =
            interviewType;

        currentExperience.textContent =
            experience;


        showScreen(practiceScreen);

        loadQuestion();

    }
);


/* ============================================================
   LOAD QUESTION
   ============================================================ */

function loadQuestion() {

    stopTimer();


    const index =
        currentSession.currentIndex;

    const question =
        currentSession.questions[index];


    if (!question) {

        finishSession();

        return;

    }


    questionSavedForCurrentIndex = false;


    /*
        Reset UI.
    */

    answerText.value = "";

    answerStatus.textContent =
        "Not submitted";

    answerStatus.classList.remove("saved");


    confidenceButtons.forEach(button => {

        button.classList.remove("selected");

    });


    currentSession.confidence = null;

    confidenceLabel.textContent =
        "Select a confidence rating";


    tipsPanel.hidden = true;

    showTipsButton.textContent =
        "💡 Show Tips";

    showTipsButton.setAttribute(
        "aria-expanded",
        "false"
    );


    /*
        Populate question.
    */

    questionText.textContent =
        question.question;

    questionCategory.textContent =
        currentSession.interviewType;

    questionLevel.textContent =
        currentSession.experience;


    tipText.textContent =
        question.tips;

    outlineText.textContent =
        question.sampleAnswerOutline;


    /*
        Progress.
    */

    const total =
        currentSession.questions.length;

    const currentNumber =
        index + 1;

    progressText.textContent =
        `Question ${currentNumber} of ${total}`;


    progressBar.style.width =
        `${(currentNumber / total) * 100}%`;


    previousButton.disabled =
        index === 0;


    if (index === total - 1) {

        nextButton.textContent =
            "Finish Session ✓";

    } else {

        nextButton.textContent =
            "Next Question →";

    }


    /*
        Reset timer.
    */

    currentSession.questionStartTime =
        Date.now();

    currentSession.remaining =
        currentSession.timerSeconds;


    timerElement.textContent =
        formatTime(
            currentSession.timerSeconds
        );


    timerContainer.classList.remove(
        "warning"
    );


    wordCount.textContent =
        "0 words";


    /*
        Start timer.
    */

    startTimer();


    /*
        Focus question for keyboard/screen-reader users.
    */

    setTimeout(() => {

        questionText.focus();

    }, 50);

}


/* ============================================================
   TIMER
   ============================================================ */

function startTimer() {

    stopTimer();


    currentSession.remaining =
        currentSession.timerSeconds;


    timerElement.textContent =
        formatTime(
            currentSession.remaining
        );


    currentSession.timerInterval =
        setInterval(() => {

            currentSession.remaining--;

            timerElement.textContent =
                formatTime(
                    currentSession.remaining
                );


            /*
                Last 15 seconds = visual warning.
            */

            if (
                currentSession.remaining <= 15
            ) {

                timerContainer.classList.add(
                    "warning"
                );

            }


            if (
                currentSession.remaining <= 0
            ) {

                stopTimer();

                showToast(
                    "Time's up! Rate your answer."
                );

                answerStatus.textContent =
                    "Time expired";

                answerStatus.classList.add(
                    "saved"
                );


                /*
                    Automatically save the answer
                    if it has not already been saved.
                */

                saveCurrentAnswer();


                /*
                    Do not automatically jump away.
                    The user can still rate the answer.
                */

            }

        }, 1000);

}


/*
    Stop timer.
*/

function stopTimer() {

    if (
        currentSession.timerInterval
    ) {

        clearInterval(
            currentSession.timerInterval
        );

        currentSession.timerInterval =
            null;

    }

}


/* ============================================================
   SAVE ANSWER
   ============================================================ */

function saveCurrentAnswer() {

    if (
        questionSavedForCurrentIndex
    ) {

        return;

    }


    const answer =
        answerText.value.trim();


    const elapsed =
        Math.min(
            currentSession.timerSeconds,
            Math.max(
                0,
                Math.floor(
                    (
                        Date.now() -
                        currentSession.questionStartTime
                    ) / 1000
                )
            )
        );


    const question =
        currentSession.questions[
            currentSession.currentIndex
        ];


    /*
        We save even an empty answer so that the summary
        accurately represents the question encountered.
    */

    sessionAnswers.push({

        question:
            question.question,

        answer:
            answer || "(No answer provided)",

        rating:
            currentSession.confidence || 0,

        timestamp:
            new Date(),

        timeTaken:
            elapsed,

        sector:
            currentSession.sector,

        interviewType:
            currentSession.interviewType,

        experience:
            currentSession.experience

    });


    questionSavedForCurrentIndex = true;


    answerStatus.textContent =
        "Answer saved ✓";

    answerStatus.classList.add(
        "saved"
    );

}


/* ============================================================
   NEXT QUESTION
   ============================================================ */

nextButton.addEventListener(
    "click",
    () => {

        /*
            If confidence has not been selected,
            ask the user before moving on.
        */

        if (
            currentSession.confidence === null
        ) {

            showToast(
                "Please rate your confidence before continuing."
            );

            evaluationCard.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            return;

        }


        saveCurrentAnswer();

        stopTimer();


        const lastQuestion =
            currentSession.currentIndex >=
            currentSession.questions.length - 1;


        if (lastQuestion) {

            finishSession();

            return;

        }


        /*
            Smooth question transition.
        */

        questionCard.classList.add(
            "transitioning"
        );


        setTimeout(() => {

            currentSession.currentIndex++;

            questionCard.classList.remove(
                "transitioning"
            );

            loadQuestion();

        }, 180);

    }
);


/* ============================================================
   PREVIOUS QUESTION
   ============================================================ */

previousButton.addEventListener(
    "click",
    () => {

        if (
            currentSession.currentIndex <= 0
        ) {

            return;

        }


        /*
            Save current answer before navigating.
        */

        if (
            currentSession.confidence !== null
        ) {

            saveCurrentAnswer();

        }


        stopTimer();


        currentSession.currentIndex--;


        /*
            Note:
            We intentionally reload the question as a fresh
            question state. This keeps the session implementation
            simple and predictable.
        */

        loadQuestion();

    }
);


/* ============================================================
   CONFIDENCE RATING
   ============================================================ */

confidenceButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const rating =
                Number(
                    button.dataset.rating
                );


            currentSession.confidence =
                rating;


            confidenceButtons.forEach(
                item => {

                    const itemRating =
                        Number(
                            item.dataset.rating
                        );

                    item.classList.toggle(
                        "selected",
                        itemRating <= rating
                    );

                }
            );


            const labels = {

                1: "Not confident yet",

                2: "Slightly confident",

                3: "Moderately confident",

                4: "Very confident",

                5: "Extremely confident"

            };


            confidenceLabel.textContent =
                labels[rating];


            /*
                If time expired, we can now save
                the answer with the rating.
            */

            if (
                currentSession.remaining <= 0
            ) {

                saveCurrentAnswer();

            }

        }
    );

});


/* ============================================================
   WORD COUNT
   ============================================================ */

answerText.addEventListener(
    "input",
    () => {

        const words =
            countWords(
                answerText.value
            );


        wordCount.textContent =
            `${words} ${words === 1 ? "word" : "words"}`;

    }
);


/* ============================================================
   SHOW / HIDE TIPS
   ============================================================ */

showTipsButton.addEventListener(
    "click",
    () => {

        const currentlyHidden =
            tipsPanel.hidden;


        tipsPanel.hidden =
            !currentlyHidden;


        showTipsButton.setAttribute(
            "aria-expanded",
            String(currentlyHidden)
        );


        showTipsButton.textContent =
            currentlyHidden
                ? "🙈 Hide Tips"
                : "💡 Show Tips";

    }
);


/* ============================================================
   FINISH SESSION
   ============================================================ */

finishSessionButton.addEventListener(
    "click",
    () => {

        if (
            sessionAnswers.length === 0 &&
            answerText.value.trim() === ""
        ) {

            finishSession();

            return;

        }


        /*
            Ask for rating if the current answer
            has not been evaluated.
        */

        if (
            currentSession.confidence === null
        ) {

            showToast(
                "Rate your current answer before finishing."
            );

            evaluationCard.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            return;

        }


        saveCurrentAnswer();

        finishSession();

    }
);


/* ============================================================
   BUILD SUMMARY
   ============================================================ */

function finishSession() {

    stopTimer();

    showScreen(summaryScreen);

    buildSummary();

}


/*
    Calculate and display summary metrics.
*/

function buildSummary() {

    const attempted =
        sessionAnswers.length;


    attemptedCount.textContent =
        attempted;


    if (attempted === 0) {

        averageConfidence.textContent =
            "0 / 5";

        averageTime.textContent =
            "0 sec";

        confidenceChart.innerHTML =
            `<p style="color: var(--text-muted);">
                No answers were recorded.
            </p>`;

        reviewAnswers.innerHTML =
            `<p style="color: var(--text-muted);">
                No answers to review.
            </p>`;

        return;

    }


    const ratings =
        sessionAnswers.map(
            item => item.rating
        );


    const totalRating =
        ratings.reduce(
            (sum, rating) =>
                sum + rating,
            0
        );


    const average =
        totalRating /
        attempted;


    const totalTime =
        sessionAnswers.reduce(
            (sum, item) =>
                sum + item.timeTaken,
            0
        );


    const avgTime =
        totalTime /
        attempted;


    averageConfidence.textContent =
        `${average.toFixed(1)} / 5`;


    averageTime.textContent =
        `${Math.round(avgTime)} sec`;


    buildConfidenceChart();

    buildReviewList();

}


/* ============================================================
   CONFIDENCE CHART
   ============================================================ */

function buildConfidenceChart() {

    confidenceChart.innerHTML = "";


    sessionAnswers.forEach(
        (item, index) => {

            const column =
                document.createElement(
                    "div"
                );

            column.className =
                "chart-column";


            const value =
                document.createElement(
                    "span"
                );

            value.className =
                "chart-value";

            value.textContent =
                item.rating
                    ? item.rating
                    : "—";


            const barContainer =
                document.createElement(
                    "div"
                );

            barContainer.className =
                "chart-bar-container";


            const bar =
                document.createElement(
                    "div"
                );

            bar.className =
                "chart-bar";


            const rating =
                item.rating || 0;


            /*
                Rating 5 = 100%
                Rating 4 = 80%
                etc.
            */

            bar.style.height =
                `${rating * 20}%`;


            const label =
                document.createElement(
                    "span"
                );

            label.className =
                "chart-label";

            label.textContent =
                `Q${index + 1}`;


            barContainer.appendChild(bar);

            column.appendChild(value);

            column.appendChild(
                barContainer
            );

            column.appendChild(label);

            confidenceChart.appendChild(
                column
            );

        }
    );

}


/* ============================================================
   REVIEW ANSWERS
   ============================================================ */

function buildReviewList() {

    reviewAnswers.innerHTML = "";


    sessionAnswers.forEach(
        (item, index) => {

            const wrapper =
                document.createElement(
                    "article"
                );

            wrapper.className =
                "review-item";


            const question =
                document.createElement(
                    "div"
                );

            question.className =
                "review-question";

            question.textContent =
                `Q${index + 1}. ${item.question}`;


            const answer =
                document.createElement(
                    "div"
                );

            answer.className =
                "review-answer";

            answer.textContent =
                item.answer;


            const meta =
                document.createElement(
                    "div"
                );

            meta.className =
                "review-meta";


            const rating =
                document.createElement(
                    "span"
                );

            rating.textContent =
                item.rating
                    ? `Confidence: ${item.rating}/5`
                    : "Confidence: Not rated";


            const time =
                document.createElement(
                    "span"
                );

            time.textContent =
                `Time: ${item.timeTaken}s`;


            const timestamp =
                document.createElement(
                    "span"
                );

            timestamp.textContent =
                item.timestamp.toLocaleTimeString();


            meta.appendChild(rating);

            meta.appendChild(time);

            meta.appendChild(timestamp);


            wrapper.appendChild(question);

            wrapper.appendChild(answer);

            wrapper.appendChild(meta);


            reviewAnswers.appendChild(
                wrapper
            );

        }
    );

}


/* ============================================================
   REVIEW TOGGLE
   ============================================================ */

reviewAnswersButton.addEventListener(
    "click",
    () => {

        const currentlyHidden =
            reviewAnswers.hidden;


        reviewAnswers.hidden =
            !currentlyHidden;


        reviewAnswersButton.setAttribute(
            "aria-expanded",
            String(currentlyHidden)
        );


        reviewArrow.textContent =
            currentlyHidden
                ? "▲"
                : "▼";

    }
);


/* ============================================================
   NEW SESSION
   ============================================================ */

newSessionButton.addEventListener(
    "click",
    () => {

        stopTimer();

        sessionAnswers = [];

        showScreen(setupScreen);

        setupForm.reset();

        timerSetting.value = 120;

    }
);


/* ============================================================
   RANDOM QUESTION MODE
   ============================================================ */

/*
    Build a flattened collection containing every question
    from every sector, interview type and level.
*/

function getAllQuestions() {

    const allQuestions = [];


    allSectors.forEach(
        sector => {

            allInterviewTypes.forEach(
                type => {

                    allLevels.forEach(
                        level => {

                            const questions =
                                questionBank[
                                    sector
                                ][
                                    type
                                ][
                                    level
                                ];


                            questions.forEach(
                                question => {

                                    allQuestions.push({

                                        ...question,

                                        sector,

                                        interviewType:
                                            type,

                                        experience:
                                            level

                                    });

                                }
                            );

                        }
                    );

                }
            );

        }
    );


    return allQuestions;

}


/*
    Start random question practice.

    A random question can come from any industry.
*/

function startRandomPractice() {

    stopTimer();


    const allQuestions =
        getAllQuestions();


    const randomQuestion =
        allQuestions[
            Math.floor(
                Math.random() *
                allQuestions.length
            )
        ];


    currentSession = {

        sector:
            randomQuestion.sector,

        interviewType:
            randomQuestion.interviewType,

        experience:
            randomQuestion.experience,

        questions: [
            randomQuestion
        ],

        currentIndex: 0,

        timerSeconds:
            Number(timerSetting.value) || 120,

        timerInterval: null,

        questionStartTime: null,

        confidence: null,

        randomMode: true

    };


    sessionAnswers = [];

    questionSavedForCurrentIndex = false;


    currentSector.textContent =
        randomQuestion.sector;

    currentInterviewType.textContent =
        randomQuestion.interviewType;

    currentExperience.textContent =
        randomQuestion.experience;


    showScreen(practiceScreen);

    loadQuestion();

    showToast(
        "Random question selected."
    );

}


/*
    Random button on setup screen.
*/

randomPracticeButton.addEventListener(
    "click",
    startRandomPractice
);


/*
    Random button on summary screen.
*/

randomSummaryButton.addEventListener(
    "click",
    startRandomPractice
);


/* ============================================================
   TEXT TO SPEECH
   ============================================================ */

function speakText(text) {

    /*
        Check browser support.
    */

    if (
        !("speechSynthesis" in window)
    ) {

        showToast(
            "Text-to-speech is not supported by this browser."
        );

        return;

    }


    /*
        Stop anything currently being spoken.
    */

    window.speechSynthesis.cancel();


    const utterance =
        new SpeechSynthesisUtterance(
            text
        );


    utterance.rate = 0.9;

    utterance.pitch = 1;

    utterance.volume = 1;


    /*
        Try to use an English voice.
    */

    const voices =
        window.speechSynthesis.getVoices();


    const preferredVoice =
        voices.find(
            voice =>
                voice.lang.startsWith("en")
        );


    if (preferredVoice) {

        utterance.voice =
            preferredVoice;

    }


    window.speechSynthesis.speak(
        utterance
    );

}


/*
    Read current interview question.
*/

readQuestionButton.addEventListener(
    "click",
    () => {

        const question =
            currentSession.questions[
                currentSession.currentIndex
            ];


        if (!question) {
            return;
        }


        speakText(
            question.question
        );

    }
);


/* ============================================================
   VOICE RECOGNITION
   ============================================================ */

/*
    Browser compatibility:

    Chrome:
        window.SpeechRecognition

    Some browsers:
        window.webkitSpeechRecognition
*/

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();


    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-US";


    recognition.onstart = () => {

        isListening = true;

        updateVoiceUI(true);

    };


    recognition.onresult = event => {

        let finalTranscript = "";

        let interimTranscript = "";


        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {

            const transcript =
                event.results[i][0].transcript;


            if (
                event.results[i].isFinal
            ) {

                finalTranscript +=
                    transcript + " ";

            } else {

                interimTranscript +=
                    transcript;

            }

        }


        /*
            Add final speech to textarea.

            Existing typed text remains.
        */

        if (finalTranscript) {

            const existing =
                answerText.value.trim();


            answerText.value =
                existing
                    ? `${existing} ${finalTranscript.trim()}`
                    : finalTranscript.trim();


            answerText.dispatchEvent(
                new Event("input")
            );

        }


        voiceStatus.textContent =
            interimTranscript
                ? `Listening: ${interimTranscript}`
                : "Listening...";

    };


    recognition.onerror = event => {

        isListening = false;

        updateVoiceUI(false);


        if (
            event.error === "not-allowed"
        ) {

            showToast(
                "Microphone permission was denied."
            );

        } else {

            showToast(
                `Voice recognition error: ${event.error}`
            );

        }

    };


    recognition.onend = () => {

        isListening = false;

        updateVoiceUI(false);

    };

} else {

    /*
        Browser doesn't support speech recognition.
    */

    recognition = null;

}


/*
    Start / stop voice recognition.
*/

function toggleVoiceRecognition() {

    if (!recognition) {

        showToast(
            "Voice recognition is not supported in this browser."
        );

        return;

    }


    if (isListening) {

        recognition.stop();

    } else {

        try {

            recognition.start();

        } catch (error) {

            console.error(error);

        }

    }

}


/*
    Update voice buttons.
*/

function updateVoiceUI(active) {

    if (active) {

        voiceAnswerButton.textContent =
            "⏹ Stop Listening";

        voiceAnswerButton.classList.add(
            "recording"
        );


        modalVoiceButton.textContent =
            "⏹ Stop Speaking";

        voiceStatus.textContent =
            "Listening...";

    } else {

        voiceAnswerButton.textContent =
            "🎙️ Voice Answer";

        voiceAnswerButton.classList.remove(
            "recording"
        );


        modalVoiceButton.textContent =
            "🎙️ Start Speaking";

        voiceStatus.textContent =
            "Ready";

    }

}


/*
    Voice answer button.
*/

voiceAnswerButton.addEventListener(
    "click",
    toggleVoiceRecognition
);


/* ============================================================
   VOICE MODAL
   ============================================================ */

voiceAssistantButton.addEventListener(
    "click",
    () => {

        voiceModal.hidden = false;

        voiceStatus.textContent =
            "Ready";

    }
);


closeVoiceModal.addEventListener(
    "click",
    () => {

        voiceModal.hidden = true;

    }
);


/*
    Clicking overlay closes modal.
*/

document.querySelector(
    ".modal-overlay"
).addEventListener(
    "click",
    () => {

        voiceModal.hidden = true;

    }
);


/*
    Modal voice button.
*/

modalVoiceButton.addEventListener(
    "click",
    toggleVoiceRecognition
);


/* ============================================================
   KEYBOARD SUPPORT
   ============================================================ */

document.addEventListener(
    "keydown",
    event => {

        /*
            Escape closes modal.
        */

        if (
            event.key === "Escape" &&
            !voiceModal.hidden
        ) {

            voiceModal.hidden = true;

        }


        /*
            Ctrl + Enter:
            move to next question.
        */

        if (
            event.ctrlKey &&
            event.key === "Enter" &&
            practiceScreen.classList.contains(
                "active-screen"
            )
        ) {

            nextButton.click();

        }

    }
);


/* ============================================================
   THEME TOGGLE
   ============================================================ */

themeButton.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );


        const dark =
            document.body.classList.contains(
                "dark-mode"
            );


        themeButton.textContent =
            dark
                ? "🌙"
                : "☀️";

    }
);


/* ============================================================
   VOICE SYNTHESIS INITIALIZATION
   ============================================================ */

/*
    Some browsers only populate voices after voiceschanged.
*/

if (
    "speechSynthesis" in window
) {

    window.speechSynthesis.onvoiceschanged =
        () => {

            window.speechSynthesis.getVoices();

        };

}


/* ============================================================
   INITIALIZATION
   ============================================================ */

function initializeApp() {

    /*
        Make sure the setup screen is visible.
    */

    showScreen(setupScreen);


    /*
        Set sensible defaults.
    */

    timerSetting.value = 120;


    /*
        Voice support hint.
    */

    if (!SpeechRecognition) {

        voiceAnswerButton.title =
            "Voice recognition is not supported by this browser.";

    }

}


initializeApp();