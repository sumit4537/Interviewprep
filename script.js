/* =========================================================
   INTERVIEWPREP
   VANILLA JAVASCRIPT APPLICATION
   =========================================================

   IMPORTANT:
   - Practice UI state remains in JavaScript memory
   - Supabase Auth manages its own persisted browser session
   - Supabase is the authentication/database backend
   - Hash routing is used to create multiple app pages

========================================================= */


/* =========================================================
   1. APPLICATION STATE
========================================================= */

const appState = {

    currentRoute: "home",

    currentQuestionIndex: 0,

    questions: [],

    selectedSector: "Software Engineering",

    selectedType: "Behavioral",

    selectedLevel: "Fresher/Entry-level",

    questionTimeSeconds: 120,

    remainingSeconds: 120,

    timerStartedAt: null,

    timerInterval: null,

    questionStartedAt: null,

    currentRating: 0,

    sessionAnswers: [],

    allAnswers: [],

    voiceQuestionIndex: 0,

    voiceTranscript: "",

    isListening: false,

    recognition: null,

    sessionActive: false,

    lastSummary: null

};


/* =========================================================
   2. QUESTION BANK
=========================================================

   The bank is intentionally structured so you can easily
   add more questions later.

   Each question contains:
   - question
   - tips
   - sampleAnswerOutline
========================================================= */

const questionBank = {

    "Software Engineering": {

        "Behavioral": {

            "Fresher/Entry-level": [
                {
                    question: "Tell me about yourself and your technical background.",
                    tips: "Use a present → past → future structure.",
                    sampleAnswerOutline: "• Education/background\n• Technical skills\n• Projects/internship\n• What you want to do next"
                },
                {
                    question: "Tell me about a challenging project you worked on.",
                    tips: "Focus on your personal contribution.",
                    sampleAnswerOutline: "• Project goal\n• Challenge\n• Your responsibility\n• Solution\n• Result"
                },
                {
                    question: "Describe a time you made a mistake in a project.",
                    tips: "Do not hide the mistake. Focus on learning.",
                    sampleAnswerOutline: "• Situation\n• Mistake\n• Correction\n• Lesson learned"
                },
                {
                    question: "How do you handle tight deadlines?",
                    tips: "Show prioritization rather than simply saying you work harder.",
                    sampleAnswerOutline: "• Understand requirements\n• Prioritize\n• Break work down\n• Communicate blockers\n• Deliver"
                },
                {
                    question: "Tell me about a time you worked in a team.",
                    tips: "Highlight collaboration and communication.",
                    sampleAnswerOutline: "• Team objective\n• Your role\n• Collaboration\n• Challenge\n• Result"
                },
                {
                    question: "How do you learn a new programming language or technology?",
                    tips: "Give a concrete learning process.",
                    sampleAnswerOutline: "• Documentation\n• Small project\n• Practice\n• Debugging\n• Feedback"
                },
                {
                    question: "What motivates you to work in software engineering?",
                    tips: "Connect motivation to problem solving and building products.",
                    sampleAnswerOutline: "• Interest in technology\n• Problem solving\n• Building useful systems\n• Continuous learning"
                },
                {
                    question: "How do you respond when someone criticizes your code?",
                    tips: "Show that you value constructive feedback.",
                    sampleAnswerOutline: "• Listen\n• Understand reasoning\n• Improve code\n• Learn from review"
                },
                {
                    question: "Describe a situation where you had to solve a problem independently.",
                    tips: "Explain your thought process.",
                    sampleAnswerOutline: "• Problem\n• Research\n• Alternatives\n• Decision\n• Outcome"
                },
                {
                    question: "Where do you see yourself in the next three years?",
                    tips: "Keep your answer realistic and role-related.",
                    sampleAnswerOutline: "• Technical growth\n• Responsibilities\n• Contribution\n• Long-term learning"
                }
            ],

            "Mid-level": [
                {
                    question: "Tell me about a difficult engineering decision you made.",
                    tips: "Explain trade-offs.",
                    sampleAnswerOutline: "• Context\n• Options\n• Trade-offs\n• Decision\n• Result"
                },
                {
                    question: "Describe a production incident you handled.",
                    tips: "Show calm troubleshooting and communication.",
                    sampleAnswerOutline: "• Incident\n• Impact\n• Diagnosis\n• Fix\n• Prevention"
                },
                {
                    question: "Tell me about a disagreement with another engineer.",
                    tips: "Focus on technical reasoning rather than personalities.",
                    sampleAnswerOutline: "• Disagreement\n• Evidence\n• Discussion\n• Resolution\n• Lesson"
                },
                {
                    question: "How have you improved engineering processes?",
                    tips: "Quantify improvements where possible.",
                    sampleAnswerOutline: "• Existing problem\n• Proposed improvement\n• Implementation\n• Measurable result"
                },
                {
                    question: "Describe a project where requirements changed significantly.",
                    tips: "Show adaptability.",
                    sampleAnswerOutline: "• Original requirements\n• Change\n• Impact\n• Adaptation\n• Result"
                },
                {
                    question: "How do you mentor junior developers?",
                    tips: "Mention coaching rather than simply solving problems for them.",
                    sampleAnswerOutline: "• Understand gap\n• Explain concepts\n• Pair programming\n• Feedback\n• Growth"
                },
                {
                    question: "Tell me about a time you improved system performance.",
                    tips: "Include measurable impact.",
                    sampleAnswerOutline: "• Bottleneck\n• Investigation\n• Change\n• Measurement\n• Result"
                },
                {
                    question: "How do you balance technical debt with feature development?",
                    tips: "Discuss business and engineering trade-offs.",
                    sampleAnswerOutline: "• Identify debt\n• Risk\n• Prioritize\n• Allocate time\n• Monitor"
                }
            ],

            "Senior": [
                {
                    question: "Tell me about a major architectural decision you led.",
                    tips: "Explain technical and business trade-offs.",
                    sampleAnswerOutline: "• Problem\n• Constraints\n• Architecture options\n• Decision\n• Impact"
                },
                {
                    question: "Describe a major engineering failure and what you learned.",
                    tips: "Take ownership.",
                    sampleAnswerOutline: "• Failure\n• Root cause\n• Leadership response\n• Prevention\n• Lesson"
                },
                {
                    question: "How do you create alignment across engineering teams?",
                    tips: "Discuss communication and shared technical direction.",
                    sampleAnswerOutline: "• Stakeholders\n• Goals\n• Architecture\n• Documentation\n• Alignment"
                },
                {
                    question: "How do you evaluate technical risk?",
                    tips: "Show systematic risk assessment.",
                    sampleAnswerOutline: "• Identify risk\n• Probability\n• Impact\n• Mitigation\n• Monitoring"
                },
                {
                    question: "Tell me about a system you scaled significantly.",
                    tips: "Use measurable scale.",
                    sampleAnswerOutline: "• Starting scale\n• Bottleneck\n• Architecture\n• Changes\n• New scale"
                },
                {
                    question: "How do you handle disagreements among senior engineers?",
                    tips: "Focus on evidence and decision frameworks.",
                    sampleAnswerOutline: "• Understand positions\n• Establish criteria\n• Evidence\n• Decision\n• Alignment"
                },
                {
                    question: "How do you balance engineering quality and delivery speed?",
                    tips: "Explain how you manage risk.",
                    sampleAnswerOutline: "• Quality baseline\n• Risk assessment\n• Prioritization\n• Automation\n• Delivery"
                },
                {
                    question: "What makes a strong engineering culture?",
                    tips: "Discuss behaviors rather than slogans.",
                    sampleAnswerOutline: "• Ownership\n• Psychological safety\n• Code quality\n• Learning\n• Accountability"
                }
            ]
        },

        "Technical": {

            "Fresher/Entry-level": [
                {
                    question: "What are the four main principles of object-oriented programming?",
                    tips: "Define each principle and give a simple example.",
                    sampleAnswerOutline: "• Encapsulation\n• Abstraction\n• Inheritance\n• Polymorphism"
                },
                {
                    question: "What is the difference between an array and a linked list?",
                    tips: "Compare memory layout and operations.",
                    sampleAnswerOutline: "• Memory\n• Access\n• Insert/delete\n• Complexity\n• Use cases"
                },
                {
                    question: "Explain time complexity and Big O notation.",
                    tips: "Use a simple algorithm as an example.",
                    sampleAnswerOutline: "• Definition\n• O(1)\n• O(log n)\n• O(n)\n• O(n²)"
                },
                {
                    question: "What is the difference between a process and a thread?",
                    tips: "Focus on memory and execution.",
                    sampleAnswerOutline: "• Process\n• Thread\n• Memory\n• Context switching\n• Use case"
                },
                {
                    question: "What is an API?",
                    tips: "Explain it as a communication interface.",
                    sampleAnswerOutline: "• Definition\n• Request\n• Response\n• HTTP example\n• Use case"
                },
                {
                    question: "What happens when you type a URL into a browser?",
                    tips: "Walk through networking layers logically.",
                    sampleAnswerOutline: "• DNS\n• TCP/TLS\n• HTTP\n• Server\n• Browser rendering"
                },
                {
                    question: "What is a database index?",
                    tips: "Explain the speed/storage trade-off.",
                    sampleAnswerOutline: "• Purpose\n• Lookup\n• Speed\n• Storage\n• Trade-off"
                },
                {
                    question: "What is Git and why is it used?",
                    tips: "Mention collaboration and version history.",
                    sampleAnswerOutline: "• Version control\n• Branches\n• Commits\n• Collaboration\n• Recovery"
                },
                {
                    question: "Explain the difference between HTTP and HTTPS.",
                    tips: "Focus on encryption and certificates.",
                    sampleAnswerOutline: "• HTTP\n• TLS\n• Encryption\n• Certificates\n• Security"
                },
                {
                    question: "What is exception handling?",
                    tips: "Explain why applications need controlled error handling.",
                    sampleAnswerOutline: "• Runtime errors\n• try/catch\n• Recovery\n• Logging\n• User experience"
                }
            ]
        }
    },


    /* =====================================================
       CLOUD / DEVOPS
    ===================================================== */

    "Cloud/DevOps": {

        "Technical": {

            "Fresher/Entry-level": [
                {
                    question: "What is cloud computing?",
                    tips: "Define it and explain its advantages.",
                    sampleAnswerOutline: "• On-demand resources\n• Internet access\n• Scalability\n• Pay-as-you-go\n• Example"
                },
                {
                    question: "What is the difference between AWS EC2 and S3?",
                    tips: "Compare compute and object storage.",
                    sampleAnswerOutline: "• EC2 = compute\n• S3 = object storage\n• Use cases\n• Example"
                },
                {
                    question: "What is Docker?",
                    tips: "Explain containers in simple terms.",
                    sampleAnswerOutline: "• Containerization\n• Image\n• Container\n• Portability\n• Use case"
                },
                {
                    question: "What is CI/CD?",
                    tips: "Separate continuous integration and delivery/deployment.",
                    sampleAnswerOutline: "• CI\n• Automated tests\n• CD\n• Deployment\n• Benefits"
                },
                {
                    question: "What is a virtual machine?",
                    tips: "Compare virtualized hardware with physical machines.",
                    sampleAnswerOutline: "• Hypervisor\n• Virtual hardware\n• Guest OS\n• Isolation"
                },
                {
                    question: "What is an AWS security group?",
                    tips: "Explain inbound and outbound traffic control.",
                    sampleAnswerOutline: "• Virtual firewall\n• Inbound\n• Outbound\n• Rules\n• EC2"
                },
                {
                    question: "What is a VPC?",
                    tips: "Describe it as an isolated virtual network.",
                    sampleAnswerOutline: "• Network isolation\n• Subnets\n• Routing\n• Security\n• Cloud resources"
                },
                {
                    question: "What is Kubernetes?",
                    tips: "Explain the problem it solves.",
                    sampleAnswerOutline: "• Container orchestration\n• Pods\n• Scaling\n• Scheduling\n• Services"
                },
                {
                    question: "What is infrastructure as code?",
                    tips: "Mention automation and repeatability.",
                    sampleAnswerOutline: "• Infrastructure definition\n• Version control\n• Automation\n• Reproducibility"
                },
                {
                    question: "What is Linux commonly used for in cloud environments?",
                    tips: "Connect Linux administration to servers.",
                    sampleAnswerOutline: "• Servers\n• CLI\n• Packages\n• Permissions\n• Networking"
                }
            ]
        }
    },


    /* =====================================================
       IT / NETWORKING
    ===================================================== */

    "IT/Networking": {

        "Technical": {

            "Fresher/Entry-level": [
                {
                    question: "What is an IP address?",
                    tips: "Explain its purpose in network communication.",
                    sampleAnswerOutline: "• Identifier\n• IPv4/IPv6\n• Network\n• Host"
                },
                {
                    question: "What is subnetting?",
                    tips: "Explain why networks are divided.",
                    sampleAnswerOutline: "• Network division\n• Subnet mask\n• Efficiency\n• Security"
                },
                {
                    question: "What is DNS?",
                    tips: "Use the domain-to-IP analogy.",
                    sampleAnswerOutline: "• Domain name\n• DNS lookup\n• IP address\n• Browser connection"
                },
                {
                    question: "What is DHCP?",
                    tips: "Explain automatic IP configuration.",
                    sampleAnswerOutline: "• Automatic addressing\n• IP\n• Gateway\n• DNS\n• Lease"
                },
                {
                    question: "What is the difference between TCP and UDP?",
                    tips: "Compare reliability and speed.",
                    sampleAnswerOutline: "• Connection\n• Reliability\n• Ordering\n• Speed\n• Use cases"
                },
                {
                    question: "What is a router?",
                    tips: "Explain packet forwarding between networks.",
                    sampleAnswerOutline: "• Network device\n• Routing table\n• Packet forwarding\n• Networks"
                },
                {
                    question: "What is a firewall?",
                    tips: "Explain traffic filtering.",
                    sampleAnswerOutline: "• Security boundary\n• Rules\n• Allow/deny\n• Inbound/outbound"
                },
                {
                    question: "What is the OSI model?",
                    tips: "Mention the seven layers and purpose.",
                    sampleAnswerOutline: "• Physical\n• Data Link\n• Network\n• Transport\n• Session\n• Presentation\n• Application"
                },
                {
                    question: "How would you troubleshoot a computer that cannot access the internet?",
                    tips: "Use a logical troubleshooting sequence.",
                    sampleAnswerOutline: "• Physical connection\n• IP configuration\n• Gateway\n• DNS\n• Ping\n• Browser"
                },
                {
                    question: "What is the difference between a switch and a hub?",
                    tips: "Focus on how traffic is forwarded.",
                    sampleAnswerOutline: "• Hub broadcasts\n• Switch MAC table\n• Collision domains\n• Efficiency"
                }
            ]
        }
    },


    /* =====================================================
       GENERIC / OTHER
    ===================================================== */

    "Generic/Other": {

        "Behavioral": {

            "Fresher/Entry-level": [
                {
                    question: "Tell me about yourself.",
                    tips: "Keep your answer relevant to the job.",
                    sampleAnswerOutline: "• Education\n• Skills\n• Projects\n• Strengths\n• Career goal"
                },
                {
                    question: "Why should we hire you?",
                    tips: "Connect your skills to the company's needs.",
                    sampleAnswerOutline: "• Relevant skills\n• Evidence\n• Learning ability\n• Contribution"
                },
                {
                    question: "What are your strengths?",
                    tips: "Support each strength with evidence.",
                    sampleAnswerOutline: "• Strength\n• Example\n• Result"
                },
                {
                    question: "What is your biggest weakness?",
                    tips: "Choose a real but manageable weakness and show improvement.",
                    sampleAnswerOutline: "• Weakness\n• Impact\n• Improvement plan\n• Progress"
                },
                {
                    question: "Why do you want this job?",
                    tips: "Connect role, company and career goals.",
                    sampleAnswerOutline: "• Role interest\n• Company interest\n• Skills\n• Growth"
                },
                {
                    question: "Tell me about a time you solved a difficult problem.",
                    tips: "Use STAR.",
                    sampleAnswerOutline: "• Situation\n• Task\n• Action\n• Result"
                },
                {
                    question: "How do you handle failure?",
                    tips: "Show accountability and learning.",
                    sampleAnswerOutline: "• Failure\n• Response\n• Learning\n• Improvement"
                },
                {
                    question: "Where do you see yourself in five years?",
                    tips: "Focus on realistic professional growth.",
                    sampleAnswerOutline: "• Skills\n• Responsibility\n• Contribution\n• Learning"
                },
                {
                    question: "How do you prioritize multiple tasks?",
                    tips: "Explain your prioritization criteria.",
                    sampleAnswerOutline: "• Urgency\n• Impact\n• Deadlines\n• Planning\n• Communication"
                },
                {
                    question: "Do you have any questions for us?",
                    tips: "Always prepare thoughtful questions.",
                    sampleAnswerOutline: "• Team\n• Role\n• Success metrics\n• Learning\n• Company"
                }
            ]
        }
    }

};


