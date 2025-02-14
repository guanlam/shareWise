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

function Category({ transaction , setTransaction ,selectedCategory ,setSelectedCategory  }) {
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [colorValue, setColorValue] = useState("#1c312c");
  const [selectedIcon, setSelectedIcon] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [transaction.type]);

  const fetchCategories = () => {
    setLoading(true);
    axiosClient.get(`/categories?type=${transaction.type}`)
      .then((res) => {
        setAllCategories(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSettingsClick = () => {
    setShowPopUp(true);
  };

  const closePopUp = () => {
    setShowPopUp(false);
    setCategoryName("");
    setSelectedIcon(null);
    setColorValue("#1c312c");
  };

  const handleIconChange = (selectedOption) => {
    setSelectedIcon(selectedOption);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!categoryName || !selectedIcon) {
      alert("Please fill all required fields.");
      return;
    }

    const newCategory = {
      name: categoryName,
      icon: selectedIcon.value,
      color: colorValue,
      type: transaction.type, // Include transaction type
    };

    axiosClient
      .post("/categories", newCategory)
      .then((res) => {
        console.log(res);
        fetchCategories(); // Refresh category list after adding
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
                className={`border all-center gap-4 px-4 py-2 rounded-xl text-center cursor-pointer 
                  ${selectedCategory?.id === category.id ? "border-dark-green" : "border-gray-300"}`}
                onClick={() => {setSelectedCategory(category)
                  setTransaction((prev => (
                    {
                      ...prev, 
                      category_id: category.id
                    }
                  )))
                }}
              >
                <div
                  className="rounded-xl p-2 text-white"
                  style={{ backgroundColor: category.color }}
                >
                  {React.createElement(iconMappings[category.icon])}
                </div>
                <p className="text-small flex-1">{category.name}</p>
              </div>
            ))}


            </div>
          </section>
        )}
        {showPopUp && (
          <PopUp title="Create Category" onClose={closePopUp}>
            <form className="popUp-form flex flex-col gap-4 h-full justify-between" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-small text-[#798f86]">
                    Category Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter Category Name" 
                    className="p-2"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
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
