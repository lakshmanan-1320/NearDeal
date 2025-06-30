import { useCallback, useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import SideBar from "./SideBar";
import background from "../assets/background.svg";
import leftArrow from "../assets/leftArrow.svg";
import product from "../assets/product.svg";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../Redux/Api/apiConfig";

const EditDiscount = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const jwtUserToken = Cookies.get("user_token");
  const userData = JSON.parse(jwtUserToken);
  const [active, setActive] = useState("setup");
  const isActive = (path) => (active === path ? "btn" : "");
  const [isChecked, setIsChecked] = useState(false);
  const [packageTitle, setPackageTitle] = useState("");
  const [inventory, setInventory] = useState([]);
  const [selectedIds, setSelectedIds] = useState("");
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editorStates, setEditorStates] = useState({
    discount: { content: "", operations: [] },
    unit: { content: "", operations: [] },
    Status: { content: "", operations: [] },
  });
  const quillRefs = useRef({ included: null, openingHours: null, tnc: null });

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userDataa = JSON.parse(jwtUserToken);
    try {
      const payload = {
        couponCode: id,
        couponType: "DISCOUNT",
      };
      console.log(payload);
      const response = await fetch(
        `${BASE_URL}fetchCouponDetails.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const userData = await response.json();
      console.log("dsidsidisdhisdhsid", userData);
      setInventoryData(userData.message[0]); // Assuming the data is an array
      setLoading(false);
      console.log(userData);
      return;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inventoryData) {
      setPackageTitle(inventoryData.CouponTitle);
      console.log(inventoryData.Status, "..................")
      setIsChecked(
        inventoryData.Status === true ||
        inventoryData.Status === 1 ||
        inventoryData.Status === "1" ||
        inventoryData.Status === "true"
      );
      setSelectedIds(inventoryData.InventoryID);
      setEditorStates((prev) => ({
        ...prev,
        discount: { content: inventoryData.Discount || "", operations: [] },
        unit: { content: inventoryData.Unit || "", operations: [] },
        Status: { content: inventoryData.Status || "", operations: [] },
      }));
    }
  }, [inventoryData]);

  const updateEditorState = useCallback(
    (editorKey, delta, oldDelta, source) => {
      setEditorStates((prevStates) => {
        const updatedOperations = [
          ...prevStates[editorKey].operations,
          { delta, oldDelta, source },
        ];
        return {
          ...prevStates,
          [editorKey]: {
            ...prevStates[editorKey],
            operations: updatedOperations,
          },
        };
      });
    },
    []
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "packageTitle":
        setPackageTitle(value);
        break;

      case "url":
        setUrl(value);
        break;
      case "duration":
        setDuration(value);
        break;
      default:
        break;
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) => {
      const currentIds = prev.split(",").filter(Boolean); // Split and filter empty values
      if (currentIds.includes(id)) {
        // If already selected, remove it
        return currentIds.filter((item) => item !== id).join(",");
      } else {
        // If not selected, add it
        return [...currentIds, id].join(",");
      }
    });
  };

  const fetchInventory = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}invListingMW.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendorId: userData.ID,
            invCat: "All",
            fetchType: "List",
          }),
        }
      );

      const data = await response.json();
      setInventory(data.data);
      console.log("IdsdsIJdisdishdishdishids", data.data);
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSaveChanges = async () => {
    // Trim title to remove extra spaces
    if (!packageTitle.trim()) {
      toast.error("Title is required.");
      return;
    }

    // Validate discount amount (should be a positive number)
    const discountValue = Number(editorStates.discount.content);
    if (isNaN(discountValue) || discountValue <= 0) {
      toast.error("Discount must be a valid positive number.");
      return;
    }

    // Allow only "$" or "%" as discount unit
    const validUnits = ["$", "%"];
    if (!validUnits.includes(editorStates.unit.content)) {
      toast.error("Invalid discount unit. Please select $ or %.");
      return;
    }
    // Ensure at least one product is selected
    if (!selectedIds || selectedIds.length === 0) {
      toast.error("Please select at least one product.");
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}updateCouponsMW.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendorId: userData.ID,
            title: packageTitle,
            startDate: "",
            endDate: "",
            discount: editorStates.discount.content,
            unit: editorStates.unit.content,

            whatsIncluded: "",
            tnc: "",
            status: isChecked,
            inventoryIds: selectedIds,
            couponCode: inventoryData.CouponCode,
            couponType: "Discount",
            currency: "",
          }),
        }
      );

      console.log(
        JSON.stringify({
          vendorId: userData.ID,
          title: packageTitle,
          startDate: "",
          endDate: "",
          discount: editorStates.discount.content,
          unit: editorStates.unit.content,
          whatsIncluded: "",
          tnc: "",
          status: isChecked,
          inventoryIds: selectedIds,
          couponCode: inventoryData.CouponCode,
          couponType: "Discount",
          currency: "",
        })
      );

      const data = await response.json();
      console.log(data);
      toast.success("Discount Updated Successfully");
      navigate("/campaign?tab=discounts");

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (

    <div style={{ display: "flex" }}>

      <SideBar />
      <img
        style={{ position: "absolute", top: 0, zIndex: "-1", width: "100%" }}
        src={background}
        alt="background"
      />
      <div className="create-package" style={{ width: "80%" }}>
        <span className="heading">
          <Link to="/campaign?tab=discounts">
            <img src={leftArrow} alt="left arrow" />
          </Link>{" "}
          Create Discount
        </span>
        {loading ? (
          <div style={{ marginTop: "20px" }}> Loading...</div>

        ) :
          (<div>
            <div className="left">
              <button
                className={`${isActive(
                  "setup"
                )} btn-outline-secondary border-0 active me-2`}
                onClick={() => setActive("setup")}
                style={{ textDecoration: "none" }}
              >
                Coupon Setup
              </button>
              <button
                className={`${isActive(
                  "availability"
                )} btn-outline-secondary border-0 active me-2`}
                style={{ textDecoration: "none" }}
              >
                Analytics (Soon)
              </button>
            </div>

            {active === "setup" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="right"
              >
                <div className="header">
                  <div
                    className="left"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <div className="toggle-switch">
                      <input
                        type="checkbox"
                        id="toggle"
                        className="toggle-checkbox"
                        checked={isChecked}
                        onChange={handleToggle}
                      />
                      <label htmlFor="toggle" className="toggle-label"></label>
                    </div>
                    <span>Publish</span>
                  </div>

                  <div className="right">
                    <button className="button" onClick={handleSaveChanges}>
                      Save Changes
                    </button>
                  </div>
                </div>
                <div className="body">
                  <input
                    name="packageTitle"
                    className="package-title"
                    type="text"
                    placeholder="Discount Title"
                    value={packageTitle}
                    onChange={handleInputChange}
                  />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    style={{ flexDirection: "column", margin: "20px 0px" }}
                  >
                    <div className="grey mt-2">Discount Amount</div>
                    <input
                      type="number"
                      value={editorStates.discount.content}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Only allow positive integers
                        if (/^\d*$/.test(value)) {
                          setEditorStates((prevStates) => ({
                            ...prevStates,
                            discount: {
                              content: value,
                              operations: prevStates.discount.operations,
                            },
                          }));
                          updateEditorState("discount", value, null, "user");
                        }
                      }}
                      style={{ width: "5rem" }}
                      className="text-area px-2  text-center number-arrow-hidden"
                      placeholder="type"
                      ref={(el) => {
                        if (el) {
                          quillRefs.current.discount = el; // No need for getEditor, just referencing the input element
                        }
                      }}
                    />

                    <div className="grey mt-2">Discount Unit</div>
                    <div className="discount-unit-options">
                      <div className="flex flex-column mb-1">
                      <label style={{marginRight:"20px",marginTop:"10px"}}>
                          <input
                            type="radio"
                            name="unit"
                            value="$"
                            checked={editorStates.unit.content === "$"}
                            onChange={(e) => {
                              setEditorStates((prevStates) => ({
                                ...prevStates,
                                unit: {
                                  content: e.target.value,
                                  operations: prevStates.unit.operations,
                                },
                              }));
                              updateEditorState(
                                "unit",
                                e.target.value,
                                null,
                                "user"
                              );
                            }}
                          />{" "}
                          $
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="unit"
                            value="%"
                            checked={editorStates.unit.content === "%"}
                            onChange={(e) => {
                              setEditorStates((prevStates) => ({
                                ...prevStates,
                                unit: {
                                  content: e.target.value,
                                  operations: prevStates.unit.operations,
                                },
                              }));
                              updateEditorState(
                                "unit",
                                e.target.value,
                                null,
                                "user"
                              );
                            }}
                          />{" "}
                          %
                        </label>
                      </div>
                    </div>

                    {/* Product Table */}
                    <div className="product-table-wrapper">
                      <table className="table table-hover product-table">
                        <thead>
                          <tr>
                            <th scope="col"></th>
                            <th scope="col">Product</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inventory.map((data) => (
                            <tr key={data.ID}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={selectedIds.split(",").includes(data.InventoryID)}
                                  onChange={() => handleCheckboxChange(data.InventoryID)}
                                />
                              </td>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "start",
                                  }}
                                >
                                  <img
                                    src={product}
                                    alt="product"
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      objectFit: "cover",
                                      borderRadius: "4px",
                                    }}
                                  />
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      paddingLeft: "15px",
                                    }}
                                  >
                                    <span>{data.InventoryName}</span>
                                    <span className="grey">$ {data.Price}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
          )}
      </div>
    </div>
  );
};

export default EditDiscount;
