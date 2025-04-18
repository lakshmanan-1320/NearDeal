import { useState, useEffect } from 'react'
import edit from "../assets/edit.svg";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const CampaignAds = ({ searchQuery }) => {
    const navigate = useNavigate();
    const jwtUserToken = Cookies.get("user_token");
    const userData = JSON.parse(jwtUserToken);
    const [isChecked, setIsChecked] = useState(false);
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleToggle = () => {
        setIsChecked(!isChecked);
        console.log('Toggle state:', !isChecked);
    };

    useEffect(() => {
        fetchAd();
    }, []); // Empty dependency array to run only on mount

    const fetchAd = async () => {
        try {
            const response = await fetch(
                "https://staging.neardeal.me/api/merchantAdsListingMW.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        vendorID: userData.ID,
                        camFilter: "ad",
                    }),
                }
            );

            const data = await response.json();
            // setNearreel(data.message);
            console.log("Coupon data:", data);
            setAds(data.message);
            setLoading(false);

        } catch (error) {
            console.error("Fetch error:", error);
            setLoading(false);

        }
    };
    const filteredAds = ads.filter(ad =>
        ad.CampaignName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}>
            {loading ? (
                "Loading..."
            ) : filteredAds.length === 0 ? (
                <table className="table">
                    <tbody>
                        <tr>
                            <td colSpan="5" className="text-center">
                                No data available add Ads
                            </td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                filteredAds.map((item, index) => (
                    <div
                        key={index}
                        style={{ padding: "10px 20px", marginBottom: "10px" }}
                        className="campaign-ads"
                    >
                        <div>
                            <img
                                style={{ borderRadius: '50%', height: '50px', width: '50px' }}
                                src={`https://staging.neardeal.me/api/${item.ContentLocation}`}
                                alt="item"
                            />
                            <span style={{marginLeft:"5px"}}>{item.CampaignName}</span>
                            {/* <span style={{ fontSize: "14px" }} className="grey">
                                Total Cost: $100
                            </span> */}
                        </div>
                        <div className="edit">
                            <Link to={`/campaign/ads/${item.CampaignID}`}>
                                <img src={edit} alt="Edit" />
                            </Link>
                        </div>
                    </div>
                ))
            )}
        </motion.div>

    )
}

export default CampaignAds