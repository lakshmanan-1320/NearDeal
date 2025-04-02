import { useState, useEffect } from "react";
import "../App.css";
import SideBar from "../Components/SideBar";
import background from "../assets/background.svg";
import { Link, useNavigate } from "react-router-dom";
import plus from "../assets/plus.svg";
import edit1 from '../assets/edit1.svg';
import more from "../assets/more.svg";
import play from "../assets/play.svg";
import { motion } from "framer-motion";
import Cookies from 'js-cookie';

const CreatePackage = () => {
    const jwtUserToken = Cookies.get("user_token");
    const userData = JSON.parse(jwtUserToken);
    const navigate = useNavigate();
    const [active, setActive] = useState('all');
    const [isChecked, setIsChecked] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);
    const [spa, setSpa] = useState([]);
    const [massage, setMassage] = useState([]);
    const [sauna, setSauna] = useState([]);
    const [gym, setGym] = useState([]);
    const [all, setAll] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [data, setData] = useState();
    var cookieValue = Cookies.get('user_token');
    cookieValue = JSON.parse(cookieValue);
    const isActive = (path) => {
        return active === path ? 'btn' : '';
    };

    const handleToggle = (index) => {
        setAll(prevAll =>
            prevAll.map((item, i) =>
                i === index ? { ...item, Status: item.Status === '1' ? '0' : '1' } : item
            )
        );
    };


    const handleAccordionToggle = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                var payload = {
                    "userID": cookieValue.ID
                }

                // Fetch user data
                const response = await fetch('https://staging.neardeal.me/api/fetchUserData.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                const userData = await response.json();
                setData(userData);
                console.log("User Data:", userData); // Log the user data

            } catch (error) {
                console.error('Failed to parse JSON from cookie or fetch user data:', error);
            }

        };

        fetchData();
    }, []);
    console.log(userData)
    console.log(data, "dataaaaaa")
    const fetchSpa = async () => {
        try {
            const response = await fetch('https://staging.neardeal.me/api/invListingMW.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "vendorId": userData.ID,
                    "invCat": 'spa',
                    "fetchType": 'List'
                })
            });

            const data = await response.json();
            console.log('Data', data);
            setSpa(data.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchMassage = async () => {
        try {
            const response = await fetch('https://staging.neardeal.me/api/invListingMW.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "vendorId": userData.ID,
                    "invCat": 'massage',
                    "fetchType": 'List'
                })
            });

            const data = await response.json();
            console.log('Data', data);
            setMassage(data.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchSauna = async () => {
        try {
            const response = await fetch('https://staging.neardeal.me/api/invListingMW.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "vendorId": userData.ID,
                    "invCat": 'sauna',
                    "fetchType": 'List'
                })
            });

            const data = await response.json();
            console.log('Data', data);
            setSauna(data.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchgym = async () => {
        try {
            const response = await fetch('https://staging.neardeal.me/api/invListingMW.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "vendorId": userData.ID,
                    "invCat": 'gym',
                    "fetchType": 'List'
                })
            });

            const data = await response.json();
            console.log('Data', data);
            setGym(data.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchAll = async () => {
        try {
            const response = await fetch('https://staging.neardeal.me/api/invListingMW.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "vendorId": userData.ID,
                    "invCat": 'all',
                    "fetchType": 'List'
                })
            });

            const data = await response.json();
            console.log('Data', data);
            setAll(data.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchSpa();
        fetchMassage();
        fetchSauna();
        fetchAll();
        fetchgym();
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            <SideBar />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} style={{ width: '80%' }}>
                <img style={{ position: 'absolute', top: 0, zIndex: '-1' }} src={background} alt="background" />

                <div className="container mainSec" id="bookingSec">
                    <h1 className="secHead">Package</h1>
                    <div className="row mb-4 p-0">
                        <div className="container mainSec" id="bookingSec">

                            <div className="row mb-4 p-0">
                                <div className="col-lg-6 d-flex">
                                    {/* Default "All" Button */}
                                    <button
                                        onClick={() => setActive("all")}
                                        type="button"
                                        className={`${isActive("all")} btn-outline-secondary border-0 active me-2`}
                                    >
                                        All
                                    </button>
                                    <div className="col-lg-6 d-flex">
                                        <button onClick={() => setActive('spa')} type="button" className={`${isActive('spa')} btn-outline-secondary border-0 active me-2`}>Spa</button>
                                        <button onClick={() => setActive('massage')} type="button" className={`${isActive('massage')} btn-outline-secondary border-0 active me-2`}>Massage</button>
                                        <button onClick={() => setActive('sauna')} type="button" className={`${isActive('sauna')} btn-outline-secondary border-0 active me-2`}>Sauna</button>
                                        <button onClick={() => setActive('gym')} type="button" className={`${isActive('gym')} btn-outline-secondary border-0 active me-2`}>Gym</button>

                                    </div>




                                </div>

                                <div className="col-lg-6 d-flex input-group justify-content-end ms-5" style={{ maxWidth: '45%' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button className="btn btn-outline-secondary me-2 rounded-3" type="button">
                                        <i className="fa fa-search"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="package-body">
                                <div className="spa" onClick={() => handleAccordionToggle('spa')}>
                                    <div style={{ width: '8%' }}>
                                    </div>
                                    <Link to='/create-package'>
                                        <button>
                                            <img src={plus} alt="add" />
                                            <span>Add Package</span>
                                        </button>
                                    </Link>
                                </div>

                                {active === 'all' && (
                                    all.length > 0 && all.some(item => item.InventoryName.toLowerCase().includes(searchQuery.toLowerCase())) ? (
                                        all
                                            .filter(item => item.InventoryName.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map((item, index) => (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 1 }}
                                                    className='item'
                                                    key={index}
                                                >
                                                    <div className='left' style={{ width: '84%' }}>
                                                        <img
                                                            style={{ borderRadius: '50%', height: '50px', width: '50px' }}
                                                            src={`https://staging.neardeal.me/api/${item.ImageLocation}`}
                                                            alt="item"
                                                        />
                                                        <div style={{ margin: 'auto 0px' }}>
                                                            <span>{item.InventoryName}</span>
                                                        </div>
                                                    </div>
                                                    <div className='right' style={{ width: '14%', justifyContent: 'space-between' }}>
                                                        <div>
                                                            <div className="toggle-switch">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`toggle-all-${index}`}
                                                                    className="toggle-checkbox"
                                                                    checked={item.Status === '1'}
                                                                    onChange={() => handleToggle(index)}
                                                                />

                                                                <label htmlFor={`toggle-all-${index}`} className="toggle-label"></label>
                                                                <span>{item.Status === '1' ? 'Published' : 'Draft Saved'}</span>
                                                            </div>
                                                        </div>
                                                        <div onClick={() => navigate(`/package/${item.InventoryID}`)}>
                                                            <img width={25} src={edit1} alt="edit" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                    ) : (
                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <td colSpan="5" className="text-center">
                                                        No data available
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )
                                )}



                                {active === 'spa' && (
                                    spa.length > 0 && spa.some(item => item.InventoryName.toLowerCase().includes(searchQuery.toLowerCase())) ? (
                                        spa
                                            .filter(item => item.InventoryName.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map((item, index) => (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 1 }}
                                                    className='item'
                                                    key={index}
                                                >
                                                    <div className='left' style={{ width: '84%' }}>
                                                        <img
                                                            style={{ borderRadius: '50%', height: '50px', width: '50px' }}
                                                            src={`https://staging.neardeal.me/api/${item.ImageLocation}`}
                                                            alt="spa"
                                                        />
                                                        <div style={{ margin: 'auto 0px' }}>
                                                            <span>{item.InventoryName}</span>
                                                        </div>
                                                    </div>
                                                    <div className='right' style={{ width: '14%', justifyContent: 'space-between' }}>
                                                        <div>
                                                            <div className="toggle-switch">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`toggle-all-${index}`}
                                                                    className="toggle-checkbox"
                                                                    checked={item.Status === '1'}
                                                                    onChange={() => handleToggle(index)}
                                                                />

                                                                <label htmlFor={`toggle-spa-${index}`} className="toggle-label"></label>
                                                                <span>{item.Status === '1' ? 'Published' : 'Draft Saved'}</span>
                                                            </div>
                                                        </div>
                                                        <div onClick={() => navigate(`/package/${item.InventoryID}`)}>
                                                            <img width={25} src={edit1} alt="edit" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                    ) : (
                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <td colSpan="5" className="text-center">
                                                        No data available
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )
                                )}

                                {active === 'massage' && (
                                    massage.length > 0 && massage.some(item => item.InventoryName.toLowerCase().includes(searchQuery.toLowerCase())) ? (
                                        massage
                                            .filter(item => item.InventoryName.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map((item, index) => (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 1 }}
                                                    className='item'
                                                    key={index}
                                                >
                                                    <div className='left' style={{ width: '84%' }}>
                                                        <img
                                                            style={{ borderRadius: '50%', height: '50px', width: '50px' }}
                                                            src={`https://staging.neardeal.me/api/${item.ImageLocation}`}
                                                            alt="massage"
                                                        />
                                                        <div style={{ margin: 'auto 0px' }}>
                                                            <span>{item.InventoryName}</span>
                                                        </div>
                                                    </div>
                                                    <div className='right' style={{ width: '14%', justifyContent: 'space-between' }}>
                                                        <div>
                                                            <div className="toggle-switch">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`toggle-all-${index}`}
                                                                    className="toggle-checkbox"
                                                                    checked={item.Status === '1'}
                                                                    onChange={() => handleToggle(index)}
                                                                />

                                                                <label htmlFor={`toggle-massage-${index}`} className="toggle-label"></label>
                                                                <span>{item.Status === '1' ? 'Published' : 'Draft Saved'}</span>
                                                            </div>
                                                        </div>
                                                        <div onClick={() => navigate(`/package/${item.InventoryID}`)}>
                                                            <img width={25} src={edit1} alt="edit" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                    ) : (
                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <td colSpan="5" className="text-center">
                                                        No data available
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )
                                )}

                                {active === 'sauna' && (
                                    sauna.length > 0 && sauna.some(item => item.InventoryName.toLowerCase().includes(searchQuery.toLowerCase())) ? (
                                        sauna
                                            .filter(item => item.InventoryName.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map((item, index) => (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 1 }}
                                                    className='item'
                                                    key={index}
                                                >
                                                    <div className='left' style={{ width: '84%' }}>
                                                        <img
                                                            style={{ borderRadius: '50%', height: '50px', width: '50px' }}
                                                            src={`https://staging.neardeal.me/api/${item.ImageLocation}`}
                                                            alt="spa"
                                                        />
                                                        <div style={{ margin: 'auto 0px' }}>
                                                            <span>{item.InventoryName}</span>
                                                        </div>
                                                    </div>
                                                    <div className='right' style={{ width: '14%', justifyContent: 'space-between' }}>
                                                        <div>
                                                            <div className="toggle-switch">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`toggle-all-${index}`}
                                                                    className="toggle-checkbox"
                                                                    checked={item.Status === '1'}
                                                                    onChange={() => handleToggle(index)}
                                                                />

                                                                <label htmlFor={`toggle-${index}`} className="toggle-label"></label>
                                                                <span>{item.Status === '1' ? 'Published' : 'Draft Saved'}</span>
                                                            </div>
                                                        </div>
                                                        <div onClick={() => navigate(`/package/${item.InventoryID}`)}>
                                                            <img width={25} src={edit1} alt="edit" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                    ) : (
                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <td colSpan="5" className="text-center">
                                                        No data available
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )
                                )}

                                {active === 'gym' && (
                                    gym.length > 0 && gym.some(item => item.InventoryName.toLowerCase().includes(searchQuery.toLowerCase())) ? (
                                        gym
                                            .filter(item => item.InventoryName.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map((item, index) => (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 1 }}
                                                    className='item'
                                                    key={index}
                                                >
                                                    <div className='left' style={{ width: '84%' }}>
                                                        <img
                                                            style={{ borderRadius: '50%', height: '50px', width: '50px' }}
                                                            src={`https://staging.neardeal.me/api/${item.ImageLocation}`}
                                                            alt="gym"
                                                        />
                                                        <div style={{ margin: 'auto 0px' }}>
                                                            <span>{item.InventoryName}</span>
                                                        </div>
                                                    </div>
                                                    <div className='right' style={{ width: '14%', justifyContent: 'space-between' }}>
                                                        <div>
                                                            <div className="toggle-switch">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`toggle-all-${index}`}
                                                                    className="toggle-checkbox"
                                                                    checked={item.Status === '1'}
                                                                    onChange={() => handleToggle(index)}
                                                                />

                                                                <label htmlFor={`toggle-gym-${index}`} className="toggle-label"></label>
                                                                <span>{item.Status === '1' ? 'Published' : 'Draft Saved'}</span>
                                                            </div>
                                                        </div>
                                                        <div onClick={() => navigate(`/package/${item.InventoryID}`)}>
                                                            <img width={25} src={edit1} alt="edit" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                    ) : (
                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <td colSpan="5" className="text-center">
                                                        No data available
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )
                                )}
                            </div>
                        </div>

                    </div>

                </div>
            </motion.div>


        </div>
    );
};

export default CreatePackage;
