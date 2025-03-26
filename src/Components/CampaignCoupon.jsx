import { useState, useEffect } from "react";
import eye1 from "../assets/eye1.svg";
import likes from "../assets/likes.svg";
import edit1 from "../assets/edit1.svg";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const CampaignCoupon = () => {
  const navigate = useNavigate();
  const jwtUserToken = Cookies.get("user_token");
  const userData = jwtUserToken ? JSON.parse(jwtUserToken) : null;
  const [couponData, setCouponData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCoupon = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://staging.neardeal.me/api/fetchCouponsMW.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendorId: userData?.ID,
            couponType: "Coupon",
          }),
        }
      );

      const data = await response.json();
      setCouponData(data.message || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      loadCoupon();
    }
  }, []);

  const handleToggle = async (index, coupon) => {
    const updatedCoupons = [...couponData];
    updatedCoupons[index].Status = coupon.Status === "1" ? "0" : "1"; // Toggle Status
    setCouponData(updatedCoupons);

    try {
      const response = await fetch(
        "https://staging.neardeal.me/api/updateCouponStatus.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            couponId: coupon.CouponCode, // Assuming CouponCode is unique
            newStatus: updatedCoupons[index].Status,
          }),
        }
      );
      const result = await response.json();
      console.log("Update response:", result);
    } catch (error) {
      console.error("Error updating coupon status:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{ overflowY: "auto", height: "60vh" }}
    >
      {loading ? (
        "Loading..."
      ) : (
        couponData.map((coupon, index) => (
          <div className="item" key={index}>
            <div className="left" style={{ width: "84%", padding: "10px" }}>
              <span style={{ color: "#00A76F" }}>{coupon.CouponTitle}</span>
            </div>
            <div
              className="right"
              style={{ width: "15%", justifyContent: "space-between" }}
            >
              <div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    id={`toggle-${index}`}
                    className="toggle-checkbox"
                    checked={coupon.Status === "1"}
                    onChange={() => handleToggle(index, coupon)}
                  />
                  <label htmlFor={`toggle-${index}`} className="toggle-label"></label>
                </div>
                <span>Publish</span>
              </div>
              <div>
                <img
                  width={25}
                  src={edit1}
                  alt="Edit"
                  onClick={() => navigate(`/coupon/${coupon.CouponCode}`)}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </motion.div>
  );
};

export default CampaignCoupon;
