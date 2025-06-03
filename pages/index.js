import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import CircularProgress from '@mui/material/CircularProgress';
import { ChevronDown, ChevronUp, ShoppingBag, Star, MapPin, ChevronRight, Globe, FileText, Users, ExternalLink, X, BookText, Newspaper, Contact, House, Clock9, Menu, University, BanknoteArrowUp, BanknoteArrowDown, Image as ImageIcon, Music, Book } from 'lucide-react';
import Slider from "react-slick";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const KEYWORD_URLS = [
  { phrase: "Timetable", url: "https://edu.info.uaic.ro/orar/" },
  { phrase: "Webmail", url: "https://webmail.info.uaic.ro/" },
  { phrase: "Educational Resources", url: "https://edu.info.uaic.ro/" },
  { phrase: "News", url: "https://www.info.uaic.ro/noutati/" },
  { phrase: "Contact", url: "https://www.info.uaic.ro/contact/" },
  { phrase: "Admission", url: "https://www.info.uaic.ro/admitere/" },
  { phrase: "Scholarships", url: "https://www.uaic.ro/studenti/burse/" },
  { phrase: "Accommodation", url: "https://www.uaic.ro/studenti/cazare/" },
  { phrase: "Canteens", url: "https://www.uaic.ro/studenti/cantinele-universitatii-alexandru-ioan-cuza/" },
  { phrase: "Fees", url: "https://plati-taxe.uaic.ro/" },
  { phrase: "Facilities", url: "https://www.info.uaic.ro/facilitati/" },
  { phrase: "Bachelor Admission", url: "https://www.info.uaic.ro/admitere-studii-de-licenta/" },
  { phrase: "Master Admission", url: "https://www.info.uaic.ro/admitere-studii-de-master/" },
  { phrase: "Bachelor Study Programs", url: "https://www.info.uaic.ro/programs/informatica-ro-en/" },
  { phrase: "Master Study Programs", url: "https://www.info.uaic.ro/studii-de-master/" },
  { phrase: "Doctoral School", url: "https://scdoc.info.uaic.ro/" },
  { phrase: "Academic Staff", url: "https://www.info.uaic.ro/personal-academic/" },
  { phrase: "Associate Staff", url: "https://www.info.uaic.ro/personal-asociat/" },
  { phrase: "Leadership", url: "https://www.info.uaic.ro/conducere/" },
  { phrase: "Technical and Administrative Staff", url: "https://www.info.uaic.ro/personal-tehnic-administrativ/" },
  { phrase: "Emeritus Professors", url: "https://www.info.uaic.ro/emeriti/" },
  { phrase: "Research at FII", url: "https://www.info.uaic.ro/cercetare/" },
  { phrase: "Student Research Activities", url: "https://www.info.uaic.ro/activitate-cercetare-studenti/" },
  { phrase: "UAIC Student Guide", url: "https://www.uaic.ro/studenti/ghidul-studentului-uaic/" },
  { phrase: "Student Documents and Forms", url: "https://www.info.uaic.ro/documente-formulare-studenti/" },
  { phrase: "Regulations", url: "https://www.info.uaic.ro/regulamente/" },
  { phrase: "3rd Year Internship", url: "https://www.info.uaic.ro/practica-anul-iii/" },
  { phrase: "Graduation", url: "https://absolvire.info.uaic.ro/" },
  { phrase: "Student Career Services and Alumni", url: "https://www.uaic.ro/studenti/cariera/" },
  { phrase: "Student Representation in Governance", url: "https://www.uaic.ro/studenti/reprezentarea-studentilor-structurile-de-conducere-2/" }
];

const SESSION_ID = getRandomInt(0,999999999)

// Categories and questions data
const CATEGORIES = [
  {
    name: "Admission",
    questions: [
      "What are the admission requirements for Bachelor's programs?",
      "What documents are needed for Master's admission?",
      "When does the admission process start?",
      "Are there any admission exams?"
    ]
  },
  {
    name: "Academic Life",
    questions: [
      "Where can I find my schedule?",
      "How do I access educational resources?",
      "What are the exam session periods?",
      "How does the grading system work?"
    ]
  },
  {
    name: "Student Services",
    questions: [
      "How do I apply for scholarships?",
      "What housing options are available?",
      "Where are the canteens located?",
      "How do I pay my tuition fees?"
    ]
  },
  {
    name: "University Resources",
    questions: [
      "Where can I find the latest university news?",
      "How do I contact the faculty administration?",
      "What research opportunities are available?",
      "Where can I find academic regulations?"
    ]
  }
];

