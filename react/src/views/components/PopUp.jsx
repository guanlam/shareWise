import React from "react";
import CloseIcon from '@mui/icons-material/Close';

function PopUp({ onClose, title, interaction, children }) {
    return (
        <section className="fixed top-0 left-0 w-full h-full bg-slate-500 bg-opacity-40 flex items-center justify-center">
            <div className="w-[60%] h-[70%] bg-light-mint rounded-xl p-6 flex flex-col">
                <div className="h-[10%] flex justify-between items-center mb-4">
                    <h2 className="text-large font-bold">{title}</h2>
                    <div>
                        {interaction}
                        <button onClick={onClose}><CloseIcon/></button>
                    </div>
                </div>
                <div className="css-scrollbar flex-1">
                    {children}
                </div>
                

            </div>
        </section>
    );
}

export default PopUp;