/* =========================================================
   3. ADD FALLBACK QUESTIONS
========================================================= */

const fallbackQuestions = [
    {
        question: "Tell me about yourself.",
        tips: "Use a concise present → past → future structure.",
        sampleAnswerOutline:
            "• Current background\n• Relevant skills\n• Projects/experience\n• Career direction"
    },
    {
        question: "Why are you interested in this role?",
        tips: "Connect the role to your skills and goals.",
        sampleAnswerOutline:
            "• Role interest\n• Relevant skills\n• Evidence\n• Career goal"
    },
    {
        question: "Describe a challenging problem you solved.",
        tips: "Use the STAR framework.",
        sampleAnswerOutline:
            "• Situation\n• Task\n• Action\n• Result"
    },
    {
        question: "What is one skill you are currently improving?",
        tips: "Show self-awareness and a concrete learning plan.",
        sampleAnswerOutline:
            "• Skill\n• Current level\n• Learning method\n• Progress"
    },
    {
        question: "How do you handle pressure?",
        tips: "Explain your process for staying organized.",
        sampleAnswerOutline:
            "• Assess\n• Prioritize\n• Execute\n• Communicate"
    },
    {
        question: "Tell me about a time you worked with a team.",
        tips: "Highlight your contribution.",
        sampleAnswerOutline:
            "• Goal\n• Role\n• Collaboration\n• Result"
    },
    {
        question: "What motivates you professionally?",
        tips: "Connect your motivation to meaningful work.",
        sampleAnswerOutline:
            "• Motivation\n• Example\n• Impact\n• Growth"
    },
    {
        question: "How do you respond to feedback?",
        tips: "Show that you turn feedback into action.",
        sampleAnswerOutline:
            "• Listen\n• Clarify\n• Apply\n• Improve"
    },
    {
        question: "What are your biggest strengths?",
        tips: "Support strengths with evidence.",
        sampleAnswerOutline:
            "• Strength\n• Example\n• Result"
    },
    {
        question: "Why should we hire you?",
        tips: "Summarize your strongest job-relevant value.",
        sampleAnswerOutline:
            "• Skills\n• Evidence\n• Learning ability\n• Contribution"
    }
];


/* =========================================================
   4. DOM HELPERS
========================================================= */

function $(id) {
    return document.getElementById(id);
}


function showElement(element) {
    element.classList.remove("hidden");
}


function hideElement(element) {
    element.classList.add("hidden");
}


/* =========================================================
   5. ROUTER
========================================================= */

function navigateTo(route) {

    const validRoutes = [
        "home",
        "pressure",
        "voice",
        "progress",
        "summary",
        "history",
        "profile",
        "login",
        "signup",
        "verify-email",
        "verify-phone",
        "forgot-password",
        "reset-password"
    ];

    if (!validRoutes.includes(route)) {
        route = "home";
    }

    appState.currentRoute = route;

    window.location.hash = route;

    renderPage(route);
}


function renderPage(route) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });


    const page = $(`${route}Page`);

    if (page) {
        page.classList.add("active-page");
    }


    document.querySelectorAll(".main-nav a").forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === `#${route}`) {
            link.classList.add("active");
        }
    });


    if (route === "progress") {
        updateProgressPage();
    }


    if (route === "home") {
        updateHomeStats();
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   HASH ROUTING
========================================================= */

function handleRouteChange() {

    let route = window.location.hash.replace("#", "");

    if (!route) {
        route = "home";
    }

    const validRoutes = [
        "home",
        "pressure",
        "voice",
        "progress",
        "summary",
        "history",
        "profile",
        "login",
        "signup",
        "verify-email",
        "verify-phone",
        "forgot-password",
        "reset-password"
    ];

    if (!validRoutes.includes(route)) {
        route = "home";
    }

    appState.currentRoute = route;

    renderPage(route);
}


window.addEventListener(
    "hashchange",
    handleRouteChange
);


/* =========================================================
   6. CLICKABLE ROUTE BUTTONS
========================================================= */

document.addEventListener("click", event => {

    const routeElement =
        event.target.closest("[data-route]");

    if (!routeElement) {
        return;
    }

    const route =
        routeElement.dataset.route;

    navigateTo(route);
});


/* =========================================================
   KEYBOARD SUPPORT FOR FEATURE CARDS
========================================================= */

document.querySelectorAll(".clickable-card").forEach(card => {

    card.addEventListener("keydown", event => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            navigateTo(card.dataset.route);
        }

    });

});


/* =========================================================
   7. MOBILE NAVIGATION
========================================================= */

$("mobileMenuBtn").addEventListener("click", () => {

    const nav = document.querySelector(".main-nav");

    const isOpen =
        nav.classList.toggle("open");

    $("mobileMenuBtn")
        .setAttribute(
            "aria-expanded",
            isOpen
        );
});


document.querySelectorAll(".main-nav a")
    .forEach(link => {

        link.addEventListener("click", () => {

            document
                .querySelector(".main-nav")
                .classList.remove("open");

            $("mobileMenuBtn")
                .setAttribute(
                    "aria-expanded",
                    "false"
                );

        });

    });


/* =========================================================
   8. GET QUESTIONS
========================================================= */

function getQuestions() {

    const sector =
        appState.selectedSector;

    const type =
        appState.selectedType;

    const level =
        appState.selectedLevel;


    const sectorData =
        questionBank[sector];


    if (
        sectorData &&
        sectorData[type] &&
        sectorData[type][level]
    ) {

        return [
            ...sectorData[type][level]
        ];
    }


    /*
       If the exact combination isn't available,
       try another question set from the same sector.
    */

    if (
        sectorData &&
        sectorData[type]
    ) {

        const levels =
            Object.values(
                sectorData[type]
            );

        if (levels.length) {
            return [...levels[0]];
        }
    }


    /*
       Otherwise use generic questions.
    */

    return [...fallbackQuestions];
}


/* =========================================================
   9. SHUFFLE
========================================================= */

function shuffle(array) {

    const copy = [...array];

    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            copy[i],
            copy[j]
        ] = [
            copy[j],
            copy[i]
        ];
    }

    return copy;
}


/* =========================================================
   10. START INTERVIEW
========================================================= */

$("startPracticeBtn")
    .addEventListener("click", () => {

        navigateTo("pressure");

    });


$("beginInterviewBtn")
    .addEventListener("click", startInterview);


