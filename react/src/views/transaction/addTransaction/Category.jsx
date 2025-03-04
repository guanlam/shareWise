import React, { useState, useEffect, useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import axiosClient from '../../axios-client';
import LoadingEffect from "../../components/LoadingEffect";
import PopUp from "../../components/PopUp";
import CustomButton from "../../components/CustomButton";
import { MuiColorInput } from "mui-color-input";
import iconMappings from "../../icon-mappings"; // For rendering icons in the list
import IconSelect from "./icon/IconSelect"; // Reusable IconSelect
import iconList from "../../icon-all-category"; // Icon mapping for categories
import SettingsIcon from '@mui/icons-material/Settings';
import MoreVertIcon from "@mui/icons-material/MoreVert";


function DropdownOptions({ categoryId, onDelete, onEdit }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // You can call a callback to close this dropdown if needed.
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="absolute right-5 top-0 bg-white z-20 border rounded-md shadow-lg text-small">
      <div className="absolute right-[-9px] top-[4px] border-x-8 border-x-transparent border-b-8 border-b-white rotate-90"></div>
      <button className="block px-3 py-1 hover:bg-gray-100 w-full" onClick={() => onEdit(categoryId)}>
        Edit
      </button>
      <button className="block px-3 py-1 hover:bg-gray-100 w-full" onClick={() => onDelete(categoryId)}>
        Delete
      </button>
    </div>
  );
}



function Category({ transaction , setTransaction ,selectedCategory ,setSelectedCategory  }) {
  
  
  const [allCategories, setAllCategories] = useState([]);
  const [allCustomeCategories, setAllCustomCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false);
  const [showSettingPopUp, setShowSettingPopUp] = useState(false);

  //add
  const [categoryName, setCategoryName] = useState("");
  const [colorValue, setColorValue] = useState("#1c312c");
  const [selectedIcon, setSelectedIcon] = useState(null);

  
  //edit
  const [showEditPopUp, setShowEditPopUp] = useState(false);
  const [editCategory, setEditCategory] = useState(null); // The category being edited


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

  const fetchCustomeCategories = () => {
    axiosClient.get(`/categories/custom/${transaction.type}`)
    .then(res => {
      console.log(res);
      setAllCustomCategories(res.data);
    }).catch(err => {
      console.error(err);
    })
  }

  const handleAddClick = () => {
    setShowPopUp(true);
    setCategoryName('');
    setColorValue("#1c312c");
    setSelectedIcon(null);
  };
  const handleSettingClick = () => {
    setShowSettingPopUp(true);
    fetchCustomeCategories();
    
  }

  

  const [openCategory, setOpenCategory] = useState(null);
  // Toggle function that opens/closes options for a specific category
  const toggleOptions = (categoryId) => {
    // Toggle the state: open the clicked category, or close it if it's already open
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  // // Ref to detect click outside
  // const dropdownRef = useRef(null);
  // // Close the options if clicked outside
  //   useEffect(() => {
  //     const handleClickOutside = (event) => {
  //       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //         setOpenCategory(null); // Close the dropdown
  //       }
  //     };
  
  //     // Add event listener
  //     document.addEventListener("mousedown", handleClickOutside);
  
  //     // Cleanup event listener on unmount
  //     return () => {
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     };
  //   }, []);














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

  //delete category
  const handleDelete = (categoryId) => {
    axiosClient
      .delete(`/categories/${categoryId}`)
      .then((response) => {
        console.log(response);
        fetchCustomeCategories();
        setOpenCategory(null);
        
      })
      .catch((err) => console.error("Error deleting category:", err));

  };

  //edit category
  const handleEdit = (category) => {
    // Set the category to edit
    setEditCategory(category);
    // Prepopulate fields
    setCategoryName(category.name);
    setColorValue(category.color);
    // Assuming selectedIcon is an object with { value, label }:
    setSelectedIcon({ value: category.icon, label: category.icon });
    setShowEditPopUp(true);
    setOpenCategory(null); // Close the dropdown
  };
  
  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    if (!categoryName || !selectedIcon) {
      alert("Please fill all required fields.");
      return;
    }
  
    // Build the updated category payload
    const updatedCategory = {
      name: categoryName,
      icon: selectedIcon.value,
      color: colorValue,
      type: transaction.type,
    };
  
    axiosClient
      .put(`/categories/${editCategory.id}`, updatedCategory)
      .then((res) => {
        console.log("Category updated:", res);
        // Refresh categories if needed:
        fetchCustomeCategories();
        fetchCategories();
        // Close the edit pop-up and reset state
        setShowEditPopUp(false);
        setEditCategory(null);
        setCategoryName("");
        setSelectedIcon(null);
        setColorValue("#1c312c");
      })
      .catch((err) => console.error("Error editing category:", err));
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
              <div className='cursor-pointer space-x-2'>
                <AddIcon fontSize="large" onClick={handleAddClick} />
                <SettingsIcon fontSize="large" onClick={handleSettingClick}/>
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
        {/* add */}
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


        {showSettingPopUp  && (
          <PopUp title="Category Setting" onClose={() => setShowSettingPopUp(false)}>
            <section className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
              {allCustomeCategories.map((category) => (
                <div
                  key={category.id}
                  className='border border-gray-300 all-center gap-4 px-4 py-2 rounded-xl text-center cursor-pointer'  
                >
                  <div
                    className="rounded-xl p-2 text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    {React.createElement(iconMappings[category.icon])}
                  </div>
                  <p className="text-small flex-1">{category.name}</p>


                  <div className="relative cursor-pointer" >
                    <MoreVertIcon fontSize="medium" onClick={() => toggleOptions(category.id)} />
                      {openCategory === category.id && (
                        <DropdownOptions categoryId={category.id} onDelete={handleDelete} onEdit={() => handleEdit(category)} />
                      )}
                    </div>
                </div>
              ))}

            </section>
            

          </PopUp>
        )}



        {showEditPopUp && (
          <PopUp title="Edit Category" onClose={() => { setShowEditPopUp(false); setEditCategory(null); }}>
            <form className="popUp-form flex flex-col gap-4 h-full justify-between" onSubmit={handleEditSubmit}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-small text-[#798f86]">Category Name</label>
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
                  <label className="text-small text-[#798f86]">Category Icon</label>
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
                  <label className="text-small text-[#798f86]">Category Color</label>
                  <MuiColorInput
                    format="hex"
                    value={colorValue}
                    onChange={setColorValue}
                    sx={{
                      "& .MuiInputBase-root": { border: "none" },
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
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
