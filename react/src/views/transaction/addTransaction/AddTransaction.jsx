import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom"; // For reading navigation state
import Section from "../../components/Section";
import TransactionDetail from "./TransactionDetail";
import Calculator from "./Calculator";
import SubmitTransaction from "./SubmitTransaction";
import Category from "./Category";
import PaymentMethod from "./PaymentMethod";
import TransactionEditDetail from "../editTransaction/TransactionEditDetail";

// Default transaction data for a new transaction
const defaultTransaction = {
  type: "Expense",
  amount: 0,
  category_id: null,
  payment_method_id: null,
  date: new Date().toISOString().split("T")[0],
  group_expense: false,
  recurrence: false,
  description: "",
};

function AddTransaction() {
  const location = useLocation();
  
  // Extract existingTransaction and initialAction from navigation state (if any)
  const { transaction: existingTransaction = null, action: initialAction = "add" } = location.state || {};
  
  // If there is no existing transaction, force action to "add"
  const effectiveAction = existingTransaction ? initialAction : "add";
  
  // Local state for action and transaction data
  const [action, setAction] = useState(effectiveAction);
  //nullish coalescing operator (??) to provide a default value for existingTransaction
  const [transaction, setTransaction] = useState(existingTransaction ?? defaultTransaction);
  
  // For navigation among panels (calculator, payment method, category)
  const [activePanel, setActivePanel] = useState("calculator");
  
  // Separate states for category and payment method selection
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // When location.state changes and no existing transaction is provided,
  // reset state to default add mode.
  //Clicking the plus button (which navigates to the same route) does not remount or reset the component because React Router sees it as the same route
  //So i have to do this below code
  useEffect(() => {
    if (!existingTransaction) {
      setAction("add");
      setTransaction(defaultTransaction);
      setSelectedCategory(null);
      setSelectedPaymentMethod(null);
      setActivePanel("calculator");
    }
  }, [location.state, existingTransaction]);


  return (
    <div className="flex gap-4 size-full justify-between flex-wrap">
      <Section className="flex flex-col gap-4 p-4 bg-light-mint">
        {action === "add" ? (
          <TransactionDetail
            transaction={transaction}
            setTransaction={setTransaction}
            setActivePanel={setActivePanel}
            selectedCategory={selectedCategory}
            selectedPaymentMethod={selectedPaymentMethod}
          />
        ) : (
          <TransactionEditDetail
            transaction={transaction}
            setTransaction={setTransaction}
            setActivePanel={setActivePanel}
            selectedCategory={selectedCategory}
            selectedPaymentMethod={selectedPaymentMethod}
          />
        )}
      </Section>

      <Section className="flex flex-col justify-between gap-8">
        <SubmitTransaction transaction={transaction} action={action} />
        {activePanel === "calculator" ? (
          <Calculator
            transaction={transaction}
            setTransaction={setTransaction}
            setActivePanel={setActivePanel}
          />
        ) : activePanel === "paymentMethod" ? (
          <PaymentMethod
            transaction={transaction}
            setTransaction={setTransaction}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
          />
        ) : activePanel === "category" ? (
          <Category
            transaction={transaction}
            setTransaction={setTransaction}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        ) : null}
      </Section>
    </div>
  );
}

export default AddTransaction;