async function startInterview() {

    if (authConfigured() && !authState.user) {
        routeTo("login");
        return;
    }

    appState.selectedSector =
        $("sectorSelect").value;

    appState.selectedType =
        $("interviewTypeSelect").value;

    appState.selectedLevel =
        $("levelSelect").value;


    const minutes =
        Number($("timerInput").value);


    appState.questionTimeSeconds =
        Math.max(
            60,
            Math.min(
                minutes * 60,
                600
            )
        );


    appState.questions =
        shuffle(
            getQuestions()
        ).slice(0, 10);


    appState.currentQuestionIndex = 0;

    appState.sessionAnswers = [];

    appState.currentRating = 0;

    appState.dbSessionId = null;
    appState.dbSessionStartedAt = new Date().toISOString();
    appState.dbSessionMode = "pressure";
    appState.sessionActive = true;

    const sessionCreated = await createPersistentInterviewSession("pressure");
    if (!sessionCreated) {
        resetPracticeState();
        return;
    }


    hideElement($("pressureSetup"));

    showElement($("pressurePractice"));


    loadQuestion();

}


/* =========================================================
   11. LOAD QUESTION
========================================================= */

function loadQuestion() {

    stopTimer();


    const index =
        appState.currentQuestionIndex;

    const question =
        appState.questions[index];


    if (!question) {
        finishSession();
        return;
    }


    $("questionText").textContent =
        question.question;


    $("questionCategory").textContent =
        `${appState.selectedType.toUpperCase()} • ${appState.selectedLevel.toUpperCase()}`;


    $("questionProgress").textContent =
        `Question ${index + 1} of ${appState.questions.length}`;


    $("questionProgressBar").style.width =
        `${((index + 1) / appState.questions.length) * 100}%`;


    $("answerInput").value = "";


    $("wordCount").textContent =
        "0 words";


    hideElement($("tipsPanel"));

    hideElement($("evaluationPanel"));


    $("showTipsBtn").textContent =
        "Show Tips";


    resetRating();


    $("tipText").textContent =
        question.tips;


    $("outlineText").textContent =
        question.sampleAnswerOutline;


    appState.questionStartedAt =
        Date.now();


    startTimer();

}


/* =========================================================
   12. TIMER
========================================================= */

function startTimer() {

    stopTimer();


    appState.remainingSeconds =
        appState.questionTimeSeconds;


    updateTimerDisplay();


    appState.timerStartedAt =
        Date.now();


    appState.timerInterval =
        setInterval(() => {

            appState.remainingSeconds--;

            updateTimerDisplay();


            if (
                appState.remainingSeconds <= 0
            ) {

                stopTimer();

                timeExpired();

            }

        }, 1000);
}


function stopTimer() {

    if (appState.timerInterval) {

        clearInterval(
            appState.timerInterval
        );

        appState.timerInterval = null;
    }
}


