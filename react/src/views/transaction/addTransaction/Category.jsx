import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import axiosClient from '../../axios-client';
import LoadingEffect from "../../components/LoadingEffect";
import PopUp from "../../components/PopUp";
import CustomButton from "../../components/CustomButton";
import { MuiColorInput } from "mui-color-input";
import iconMappings from "../../icon-mappings"; // For rendering icons in the list
import IconSelect from "./icon/IconSelect"; // Reusable IconSelect
import iconList from "../../icon-all-category"; // Icon mapping for categories

function Category({ transaction }) {
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false);

  useEffect(() => {
    axiosClient.get(`/categories?type=${transaction.type}`)
      .then((res) => {
        setAllCategories(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [transaction.type]);

  const handleSettingsClick = () => {
    setShowPopUp(true);
  };

  const closePopUp = () => {
    setShowPopUp(false);
  };

  const [colorValue, setColorValue] = useState("#1c312c");
  const handleChange = (newValue) => {
    setColorValue(newValue);
  };

  const [selectedIcon, setSelectedIcon] = useState(null);

  // Generate icon options using the imported iconList (for categories)
  // The iconOptions are generated within the IconSelect component.
  
  const handleIconChange = (selectedOption) => {
    setSelectedIcon(selectedOption);
  };

  return (
    <>
      <div className="bg-light-cyan rounded-xl p-6 size-full flex flex-col justify-between">
        {loading ? (
          <LoadingEffect/>
        ) : (
          <section className='space-y-4 size-full flex flex-col'>
            <div className="flex justify-between items-center">
              <h2 className='text-medium font-semibold'>Category</h2>
              <div className='cursor-pointer'>
                <AddIcon fontSize="large" onClick={handleSettingsClick} />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-8 max-h-[45vh] overflow-auto scrollbar-thin scrollbar-thumb-dark-green scrollbar-track-slate-50 pr-2'>
              {allCategories.map((category) => (
                <div
                  key={category.id}
                  className='border border-gray-300 all-center gap-4 px-4 py-2 rounded-xl text-center '
                >
                  <div className='bg-amber-300 rounded-xl p-2 text-white' style={{ backgroundColor: category.color }}>
                    {(() => {
                      const IconComponent = iconMappings[category.icon];
                      return <IconComponent />;
                    })()}
                  </div>
                  <p className='text-small flex-1'>
                    {category.name}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
        {showPopUp && (
          <PopUp title="Create Category" onClose={closePopUp}>
            <form className="popUp-form flex flex-col gap-4 h-full justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-small text-[#798f86]">
                    Category Name
                  </label>
                  <input type="text" placeholder="Enter Category Name" className="p-2" />
                </div>
                <div className="w-full h-[1px] bg-[#adccbd]"></div>
                <div className="flex flex-col gap-2">
                  <label className="text-small text-[#798f86]">
                    Category Icon
                  </label>
                  <IconSelect
                    value={selectedIcon}
                    onChange={handleIconChange}
                    color={colorValue}
                    placeholder="Choose icon"
                    iconList={iconList} // Pass category icon mapping here
                  />
                </div>
                <div className="w-full h-[1px] bg-[#adccbd]"></div>
                <div className="flex flex-col gap-2">
                  <label className="text-small text-[#798f86]">
                    Category Color
                  </label>
                  <MuiColorInput
                    format="hex"
                    value={colorValue}
                    onChange={handleChange}
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
                <CustomButton type="submit" className="bg-dark-green text-white" text="Confirm" />
              </div>
            </form>
          </PopUp>
        )}
      </div>
    </>
  );
}

export default Category;
