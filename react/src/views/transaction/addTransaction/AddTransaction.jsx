import React, { useState } from 'react'
import Section from '../../components/Section'
import TransactionDetail from './TransactionDetail'
import Calculator from './Calculator';
import SubmitTransaction from './SubmitTransaction';
import Category from './Category';
import PaymentMethod from './PaymentMethod';



function AddTransaction() {
    const [transaction, setTransaction] = useState({
        type: "Expense",
        amount: 0,
        category_id: null,
        payment_method_id: null,
        date: new Date().toISOString().split("T")[0],
        group_expense: false,
        recurrence: false,
        // recurrence_frequency: "None", //if recurrence is true it will be set to "Daily", "Weekly", "Monthly", "Yearly"
        description: null,
        

        
    });

    console.log (transaction);

    const [activePanel, setActivePanel] = useState("calculator");

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);



    return (
        <div className="flex gap-4 size-full justify-between flex-wrap">
                {/* Left Side: Balance Summary & Transaction Filter */}
                <Section className="flex flex-col gap-4 p-4 bg-light-mint">
                    {/* Left Panel - Transaction Details */}
                    <TransactionDetail transaction={transaction} setTransaction={setTransaction} setActivePanel={setActivePanel} selectedCategory={selectedCategory} selectedPaymentMethod={selectedPaymentMethod} />
                </Section>

                {/* Right Side: Transaction List */}
                <Section className="flex flex-col justify-between gap-8">
                    
                    <SubmitTransaction transaction={transaction}/>
                    {
                        activePanel === "calculator" ? (
                            <Calculator
                            transaction={transaction}
                            setTransaction={setTransaction}
                            setActivePanel={setActivePanel}
                            />
                        ) : activePanel === "paymentMethod" ? (
                            <PaymentMethod transaction={transaction} setTransaction={setTransaction} selectedPaymentMethod={selectedPaymentMethod} setSelectedPaymentMethod={setSelectedPaymentMethod} />
                        ) : activePanel === "category" ? (
                            <Category transaction={transaction} setTransaction={setTransaction} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                        ) : null
                    }
                </Section>


        </div>
    )
}

export default AddTransaction