function updateTimerDisplay() {

    const seconds =
        Math.max(
            0,
            appState.remainingSeconds
        );


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remaining =
        seconds % 60;


    $("timerDisplay").textContent =
        `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;


    if (seconds <= 15) {

        $("timerDisplay")
            .classList.add("low-time");

    } else {

        $("timerDisplay")
            .classList.remove("low-time");

    }

}


function timeExpired() {

    saveCurrentAnswer();

    showElement(
        $("evaluationPanel")
    );

    $("ratingText").textContent =
        "Time is up. Rate your answer before continuing.";

}


/* =========================================================
   13. ANSWER WORD COUNT
========================================================= */

$("answerInput")
    .addEventListener("input", () => {

        const text =
            $("answerInput").value.trim();


        const words =
            text
                ? text.split(/\s+/).length
                : 0;


        $("wordCount").textContent =
            `${words} ${words === 1 ? "word" : "words"}`;

    });


/* =========================================================
   14. SHOW TIPS
========================================================= */

$("showTipsBtn")
    .addEventListener("click", () => {

        const panel =
            $("tipsPanel");

        const hidden =
            panel.classList.contains("hidden");


        if (hidden) {

            showElement(panel);

            $("showTipsBtn")
                .textContent =
                "Hide Tips";

        } else {

            hideElement(panel);

            $("showTipsBtn")
                .textContent =
                "Show Tips";

        }

    });


/* =========================================================
   15. RATING
========================================================= */

document
    .querySelectorAll(
        "#ratingStars button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const rating =
                    Number(
                        button.dataset.rating
                    );

                setRating(rating);

            }
        );

    });


function setRating(rating) {

    appState.currentRating =
        rating;


    document
        .querySelectorAll(
            "#ratingStars button"
        )
        .forEach(button => {

            const buttonRating =
                Number(
                    button.dataset.rating
                );


            button.classList.toggle(
                "selected",
                buttonRating <= rating
            );

        });


    const descriptions = {
        1: "Very low confidence",
        2: "Low confidence",
        3: "Moderate confidence",
        4: "Good confidence",
        5: "Very high confidence"
    };


    $("ratingText").textContent =
        descriptions[rating];

}


function resetRating() {

    appState.currentRating = 0;

    document
        .querySelectorAll(
            "#ratingStars button"
        )
        .forEach(button => {

            button.classList.remove(
                "selected"
            );

        });


    $("ratingText").textContent =
        "Select a rating";

}


/* =========================================================
   16. SAVE CURRENT ANSWER
========================================================= */

function saveCurrentAnswer() {

    const question =
        appState.questions[
            appState.currentQuestionIndex
        ];


    if (!question) {
        return;
    }


    const answer =
        $("answerInput").value.trim();


    const existingIndex =
        appState.sessionAnswers
            .findIndex(
                item =>
                    item.questionIndex ===
                    appState.currentQuestionIndex
            );


    const elapsed =
        Math.max(
            0,
            Math.round(
                (Date.now() -
                    appState.questionStartedAt) /
                1000
            )
        );


    const record = {

        questionIndex:
            appState.currentQuestionIndex,

        question:
            question.question,

        answer:
            answer,

        rating:
            appState.currentRating,

        timestamp:
            new Date().toISOString(),

        timeTaken:
            Math.min(
                elapsed,
                appState.questionTimeSeconds
            ),

        sector:
            appState.selectedSector,

        type:
            appState.selectedType,

        level:
            appState.selectedLevel

    };


    if (existingIndex >= 0) {

        appState.sessionAnswers[
            existingIndex
        ] = record;

    } else {

        appState.sessionAnswers.push(
            record
        );

    }


    /*
       Keep a global in-memory record too.
       This resets when the browser page reloads.
    */

    const globalExistingIndex =
        appState.allAnswers.findIndex(
            item =>
                item.question ===
                record.question &&
                item.timestamp ===
                record.timestamp
        );


    if (globalExistingIndex === -1) {

        appState.allAnswers.push(
            record
        );

    }

}


/* =========================================================
   17. NEXT QUESTION
========================================================= */

$("nextQuestionBtn")
    .addEventListener(
        "click",
        nextQuestion
    );


function nextQuestion() {

    if (
        appState.currentRating === 0 &&
        $("answerInput").value.trim()
    ) {

        showElement(
            $("evaluationPanel")
        );

        $("ratingText").textContent =
            "Please select a confidence rating before continuing.";

        return;
    }


    saveCurrentAnswer();


    if (
        appState.currentQuestionIndex <
        appState.questions.length - 1
    ) {

        appState.currentQuestionIndex++;

        loadQuestion();

    } else {

        finishSession();

    }

}


/* =========================================================
   18. PREVIOUS QUESTION
========================================================= */

$("previousQuestionBtn")
    .addEventListener(
        "click",
        previousQuestion
    );


function previousQuestion() {

    saveCurrentAnswer();


    if (
        appState.currentQuestionIndex > 0
    ) {

        appState.currentQuestionIndex--;

        loadQuestion();

    }

}


/* =========================================================
   19. FINISH SESSION
========================================================= */

$("finishSessionBtn")
    .addEventListener(
        "click",
        finishSession
    );


async function finishSession() {

    if (!appState.sessionActive && !appState.sessionAnswers.length) {
        navigateTo("summary");
        return;
    }

    saveCurrentAnswer();
    stopTimer();

    // Render the completed session before clearing transient practice state.
    updateSummary();

    await persistCurrentAnswerToDatabase();
    await completePersistentInterviewSession();

    appState.sessionActive = false;
    resetPracticeState();
    appState.allAnswers = [];

    navigateTo("summary");

}


/* =========================================================
   20. SUMMARY
========================================================= */

function updateSummary() {

    const answers =
        appState.sessionAnswers;


    const attempted =
        answers.filter(
            item =>
                item.answer.length > 0
        );


    $("summaryAttempts")
        .textContent =
        attempted.length;


    const rated =
        answers.filter(
            item =>
                item.rating > 0
        );


    if (rated.length) {

        const average =
            rated.reduce(
                (sum, item) =>
                    sum + item.rating,
                0
            ) / rated.length;


        $("summaryConfidence")
            .textContent =
            `${average.toFixed(1)} / 5`;

    } else {

        $("summaryConfidence")
            .textContent =
            "--";

    }


    if (attempted.length) {

        const averageTime =
            attempted.reduce(
                (sum, item) =>
                    sum + item.timeTaken,
                0
            ) / attempted.length;


        $("summaryTime")
            .textContent =
            formatSeconds(
                averageTime
            );

    } else {

        $("summaryTime")
            .textContent =
            "--";

    }


    renderChart(
        $("summaryChart"),
        answers
    );


    renderReviewAnswers(
        $("summaryReviewAnswers"),
        answers
    );

}


/* =========================================================
   21. PROGRESS PAGE
========================================================= */

function updateProgressPage() {

    const answers =
        appState.allAnswers;


    const attempted =
        answers.filter(
            item =>
                item.answer.length > 0
        );


    $("progressAttempts")
        .textContent =
        attempted.length;


    const rated =
        attempted.filter(
            item =>
                item.rating > 0
        );


    if (rated.length) {

        const average =
            rated.reduce(
                (sum, item) =>
                    sum + item.rating,
                0
            ) / rated.length;


        $("progressAverage")
            .textContent =
            `${average.toFixed(1)} / 5`;


        $("progressBest")
            .textContent =
            `${Math.max(
                ...rated.map(
                    item =>
                        item.rating
                )
            )} / 5`;

    } else {

        $("progressAverage")
            .textContent =
            "--";

        $("progressBest")
            .textContent =
            "--";

    }


    if (attempted.length) {

        const averageTime =
            attempted.reduce(
                (sum, item) =>
                    sum + item.timeTaken,
                0
            ) / attempted.length;


        $("progressTime")
            .textContent =
            formatSeconds(
                averageTime
            );

    } else {

        $("progressTime")
            .textContent =
            "--";

    }


    renderChart(
        $("progressChart"),
        answers
    );


    renderReviewAnswers(
        $("reviewAnswers"),
        answers
    );

}


/* =========================================================
   22. HOME STATS
========================================================= */

function updateHomeStats() {

    const answers =
        appState.allAnswers;


    const attempted =
        answers.filter(
            item =>
                item.answer.length > 0
        );


    $("totalAttemptsHome")
        .textContent =
        attempted.length;


    const rated =
        attempted.filter(
            item =>
                item.rating > 0
        );


    if (rated.length) {

        const average =
            rated.reduce(
                (sum, item) =>
                    sum + item.rating,
                0
            ) / rated.length;


        $("averageConfidenceHome")
            .textContent =
            `${average.toFixed(1)} / 5`;


        $("bestConfidenceHome")
            .textContent =
            `${Math.max(
                ...rated.map(
                    item =>
                        item.rating
                )
            )} / 5`;


        const readiness =
            Math.round(
                (average / 5) * 100
            );


        $("homeReadiness")
            .textContent =
            readiness;


        $("homeProgressBar")
            .style.width =
            `${readiness}%`;

    } else {

        $("averageConfidenceHome")
            .textContent =
            "--";

        $("bestConfidenceHome")
            .textContent =
            "--";

        $("homeReadiness")
            .textContent =
            "--";

        $("homeProgressBar")
            .style.width =
            "0%";

    }

}


/* =========================================================
   23. BAR CHART
========================================================= */

function renderChart(
    container,
    answers
) {

    container.innerHTML = "";


    const rated =
        answers.filter(
            item =>
                item.rating > 0
        );


    if (!rated.length) {

        container.innerHTML = `
            <div class="empty-chart">
                Complete some questions and rate your answers
                to see your confidence chart.
            </div>
        `;

        return;
    }


    rated.forEach(
        (item, index) => {

            const itemContainer =
                document.createElement(
                    "div"
                );


            itemContainer.className =
                "bar-item";


            const score =
                document.createElement(
                    "span"
                );


            score.className =
                "bar-score";


            score.textContent =
                `${item.rating}/5`;


            const bar =
                document.createElement(
                    "div"
                );


            bar.className =
                "bar";


            bar.style.height =
                `${item.rating * 20}%`;


            const label =
                document.createElement(
                    "span"
                );


            label.className =
                "bar-label";


            label.textContent =
                `Q${index + 1}`;


            itemContainer.appendChild(
                score
            );

            itemContainer.appendChild(
                bar
            );

            itemContainer.appendChild(
                label
            );


            container.appendChild(
                itemContainer
            );

        }
    );

}


/* =========================================================
   24. REVIEW ANSWERS
========================================================= */

function renderReviewAnswers(
    container,
    answers
) {

    container.innerHTML = "";


    if (!answers.length) {

        container.innerHTML = `
            <p class="empty-review">
                No answers have been recorded yet.
            </p>
        `;

        return;
    }


    answers.forEach(
        (item, index) => {

            const review =
                document.createElement(
                    "article"
                );


            review.className =
                "review-item";


            const question =
                document.createElement(
                    "h3"
                );


            question.textContent =
                `Question ${index + 1}: ${item.question}`;


            const answer =
                document.createElement(
                    "p"
                );


            answer.textContent =
                item.answer ||
                "No answer provided.";


            review.appendChild(
                question
            );

            review.appendChild(
                answer
            );


            if (item.rating > 0) {

                const rating =
                    document.createElement(
                        "div"
                    );


                rating.className =
                    "review-rating";


                rating.textContent =
                    `Confidence: ${"★".repeat(item.rating)}${"☆".repeat(5 - item.rating)}`;


                review.appendChild(
                    rating
                );

            }


            container.appendChild(
                review
            );

        }
    );

}


/* =========================================================
   25. REVIEW TOGGLES
========================================================= */

$("reviewToggle")
    .addEventListener(
        "click",
        () => {

            toggleReview(
                $("reviewAnswers"),
                $("reviewToggle")
            );

        }
    );


$("summaryReviewToggle")
    .addEventListener(
        "click",
        () => {

            toggleReview(
                $("summaryReviewAnswers"),
                $("summaryReviewToggle")
            );

        }
    );


function toggleReview(
    content,
    button
) {

    const isHidden =
        content.classList.contains(
            "hidden"
        );


    if (isHidden) {

        showElement(content);

        button.setAttribute(
            "aria-expanded",
            "true"
        );

        button.lastElementChild
            .textContent =
            "−";

    } else {

        hideElement(content);

        button.setAttribute(
            "aria-expanded",
            "false"
        );

        button.lastElementChild
            .textContent =
            "＋";

    }

}


/* =========================================================
   26. FORMAT TIME
========================================================= */

function formatSeconds(seconds) {

    const rounded =
        Math.round(seconds);


    if (rounded < 60) {

        return `${rounded}s`;

    }


    const minutes =
        Math.floor(
            rounded / 60
        );


    const remaining =
        rounded % 60;


    return `${minutes}m ${remaining}s`;

}


/* =========================================================
   27. RANDOM QUESTION MODE
========================================================= */

$("randomQuestionBtn")
    .addEventListener(
        "click",
        startRandomQuestion
    );


async function startRandomQuestion() {

    if (authConfigured() && !authState.user) {
        routeTo("login");
        return;
    }

    const allQuestions = [];


    Object.entries(
        questionBank
    ).forEach(
        ([sector, sectorData]) => {

            Object.entries(
                sectorData
            ).forEach(
                ([type, typeData]) => {

                    Object.entries(
                        typeData
                    ).forEach(
                        ([level, questions]) => {

                            questions.forEach(
                                question => {

                                    allQuestions.push({

                                        ...question,

                                        sector,

                                        type,

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


    const random =
        allQuestions[
            Math.floor(
                Math.random() *
                allQuestions.length
            )
        ];


    if (!random) {
        return;
    }


    appState.selectedSector =
        random.sector;

    appState.selectedType =
        random.type;

    appState.selectedLevel =
        random.level;


    appState.questions = [
        random
    ];


    appState.currentQuestionIndex = 0;

    appState.sessionAnswers = [];
    appState.dbSessionId = null;
    appState.dbSessionStartedAt = new Date().toISOString();
    appState.dbSessionMode = "random";
    appState.sessionActive = true;

    const sessionCreated = await createPersistentInterviewSession("random");
    if (!sessionCreated) {
        resetPracticeState();
        return;
    }


    $("sectorSelect").value =
        random.sector;

    $("interviewTypeSelect").value =
        random.type;

    $("levelSelect").value =
        random.level;


    hideElement(
        $("pressureSetup")
    );

    showElement(
        $("pressurePractice")
    );


    navigateTo("pressure");

    loadQuestion();

}


/* =========================================================
   28. RESTART INTERVIEW
========================================================= */

$("restartInterviewBtn")
    .addEventListener(
        "click",
        () => {

            navigateTo("pressure");

            hideElement(
                $("pressurePractice")
            );

            showElement(
                $("pressureSetup")
            );

        }
    );


/* =========================================================
   29. VOICE PRACTICE
========================================================= */

const voiceQuestions = [

    "Tell me about yourself and your background.",

    "Why are you interested in this role?",

    "What is your biggest professional strength?",

    "Tell me about a challenging project you completed.",

    "Describe a time when you solved a difficult problem.",

    "How do you handle pressure and deadlines?",

    "Tell me about a time you worked successfully in a team.",

    "What technical or professional skill are you currently improving?",

    "Why should we hire you?",

    "Where do you see yourself in the next three years?"

];


function loadVoiceQuestion() {

    const question =
        voiceQuestions[
            appState.voiceQuestionIndex
        ];


    $("voiceQuestionText")
        .textContent =
        question;


    $("voiceTranscript")
        .innerHTML = `
            <span class="transcript-placeholder">
                Your speech transcript will appear here...
            </span>
        `;


    appState.voiceTranscript = "";

    hideElement(
        $("voiceFeedback")
    );

}


/* =========================================================
   VOICE RECOGNITION
========================================================= */

function initializeSpeechRecognition() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        $("voiceStatus").textContent =
            "Speech recognition is not supported in this browser.";

        $("voiceInstruction").textContent =
            "Try using Google Chrome or Microsoft Edge.";

        return null;
    }


    const recognition =
        new SpeechRecognition();


    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-US";


    recognition.onstart = () => {

        appState.isListening = true;

        $("voiceStatus").textContent =
            "Listening... speak naturally";

        $("voiceStatusDot")
            .classList.add(
                "recording"
            );

        $("voiceRecordBtn")
            .classList.add(
                "recording"
            );

        $("voiceButtonIcon")
            .textContent =
            "⏹";

        $("voiceVisualizer")
            .classList.add(
                "active"
            );

        $("voiceInstruction")
            .textContent =
            "Speak clearly. Your answer is being transcribed.";

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


        appState.voiceTranscript +=
            finalTranscript;


        $("voiceTranscript").textContent =
            appState.voiceTranscript +
            interimTranscript;

    };


    recognition.onerror = event => {

        console.error(
            "Speech recognition error:",
            event.error
        );


        $("voiceStatus").textContent =
            `Voice recognition error: ${event.error}`;

        stopVoicePractice();

    };


    recognition.onend = () => {

        if (appState.isListening) {

            /*
               Some browsers stop recognition automatically.
               Restart while the user is still recording.
            */

            try {
                recognition.start();
            } catch (error) {
                console.log(error);
            }

        }

    };


    return recognition;

}


appState.recognition =
    initializeSpeechRecognition();


/* =========================================================
   VOICE RECORD BUTTON
========================================================= */

$("voiceRecordBtn")
    .addEventListener(
        "click",
        () => {

            if (!appState.recognition) {

                alert(
                    "Speech recognition is not supported by this browser."
                );

                return;
            }


            if (appState.isListening) {

                stopVoicePractice();

            } else {

                startVoicePractice();

            }

        }
    );


function startVoicePractice() {

    try {

        appState.recognition.start();

    } catch (error) {

        console.log(error);

    }

}


function stopVoicePractice() {

    appState.isListening = false;


    if (appState.recognition) {

        try {
            appState.recognition.stop();
        } catch (error) {
            console.log(error);
        }

    }


    $("voiceStatus").textContent =
        "Recording stopped";


    $("voiceStatusDot")
        .classList.remove(
            "recording"
        );


    $("voiceRecordBtn")
        .classList.remove(
            "recording"
        );


    $("voiceButtonIcon")
        .textContent =
        "🎙";


    $("voiceVisualizer")
        .classList.remove(
            "active"
        );


    $("voiceInstruction")
        .textContent =
        "Review your transcript or evaluate your answer.";

}


/* =========================================================
   NEW VOICE QUESTION
========================================================= */

$("voiceNewQuestionBtn")
    .addEventListener(
        "click",
        () => {

            if (appState.isListening) {
                stopVoicePractice();
            }


            appState.voiceQuestionIndex =
                (
                    appState.voiceQuestionIndex + 1
                ) %
                voiceQuestions.length;


            loadVoiceQuestion();

        }
    );


/* =========================================================
   VOICE EVALUATION
========================================================= */

$("voiceEvaluateBtn")
    .addEventListener(
        "click",
        evaluateVoiceAnswer
    );


async function evaluateVoiceAnswer() {

    if (!appState.voiceTranscript.trim()) {
        alert("Please record an answer before evaluating it.");
        return;
    }

    const words = appState.voiceTranscript.trim().split(/\s+/).length;

    let confidence = 3;
    if (words >= 80) confidence = 5;
    else if (words >= 50) confidence = 4;
    else if (words >= 25) confidence = 3;
    else if (words >= 10) confidence = 2;
    else confidence = 1;

    let lengthFeedback;
    if (words < 20) {
        lengthFeedback = "Your answer was quite short. Try adding a specific example or result.";
    } else if (words > 180) {
        lengthFeedback = "Your answer was long. Practice making your main point more concise.";
    } else {
        lengthFeedback = "Your answer length is reasonable. Focus on structure and clarity.";
    }

    $("voiceWordCount").textContent = words;
    $("voiceConfidence").textContent = `${confidence}/5`;
    $("voiceLength").textContent = lengthFeedback;
    $("voiceFeedbackText").textContent =
        `Practice feedback: ${lengthFeedback} Use a clear structure, avoid unnecessary filler words, and support your claims with specific examples.`;

    showElement($("voiceFeedback"));

    /* Each evaluated voice response is stored as its own completed session. */
    appState.selectedSector = "Voice Practice";
    appState.selectedType = "Voice";
    appState.selectedLevel = "General";
    appState.sessionAnswers = [];
    appState.dbSessionId = null;
    appState.dbSessionStartedAt = new Date().toISOString();
    appState.dbSessionMode = "voice";
    appState.sessionActive = true;

    const sessionCreated = await createPersistentInterviewSession("voice");
    if (!sessionCreated) {
        resetPracticeState();
        return;
    }

    const record = {
        questionIndex: appState.voiceQuestionIndex,
        question: voiceQuestions[appState.voiceQuestionIndex],
        answer: appState.voiceTranscript,
        rating: confidence,
        timestamp: new Date().toISOString(),
        timeTaken: 0,
        sector: "Voice Practice",
        type: "Voice",
        level: "General"
    };

    appState.sessionAnswers.push(record);
    appState.allAnswers.push(record);

    const saved = await persistInterviewAnswer(record);
    if (!saved) return;

    await completePersistentInterviewSession();

    appState.dbSessionId = null;
    appState.dbSessionStartedAt = null;
    appState.dbSessionMode = null;
    appState.sessionActive = false;
    appState.sessionAnswers = [];
}



/* =========================================================
   30. VOICE PAGE INITIALIZATION
========================================================= */

loadVoiceQuestion();


/* =========================================================
   31. INITIAL APPLICATION LOAD
========================================================= */

handleRouteChange();

updateHomeStats();


/* =========================================================
   TRANSIENT SESSION RESET / TAB-SAFE CLEANUP
========================================================= */

function resetPracticeState() {
    stopTimer();

    if (appState.recognition) {
        try {
            appState.recognition.stop();
        } catch (error) {
            console.debug("Speech recognition cleanup:", error);
        }
    }

    appState.currentQuestionIndex = 0;
    appState.questions = [];
    appState.questionStartedAt = null;
    appState.currentRating = 0;
    appState.remainingSeconds = appState.questionTimeSeconds;
    appState.sessionAnswers = [];
    appState.dbSessionId = null;
    appState.dbSessionStartedAt = null;
    appState.dbSessionMode = null;
    appState.sessionActive = false;
    appState.voiceTranscript = "";
    appState.isListening = false;

    // Clear only transient browser-session data. Supabase authentication is
    // intentionally NOT cleared, so closing a tab does not log the user out.
    try {
        sessionStorage.removeItem("interviewprep_active_session");
    } catch (error) {
        console.debug("Session storage cleanup:", error);
    }
}

function resetUiForFreshSession() {
    hideElement($("pressurePractice"));
    showElement($("pressureSetup"));
    if ($("answerInput")) $("answerInput").value = "";
    if ($("wordCount")) $("wordCount").textContent = "0 words";
    if ($("summaryReviewAnswers")) $("summaryReviewAnswers").innerHTML = "";
}


/* =========================================================
   32. CLEANUP
========================================================= */

function handleTabCloseCleanup() {
    resetPracticeState();
    resetUiForFreshSession();
}

window.addEventListener("pagehide", handleTabCloseCleanup);
window.addEventListener("beforeunload", handleTabCloseCleanup);


/* =========================================================
   INTERVIEWPREP PHASE 2 — SUPABASE AUTHENTICATION
========================================================= */

/*
  IMPORTANT:
  Replace these two values with the Project URL and
  Publishable/Anon key from your Supabase project.

  Never put the Supabase service_role key in this file.
*/
/* =========================================================
   PHASE 4A — PERSISTENCE, DASHBOARD + INTERVIEW HISTORY
========================================================= */

appState.dbSessionId = null;
appState.dbSessionStartedAt = null;
appState.dbSessionMode = null;

function phase4aConfigured() {
    return Boolean(
        typeof supabaseClient !== "undefined" &&
        supabaseClient &&
        typeof authState !== "undefined" &&
        authState.user
    );
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatHistoryDate(value) {
    if (!value) return "Unknown date";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Unknown date";
    return date.toLocaleString([], {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function historySessionTitle(session) {
    if (session.mode === "voice") return "Voice Practice";
    return `${session.sector || "Interview"} • ${session.interview_type || "Mixed"}`;
}

function historyAverageLabel(value) {
    return value === null || value === undefined || value === ""
        ? "--"
        : `${Number(value).toFixed(1)} / 5`;
}

function historyTimeLabel(value) {
    if (value === null || value === undefined || value === "") return "--";
    return formatSeconds(Number(value));
}

async function createPersistentInterviewSession(mode = "pressure") {
    if (!phase4aConfigured()) return true;

    const payload = {
        user_id: authState.user.id,
        sector: appState.selectedSector || "Generic/Other",
        interview_type: appState.selectedType || "Mixed",
        experience_level: appState.selectedLevel || "Fresher/Entry-level",
        mode,
        question_count: appState.questions?.length || 0,
        started_at: appState.dbSessionStartedAt || new Date().toISOString()
    };

    const { data, error } = await supabaseClient
        .from("interview_sessions")
        .insert(payload)
        .select("id")
        .single();

    if (error) {
        console.error("Could not create interview session:", error);
        showHistoryMessage("Your interview could not be saved. Check your Supabase database setup.", true);
        return false;
    }

    appState.dbSessionId = data.id;
    appState.dbSessionStartedAt = payload.started_at;
    appState.dbSessionMode = mode;
    return true;
}

function getQuestionId(record) {
    return [
        record.sector || appState.selectedSector,
        record.type || appState.selectedType,
        record.level || appState.selectedLevel,
        record.questionIndex ?? 0
    ].join("::");
}

async function persistInterviewAnswer(record) {
    if (!phase4aConfigured() || !appState.dbSessionId) return true;

    const payload = {
        session_id: appState.dbSessionId,
        user_id: authState.user.id,
        question_id: getQuestionId(record),
        question: record.question,
        answer: record.answer || "",
        confidence: Number(record.rating) || null,
        time_taken_seconds: Number(record.timeTaken) || 0,
        mode: appState.dbSessionMode || "pressure"
    };

    const { error } = await supabaseClient
        .from("interview_answers")
        .upsert(payload, { onConflict: "session_id,question_id" });

    if (error) {
        console.error("Could not save interview answer:", error);
        showHistoryMessage("Your answer could not be saved to your account.", true);
        return false;
    }

    return true;
}

async function completePersistentInterviewSession() {
    if (!phase4aConfigured() || !appState.dbSessionId) return true;

    const answers = (appState.sessionAnswers || []).filter(item => item.answer?.trim() || item.rating > 0);
    const rated = answers.filter(item => Number(item.rating) > 0);
    const averageConfidence = rated.length
        ? rated.reduce((sum, item) => sum + Number(item.rating), 0) / rated.length
        : null;
    const averageTime = answers.length
        ? answers.reduce((sum, item) => sum + Number(item.timeTaken || 0), 0) / answers.length
        : null;

    const { error } = await supabaseClient
        .from("interview_sessions")
        .update({
            question_count: answers.length,
            average_confidence: averageConfidence,
            average_time_seconds: averageTime,
            completed_at: new Date().toISOString()
        })
        .eq("id", appState.dbSessionId)
        .eq("user_id", authState.user.id);

    if (error) {
        console.error("Could not complete interview session:", error);
        return false;
    }

    return true;
}

async function persistCurrentAnswerToDatabase() {
    if (!phase4aConfigured() || !appState.dbSessionId) return;
    const record = appState.sessionAnswers?.find(
        item => item.questionIndex === appState.currentQuestionIndex
    );
    if (!record) return;
    await persistInterviewAnswer(record);
}

async function fetchInterviewSessions(limit = 20) {
    if (!phase4aConfigured()) return [];

    const { data, error } = await supabaseClient
        .from("interview_sessions")
        .select("id,user_id,sector,interview_type,experience_level,mode,question_count,average_confidence,average_time_seconds,started_at,completed_at,created_at")
        .eq("user_id", authState.user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Could not load interview history:", error);
        return [];
    }
    return data || [];
}

function renderSessionCard(session, compact = false) {
    const complete = Boolean(session.completed_at);
    const score = historyAverageLabel(session.average_confidence);
    const count = Number(session.question_count || 0);

    return `
        <article class="session-card" data-session-id="${escapeHtml(session.id)}">
            <div class="session-card-header">
                <div>
                    <span class="session-pill">${escapeHtml(session.mode === "voice" ? "Voice" : "Interview")}</span>
                    <h3>${escapeHtml(historySessionTitle(session))}</h3>
                </div>
                <span class="session-score">${escapeHtml(score)}</span>
            </div>
            <div class="session-card-meta">
                <span>${escapeHtml(session.experience_level || "General")}</span>
                <span>•</span>
                <span>${count} question${count === 1 ? "" : "s"}</span>
                <span>•</span>
                <span>${escapeHtml(historyTimeLabel(session.average_time_seconds))} avg.</span>
                <span>•</span>
                <span>${escapeHtml(formatHistoryDate(session.created_at || session.started_at))}</span>
            </div>
            <div class="session-card-actions">
                <button type="button" class="btn btn-primary btn-small" data-history-view="${escapeHtml(session.id)}">Review</button>
                ${compact ? "" : `<button type="button" class="btn btn-secondary btn-small" data-history-delete="${escapeHtml(session.id)}">Delete</button>`}
                ${complete ? "" : `<span class="session-pill">In progress</span>`}
            </div>
        </article>
    `;
}

function renderRecentSessions(sessions) {
    const list = $("recentSessionsList");
    if (!list) return;

    if (!phase4aConfigured()) {
        list.innerHTML = '<div class="session-empty">Connect Supabase and log in to save interview history.</div>';
        return;
    }

    if (!sessions.length) {
        list.innerHTML = '<div class="session-empty">No completed interview sessions yet. Start practicing to create your first record.</div>';
        return;
    }

    list.innerHTML = sessions.slice(0, 3).map(session => renderSessionCard(session, true)).join("");
}

function renderHistoryList(sessions) {
    const list = $("historyList");
    if (!list) return;

    if (!phase4aConfigured()) {
        list.innerHTML = '<div class="session-empty">Log in with your Supabase account to view your private interview history.</div>';
        return;
    }

    if (!sessions.length) {
        list.innerHTML = '<div class="session-empty">No interview sessions found.</div>';
        return;
    }

    list.innerHTML = sessions.map(session => renderSessionCard(session)).join("");
}

async function viewHistorySession(sessionId) {
    if (!phase4aConfigured() || !sessionId) return;
    const details = $("historyDetails");
    if (!details) return;

    details.innerHTML = '<div class="history-details-empty"><h2>Loading session...</h2><p>Fetching your saved answers.</p></div>';

    const { data: session, error: sessionError } = await supabaseClient
        .from("interview_sessions")
        .select("id,sector,interview_type,experience_level,mode,question_count,average_confidence,average_time_seconds,created_at,completed_at")
        .eq("id", sessionId)
        .eq("user_id", authState.user.id)
        .single();

    if (sessionError || !session) {
        details.innerHTML = '<div class="history-details-empty"><h2>Session unavailable</h2><p>This session could not be loaded.</p></div>';
        return;
    }

    const { data: answers, error: answerError } = await supabaseClient
        .from("interview_answers")
        .select("id,question_id,question,answer,confidence,time_taken_seconds,created_at")
        .eq("session_id", sessionId)
        .eq("user_id", authState.user.id)
        .order("created_at", { ascending: true });

    if (answerError) {
        details.innerHTML = '<div class="history-details-empty"><h2>Answers unavailable</h2><p>The session exists, but its answers could not be loaded.</p></div>';
        return;
    }

    const answerHtml = (answers || []).map((answer, index) => `
        <article class="history-answer">
            <span class="history-answer-number">Question ${index + 1}</span>
            <h4>${escapeHtml(answer.question)}</h4>
            <p>${escapeHtml(answer.answer || "No written answer was saved.")}</p>
            <div class="history-answer-footer">
                <span>Confidence: ${escapeHtml(answer.confidence ? `${answer.confidence}/5` : "Not rated")}</span>
                <span>Time: ${escapeHtml(historyTimeLabel(answer.time_taken_seconds))}</span>
            </div>
        </article>
    `).join("");

    details.innerHTML = `
        <div class="history-details-header">
            <span class="session-pill">${escapeHtml(session.mode === "voice" ? "Voice Practice" : "Interview")}</span>
            <h2>${escapeHtml(historySessionTitle(session))}</h2>
            <p>${escapeHtml(formatHistoryDate(session.created_at))}</p>
            <div class="session-card-meta">
                <span>${Number(session.question_count || 0)} questions</span>
                <span>•</span>
                <span>${escapeHtml(historyAverageLabel(session.average_confidence))}</span>
                <span>•</span>
                <span>${escapeHtml(historyTimeLabel(session.average_time_seconds))} avg.</span>
            </div>
        </div>
        ${answerHtml || '<div class="session-empty">No answers were saved for this session.</div>'}
    `;
}

async function deleteHistorySession(sessionId) {
    if (!phase4aConfigured() || !sessionId) return;
    if (!window.confirm("Delete this interview session and its saved answers? This cannot be undone.")) return;

    const { error } = await supabaseClient
        .from("interview_sessions")
        .delete()
        .eq("id", sessionId)
        .eq("user_id", authState.user.id);

    if (error) {
        showHistoryMessage("Could not delete this session.", true);
        return;
    }

    $("historyDetails").innerHTML = '<div class="history-details-empty"><h2>Select a session</h2><p>Choose an interview from your history to review its saved answers.</p></div>';
    await refreshPhase4AData();
    showHistoryMessage("Interview session deleted.");
}

function showHistoryMessage(message, isError = false) {
    const element = $("historyMessage");
    if (!element) return;
    element.textContent = message;
    element.classList.remove("hidden");
    element.style.background = isError ? "#fee2e2" : "var(--green-light)";
    element.style.color = isError ? "var(--danger)" : "var(--green)";
    clearTimeout(showHistoryMessage.timer);
    showHistoryMessage.timer = setTimeout(() => element.classList.add("hidden"), 3500);
}

async function fetchPersistentAnswers(limit = 1000) {
    if (!phase4aConfigured()) return [];

    const { data, error } = await supabaseClient
        .from("interview_answers")
        .select("question_id,question,answer,confidence,time_taken_seconds,mode,created_at")
        .eq("user_id", authState.user.id)
        .order("created_at", { ascending: true })
        .limit(limit);

    if (error) {
        console.error("Could not load interview answers:", error);
        return [];
    }

    return (data || []).map(answer => {
        const parts = String(answer.question_id || "").split("::");
        const questionIndex = Number(parts[parts.length - 1]);

        return {
            questionIndex: Number.isFinite(questionIndex) ? questionIndex : 0,
            question: answer.question || "",
            answer: answer.answer || "",
            rating: Number(answer.confidence) || 0,
            timestamp: answer.created_at || new Date().toISOString(),
            timeTaken: Number(answer.time_taken_seconds) || 0,
            sector: parts[0] || "Generic/Other",
            type: parts[1] || "Mixed",
            level: parts[2] || "Fresher/Entry-level",
            mode: answer.mode || "pressure"
        };
    });
}

async function refreshPhase4AData() {
    if (!phase4aConfigured()) {
        appState.allAnswers = [];
        renderRecentSessions([]);
        renderHistoryList([]);
        return;
    }

    const [sessions, answers] = await Promise.all([
        fetchInterviewSessions(20),
        fetchPersistentAnswers(1000)
    ]);

    appState.allAnswers = answers;
    renderRecentSessions(sessions);
    renderHistoryList(sessions);

    // Refresh the visible dashboard/analytics using the database-backed data.
    if (typeof phase4aOriginalUpdateHomeStats === "function" && getRoute() === "home") {
        phase4aOriginalUpdateHomeStats();
    }

    if (typeof phase4aOriginalUpdateProgressPage === "function" && getRoute() === "progress") {
        phase4aOriginalUpdateProgressPage();
    }
}

function bindPhase4AEvents() {
    $("refreshHistoryBtn")?.addEventListener("click", refreshPhase4AData);

    document.addEventListener("click", event => {
        const viewButton = event.target.closest("[data-history-view]");
        if (viewButton) {
            if (getRoute() !== "history") routeTo("history");
            setTimeout(() => viewHistorySession(viewButton.dataset.historyView), 0);
            return;
        }

        const deleteButton = event.target.closest("[data-history-delete]");
        if (deleteButton) {
            deleteHistorySession(deleteButton.dataset.historyDelete);
        }
    });
}

// Persist the current question after the original in-memory save routine runs.
const phase4aOriginalSaveCurrentAnswer = saveCurrentAnswer;
saveCurrentAnswer = function () {
    phase4aOriginalSaveCurrentAnswer();
    persistCurrentAnswerToDatabase();
};

// Load account-backed dashboard/history whenever authentication becomes available.
const phase4aOriginalUpdateHomeStats = updateHomeStats;
updateHomeStats = function () {
    phase4aOriginalUpdateHomeStats();
    refreshPhase4AData();
};

const phase4aOriginalUpdateProgressPage = updateProgressPage;
updateProgressPage = function () {
    phase4aOriginalUpdateProgressPage();
    refreshPhase4AData();
};

bindPhase4AEvents();

const SUPABASE_URL = "https://vskygcjkkwjcidpxzega.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_oN2DPPNKJqlkvBkjUMHyqA_W4FfaJE7";

// This is a Supabase publishable key and is safe to expose in a browser app.
// NEVER replace it with a service_role/secret key. Configure Auth redirect URLs
// for the production domain in Supabase before deploying.


/*
  Bug fix: the previous check compared SUPABASE_URL/KEY against a
  "placeholder" string that was identical to the real values above,
  so the condition was always false and supabaseClient was always null
  — meaning login, signup and saving never actually worked.
  Now we just verify the values are present and non-empty.
*/
const supabaseClient =
    SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY && typeof window.supabase !== "undefined"
        ? window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        )
        : null;

const AUTH_ROUTES = new Set([
    "login",
    "signup",
    "verify-email",
    "verify-phone",
    "forgot-password",
    "reset-password"
]);

const PROTECTED_ROUTES = new Set([
    /*
      "home" removed: first-time visitors should land on the dashboard,
      not be forced to log in. Login is still required the moment they
      try to actually start a practice session (pressure/voice) or view
      account-specific pages (progress/summary/history/profile).
    */
    "pressure",
    "voice",
    "progress",
    "summary",
    "history",
    "profile"
]);

const PUBLIC_ROUTES = new Set([
    "login",
    "signup",
    "verify-email",
    "verify-phone",
    "forgot-password",
    "reset-password"
]);

const authState = {
    session: null,
    user: null,
    profile: null,
    initialized: false,
    pendingSignup: null,
    phoneRecovery: false // retained only for backward compatibility; phone auth is disabled
};

function authElement(id) {
    return document.getElementById(id);
}

function showAuthMessage(id, message, type = "info") {
    const element = authElement(id);
    if (!element) return;

    element.textContent = message;
    element.className = `auth-message ${type}`;
}

function clearAuthMessage(id) {
    const element = authElement(id);
    if (!element) return;

    element.textContent = "";
    element.className = "auth-message hidden";
}

function authConfigured() {
    return Boolean(supabaseClient);
}

function authConfigGuard() {
    if (authConfigured()) return true;

    const message =
        "Supabase is not connected yet. Add your Supabase URL and publishable key in script.js.";

    showAuthMessage("loginMessage", message, "error");
    showAuthMessage("signupMessage", message, "error");
    return false;
}

function getRoute() {
    return window.location.hash.replace("#", "") || "home";
}

function routeTo(route) {
    window.location.hash = `#${route}`;
}

