import { useEffect, useState } from 'react';
import edit1 from '../assets/edit1.svg';
import eye from '../assets/eye.svg';
import share from '../assets/share.svg';
import eye1 from '../assets/eye1.svg';
import likes from '../assets/likes.svg';
import { motion } from 'framer-motion';
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { BASE_URL } from '../Redux/Api/apiConfig';

const CampaignNearReel = ({ searchQuery }) => {
    const jwtUserToken = Cookies.get("user_token");
    const userData = JSON.parse(jwtUserToken);
    const [isChecked, setIsChecked] = useState(false);
    const [nearreel, setNearreel] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleToggle = () => {
        setIsChecked(!isChecked);
        console.log('Toggle state:', !isChecked);
    };

    useEffect(() => {
        fetchNearReel();
    }, []);

    const fetchNearReel = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}merchantAdsListingMW.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        vendorID: userData.ID,
                        camFilter: "nearreel",
                    }),
                }
            );

            const data = await response.json();
            setNearreel(data.message);
            setLoading(false);

            console.log("Coupon data:", data);
        } catch (error) {
            console.error("Fetch error:", error);
            setLoading(false);

        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            const response = await fetch(
                `${BASE_URL}deleteNearReelMW.php`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ campaignID: deleteId }),
                }
            );

            const data = await response.json();
            toast.success("NearReel Deleted Successfully");
            setShowConfirm(false);
            setDeleteId(null);
            fetchNearReel();
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to delete");
        }
    };

    const cancelDelete = () => {
        setShowConfirm(false);
        setDeleteId(null);
    };
    const filteredNearreel = nearreel.filter(ad =>
        ad.CampaignName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            <div className='campaign-nearreel' style={{ background: 'none' }}>
            {loading ? (
                "Loading..."
            ) : 
                    filteredNearreel.length === 0 ?
                        'No NearReel Campaigns Available'
                        :
                        filteredNearreel.map((data) => (
                            <div key={data.CampaignID} className='item' style={{ justifyContent: 'space-between', marginBottom: '10px' }}>
                                <div className='left' style={{ width: '84%' }}>
                                    <video
                                        src={`${BASE_URL}${data.ContentLocation}`}
                                        controls
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            overflow: 'hidden',
                                            marginRight: '20px'
                                        }}
                                    />
                                    <div>
                                        <span style={{marginTop:"15px"}}>{data.CampaignName}</span>
                                        {/* <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                                            <div><img src={eye1} alt="views" /><span style={{ color: 'grey', marginLeft: '5px' }}>1000 views</span></div>
                                            <div style={{ marginLeft: '10px' }}><img src={likes} alt="likes" /><span style={{ color: 'grey', marginLeft: '5px' }}>1000 likes</span></div>
                                        </div> */}
                                    </div>
                                </div>
                                <div className='right' style={{ width: '5%', justifyContent: 'space-between' }}>
                                    <div>
                                        <i
                                            style={{ fontSize: '20px', color: 'red', cursor: 'pointer' }}
                                            onClick={() => handleDeleteClick(data.CampaignID)}
                                            className="bi bi-trash3-fill"
                                        ></i>
                                    </div>
                                </div>
                            </div>
                        ))
                }

                {/* Delete confirmation modal */}
                {showConfirm && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div style={{
                            background: '#fff', padding: '20px', borderRadius: '8px',
                            minWidth: '300px', textAlign: 'center', boxShadow: '0 0 10px rgba(0,0,0,0.3)'
                        }}>
                            <p>Are you sure you want to delete this Reel?</p>
                            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                                <button onClick={confirmDelete} style={{ background: 'red', color: 'white', padding: '5px 15px', border: 'none', borderRadius: '5px' }}>Delete</button>
                                <button onClick={cancelDelete} style={{ background: 'gray', color: 'white', padding: '5px 15px', border: 'none', borderRadius: '5px' }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CampaignNearReel;
