import React, { useState } from "react";
import { CalendarToday, Repeat, Payment, Calculate } from "@mui/icons-material";
import TransactionInput from "./TransactionInput";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DebitCardIcon from '@mui/icons-material/CreditCard';
import FoodnDrinkIcon from '@mui/icons-material/Fastfood';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RecurrenceIcon from '@mui/icons-material/EventRepeat';
import GroupIcon from '@mui/icons-material/Group';

import SettingsIcon from '@mui/icons-material/Settings';
import Switch from '@mui/material/Switch';
import CustomSwitch from "../../components/CustomSwitch";
import BasicDatePicker from "./BasicDatePicker";



function TransactionDetail({ transaction, setTransaction, setActivePanel }) {
    const [isGroupExpense, setIsGroupExpense] = useState(false);
    const [amount, setAmount] = useState("");

    // Handle switch toggle
    const handleSwitchToggle = (event) => {
      setIsGroupExpense(event.target.checked);
    };

    

    return (
        <div className="p-6 flex flex-col gap-4 size-full">
            <div className="flex items-center justify-between gap-2">
                <h2 className="text-large font-semibold whitespace-nowrap">
                    New Transaction
                </h2>
                <div className="flex gap-4">
                    <button className="bg-dark-green text-white px-4 py-2 rounded-3xl text-small">
                        Expense
                    </button>
                    <button className="bg-white text-black px-4 py-2 rounded-3xl text-small">
                        Income
                    </button>
                </div>
            </div>

            <form action="" className="tran-form css-scrollbar">
                <div className="css-input" onClick={() => setActivePanel("calculator")}>
                    <label className="text-medium font-semibold">RM</label>
                    <input type="text" placeholder="0" className="text-big" value={transaction.amount || amount} onChange={(e)=> setAmount(e.target.value)} />
                </div>
                <div className="w-full h-[2px] bg-black mb-4"></div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="text-small text-[#798f86]"><h5>Category</h5></div>
                        <div className="flex justify-between items-center" onClick={() => setActivePanel("category")}>
                            <div className="flex items-center gap-4">
                                <div className="size-[2.5rem] bg-yellow-400 all-center rounded-xl">
                                    <span className="text-white "><FoodnDrinkIcon /></span>
                                </div>
                                <h3>Food & Drink</h3>
                            </div>
                            <div>
                                <ChevronRightIcon fontSize='large'/>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[1px] bg-[#adccbd]"></div>

                    <div className="flex flex-col gap-2">
                        <div className="text-small text-[#798f86]"><h5>Payment Method</h5></div>
                        <div className="flex justify-between items-center" onClick={() => setActivePanel("paymentMethod")}>
                            <div className="flex items-center gap-4">
                                <div className="size-[2.5rem] bg-slate-500 all-center rounded-xl">
                                    <span className="text-white"><DebitCardIcon /></span>
                                </div>
                                <h3>Debit Card</h3>
                            </div>
                            <div>
                                <ChevronRightIcon fontSize='large'/>
                            </div>
                        </div>
                        
                    </div>
                    <div className="w-full h-[1px] bg-[#adccbd]"></div>

                    <div className="flex flex-col gap-2">
                        <div className="text-small text-[#798f86]"><h5>Date</h5></div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="size-[2.5rem] bg-cyan-500 all-center rounded-xl">
                                    <span className="text-white"><CalendarMonthIcon /></span>
                                </div>
                                <BasicDatePicker/>                                
                                
                                
                            </div>
                            
                        </div>
                    </div>
                    <div className="w-full h-[1px] bg-[#adccbd]"></div>

                    <div className="flex flex-col gap-2">
                        <div className="text-small text-[#798f86]"><h5>Recurrence</h5></div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4 w-full">
                                <div className="size-[2.5rem] bg-teal-500 all-center rounded-xl">
                                    <span className="text-white"><RecurrenceIcon /></span>
                                </div>
                                <select id="recurrence" name="recurrence">
                                    <option value="none">None</option>
                                    <option value="apple">Daily</option>
                                    <option value="banana">Weekly</option>
                                    <option value="orange">Monthly</option>
                                    <option value="grape">Yearly</option>
                                </select>
                            </div>
                            
                        </div>
                    </div>
                    <div className="w-full h-[1px] bg-[#adccbd]"></div>

                    <div className="flex flex-col gap-2">
                        <div className="text-small text-[#798f86]">
                            <h5>Group Expense</h5>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                            <div className="size-[2.5rem] bg-slate-500 all-center rounded-xl">
                                <span className="text-white"><GroupIcon /></span>
                            </div>
                            <h3>As Group Expense</h3>
                            </div>
                            <div className="flex gap-2">
                            <SettingsIcon fontSize="large" />
                            <CustomSwitch onChange={handleSwitchToggle} checked={isGroupExpense} />
                            </div>
                        </div>

                        {/* Conditionally render this section based on the switch state */}
                        {isGroupExpense && (
                            <div className="flex gap-2">
                            <select id="fruit" name="fruit" className="w-[70%] rounded-full p-2">
                                <option value="" disabled selected hidden>Select a person</option>  {/* Placeholder option */}
                                <option value="apple">Ali</option>
                                <option value="banana">Tek Quan</option>
                                <option value="orange">Wei</option>
                                <option value="grape">Lam</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Enter Amount"
                                className="border-b-2 border-[#adccbd]"
                            />
                            </div>
                        )}
                        </div>
                    <div className="w-full h-[1px] bg-[#adccbd]"></div>

                    <div className="flex flex-col gap-2">
                        <div className="text-small text-[#798f86]"><h5>Note</h5></div>
                        <div className="css-input">
                            <input type="text" placeholder="Click to fill in the remarks" />
                        </div>
                    </div>
                    <div className="w-full h-[1px] bg-[#adccbd]"></div>

                    


                </div>
                


            </form>

            
        </div>
    );
}

export default TransactionDetail;