function normalizePhone(phone) {
    return phone.trim().replace(/[^\d+]/g, "");
}

function isStrongPassword(password) {
    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
    );
}

function updatePasswordRequirementUI(password) {
    const checks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };

    Object.entries(checks).forEach(([rule, valid]) => {
        const element =
            document.querySelector(`[data-rule="${rule}"]`);

        if (element) {
            element.classList.toggle("valid", valid);
        }
    });
}

function setAuthLoading(button, loading, loadingText = "Please wait...") {
    if (!button) return;

    if (loading) {
        button.dataset.originalText = button.textContent;
        button.textContent = loadingText;
        button.disabled = true;
        button.classList.add("btn-loading");
    } else {
        button.textContent =
            button.dataset.originalText || button.textContent;
        button.disabled = false;
        button.classList.remove("btn-loading");
    }
}

function setHeaderAuthUI() {
    const guest = authElement("authGuestActions");
    const user = authElement("authUserActions");

    if (!guest || !user) return;

    const loggedIn = Boolean(authState.user);

    guest.classList.toggle("hidden", loggedIn);
    user.classList.toggle("hidden", !loggedIn);

    if (loggedIn) {
        const first =
            authState.profile?.first_name ||
            authState.user.user_metadata?.first_name ||
            "Account";

        const last =
            authState.profile?.last_name ||
            authState.user.user_metadata?.last_name ||
            "";

        const displayName =
            `${first} ${last}`.trim();

        const nameElement = authElement("headerUserName");
        const avatar = authElement("headerAvatar");

        if (nameElement) {
            nameElement.textContent = displayName;
        }

        if (avatar) {
            avatar.src =
                authState.profile?.avatar_url ||
                createAvatarDataUri(displayName);

            avatar.alt = `${displayName} profile picture`;
        }
    }
}

