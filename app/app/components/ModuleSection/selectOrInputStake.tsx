import { useState } from 'react';
import { FaChevronDown, FaEdit } from 'react-icons/fa';

// Define the prop types for SelectOrInput
interface SelectOrInputProps {
    isConnected: boolean;
    amount: string;
    setAmount: (amount: string) => void;
  }

export default function SelectOrInput({ isConnected, amount, setAmount } : SelectOrInputProps) {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEditing = () => {
      setIsEditing(!isEditing);
    };
  
    // @ts-expect-error: Ignoring implicit any type for event parameter
    const handleInputChange = (e) => {
      setAmount(e.target.value);
    };
  
    // @ts-expect-error: Ignoring implicit any type for event parameter
    const handleSelectChange = (e) => {
      setAmount(e.target.value);
    };

  return (
    <div className="relative flex items-center space-x-2">
      {isEditing ? (
        <input
          type="text"
          disabled={!isConnected}
          className="rounded-xl bg-gray-900/50 border border-white border-opacity-[0.23] text-white py-2 px-4 shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          value={amount}
          onChange={handleInputChange}
        />
      ) : (
        <select
          disabled={!isConnected}
          className="rounded-xl bg-gray-900/50 border border-white border-opacity-[0.23] text-white py-2 px-4 shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          value={amount}
          onChange={handleSelectChange}
        >
          <option value="">Select $COMAI amount</option>
          <option value="1">1 $COMAI</option>
          <option value="10">10 $COMAI</option>
          <option value="100">100 $COMAI</option>
          <option value="1000">1,000 $COMAI</option>
          <option value="10000">10,000 $COMAI</option>
          <option value="100000">100,000 $COMAI</option>
          <option value="1000000">1,000,000 $COMAI</option>
        </select>
      )}
      <button
        type="button"
        onClick={toggleEditing}
        className="text-white transition-transform transform hover:scale-105"
      >
        {isEditing ? <FaChevronDown size={20} /> : <FaEdit size={20} />}
      </button>
    </div>
  );
}
