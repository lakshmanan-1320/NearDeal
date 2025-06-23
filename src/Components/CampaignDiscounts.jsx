import { useState, useEffect } from "react";
import eye1 from "../assets/eye1.svg";
import likes from "../assets/likes.svg";
import edit1 from "../assets/edit1.svg";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const CampaignDiscounts = ({ searchQuery }) => {
  const navigate = useNavigate();
  const jwtUserToken = Cookies.get("user_token");
  const userData = jwtUserToken ? JSON.parse(jwtUserToken) : null;
  const [discountData, setDiscountData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDiscount = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://wellness.neardeal.me/WAPI/fetchCouponsMW.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendorId: userData?.ID,
            couponType: "Discount",
          }),
        }
      );
      const data = await response.json();
      setDiscountData(data.message || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      loadDiscount();
    }
  }, []);

  const handleToggle = async (index, discount) => {
    const updatedDiscounts = [...discountData];
    updatedDiscounts[index].Status = discount.Status === "1" ? "0" : "1";
    setDiscountData(updatedDiscounts);

    try {
      const response = await fetch(
        "https://wellness.neardeal.me/WAPI/updateCouponStatus.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            couponId: discount.CouponCode, // Assuming CouponCode is unique
            newStatus: updatedDiscounts[index].Status,
          }),
        }
      );
      const result = await response.json();
      console.log("Update response:", result);
    } catch (error) {
      console.error("Error updating discount status:", error);
    }
  };

  const filteredDiscounts = discountData.filter(ad =>
    ad.CouponTitle.toLowerCase().includes(searchQuery.toLowerCase())
);


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
      ) :filteredDiscounts.length === 0 ? (
        <table className="table">
          <tbody>
            <tr>
              <td colSpan="5" className="text-center">
              No data available add discounts
              </td>
            </tr>
          </tbody>
        </table>
      ): (
        filteredDiscounts.map((discount, index) => (
          <div className="item" key={index}>
            <div className="left" style={{ width: "84%", padding: "10px" }}>
              <span style={{ color: "#00A76F" }}>{discount.CouponTitle}</span>
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
                    checked={discount.Status === "1"}
                    onChange={() => handleToggle(index, discount)}
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
                  onClick={() => navigate(`/discount/${discount.CouponCode}`)}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </motion.div>
  );
};

export default CampaignDiscounts;
