import { useEffect, useRef, useState } from "react";
import "./App.css";
import Pill from "./components/Pill";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedUserSet, setSelectedUserSet] = useState(new Set());

  
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchUsers = () => {
      if (searchTerm.trim() === "") {
        setSuggestions([]); // Clear suggestions when search term is empty
        return;
      }

      fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data.users || []); // Safely update suggestions
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchUsers();
  }, [searchTerm]);

  const handleSelectUser = (user) => {
    setSelected([...selected, user]);
    setSelectedUserSet(new Set([...selectedUserSet, user.email]));
    setSearchTerm("");
    setSuggestions([]);
    inputRef.current.focus();
  };

  const handleRemove = (user) => {
    const updatedUser = selected.filter((selected) => selected.id !== user.id);
    setSelected(updatedUser);

    const updatedEmails = new Set(selectedUserSet);
    updatedEmails.delete(user.email);
    setSelectedUserSet(updatedEmails);
  };
  const handleKeyDown=(e)=>{
     if(e.key === 'Backspace' && e.target.value === "" && selected.length>0){
      const lastUser = selected[selected.length-1];
      handleRemove(lastUser);
      setSuggestions([]);
     }
  }

  return (
    <div className="user-search">
      <div className="user-input">
        {selected.map((user, index) => {
          return (
            <Pill
              key={`${user.email}-${index}`} // Corrected key
              image={user.image}
              text={`${user.firstName} ${user.lastName}`}
              onClick={() => handleRemove(user)}
            />
          );
        })}
        <div>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Always set as string
            placeholder="Search For A User..."
            onKeyDown={handleKeyDown}
          />
          <ul className="suggestions-list">
            {suggestions.map((user, index) => {
              return !selectedUserSet.has(user.email) ? (
                <li
                  key={`${user.email}-${index}`} // Corrected key
                  onClick={() => handleSelectUser(user)}
                >
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </li>
              ) : null;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
