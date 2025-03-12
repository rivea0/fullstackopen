const Input = ({ inputText, handleInputChange }) => {
  return (
    <div>
      find countries: <input value={inputText} onChange={handleInputChange} />
    </div>
  );
}

export default Input;