function createAvatarDataUri(name) {
    const letter =
        (name || "U").trim().charAt(0).toUpperCase();

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
            <rect width="128" height="128" rx="64" fill="#dbeafe"/>
            <text x="50%" y="54%" dominant-baseline="middle"
                text-anchor="middle"
                font-family="Arial, sans-serif"
                font-size="54"
                font-weight="700"
                fill="#2563eb">${letter}</text>
        </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

async function loadUserProfile() {
    if (!supabaseClient || !authState.user) {
        return null;
    }

    const { data, error } =
        await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", authState.user.id)
            .maybeSingle();

    if (error) {
        console.error("Profile load error:", error);
        return null;
    }

    if (data) {
        authState.profile = data;
        return data;
    }

    /*
      Email confirmation can mean signup initially returns no session.
      Therefore profile creation is deferred until the first authenticated
      session if a row does not yet exist.
    */
    const metadata = authState.user.user_metadata || {};

    const profilePayload = {
        id: authState.user.id,
        first_name: metadata.first_name || "User",
        last_name: metadata.last_name || "",
        username: metadata.username || `user_${authState.user.id.slice(0, 8)}`,
        date_of_birth: metadata.date_of_birth || null,
        country: metadata.country || null,
        avatar_url: null
    };

    const { data: created, error: createError } =
        await supabaseClient
            .from("profiles")
            .insert(profilePayload)
            .select()
            .single();

    if (createError) {
        /*
          A username collision should not break authentication.
          The profile can be completed from the Profile page.
        */
        console.warn("Profile creation deferred:", createError.message);
        return null;
    }

    authState.profile = created;
    return created;
}

function isEmailVerified() {
    return Boolean(authState.user?.email_confirmed_at);
}

function isPhoneVerified() {
    return Boolean(authState.user?.phone_confirmed_at);
}

function isFullyVerified() {
    // Phone/SMS verification is intentionally disabled in the free deployment.
    return isEmailVerified();
}

async function requireAuthenticatedRoute(route) {
    if (!authConfigured()) {
        return;
    }

    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error) {
        console.error("Session error:", error);
    }

    authState.session = data?.session || null;
    authState.user = data?.session?.user || null;

    if (!authState.user) {
        routeTo("login");
        return;
    }

    await loadUserProfile();
    setHeaderAuthUI();
}

