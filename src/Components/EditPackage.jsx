import React, { useState, useEffect, useRef } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SideBar from "./SideBar";
import background from "../assets/background.svg";
import leftArrow from "../assets/leftArrow.svg";
import crossIcon from "../assets/cross.svg";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import imageUpload from "../assets/imageUpload.svg";
import CreateTable from "./createTable";
import { useNavigate } from "react-router-dom";

const CreatePackage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const jwtUserToken = Cookies.get("user_token");
    const userData = JSON.parse(jwtUserToken);
    console.log("User Data:", userData);
    const [rowsData, setRowsData] = useState([]);
    const [invImgFileName, setInvImgFileName] = useState("");
    const [unit, setUnit] = useState("minutes");
    const [inventoryData, setInventoryData] = useState(null);
    const [active, setActive] = useState('setup');
    const [isChecked, setIsChecked] = useState(false);
    const [images, setImages] = useState([]);
    const [editorStates, setEditorStates] = useState({
        included: { content: '', operations: [] },
        tnc: { content: '', operations: [] }
    });
    const [packageTitle, setPackageTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [duration, setDuration] = useState('');
    const quillRefs = useRef({ included: null, tnc: null });

    const fetchData = async () => {
        const userDataa = JSON.parse(jwtUserToken);
        try {
            const payload = {
                vendorId: userDataa.ID,
                invId: id
            };
            console.log(id);
            const response = await fetch('https://staging.neardeal.me/api/fetchInvDetailsMW.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const userData = await response.json();
            setInventoryData(userData.data[0]); // Assuming the data is an array
            // const serviceArrays=inventoryData['Services'];
            console.log("askjd", inventoryData);

        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    useEffect(() => {
        fetchData();

        console.log("Inventory Data:", inventoryData);
    }, []);

    const handleUnitChange = (e) => {
        setUnit(e.target.value);
    };

    const handleRemoveImage = () => {
        setImages(null);
    };
    const handleChildData = (data) => {
        setRowsData(data);
        console.log(data);
    };

    useEffect(() => {

        if (inventoryData) {
            const service = JSON.parse(inventoryData.Services);
            const data = []
            const multiDimensionalArray = service.map(obj => Object.values(obj));
            setRowsData(multiDimensionalArray);
            // handleChildData(rowsData);
            console.log(rowsData);
            setSelectedCategory(inventoryData.InventoryCat)
            setInvImgFileName(inventoryData.ImageLocation);
            console.log("kjweb", invImgFileName);
            console.log("kjweb", multiDimensionalArray);
            setPackageTitle(inventoryData.InventoryName);
            setIsChecked(inventoryData.Status === '1' ? true : false);
            setDuration(inventoryData.Duration || '');
            setEditorStates(prev => ({
                ...prev,
                included: { content: inventoryData.WhatIncluded || '', operations: [] },
                tnc: { content: inventoryData.Tnc || '', operations: [] }
            }));
        }
    }, [inventoryData]);

    const handleToggle = () => {
        setIsChecked(prev => !prev);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setInvImgFileName(file.name);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result; // Get the Base64 string from the reader
                const parts = base64String.split(","); // Split the string at the comma
                console.log("--------", parts); // Now you can log it

                // Update the state with the new data
                setImages(parts[1]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'packageTitle':
                setPackageTitle(value);
                break;
            case 'duration':
                setDuration(value);
                break;
            default:
                break;
        }
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };
    const handleSaveChanges = async () => {
        if (!packageTitle.trim()) {
            toast.error("Package title is required");
            return;
        }

        // Ensure at least one image is present (either newly uploaded or retrieved)
        const finalImage = images && images.length > 0 ? images : null;

        // if (!finalImage && !invImgFileName) {
        //     toast.error("Image is required");
        //     return;
        // }

        let datas = [];

        if (rowsData && rowsData.length > 0) {
            datas = rowsData
                .filter(row => row.length === 3 && row.every(value => value.trim() !== '')) // Ensure all fields are filled
                .map(row => ({
                    Name: row[0],
                    Price: row[1],
                    Hours: row[2]
                }));

            if (datas.length === 0) {
                toast.error("Each row must have Name, Price, and Hours filled");
                return;
            }
        }



        console.log(rowsData, "dataaaaaaaaaaaaaaa");

        try {
            const response = await fetch('https://staging.neardeal.me/api/createPackageMW.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    vendorId: userData.ID,
                    invId: id,
                    invName: packageTitle,
                    services: JSON.stringify(datas),
                    invCat: selectedCategory,
                    whatIncluded: editorStates.included.content,
                    TnC: editorStates.tnc.content,
                    duration: duration,
                    unit: unit,
                    status: isChecked ? 1 : 0,
                    price: 999,
                    currency: "HKD",
                    invImgFileName: invImgFileName, // Existing image name
                    invImage: finalImage // Use existing image if no new image is uploaded
                })
            });

            const data = await response.json();
            toast.success("Package updated successfully");
            navigate("/package");
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred');
        }
    };



    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    if (!inventoryData) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex' }}>
            <SideBar />
            <img style={{ position: 'absolute', top: 0, zIndex: '-1', width: '100%' }} src={background} alt="background" />
            <div className="create-package" style={{ width: '80%' }}>
                <span className="heading">
                    <Link to="/package"><img src={leftArrow} alt="left arrow" /></Link> Edit Package
                </span>
                <div>
                    <div className="left">
                        <button className={`btn-outline-secondary border-0 active me-2 ${active === 'setup' ? 'active' : ''}`} onClick={() => setActive('setup')}>Package Setup</button>
                    </div>
                    {active === 'setup' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="right">
                            <div className="header">
                                <div className="left" style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            id="toggle"
                                            className="toggle-checkbox"
                                            onChange={handleToggle}
                                            checked={isChecked}
                                        />
                                        <label htmlFor="toggle" className="toggle-label"></label>
                                    </div>
                                    <span>Publish</span>
                                </div>
                                <div className="right">
                                    <button className="button" onClick={handleSaveChanges}>Save Changes</button>
                                </div>
                            </div>
                            <div className="body">
                                <div>
                                    <span className="grey">Add this package to
                                        <select
                                            style={{ marginLeft: '10px' }}
                                            className="select"
                                            value={selectedCategory}
                                            onChange={handleCategoryChange}
                                        >
                                            <option>Spa</option>
                                            <option>Massage</option>
                                            <option>Sauna</option>
                                            <option>Gym</option>
                                        </select>
                                    </span>
                                </div>
                                <input
                                    name="packageTitle"
                                    className="package-title"
                                    type="text"
                                    value={packageTitle}
                                    onChange={handleInputChange}
                                    
                                />

                                <div
                                    className="image-upload"
                                    style={{ cursor: 'pointer', textAlign: 'center', width: '80%' }}
                                    onClick={handleUploadClick}
                                >
                                    <img src={imageUpload} alt="upload" />
                                    <span style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '20px' }}>Select files</span>
                                    <p className="grey">Drop files here or click <span style={{ color: '#00A76F' }}>browse</span> through your machine</p>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />
                                </div>

                                {images && (
                                    <div style={{ position: 'relative', margin: '10px' }}>
                                        <img
                                            src={`https://staging.neardeal.me/api/${invImgFileName}`}
                                            alt="uploaded"
                                            style={{ objectFit: 'cover', width: '30%', height: 'auto' }}
                                        />
                                        <button
                                            onClick={handleRemoveImage}
                                            style={{
                                                position: 'absolute',
                                                top: '5px',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                left: '5px',
                                            }}
                                        >
                                            <img src={crossIcon} alt="remove" style={{ width: '20px', height: '20px', position: 'absolute', left: '0px' }} />
                                        </button>
                                    </div>
                                )}
                                <div className="grey">TNC</div>
                                <div className="text-section">
                                    <ReactQuill
                                        value={editorStates.tnc.content}
                                        onChange={(content) => setEditorStates(prevStates => ({
                                            ...prevStates,
                                            tnc: { content, operations: prevStates.tnc.operations }
                                        }))}
                                        className="text-area"
                                        placeholder="Type here"
                                        ref={(el) => {
                                            if (el) {
                                                quillRefs.current.tnc = el.getEditor();
                                            }
                                        }}
                                    />
                                </div>
                                <div className="createtable">
                                    <div className="grey">Services</div>
                                    <CreateTable colNo={3} sendDataToParent={handleChildData} passData={rowsData} />
                                </div>


                                {/* <div> */}
                                {/* <button className="button" onClick={handleSaveChanges}>
                    Save changes
                  </button> */}
                                {/* </div> */}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatePackage;
