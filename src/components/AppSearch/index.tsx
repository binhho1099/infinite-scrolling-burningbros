import React from 'react';

interface IAppSearchProps {
  value: string;
  onChange: (value: string) => void;
}

function AppSearch({ value, onChange }: IAppSearchProps) {
  return (
    <div className="d-flex align-items-center">
      <span>Search: </span>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder="Type to search ..."
        className="w-50 form-control"
      />
    </div>
  );
}

export default AppSearch;
