import React, { useState,useEffect, useRef, useCallback } from 'react';
import SideBar from '../Components/SideBar';
import v1 from '../assets/video1.svg';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Cookies from 'js-cookie';
import imageUpload from "../assets/imageUpload.svg";
import crossIcon from "../assets/cross.svg";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
const NearAI = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isVideoModalOpen, setVideoModalOpen] = useState(false);


    // Function to toggle modal visibility
    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };
    const [isLoading, setIsLoading] = useState(false); 
    const jwtUserToken = Cookies.get("user_token");
    const userData = JSON.parse(jwtUserToken);
    const [packageTitle, setPackageTitle] = useState('');
    const [images, setImages] = useState([]);
    const [videoURL, setvideoURL] = useState('');
    const [scriptContent, setScriptContent] = useState('');
    const [promptContent, setpromptContent] = useState('');
    const [selectedSections, setSelectedSections] = useState([]);
    const [language, setLanguage] = useState([]);
    const [selectedlanguage, setSelectedlanguage] = useState('');
    const [font, setFont] = useState([]);
    const [voice, setVoice] = useState([]);
    const [selectedVoice, setselectedVoice] = useState('');
    const [selectedfont, setselectedfont] = useState('');
    const fileInputRef = useRef(null);
    const regenerate=()=>{
      setVideoModalOpen(false);
      toggleModal();
    }
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [];
        files.forEach(file => {
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result.split(",")[1];
                    newImages.push(base64String);
                    if (newImages.length === files.length) {
                        setImages(prevImages => [...prevImages, ...newImages]);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const handleDownload = () => {
      window.open(videoURL, "_blank");
    };
    
  

    const getLanguages = async () => {
        const token = "3e61107713dd29dd11db3d9d758d74915f236209"; // Replace with your actual token
        const baseUrl = "https://neardeal.me";
        try {
          const response = await fetch(`${baseUrl}/api/v1/get-languages`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
    
          const data = await response.json();
          setLanguage(data.languages);
          setSelectedlanguage(data.languages[0]['languageCode']);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };


    const getFonts = async () => {
        const token = "3e61107713dd29dd11db3d9d758d74915f236209"; // Replace with your actual token
        const baseUrl = "https://neardeal.me";
        try {
          const response = await fetch(`${baseUrl}/api/v1/get-fonts`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
    
          const data = await response.json();
          setFont(data.fonts);
          setselectedfont(data.fonts[0]['fontName'])
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };


      const getVoices = async () => {
        const token = "3e61107713dd29dd11db3d9d758d74915f236209"; // Replace with your actual token
        const baseUrl = "https://neardeal.me";
        try {
          const response = await fetch(`${baseUrl}/api/v1/get-voices`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
    
          const data = await response.json();
          setVoice(data.voices);
          setselectedVoice(data.voices[0]['name'])
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      useEffect(() => {
        getLanguages();
        getFonts();
        getVoices();
      }, []);

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const GeneratePrompt = async() => {
      setIsLoading(true);
      const token = "3e61107713dd29dd11db3d9d758d74915f236209"; // Replace with your actual token
      const baseUrl = "https://neardeal.me";
      try {
        const response = await fetch(`${baseUrl}/api/v1/prompt-to-script`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body:JSON.stringify({'prompt':promptContent,'outputLanguageCode':selectedlanguage})
        });
  
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
  
        const data = await response.json();
        setScriptContent(data['script']);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
  };

    const handleSaveChanges = async() => {
        setIsLoading(true);
        const token = "3e61107713dd29dd11db3d9d758d74915f236209"; // Replace with your actual token
        const baseUrl = "https://neardeal.me";
        try {
          const response = await fetch(`${baseUrl}/api/v1/script-to-video`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body:JSON.stringify({'script':scriptContent,'voice':selectedVoice,'captionFontName':selectedfont,'aspectRatio':{"width":9,"height":16}})
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
    
          const data = await response.json();
          console.log(data.apiFileId);
            getVideo(data.apiFileId);

        } catch (error) {
          console.error("Error fetching data:", error);
        }
    };

    const getVideo = async(apiFileId) => {
        console.log(apiFileId);
        const token = "3e61107713dd29dd11db3d9d758d74915f236209"; // Replace with your actual token
        const baseUrl = "https://neardeal.me";
        try {
           const response = await fetch(`${baseUrl}/api/v1/get-file?apiFileId=${apiFileId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
          const data = await response.json();
          if (data.loadingState === "FULFILLED" && data.apiFileSignedUrl) {
            console.log(data);
            setvideoURL(data.apiFileSignedUrl);
            setIsLoading(false);
            toggleModal();
            setVideoModalOpen(true);
          } else if (data.loadingState === "REJECTED") {
            console.error("Video generation failed:", data.errorDisplayMessage);
          }else{
            setTimeout(() => {
                getVideo(apiFileId);
              }, 500);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <SideBar></SideBar>
            <div className="nearai-main" style={{ width: '100%', padding: '1% 0% 0% 1%' }}>
                {/* Header */}
                <header className="d-flex justify-content-between align-items-center py-3">
                    {/* font-weight: 900;
    font-size: 3rem; */}
                    <h1 className="ms-4 secHead" style={{ color: 'white' }}>Near.AI</h1>
                    <div className="me-4" style={{ background: 'white' }}>
                        <input
                            type="text"
                            className="form-control text-white"
                            placeholder="Search..."
                        />
                    </div>
                </header>

                {/* Media Selection Buttons */}
                <div className="d-flex justify-content-center gap-4 my-4">
                    <div>
                        {/* SVG for Video */}
                        {/* ... */}
                    </div>

                    <div>
                        {/* SVG for another option */}
                        {/* ... */}
                    </div>

                    <div>
                        {/* SVG for third option */}
                        {/* ... */}
                    </div>
                </div>

                {/* Video Grid */}
                <div className="row g-4 justify-content-start px-5">
                    <div className="col-md-3" onClick={toggleModal}>
                      <div className='tilecontainer'>
                        <svg width="267" height="148" viewBox="0 0 267 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="266.75" height="148" rx="8" fill="white" fillOpacity="0.2" />
                            <path d="M27 85V99M20 92H34" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            
                        </svg>
                        <div className='CRvideo'>Create Video</div>
                        </div>
                    </div>
                </div>
    <div className='d-flex justify-content-center m-2 my-4'>
{/* Bootstrap Modal for Video Overlay */}
{/* Bootstrap Modal for Video Overlay */}
{isVideoModalOpen && videoURL && (
  <div className="modal show d-block" tabIndex="-1" role="dialog">
    <div className="modal-dialog modal-lg" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Video Preview</h5>
        </div>
        <div className="modal-body d-flex justify-content-center">
          <video controls width="40%" style={{ borderRadius: '8px' }}>
            <source src={videoURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="modal-footer">
        <button
        onClick={handleDownload}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
      >
        Download Video
      </button>

          <button type="button" className="btn btn-secondary" onClick={() => setVideoModalOpen(false)}>
            Close
          </button>
          <button type="button" className="btn btn-secondary" onClick={regenerate}>
            Regenerate
          </button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>


                {/* Bootstrap Modal */}
                {isModalOpen && (
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="sizes modal-content">
                                <div className="modal-body">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1 }}
                                        className="right"
                                    >
                                        {/* <div className="header">
                                            <div className="right" style={{ display: 'flex', justifyContent: 'end' }}>
                                                <button className="button" onClick={handleSaveChanges}>Generate</button>
                                            </div>
                                        </div> */}

                                        <div className="body">
                                            <div className="image-select">
                                                {images.map((image, index) => (
                                                    <div key={index} style={{ position: 'relative' }}>
                                                        <img src={`data:image/jpeg;base64,${image}`} alt={`uploaded ${index}`} />
                                                        <button
                                                            onClick={() => handleRemoveImage(index)}
                                                            style={{ position: 'absolute', top: '5px', right: '5px' }}
                                                        >
                                                            <img src={crossIcon} alt="remove" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            <div className="grey mx-2">Instructions for Near.AI</div>
                                            <div className='' id="stepsstyle">STEP 1: Enter prompt and select language for the script to be created automatically and in the preferred language.<br/>
STEP 2: After the script is populated, verify the script as per your requirement and click Generate.<br/>
STEP 3: Download the video created and use it wherever you want to as campaign / Reel etc.</div>
<div className="grey m-2">Prompt</div>
                                            <ReactQuill
                                                value={promptContent}
                                                onChange={setpromptContent}
                                                className="text-area"
                                                placeholder="Write your Prompt here"
                                            />
                                            <div style={{ display: 'flex', justifyContent:'space-around', margin:'10px 0px' }}>
                                                <div>
                                                    <div className="grey">Language</div>
                                                    <select
                                                        value={selectedlanguage}
                                                        onChange={(e) => setSelectedlanguage(e.target.value)}
                                                        style={{ width: '100%', height: '40px' }}
                                                    >
                                                        {
                                                            language.map((languagess)=>(
                                                                <option value={languagess['languageCode']}>{languagess['languageName']}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                </div>
                                                <div className="right m-3" style={{ display: 'flex', justifyContent: 'end' }}>
                                                <button className="button" onClick={GeneratePrompt}>Generate</button>
                                            </div>
                                              
                                            <div className="grey m-2">Script</div>
                                            <ReactQuill
                                                value={scriptContent}
                                                onChange={setScriptContent}
                                                className="text-area"
                                                placeholder="Write your script here"
                                            />
                                            <div style={{ display: 'flex', justifyContent:'space-around', margin:'10px 0px' }}>
                                                <div>
                                                    <div className="grey">Font</div>
                                                    <select
                                                        value={selectedfont}
                                                        onChange={(e) => setselectedfont(e.target.value)}
                                                        style={{ width: '100%', height: '40px' }}
                                                    >
                                                        {
                                                            font.map((fontts)=>(
                                                                <option value={fontts['fontName']}>{fontts['fontName']}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                <div>
                                                    <div className="grey">Voice</div>
                                                    <select
                                                        value={selectedVoice}
                                                        onChange={(e) => setselectedVoice(e.target.value)}
                                                        style={{ width: '100%', height: '40px' }}
                                                    >
                                                        {/* <option value="Default">Default</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Neutral">Neutral</option> */}


                                                        {
                                                            voice.map((voiceees)=>(
                                                                <option value={voiceees['name']}>{voiceees['name']}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                
                                            </div><div className="m-3 right" style={{ display: 'flex', justifyContent: 'end' }}>
                                                <button className="button" onClick={handleSaveChanges}>Generate</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                                {isLoading &&<div className='position-relative'><div className="position-absolute top-50 start-50 translate-middle"><div className='loader'></div></div></div>}
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={toggleModal}
                                    >
                                        Close
                                    </button>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Styling to keep modal's backdrop */}
            <style jsx>{`
                .modal.show.d-block {
                    display: block;
                    background-color: rgba(0, 0, 0, 0.5);
                }
            `}</style>
        </div>
    );
};

export default NearAI;
