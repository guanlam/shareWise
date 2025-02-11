import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import axiosClient from "../../axios-client";
import iconMappings from "../../icon-mappings";
import LoadingEffect from "../../components/LoadingEffect";
import PopUp from "../../components/PopUp";
import CustomButton from "../../components/CustomButton";
import { MuiColorInput } from "mui-color-input";
import IconSelect from "./icon/IconSelect";
import iconList from "../../icon-all-py"; // Payment method icon mapping

function PaymentMethod() {
  const [allPaymentMethods, setAllPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false);

  const [paymentMethodName, setPaymentMethodName] = useState("");
  const [colorValue, setColorValue] = useState("#1c312c");
  const [selectedIcon, setSelectedIcon] = useState(null);


  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = () => {
    setLoading(true);
    axiosClient
      .get(`/payment-methods`)
      .then((res) => {
        setAllPaymentMethods(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSettingsClick = () => {
    setShowPopUp(true);
  };

  const closePopUp = () => {
    setShowPopUp(false);
    setPaymentMethodName("");
    setSelectedIcon(null);
    setColorValue("#1c312c");
  };

  const handleIconChange = (selectedOption) => {
    setSelectedIcon(selectedOption);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!paymentMethodName || !selectedIcon) {
      alert("Please fill all required fields.");
      return;
    }

    const newPaymentMethod = {
      name: paymentMethodName,
      icon: selectedIcon.value,
      color: colorValue,
    };

    axiosClient
      .post("/payment-methods", newPaymentMethod)
      .then((res) => {
        // After successfully adding the payment method, refetch all payment methods
        console.log(res);
        fetchPaymentMethods(); // This will update the state with the latest data
        closePopUp();
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="bg-light-cyan rounded-xl p-6 size-full flex flex-col justify-between">
        {loading ? (
          <LoadingEffect />
        ) : (
          <section className="space-y-4 size-full flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="text-medium font-semibold">Payment Method</h2>
              <div className="cursor-pointer">
                <AddIcon fontSize="large" onClick={handleSettingsClick} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 max-h-[45vh] overflow-auto scrollbar-thin scrollbar-thumb-dark-green scrollbar-track-slate-50 pr-2">
              {allPaymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className="border border-gray-300 all-center gap-4 px-4 py-2 rounded-xl text-center"
                >
                  <div
                    className="rounded-xl p-2 text-white"
                    style={{ backgroundColor: pm.color }}
                  >
                    {(() => {
                      const IconComponent = iconMappings[pm.icon];
                      return <IconComponent />;
                    })()}
                  </div>
                  <p className="text-small flex-1">{pm.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {showPopUp && (
          <PopUp title="Create Payment Method" onClose={closePopUp}>
            <form className="popUp-form flex flex-col gap-4 h-full justify-between" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-small text-[#798f86]">
                    Payment Method Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Payment Method Name"
                    className="p-2"
                    value={paymentMethodName}
                    onChange={(e) => setPaymentMethodName(e.target.value)}
                  />
                </div>
                <div className="w-full h-[1px] bg-[#adccbd]"></div>

                <div className="flex flex-col gap-2">
                  <label className="text-small text-[#798f86]">
                    Payment Method Icon
                  </label>
                  <IconSelect
                    value={selectedIcon}
                    onChange={handleIconChange}
                    color={colorValue}
                    placeholder="Choose icon"
                    iconList={iconList}
                  />
                </div>
                <div className="w-full h-[1px] bg-[#adccbd]"></div>

                <div className="flex flex-col gap-2">
                  <label className="text-small text-[#798f86]">
                    Payment Method Color
                  </label>
                  <MuiColorInput
                    format="hex"
                    value={colorValue}
                    onChange={setColorValue}
                    sx={{
                      "& .MuiInputBase-root": {
                        border: "none",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  />
                </div>
                <div className="w-full h-[1px] bg-[#adccbd]"></div>
              </div>
              <div className="text-right">
                <CustomButton
                  type="submit"
                  className="bg-dark-green text-white"
                  text="Confirm"
                />
              </div>
            </form>
          </PopUp>
        )}
      </div>
    </>
  );
}

export default PaymentMethod;