async function routeAuthGuard() {
    const route = getRoute();

    if (!authConfigured()) {
        /*
          Bug fix: previously this returned immediately, which meant that
          if the Supabase script ever failed to load (slow network,
          blocked CDN, ad-blocker) the login/signup/profile pages became
          completely unreachable — hashchange would fire, but nothing
          would ever switch the visible page. Now we still show the
          correct page section; only the session-dependent checks below
          are skipped.
        */
        setHeaderAuthUI();

        const fallbackPage = document.getElementById(`${route}Page`);
        if (fallbackPage) {
            document.querySelectorAll(".page").forEach(page => {
                page.classList.remove("active-page");
            });
            fallbackPage.classList.add("active-page");
        }
        return;
    }

    const { data } =
        await supabaseClient.auth.getSession();

    authState.session = data?.session || null;
    authState.user = data?.session?.user || null;

    if (authState.user) {
        await loadUserProfile();
    }

    setHeaderAuthUI();

    if (PROTECTED_ROUTES.has(route) && !authState.user) {
        routeTo("login");
        return;
    }

    if (
        route === "login" &&
        authState.user
    ) {
        routeTo("home");
        return;
    }

    if (
        route === "signup" &&
        authState.user
    ) {
        routeTo("home");
        return;
    }

    /*
      Preserve the existing application's router, but make sure the
      new auth-only pages become visible.
    */
    const authPage = document.getElementById(`${route}Page`);

    if (authPage) {
        document.querySelectorAll(".page").forEach(page => {
            page.classList.remove("active-page");
        });

        authPage.classList.add("active-page");
    }

    if (route === "profile" && authState.user) {
        renderProfile();
    }

    if (route === "verify-email") {
        updateEmailVerificationPage();
    }

    if (route === "verify-phone") {
        // SMS verification is disabled for the free deployment.
        routeTo("home");
        return;
    }

    if (route === "reset-password") {
        updateResetPasswordRoute();
    }
}

function updateEmailVerificationPage() {
    const text = authElement("verifyEmailText");

    if (!text) return;

    const email =
        authState.user?.email ||
        authState.pendingSignup?.email ||
        "your email address";

    text.textContent =
        `We sent a verification link to ${email}. Open it, then return here to continue.`;
}

async function signupUser() {
    if (!authConfigGuard()) return;

    const firstName = authElement("signupFirstName").value.trim();
    const lastName = authElement("signupLastName").value.trim();
    const username = authElement("signupUsername").value.trim();
    const dateOfBirth = authElement("signupDob").value;
    const email = authElement("signupEmail").value.trim().toLowerCase();
    const phone = normalizePhone(authElement("signupPhone").value);
    const country = authElement("signupCountry").value.trim();
    const password = authElement("signupPassword").value;
    const confirmPassword = authElement("signupConfirmPassword").value;
    const terms = authElement("signupTerms").checked;
    const marketing = authElement("signupMarketing").checked;
    const avatarFile = authElement("signupAvatar").files[0];

    clearAuthMessage("signupMessage");

    if (
        !firstName ||
        !lastName ||
        !username ||
        !dateOfBirth ||
        !email ||
        !country
    ) {
        showAuthMessage(
            "signupMessage",
            "Please complete all required fields.",
            "error"
        );
        return;
    }

    if (!/^[A-Za-z0-9_.-]{3,30}$/.test(username)) {
        showAuthMessage(
            "signupMessage",
            "Username must be 3–30 characters and use only letters, numbers, dot, dash or underscore.",
            "error"
        );
        return;
    }

    if (!isStrongPassword(password)) {
        showAuthMessage(
            "signupMessage",
            "Password must contain at least 8 characters, uppercase, lowercase, number and special character.",
            "error"
        );
        return;
    }

    if (password !== confirmPassword) {
        showAuthMessage(
            "signupMessage",
            "Passwords do not match.",
            "error"
        );
        return;
    }

    if (!terms) {
        showAuthMessage(
            "signupMessage",
            "You must accept the Terms of Service and Privacy Policy.",
            "error"
        );
        return;
    }

    if (avatarFile && avatarFile.size > 2 * 1024 * 1024) {
        showAuthMessage(
            "signupMessage",
            "Profile picture must be 2 MB or smaller.",
            "error"
        );
        return;
    }

    const submitButton = authElement("signupSubmitBtn");
    setAuthLoading(submitButton, true, "Creating account...");

    const { data, error } =
        await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}${window.location.pathname}#verify-email`,
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    username,
                    date_of_birth: dateOfBirth,
                    country,
                    signup_phone: phone,
                    marketing_opt_in: marketing
                }
            }
        });

    setAuthLoading(submitButton, false);

    if (error) {
        showAuthMessage(
            "signupMessage",
            getFriendlyAuthError(error),
            "error"
        );
        return;
    }

    authState.pendingSignup = {
        email,
        phone,
        firstName,
        lastName,
        username,
        dateOfBirth,
        country,
        marketing,
        avatarFile
    };

    /*
      With email confirmation enabled, Supabase normally returns a user
      without an active session. The user verifies email first.
    */
    if (data?.session) {
        authState.session = data.session;
        authState.user = data.user;

        await createOrUpdateProfileFromSignup();
        routeTo("home");
    } else {
        showAuthMessage(
            "signupMessage",
            "Account created. Check your email and click the verification link before logging in.",
            "success"
        );

        setTimeout(() => routeTo("verify-email"), 700);
    }
}

async function createOrUpdateProfileFromSignup() {
    if (!authState.user || !authState.pendingSignup) return;

    const pending = authState.pendingSignup;

    const profilePayload = {
        id: authState.user.id,
        first_name: pending.firstName,
        last_name: pending.lastName,
        username: pending.username,
        date_of_birth: pending.dateOfBirth || null,
        country: pending.country || null,
        avatar_url: null
    };

    const { error } =
        await supabaseClient
            .from("profiles")
            .upsert(profilePayload, { onConflict: "id" });

    if (error) {
        console.warn("Profile creation failed:", error.message);
    }

    await loadUserProfile();

    if (pending.avatarFile) {
        await uploadAvatar(pending.avatarFile);
    }
}

async function loginUser() {
    if (!authConfigGuard()) return;

    const email = authElement("loginEmail").value.trim().toLowerCase();
    const password = authElement("loginPassword").value;

    clearAuthMessage("loginMessage");

    if (!email || !password) {
        showAuthMessage(
            "loginMessage",
            "Enter your email and password.",
            "error"
        );
        return;
    }

    const submitButton = authElement("loginSubmitBtn");
    setAuthLoading(submitButton, true, "Logging in...");

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

    setAuthLoading(submitButton, false);

    if (error) {
        showAuthMessage(
            "loginMessage",
            getFriendlyAuthError(error),
            "error"
        );
        return;
    }

    authState.session = data.session;
    authState.user = data.user;

    await loadUserProfile();
    setHeaderAuthUI();

    if (!isEmailVerified()) {
        routeTo("verify-email");
        return;
    }

    routeTo("home");
}

async function resendEmailVerification() {
    if (!authConfigured()) return;

    const email =
        authState.user?.email ||
        authState.pendingSignup?.email;

    if (!email) {
        showAuthMessage(
            "verifyEmailMessage",
            "Enter your email by returning to the login page.",
            "error"
        );
        return;
    }

    const button = authElement("resendEmailBtn");
    setAuthLoading(button, true, "Sending...");

    const { error } =
        await supabaseClient.auth.resend({
            type: "signup",
            email
        });

    setAuthLoading(button, false);

    if (error) {
        showAuthMessage(
            "verifyEmailMessage",
            getFriendlyAuthError(error),
            "error"
        );
        return;
    }

    showAuthMessage(
        "verifyEmailMessage",
        "A new verification email has been sent.",
        "success"
    );
}

async function continueAfterEmailVerification() {
    if (!authConfigured()) return;

    const { data } =
        await supabaseClient.auth.getSession();

    authState.session = data?.session || null;
    authState.user = data?.session?.user || null;

    if (!authState.user) {
        showAuthMessage(
            "verifyEmailMessage",
            "Email verified. Please log in to continue.",
            "success"
        );
        setTimeout(() => routeTo("login"), 900);
        return;
    }

    await loadUserProfile();

    if (!isEmailVerified()) {
        showAuthMessage(
            "verifyEmailMessage",
            "Your email is not marked as verified yet. Open the latest email and try again.",
            "error"
        );
        return;
    }

    routeTo("home");
}

async function sendPhoneVerificationOtp() {
    if (!authConfigured() || !authState.user) {
        routeTo("login");
        return;
    }

    const phone = normalizePhone(
        authElement("verifyPhoneInput").value
    );

    if (!phone) {
        showAuthMessage(
            "phoneVerifyMessage",
            "Enter a valid phone number.",
            "error"
        );
        return;
    }

    const button = authElement("sendPhoneOtpBtn");
    setAuthLoading(button, true, "Sending code...");

    /*
      updateUser(phone) starts the phone-change verification flow
      for an already authenticated user.
    */
    const { error } =
        await supabaseClient.auth.updateUser({
            phone
        });

    setAuthLoading(button, false);

    if (error) {
        showAuthMessage(
            "phoneVerifyMessage",
            getFriendlyAuthError(error),
            "error"
        );
        return;
    }

    showAuthMessage(
        "phoneVerifyMessage",
        "Verification code sent. Enter the 6-digit code below.",
        "success"
    );
}

async function verifyPhoneOtp() {
    if (!authConfigured() || !authState.user) return;

    const phone = normalizePhone(
        authElement("verifyPhoneInput").value
    );

    const token =
        authElement("phoneOtpInput").value.trim();

    if (!phone || !/^\d{6}$/.test(token)) {
        showAuthMessage(
            "phoneVerifyMessage",
            "Enter the 6-digit verification code.",
            "error"
        );
        return;
    }

    const { error } =
        await supabaseClient.auth.verifyOtp({
            phone,
            token,
            type: "phone_change"
        });

    if (error) {
        showAuthMessage(
            "phoneVerifyMessage",
            getFriendlyAuthError(error),
            "error"
        );
        return;
    }

    const { data } =
        await supabaseClient.auth.getUser();

    authState.user = data?.user || authState.user;

    await loadUserProfile();
    setHeaderAuthUI();

    showAuthMessage(
        "phoneVerifyMessage",
        "Phone verified successfully. Your InterviewPrep account is now fully verified.",
        "success"
    );

    setTimeout(() => routeTo("home"), 900);
}

function preparePhoneVerificationPage() {
    const input = authElement("verifyPhoneInput");
    if (!input) return;

    if (!input.value) {
        input.value =
            authState.user?.phone ||
            authState.pendingSignup?.phone ||
            "";
    }
}

async function sendEmailRecovery() {
    if (!authConfigGuard()) return;

    const email =
        authElement("recoveryEmail").value.trim().toLowerCase();

    if (!email) {
        showAuthMessage(
            "forgotMessage",
            "Enter your email address.",
            "error"
        );
        return;
    }

    const { error } =
        await supabaseClient.auth.resetPasswordForEmail(
            email,
            {
                redirectTo:
                    `${window.location.origin}${window.location.pathname}#reset-password`
            }
        );

    /*
      Intentionally use the same public message for success and
      account-not-found scenarios.
    */
    if (error) {
        console.warn("Recovery request:", error.message);
    }

    showAuthMessage(
        "forgotMessage",
        "If an account is associated with that email, a password-reset link has been sent.",
        "success"
    );
}

async function sendPhoneRecovery() {
    if (!authConfigGuard()) return;

    const phone =
        normalizePhone(
            authElement("recoveryPhone").value
        );

    if (!phone) {
        showAuthMessage(
            "forgotMessage",
            "Enter your phone number.",
            "error"
        );
        return;
    }

    const { error } =
        await supabaseClient.auth.signInWithOtp({
            phone,
            options: {
                shouldCreateUser: false
            }
        });

    if (error) {
        console.warn("Phone recovery request:", error.message);
    }

    showAuthMessage(
        "forgotMessage",
        "If an account is associated with that phone number, a recovery code has been sent.",
        "success"
    );

    authState.phoneRecovery = true;
}

async function verifyPhoneRecoveryOtp() {
    if (!authConfigured()) return;

    const phone =
        normalizePhone(
            authElement("recoveryPhone").value
        );

    const token =
        authElement("recoveryOtp").value.trim();

    if (!phone || !/^\d{6}$/.test(token)) {
        showAuthMessage(
            "forgotMessage",
            "Enter the 6-digit recovery code.",
            "error"
        );
        return;
    }

    const { data, error } =
        await supabaseClient.auth.verifyOtp({
            phone,
            token,
            type: "sms"
        });

    if (error) {
        showAuthMessage(
            "forgotMessage",
            getFriendlyAuthError(error),
            "error"
        );
        return;
    }

    authState.session = data.session;
    authState.user = data.user;

    routeTo("reset-password");
}

