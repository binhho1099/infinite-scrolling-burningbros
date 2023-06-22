import React from 'react';

interface IAppSearchProps {
  value: string;
  onChange: (value: string) => void;
}

function AppSearch({ value, onChange }: IAppSearchProps) {
  return (
    <div>
      <span>Search: </span>
      <input
        type="text"
        value={value}
        onChange={e => {
          onChange(e.target.value);
        }}
        placeholder="Enter name product ..."
        className="w-50"
      />
    </div>
  );
}

export default AppSearch;
