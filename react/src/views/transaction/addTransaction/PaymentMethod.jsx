import React, { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import axiosClient from "../../axios-client";
import iconMappings from "../../icon-mappings"; // Import your icon mapping
import iconList from "../../icon-all-py";
import LoadingEffect from "../../components/LoadingEffect";
import PopUp from "../../components/PopUp";
import CustomButton from "../../components/CustomButton";
import { MuiColorInput } from "mui-color-input";
import Select from "react-select";

function PaymentMethod() {
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPopUp, setShowPopUp] = useState(false);

    useEffect(() => {
        axiosClient
            .get(`/payment-methods`)
            .then((res) => {
                setAllCategories(res.data);
                setLoading(false);
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSettingsClick = () => {
        setShowPopUp(true); // Show the PopUp
    };

    const closePopUp = () => {
        setShowPopUp(false); // Close the PopUp
    };

    const [colorValue, setColorValue] = useState("#1c312c");

    const handleChange = (newValue) => {
        setColorValue(newValue);
    };

    const [selectedIcon, setSelectedIcon] = useState(null); // Holds the selected icon value

    // Convert iconList to an array of options for the dropdown
    const iconOptions = Object.keys(iconList).map((iconName) => ({
        label: (
            <div className="all-center">
                {React.createElement(iconList[iconName], { fontSize: "large" })}
            </div>
        ),
        value: iconName, // value will be the icon name
    }));

    const handleIconChange = (selectedOption) => {
        setSelectedIcon(selectedOption);
    };

    // Custom SingleValue component to show the icon on the left
    const customSingleValue = ({ data }) => {
        const IconComponent = iconList[data.value];
        return (
            <div
                className="size-[2.5rem] all-center mt-[-1.5rem] rounded-xl text-white"
                style={{ backgroundColor: colorValue }}
            >
                <IconComponent fontSize="medium" />{" "}
                {/* Adjust size as needed */}
            </div>
        );
    };

    // Custom styles to remove the border and background
    const customStyles = {
        control: (provided) => ({
            ...provided,
            border: "none", // Remove the border around the input field
            boxShadow: "none", // Remove any box shadow
            background: "none", // Make the background transparent
            "&:hover": {
                border: "none", // Ensure border stays removed when hovered
            },
        }),
        menu: (provided) => ({
            ...provided,
            border: "none", // Remove border from the dropdown list

            borderRadius: "8px", // Optional: adjust the radius of the dropdown
        }),
        menuList: (provided) => ({
            ...provided,
            padding: "0", // Optional: remove padding inside the dropdown list
        }),
        option: (provided) => ({
            ...provided,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            "&:hover": {
                background: "#f0f0f0", // Optional: add hover effect for the options
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            background: "none", // Make the background transparent for the selected value
        }),
    };

    return (
        <>
            <div className="bg-light-cyan rounded-xl p-6 size-full flex flex-col justify-between">
                {loading ? (
                    <LoadingEffect />
                ) : (
                    <section className="space-y-4 size-full flex flex-col">
                        <div className="flex justify-between items-center">
                            <h2 className="text-medium font-semibold">
                                Payment Method
                            </h2>

                            <div className="cursor-pointer">
                                <AddIcon
                                    fontSize="large"
                                    onClick={handleSettingsClick}
                                />
                            </div>
                        </div>

                        {/* Scrollable Category List */}
                        <div className="grid grid-cols-2 gap-8 max-h-[45vh] overflow-auto scrollbar-thin scrollbar-thumb-dark-green scrollbar-track-slate-50 pr-2">
                            {allCategories.map((category) => (
                                <div
                                    key={category.id}
                                    className="border border-gray-300 all-center gap-4 px-4 py-2 rounded-xl text-center "
                                >
                                    <div className="bg-amber-300 rounded-xl p-2 text-white ">
                                        {(() => {
                                            // Look up the icon component using the icon name from the category.
                                            const IconComponent =
                                                iconMappings[category.icon];
                                            return <IconComponent />;
                                        })()}
                                    </div>
                                    <p className="text-small flex-1">
                                        {category.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {/* Conditionally render the PopUp */}
                {showPopUp && (
                    <PopUp title="Create Payment Method" onClose={closePopUp}>
                        <form className="popUp-form flex flex-col gap-4 h-full justify-between">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-small text-[#798f86]">
                                        Payment Method Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter Payment Method Name"
                                        className="p-2"
                                    />
                                </div>
                                <div className="w-full h-[1px] bg-[#adccbd]"></div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-small text-[#798f86]">
                                        Payment Method Icon
                                    </label>

                                    <Select
                                        options={iconOptions}
                                        onChange={handleIconChange}
                                        getOptionLabel={(e) => e.label} // Use the label from the options array
                                        className="w-full"
                                        placeholder="Choose icon"
                                        value={selectedIcon}
                                        isSearchable={false} // Optional: Disable search for the icons
                                        components={{
                                            IndicatorSeparator: () => null, // Optional: remove the default separator
                                            MenuList: (props) => (
                                                <div
                                                    {...props.innerProps}
                                                    className="grid grid-cols-4 sm:grid-cols-6"
                                                >
                                                    {props.children}
                                                </div>
                                            ),
                                            SingleValue: customSingleValue,
                                        }}
                                        styles={customStyles} // Apply custom styles to remove border
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
                                        onChange={handleChange}
                                        sx={{
                                            "& .MuiInputBase-root": {
                                                border: "none", // Remove border
                                                
                                            },
                                            "& .MuiOutlinedInput-notchedOutline":
                                                {
                                                    border: "none", // Remove outline
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