function updateResetPasswordRoute() {
    /*
      The page itself is protected by the recovery session generated
      from either email recovery or phone OTP recovery.
    */
    if (!authState.user) {
        showAuthMessage(
            "resetMessage",
            "Your recovery session is missing or has expired. Start recovery again.",
            "error"
        );
    }
}

async function resetPassword() {
    if (!authConfigured()) return;

    const password =
        authElement("resetPassword").value;

    const confirmation =
        authElement("resetConfirmPassword").value;

    if (!isStrongPassword(password)) {
        showAuthMessage(
            "resetMessage",
            "Password must contain at least 8 characters, uppercase, lowercase, number and special character.",
            "error"
        );
        return;
    }

    if (password !== confirmation) {
        showAuthMessage(
            "resetMessage",
            "Passwords do not match.",
            "error"
        );
        return;
    }

    const { error } =
        await supabaseClient.auth.updateUser({
            password
        });

    if (error) {
        showAuthMessage(
            "resetMessage",
            getFriendlyAuthError(error),
            "error"
        );
        return;
    }

    showAuthMessage(
        "resetMessage",
        "Password updated successfully. You can now continue to your dashboard.",
        "success"
    );

    setTimeout(() => routeTo("home"), 900);
}

async function logoutUser() {
    if (!supabaseClient) return;

    await supabaseClient.auth.signOut();

    authState.session = null;
    authState.user = null;
    authState.profile = null;
    resetPracticeState();
    appState.allAnswers = [];
    resetUiForFreshSession();

    setHeaderAuthUI();
    routeTo("login");
}

function renderProfile() {
    if (!authState.user) return;

    const profile = authState.profile || {};
    const user = authState.user;

    const displayName =
        `${profile.first_name || user.user_metadata?.first_name || "User"} ${profile.last_name || user.user_metadata?.last_name || ""}`.trim();

    const avatarUrl =
        profile.avatar_url ||
        createAvatarDataUri(displayName);

    const avatar = authElement("profileAvatar");
    if (avatar) {
        avatar.src = avatarUrl;
        avatar.alt = `${displayName} profile picture`;
    }

    const display = authElement("profileDisplayName");
    if (display) display.textContent = displayName;

    const username = authElement("profileUsername");
    if (username) {
        username.textContent =
            profile.username
                ? `@${profile.username}`
                : "@username";
    }

    const verified = authElement("verifiedBadge");
    if (verified) {
        const verifiedAccount = isFullyVerified();
        verified.textContent =
            verifiedAccount
                ? "● Verified account"
                : "● Verification incomplete";
        verified.classList.toggle(
            "unverified",
            !verifiedAccount
        );
    }

    const mappings = {
        profileFirstName: profile.first_name || "",
        profileLastName: profile.last_name || "",
        profileUsernameInput: profile.username || "",
        profileDob: profile.date_of_birth || "",
        profileCountry: profile.country || "",
        profileEmail: user.email || "",
        profilePhone: user.phone || "",
        profileEmailStatus:
            isEmailVerified()
                ? "Verified"
                : "Not verified",
        profilePhoneStatus:
            user.phone
                ? "Configured (not required)"
                : "Not configured"
    };

    Object.entries(mappings).forEach(([id, value]) => {
        const element = authElement(id);
        if (element) element.value = value;
    });
}

async function saveProfile(event) {
    event.preventDefault();

    if (!authState.user || !supabaseClient) return;

    const payload = {
        id: authState.user.id,
        first_name:
            authElement("profileFirstName").value.trim(),
        last_name:
            authElement("profileLastName").value.trim(),
        username:
            authElement("profileUsernameInput").value.trim(),
        date_of_birth:
            authElement("profileDob").value || null,
        country:
            authElement("profileCountry").value.trim() || null
    };

    if (!payload.first_name || !payload.last_name || !payload.username) {
        showAuthMessage(
            "profileMessage",
            "First name, last name and username are required.",
            "error"
        );
        return;
    }

    const { data, error } =
        await supabaseClient
            .from("profiles")
            .upsert(payload, { onConflict: "id" })
            .select()
            .single();

    if (error) {
        showAuthMessage(
            "profileMessage",
            getFriendlyAuthError(error),
            "error"
        );
        return;
    }

    authState.profile = data;
    setHeaderAuthUI();
    renderProfile();

    showAuthMessage(
        "profileMessage",
        "Profile updated successfully.",
        "success"
    );
}

async function uploadAvatar(file) {
    if (!file || !authState.user || !supabaseClient) {
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        showAuthMessage(
            "profileMessage",
            "Profile picture must be 2 MB or smaller.",
            "error"
        );
        return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        showAuthMessage(
            "profileMessage",
            "Only JPG, PNG and WebP images are supported.",
            "error"
        );
        return;
    }

    const extension =
        file.type === "image/png"
            ? "png"
            : file.type === "image/webp"
                ? "webp"
                : "jpg";

    const path =
        `${authState.user.id}/avatar.${extension}`;

    const { error: uploadError } =
        await supabaseClient.storage
            .from("avatars")
            .upload(path, file, {
                upsert: true,
                contentType: file.type,
                cacheControl: "3600"
            });

    if (uploadError) {
        showAuthMessage(
            "profileMessage",
            getFriendlyAuthError(uploadError),
            "error"
        );
        return;
    }

    const { data } =
        supabaseClient.storage
            .from("avatars")
            .getPublicUrl(path);

    const avatarUrl =
        `${data.publicUrl}?v=${Date.now()}`;

    const { data: updatedProfile, error } =
        await supabaseClient
            .from("profiles")
            .update({
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString()
            })
            .eq("id", authState.user.id)
            .select()
            .single();

    if (error) {
        showAuthMessage(
            "profileMessage",
            getFriendlyAuthError(error),
            "error"
        );
        return;
    }

    authState.profile = updatedProfile;
    renderProfile();
    setHeaderAuthUI();

    showAuthMessage(
        "profileMessage",
        "Profile picture updated.",
        "success"
    );
}

function getFriendlyAuthError(error) {
    const message =
        String(error?.message || "Something went wrong.");

    const lower = message.toLowerCase();

    if (lower.includes("invalid login credentials")) {
        return "Email or password is incorrect.";
    }

    if (lower.includes("email not confirmed")) {
        return "Please verify your email before logging in.";
    }

    if (lower.includes("user already registered")) {
        return "An account with these details already exists.";
    }

    if (lower.includes("password")) {
        return message;
    }

    if (lower.includes("rate limit") || lower.includes("too many")) {
        return "Too many attempts. Please wait a little and try again.";
    }

    return message;
}

function bindAuthEvents() {
    authElement("loginForm")?.addEventListener(
        "submit",
        event => {
            event.preventDefault();
            loginUser();
        }
    );

    authElement("signupForm")?.addEventListener(
        "submit",
        event => {
            event.preventDefault();
            signupUser();
        }
    );

    authElement("resendEmailBtn")?.addEventListener(
        "click",
        resendEmailVerification
    );

    authElement("emailVerifiedBtn")?.addEventListener(
        "click",
        continueAfterEmailVerification
    );

    authElement("sendPhoneOtpBtn")?.addEventListener(
        "click",
        sendPhoneVerificationOtp
    );

    authElement("verifyPhoneOtpBtn")?.addEventListener(
        "click",
        verifyPhoneOtp
    );

    authElement("emailRecoveryForm")?.addEventListener(
        "submit",
        event => {
            event.preventDefault();
            sendEmailRecovery();
        }
    );

    authElement("phoneRecoveryForm")?.addEventListener(
        "submit",
        event => {
            event.preventDefault();
            sendPhoneRecovery();
        }
    );

    authElement("verifyRecoveryOtpBtn")?.addEventListener(
        "click",
        verifyPhoneRecoveryOtp
    );

    authElement("resetPasswordForm")?.addEventListener(
        "submit",
        event => {
            event.preventDefault();
            resetPassword();
        }
    );

    authElement("logoutBtn")?.addEventListener(
        "click",
        logoutUser
    );

    authElement("profileForm")?.addEventListener(
        "submit",
        saveProfile
    );

    authElement("profileAvatarInput")?.addEventListener(
        "change",
        event => {
            const file = event.target.files?.[0];
            if (file) uploadAvatar(file);
        }
    );

    authElement("signupPassword")?.addEventListener(
        "input",
        event => {
            updatePasswordRequirementUI(event.target.value);
        }
    );

    document.querySelectorAll("[data-password-toggle]").forEach(
        button => {
            button.addEventListener("click", () => {
                const target =
                    authElement(button.dataset.passwordToggle);

                if (!target) return;

                const showing =
                    target.type === "text";

                target.type =
                    showing ? "password" : "text";

                button.textContent =
                    showing ? "Show" : "Hide";
            });
        }
    );

    document.querySelectorAll("[data-recovery]").forEach(
        button => {
            button.addEventListener("click", () => {
                document.querySelectorAll("[data-recovery]")
                    .forEach(item =>
                        item.classList.remove("active")
                    );

                button.classList.add("active");

                const emailForm =
                    authElement("emailRecoveryForm");
                const phoneForm =
                    authElement("phoneRecoveryForm");

                const emailMode =
                    button.dataset.recovery === "email";

                emailForm?.classList.toggle(
                    "hidden",
                    !emailMode
                );

                phoneForm?.classList.toggle(
                    "hidden",
                    emailMode
                );

                clearAuthMessage("forgotMessage");
            });
        }
    );
}

function disablePaidPhoneAuthUI() {
    const phoneRecoveryTab = document.querySelector('[data-recovery="phone"]');
    const phoneRecoveryForm = authElement("phoneRecoveryForm");

    phoneRecoveryTab?.remove();
    phoneRecoveryForm?.remove();
}

function installAuthRouter() {
    window.addEventListener(
        "hashchange",
        () => {
            routeAuthGuard();
        }
    );
}

async function initializeAuthentication() {
    if (!authConfigured()) {
        /*
          Bug fix: previously this returned immediately without ever
          switching to the requested page section. If someone opened
          the app directly on a link like #login or #signup (or
          Supabase's script was still loading / failed to load), the
          page would silently show the home dashboard instead of the
          page in the URL. routeAuthGuard() already knows how to fall
          back gracefully when Supabase isn't configured, so route
          through it instead of stopping here.
        */
        setAuthHeaderFallback();
        await routeAuthGuard();
        return;
    }

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    authState.session = session;
    authState.user = session?.user || null;

    if (authState.user) {
        await loadUserProfile();
    }

    setHeaderAuthUI();

    if (authState.user) {
        await refreshPhase4AData();
    }

    supabaseClient.auth.onAuthStateChange(
        async (event, session) => {
            authState.session = session;
            authState.user = session?.user || null;

            if (authState.user) {
                await loadUserProfile();
            } else {
                authState.profile = null;
                resetPracticeState();
                appState.allAnswers = [];
                resetUiForFreshSession();
            }

            setHeaderAuthUI();
            if (authState.user) {
                await refreshPhase4AData();
            }

            if (event === "PASSWORD_RECOVERY") {
                routeTo("reset-password");
                return;
            }

            if (
                event === "SIGNED_IN" &&
                authState.user &&
                getRoute() === "login"
            ) {
                routeTo("home");
            }
        }
    );

    await routeAuthGuard();
    authState.initialized = true;
}

function setAuthHeaderFallback() {
    const guest = authElement("authGuestActions");
    const user = authElement("authUserActions");

    guest?.classList.remove("hidden");
    user?.classList.add("hidden");
}

/*
  Run after the existing InterviewPrep application has initialized.
  This intentionally leaves the original practice logic intact while
  adding authentication and persistent account state around it.
*/
bindAuthEvents();
disablePaidPhoneAuthUI();
installAuthRouter();
initializeAuthentication();