export default function Home() {
    const [userInput, setUserInput] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);

    const [resourcesOpen, setResourcesOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const resourcesRef = useRef(null);

    const messageListRef = useRef(null);
    const textAreaRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordTime, setRecordTime] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark';
        }
        return true;
    });

  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordInterval = useRef(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const resources = [
    { id: 1, name: 'Schedule', icon: Clock9, url: 'https://edu.info.uaic.ro/orar/' },
    { id: 2, name: 'Courses', icon: BookText, url: 'https://edu.info.uaic.ro/' },
    { id: 3, name: 'News', icon: Newspaper, url: 'https://www.info.uaic.ro/noutati/' },
    { id: 4, name: 'Contact', icon: Contact, url: 'https://www.info.uaic.ro/contact/' },
    { id: 5, name: 'Admission', icon: University, url: 'https://www.info.uaic.ro/admitere/' },
    { id: 6, name: 'Scholarship', icon: BanknoteArrowUp, url: 'https://www.uaic.ro/studenti/burse/' },
    { id: 7, name: 'Taxes', icon: BanknoteArrowDown, url: 'https://plati-taxe.uaic.ro/' },
    { id: 8, name: 'Housing', icon: House, url: 'https://www.uaic.ro/studenti/cazare/' }
  ];

  const facultyLinks = [
  {
    id: 1,
    title: "Academic staff",
    description: "Contact information for professors and staff including office locations, email addresses, and personal websites. Users may search for specific professors by name or department.",
    url: "https://www.info.uaic.ro/personal-academic",
    logo: "/FiiLogo.png",
    keywords: ["professor", "staff", "email", "office", "contact", "website", "person", "faculty", "mr", "mrs", "prof"]
  },
  {
    id: 2,
    title: "Canteens and cafes",
    description: "Complete information about campus dining options including: canteen locations, opening hours, menus, and prices. Users may refer to these as 'cafeteria', 'dining hall', or 'food court'.",
    url: "https://www.uaic.ro/studenti/cantinele-universitatii-alexandru-ioan-cuza/",
    logo: "/UaicLogo.jpg",
    keywords: ["canteen", "cafeteria", "food", "menu", "price", "hours", "opening", "eat", "cafe"]
  },
  {
    id: 3,
    title: "Master programs info",
    description: "Information about master programs, including websites and study plan link.",
    url: "https://www.info.uaic.ro/en/master-studies/",
    logo: "/FiiLogo.png",
    keywords: ["Software Engineering", "Computational Linguistics", "Computational Optimization", "Artificial Intelligence and Optimization",
                     "Information Security", "Advanced Studies in Computer Science", "MISS", "ISS", "MLC", "LC", "MIAO", "IAO", "MSD", "SD", "MSI", "SI", "MSAI", "SAI"]
  },
  {
    id: 4,
    title: "Scholarships",
    description: "Complete information about scholarship information, including contact persons information, social problems department location, scholarship categories.",
    url: "https://www.uaic.ro/studenti/burse/",
    logo: "/UaicLogo.jpg",
    keywords: ["scholarship", "grant", "financial", "bursary", "support", "tuition", "funding", "merit", "social problems", "social support", "erasmus", "social scholarship"]
  },
  {
    id: 5,
    title: "Student accommodation",
    description: "Complete information about student accommodation.",
    url: "https://www.uaic.ro/studenti/cazare/",
    logo: "/UaicLogo.jpg",
    keywords: ["dorm", "room", "bed", "accommodation", "titu", "codrescu", "targusor", "gaudeamus", "akademos", "buna vestire", "live",
                     "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C10", "C11", "C12", "Titu Maiorescu", "Târguşor-Copou"]
  },
  {
    id: 6,
    title: "Request for study interruption",
    description: "Form request for study interruption.",
    url: "https://profs.info.uaic.ro/~webdata/regulamente/Cerere%20intrerupere%20studii.docx",
    logo: "/FiiLogo.png",
    keywords: ["study interruption"]
  },
  {
    id: 7,
    title: "Request for academic transcript issuance",
    description: "Form request for academic transcript issuance.",
    url: "https://profs.info.uaic.ro/~webdata/regulamente/Cerere%20eliberare%20situatie%20scolara.docx",
    logo: "/FiiLogo.png",
    keywords: ["academic transcript issuance"]
  },
  {
    id: 8,
    title: "Request to borrow diploma",
    description: "Form request to borrow diploma.",
    url: "https://profs.info.uaic.ro/~webdata/regulamente/Cerere%20imprumut%20diploma.docx",
    logo: "/FiiLogo.png",
    keywords: ["borrow diploma"]
  },
  {
    id: 9,
    title: "Request for faculty withdrawal",
    description: "Form request for faculty withdrawal.",
    url: "https://profs.info.uaic.ro/~webdata/regulamente/cerere%20retragere_facultate.doc",
    logo: "/FiiLogo.png",
    keywords: ["faculty withdrawal"]
  },
  {
    id: 10,
    title: "Request for withdrawal submitted to the registry",
    description: "Form request for withdrawal submitted to the registry.",
    url: "https://profs.info.uaic.ro/~webdata/regulamente/cerere%20retragere_registratura.doc",
    logo: "/FiiLogo.png",
    keywords: ["withdrawal submitted to the registry"]
  },
  {
    id: 11,
    title: "Medical services",
    description: "Available medical resources",
    url: "https://www.uaic.ro/studenti/servicii-medicale/",
    logo: "/UaicLogo.jpg",
    keywords: ["medical services"]
  },
  {
    id: 12,
    title: "Student regulations",
    description: "Rules of the faculty",
    url: "https://www.info.uaic.ro/regulamente/",
    logo: "/FiiLogo.png",
    keywords: ["student regulations"]
  },
  {
    id: 13,
    title: "Study plans",
    description: "Study plans for the students",
    url: "https://edu.info.uaic.ro/fise-discipline/",
    logo: "/FiiLogo.png",
    keywords: ["study plans"]
  },
  {
    id: 14,
    title: "Schedule bachelor year 1 A",
    description: "Bachelor's program schedule for Year 1, Semigroup A.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_I1A.html",
    logo: "/FiiLogo.png",
    keywords: ["1A", "first year A", "year 1 A"]
  },
  {
    id: 15,
    title: "Schedule bachelor year 1 B",
    description: "Bachelor's program schedule for Year 1, Semigroup B.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_I1B.html",
    logo: "/FiiLogo.png",
    keywords: ["1B", "first year B", "year 1 B"]
  },
  {
    id: 16,
    title: "Schedule bachelor year 1 E",
    description: "Bachelor's program schedule for Year 1, Semigroup E.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_I1E.html",
    logo: "/FiiLogo.png",
    keywords: ["1E", "first year E", "year 1 E"]
  },
  {
    id: 17,
    title: "Schedule bachelor year 2 A",
    description: "Bachelor's program schedule for Year 2, Semigroup A.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_I2A.html",
    logo: "/FiiLogo.png",
    keywords: ["2A", "second year A", "year 2 A"]
  },
  {
    id: 18,
    title: "Schedule bachelor year 2 B",
    description: "Bachelor's program schedule for Year 2, Semigroup B.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_I2B.html",
    logo: "/FiiLogo.png",
    keywords: ["2B", "second year B", "year 2 B"]
  },
  {
    id: 19, 
    title: "Schedule bachelor year 2 E",
    description: "Bachelor's program schedule for Year 2, Semigroup E.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_I2E.html",
    logo: "/FiiLogo.png",
    keywords: ["2E", "second year E", "year 2 E"]
  },
  {
    id: 20,
    title: "Schedule bachelor year 3 A",
    description: "Bachelor's program schedule for Year 3, Semigroup A.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_I3A.html",
    logo: "/FiiLogo.png",
    keywords: ["3A", "third year A", "year 3 A"]
  },
  {
    id: 21,
    title: "Schedule bachelor year 3 B",
    description: "Bachelor's program schedule for Year 3, Semigroup B.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_I3B.html",
    logo: "/FiiLogo.png",
    keywords: ["3B", "third year B", "year 3 B"]
  },
  {
    id: 22,
    title: "Schedule bachelor year 3 E",
    description: "Bachelor's program schedule for Year 3, Semigroup E.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_I3E.html",
    logo: "/FiiLogo.png",
    keywords: ["3E", "third year E", "year 3 E"]
  },
  {
    id: 23,
    title: "Schedule master IAO year 1",
    description: "Artificial Intelligence and Optimization master's program schedule for Year 1.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MIAO1.html",
    logo: "/FiiLogo.png",
    keywords: ["MIAO1", "IAO1"]
  },
  {
    id: 24,
    title: "Schedule master IAO year 2",
    description: "Artificial Intelligence and Optimization master's program schedule for Year 2.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MIAO2.html",
    logo: "/FiiLogo.png",
    keywords: ["MIAO2", "IAO2"]
  },
  {
    id: 25,
    title: "Schedule master LC year 1",
    description: "Computational Linguistics master's program schedule for Year 1.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MLC1.html",
    logo: "/FiiLogo.png",
    keywords: ["MLC1", "LC1"]
  },
  {
    id: 26,
    title: "Schedule master LC year 2",
    description: "Computational Linguistics master's program schedule for Year 2.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MLC2.html",
    logo: "/FiiLogo.png",
    keywords: ["MLC2", "LC2"]
  },
  {
    id: 27,
    title: "Schedule master SI year 1",
    description: "Information Security master's program schedule for Year 1.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MSI1.html",
    logo: "/FiiLogo.png",
    keywords: ["MSI1", "SI1"]
  },
  {
    id: 28,
    title: "Schedule master SI year 2",
    description: "Information Security master's program schedule for Year 2.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MSI2.html",
    logo: "/FiiLogo.png",
    keywords: ["MSI2", "SI2"]
  },
  {
    id: 29,
    title: "Schedule master SAI year 1",
    description: "Advanced Studies in Computer Science master's program schedule for Year 1.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MSAI1.html",
    logo: "/FiiLogo.png",
    keywords: ["MSAI1", "SAI1"]
  },
  {
    id: 30,
    title: "Schedule master SAI year 2",
    description: "Advanced Studies in Computer Science master's program schedule for Year 2.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MSAI2.html",
    logo: "/FiiLogo.png",
    keywords: ["MSAI2", "SAI2"]
  },
  {
    id: 31,
    title: "Schedule master SD year 1",
    description: "Distributed Systems master's program schedule for Year 1.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MSD1.html",
    logo: "/FiiLogo.png",
    keywords: ["MSD1", "SD1"]
  },
  {
    id: 32,
    title: "Schedule master SD year 2",
    description: "Distributed Systems master's program schedule for Year 2.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MSD2.html",
    logo: "/FiiLogo.png",
    keywords: ["MSD2", "SD2"]
  },
  {
    id: 33,
    title: "Schedule master ISS1 year 1",
    description: "Software Engineering master's program schedule for Year 1 Group 1.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MISS11.html",
    logo: "/FiiLogo.png",
    keywords: ["MISS11", "ISS11"]
  },
  {
    id: 34,
    title: "Schedule master ISS2 year 1",
    description: "Software Engineering master's program schedule for Year 1 Group 2.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MISS12.html",
    logo: "/FiiLogo.png",
    keywords: ["MISS12", "ISS12"]
  },
  {
    id: 35,
    title: "Schedule master ISS1 year 2",
    description: "Software Engineering master's program schedule for Year 2 Group 1.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MISS21.html",
    logo: "/FiiLogo.png",
    keywords: ["MISS21", "ISS21"]
  },
  {
    id: 36,
    title: "Schedule master ISS2 year 2",
    description: "Software Engineering master's program schedule for Year 2 Group 2.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MISS22.html",
    logo: "/FiiLogo.png",
    keywords: ["MISS22", "ISS22", "error"]
  }
];

  const filteredLinks = (message) => {
    if(message.length) {
      const messageLower = message.toLowerCase();
      const result = facultyLinks.filter(link => {
        return link.keywords && link.keywords.some(keyword =>
          messageLower.includes(keyword.toLowerCase())
        );
      });
      return result;
    }
  };

  const FacultySidebar = ({ isOpen, onClose, links }) => {
    if (!isOpen) return null;
    console.log(links);
    return (
      <>
        <div 
          className={styles.sidebarOverlay}
          onClick={onClose}
        />
        
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Faculty links</h3>
            <button 
              className={styles.closeButton}
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          
          <div className={styles.sidebarContent}>
            {links.map((link) => (
              <div key={link.id} className={styles.facultyResource}>
                <div className={styles.facultyResourceHeader}>
                  <img src={link.logo} className={styles.facultyLogo} />
                </div>
                
                <h4 className={styles.facultyResourceTitle}>{link.title}</h4>
                <p className={styles.facultyResourceDescription}>{link.description}</p>
                
                <a 
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.facultyButton}
                  onClick={onClose}
                >
                  Click here
                </a>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    function handleClickOutside(event) {
        if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
            setResourcesOpen(false);
        }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [resourcesRef]);

  useEffect(() => {
    const messageList = messageListRef.current;
    messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

    useEffect(() => {
        if(textAreaRef.current) textAreaRef.current.focus();
    }, [messages]);

    useEffect(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, [messages]);

    const handleInput = () => {
        const el = textAreaRef.current;
        if (el) {
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
            el.scrollTop = el.scrollHeight;
        }
    };

    useEffect(() => {
        handleInput();

        window.addEventListener("resize", handleInput);
        return () => {
            window.removeEventListener("resize", handleInput);
        };
    }, []);

    const handleError = () => {
        setMessages((prevMessages) => [...prevMessages, {
            "message": "Oops! There seems to be an error. Please try again.",
            "type": "apiMessage"
        }]);
        setLoading(false);
        setUserInput("");
        const el = textAreaRef.current;
        if (el) {
            el.style.height = "auto";
            el.rows = 1;
        }
    }

    const handleSubmit = async (e) => {
        if(e) e.preventDefault();

        if (userInput.trim() === "") {
            return;
        }

        setLoading(true);
        setMessages((prevMessages) => [...prevMessages, { "message": userInput, "type": "userMessage" }]);

        const response = await fetch("https://43c3-62-217-241-123.ngrok-free.app/api/post_question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: userInput, session_id: SESSION_ID}),
        });

        if (!response.ok) {
          handleError();
          return;
        }

        const data = await response.json();

        if (data.error) {
            handleError();
            return;
        }

        setMessages((prevMessages) => [...prevMessages, { "message": data.answer, "type": "apiMessage" }]);
        setUserInput("")
        setLoading(false);

         //const links = extractRelevantLinks(data.answer);
         //setRelevantLinks(links);
          
         // Auto-open sidebar if there are relevant links
         //if (links.length > 0) {
           //setSidebarOpen(true);
         //}
    };

    const handleQuickQuestionClick = async (question) => {
        // Add the question to messages immediately as a user message
        setMessages((prevMessages) => [...prevMessages, { "message": question, "type": "userMessage" }]);
        
        // Show loading state
        setLoading(true);
        
        // Send the question to the backend
        try {
          const response = await fetch("https://43c3-62-217-241-123.ngrok-free.app/api/post_question", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: question, session_id: SESSION_ID }),
          });
          
          if (!response.ok) {
            handleError();
            return;
          }
          
          const data = await response.json();
          
          if (data.error) {
            handleError();
            return;
          }
          
          // Add the response to messages
          setMessages((prevMessages) => [...prevMessages, { "message": data.answer, "type": "apiMessage" }]);
          setLoading(false);
        } catch (error) {
          console.error("Error sending quick question:", error);
          handleError();
        }
    };
     
    const processKeywords = (text) => {
        const sortedKeywords = [...KEYWORD_URLS].sort((a, b) => b.phrase.length - a.phrase.length);
          
        let processedText = text;
          
        sortedKeywords.forEach(({ phrase, url }) => {
          const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
          processedText = processedText.replace(
            regex,
            `[${phrase}](${url})`
          );
        });
          
        return processedText;
    };

    const handleEnter = (e) => {
        if (e.key === "Enter" && userInput) {
            if (!e.shiftKey && userInput) {
                handleSubmit(e);
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const handleResourceSelect = (resource) => {
        setResourcesOpen(false);

        if(resource.url) {
          window.open(resource.url, '_blank', 'noopener,noreferrer');
        }
    };

    const handleSidebarResourceClick = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    useEffect(() => {
        if (messages.length >= 3) {
          setHistory([[messages[messages.length - 2].message, messages[messages.length - 1].message]]);
        }
    }, [messages]);

    useEffect(() => {
        return () => {
          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
          }
          clearInterval(recordInterval.current);
        };
    }, []);

    const handleRecord = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            clearInterval(recordInterval.current);
            setIsRecording(false);
            setRecordTime(0);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            
            const audioChunks = [];
            
            // Store references to event listeners for cleanup
            const dataAvailableHandler = (event) => audioChunks.push(event.data);
            const stopHandler = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioUrl(audioUrl);
                
                setMessages(prev => [...prev, {
                    "message": audioUrl,
                    "type": "userMessage",
                    "isAudio": true
                }]);
                
                // Clean up
                stream.getTracks().forEach(track => track.stop());
                mediaRecorder.removeEventListener("dataavailable", dataAvailableHandler);
                mediaRecorder.removeEventListener("stop", stopHandler);
            };

            mediaRecorder.addEventListener("dataavailable", dataAvailableHandler);
            mediaRecorder.addEventListener("stop", stopHandler);

            mediaRecorder.start();

            // Start timer
            setIsRecording(true);
            setRecordTime(0);
            recordInterval.current = setInterval(() => {
                setRecordTime(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error("Recording error:", error);
            setIsRecording(false);
            setMessages(prev => [...prev, {
                "message": error.message.includes('permission') ? 
                    "Microphone access denied. Please allow microphone permissions." :
                    "Recording failed. Please try again.",
                "type": "apiMessage"
            }]);
        }
    };

    return (
    <>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>FiiHelp</title>
        </Head>

      <div className={isDarkMode ? styles.dark : styles.light}>
        <div className={styles.topnav}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem 0 0' }}>
                <Image src="/logo.png" alt="UAIC Logo" width={48} height={48} />
            </a>
          <div className={styles.resourcesContainer} ref={resourcesRef}>
              <button 
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className={styles.resourcesButton}
              >
                <Menu />
              </button>
              
              {resourcesOpen && (
                <div className={styles.resourcesDropdown}>
                  <ul>
                    {resources.map((resource) => {
                      const IconComponent = resource.icon;
                      return (
                        <li key={resource.id}>
                          <button 
                            onClick={() => handleResourceSelect(resource)}
                            className={styles.resourceItem}
                          >
                            {IconComponent && <IconComponent size={16} className={styles.resourceIcon} />}
                            <span>{resource.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          <div className = {styles.navlinks}>
            <label className={styles["theme-toggle"]}>
                              <input
                                  type="checkbox"
                                  checked={!isDarkMode}
                                  onChange={() => {
                                      setIsDarkMode((prev) => {
                                          const newTheme = !prev;
                                          localStorage.setItem("theme", newTheme ? "dark" : "light");
                                          return newTheme;
                                      });
                                  }}
                              />
                              <span className={styles.slider}>
        <span className={`${styles.icon} ${styles.sun}`}>🌙</span>
        <span className={`${styles.icon} ${styles.moon}`}>☀️</span>
      </span>
                          </label>
          </div>
        </div>
        <main className={styles.main}>
          <div className = {styles.cloud}>
            <div ref={messageListRef} className = {styles.messagelist}>
              {messages.length === 0 ? (
                <div className={styles.welcomeContainer}>
                  <div className={styles.description}>
                    <h1>Welcome to FiiHelp Assistant</h1>
                    <p>Your virtual assistant for all questions related to the Faculty of Computer Science (FII). 
                    Get instant answers about admissions, academic programs, student services and more.</p>
                  </div>
                  <div className={styles.center}>
            <div className={styles.cloudform}>
              <form onSubmit={handleSubmit} className={styles.inputArea}>
                <div className={styles.inputWrap}>
                  <textarea
                    disabled={loading}
                    onKeyDown={handleEnter}
                    ref={textAreaRef}
                    rows={1}
                    onInput={handleInput}
                    type="text"
                    id="userInput"
                    name="userInput"
                    placeholder={loading ? "Waiting for response..." : "Type your question..."}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className={styles.textarea}
                  />

                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleRecord}
                        className={styles.recordButton}
                        title={isRecording ? "Stop Recording" : "Start Recording"}
                    >
                        {isRecording ? "⏹" : "🎤"}
                    </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.generatebutton}
                  >
                    {loading ? (
                      <div className={styles.loadingwheel}>
                        <CircularProgress color="inherit" size={20}/>
                      </div>
                    ) : (
                      <svg viewBox="0 0 20 20" className={styles.svgicon}
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </form>
              {isRecording && (
                <div className={styles.recordingIndicator}>
                  <div className={styles.recordingDot}></div>
                  ⏱️ Recording: {recordTime}s
                </div>
              )}
            </div>
          </div>
                  <div className={styles.categoriesContainer}>
                    {CATEGORIES.map((category) => (
                      <div 
                        key={category.name} 
                        className={styles.categoryBox}
                        onClick={() => setActiveCategory(activeCategory === category.name ? null : category.name)}
                      >
                        <h3>{category.name}</h3>
                        {activeCategory === category.name && (
                          <div className={styles.questionsList}>
                            {category.questions.map((question, index) => (
                              <div 
                                key={index} 
                                className={styles.questionItem}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuickQuestionClick(question);
                                }}
                              >
                                {question}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                <div className={styles.slideshowParent}>
                  <div className={styles.slideshowContainer}>
                    <div className={styles.sliderWrapper}>
                      <Slider {...settings}>
                        <div className={styles.slide}>
                          <img src="/BCU1.jpg" alt="Central University Library" />
                          <div className={styles.descriptionBox}>
                            <p>Central University Library – A historic library in Iași.</p>
                            <a href="http://site-vechi.bcu-iasi.ro/" target="_blank" rel="noopener noreferrer">Visit Website</a>
                          </div>
                        </div>
                        <div className={styles.slide}>
                          <img src="/BCU3.jpg" alt="Central University Library" />
                          <div className={styles.descriptionBox}>
                            <p>Central University Library – A historic library in Iași.</p>
                            <a href="http://site-vechi.bcu-iasi.ro/" target="_blank" rel="noopener noreferrer">Visit Website</a>
                          </div>
                        </div>
                        <div className={styles.slide}>
                          <img src="/GradinaBotanica1.png" alt="Botanical Garden Anastasie Fatu" />
                          <div className={styles.descriptionBox}>
                            <p>Botanical Garden Anastasie Fatu</p>
                            <a href="https://www.botanica.uaic.ro/" target="_blank" rel="noopener noreferrer">Explore More</a>
                          </div>
                        </div>
                        <div className={styles.slide}>
                          <img src="/GradinaBotanica2.jpg" alt="Botanical Garden Anastasie Fatu" />
                          <div className={styles.descriptionBox}>
                            <p>Botanical Garden Anastasie Fatu</p>
                            <a href="https://www.botanica.uaic.ro/" target="_blank" rel="noopener noreferrer">Explore More</a>
                          </div>
                        </div>
                        <div className={styles.slide}>
                          <img src="/GradinaBotanica4.webp" alt="Botanical Garden Anastasie Fatu" />
                          <div className={styles.descriptionBox}>
                            <p>Botanical Garden Anastasie Fatu</p>
                            <a href="https://www.botanica.uaic.ro/" target="_blank" rel="noopener noreferrer">Explore More</a>
                          </div>
                        </div>
                         <div className={styles.slide}>
                          <img src="/GradinaBotanica6.webp" alt="Botanical Garden Anastasie Fatu" />
                          <div className={styles.descriptionBox}>
                            <p>Botanical Garden Anastasie Fatu</p>
                            <a href="https://www.botanica.uaic.ro/" target="_blank" rel="noopener noreferrer">Explore More</a>
                          </div>
                        </div>
                          <div className={styles.slide}>
                          <img src="/GradinaBotanica9.webp" alt="Botanical Garden Anastasie Fatu" />
                          <div className={styles.descriptionBox}>
                            <p>Botanical Garden Anastasie Fatu</p>
                            <a href="https://www.botanica.uaic.ro/" target="_blank" rel="noopener noreferrer">Explore More</a>
                          </div>
                        </div>
                        <div className={styles.slide}>
                          <img src="/informatica1.jpg" alt="Studenti" />
                          <div className={styles.descriptionBox}>
                            <p>Students working in the Informatics classrooms.</p>
                          </div>
                        </div>
                        <div className={styles.slide}>
                          <img src="/informatica2.jpg" alt="Studenti" />
                          <div className={styles.descriptionBox}>
                            <p>Students working in the Informatics classrooms.</p>
                          </div>
                        </div>
                          <div className={styles.slide}>
                          <img src="/Gaudeamus.webp" alt="Gaudeamus Canteen" />
                          <div className={styles.descriptionBox}>
                            <p>Gaudeamus Canteen</p>
                          </div>
                        </div>
                        <div className={styles.slide}>
                          <img src="/muzeuluniversitatii.jpg" alt="University Museum" />
                          <div className={styles.descriptionBox}>
                            <p>University Museum</p>
                            <a href="https://www.uaic.ro/muzeul-universitatii-alexandru-ioan-cuza/" target="_blank" rel="noopener noreferrer">Explore More</a>
                          </div>
                        </div>
                        <div className={styles.slide}>
                          <img src="/salaPasilorPierduti1.jpg" alt="Sala Pasilor Pierduti" />
                          <div className={styles.descriptionBox}>
                            <p>"Sala Pasilor Pierduti"</p>
                            <a href="https://www.uaic.ro/despre-uaic/prezentare-sala-pasilor-pierduti/" target="_blank" rel="noopener noreferrer">Explore More</a>
                          </div>
                        </div>
                          <div className={styles.slide}>
                          <img src="/sala_pasilor_pierduti.jpg" alt="Sala Pasilor Pierduti" />
                          <div className={styles.descriptionBox}>
                            <p>"Sala Pasilor Pierduti"</p>
                            <a href="https://www.uaic.ro/despre-uaic/prezentare-sala-pasilor-pierduti/" target="_blank" rel="noopener noreferrer">Explore More</a>
                          </div>
                        </div>
                      </Slider>
                    </div>
                  </div>
                </div>

                  <footer className={styles.footer}>
                    <div className={styles.footerCenter}>
                      <img src="/logo_uaic.png" alt="Logo 1" className={styles.footerLogo} />
                      <span className={styles.universityName}>"Alexandru Ioan Cuza" University of Iași</span>
                    </div>
                    <div className={styles.footerText}>
                      <p>© 2025 FiiHelp Assistant. Developed by students of the Master's program in Computational Linguistics under the guidance of Ionut Pistol.</p>
                      <p>Contact us at: fiihelpuaicassistant@gmail.com</p>
                    </div>
                  </footer>
                </div>
              ) : (
                messages.reduce((acc, message, index) => {
                  acc.push(
                  <div 
                     key={index}
                     className={message.type === "apiMessage" ? styles.botText : styles.userBubble}
                  >
                    <div className={styles.markdownanswer}>
                      {message.isAudio ? (
                        <audio controls src={message.message} className='styles.audioPlayer' />
                      ) : (
                        <ReactMarkdown 
                          linkTarget="_blank"
                          components={{
                            a: ({node, ...props}) => (
                              <a {...props} style={{color: '#0066cc', textDecoration: 'underline'}} />
                            )
                          }}
                        >
                          {processKeywords(message.message)}
                        </ReactMarkdown>
                      )}
                      </div>
                    </div>
                  );
                        if(message.type === "apiMessage" && filteredLinks(message.message).length > 0) {
                        acc.push(
                        <div key={`faculty-${index}`} className={styles.facultyResourceContainer}>
                          <button
                            onClick={() => setIsSidebarOpen(true)}
                            className={styles.facultyResourceButton}
                          >
                            Resources
                          </button>
                        </div>
                      );
                    }

                    return acc;
                 }, []) 
                )
              }
            </div>
          </div>
          
          {messages.length > 0 && (
          <div className={styles.center}>
            <div className={styles.cloudform}>
              <form onSubmit={handleSubmit} className={styles.inputArea}>
                <div className={styles.inputWrap}>
                  <textarea
                    disabled={loading}
                    onKeyDown={handleEnter}
                    ref={textAreaRef}
                    rows={1}
                    onInput={handleInput}
                    type="text"
                    id="userInput"
                    name="userInput"
                    placeholder={loading ? "Waiting for response..." : "Type your question..."}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className={styles.textarea}
                  />

                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleRecord}
                        className={styles.recordButton}
                    >
                        🎤
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.generatebutton}
                    >
                        ⬆️
                  </button>
                </div>
              </form>
              {isRecording && (
                <div className={styles.recordingIndicator}>
                  <div className={styles.recordingDot}></div>
                  ⏱️ Recording: {recordTime}s
                </div>
              )}
            </div>
          </div>  
          )}                     
        </main>
          <FacultySidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            links={messages.length > 0 ? filteredLinks(messages[messages.length - 1].message) : []}
          />
      </div>
    </>
  );
}
