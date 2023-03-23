import React, { FC, ReactElement, useState, useEffect } from 'react';
import './StarToggle.css';

type StarToggleProps = {
  checked: boolean,
  onChecked: Function,
}

export const StarToggle: FC<StarToggleProps> = ({checked, onChecked}): ReactElement => {

  const [internalChecked, setInternalChecked] = useState<boolean>(false);

  useEffect(
    () => {
      setInternalChecked(checked);
    }
  , [checked]);

  const handleOnClick = () => {
    setInternalChecked(!internalChecked);
    onChecked(!internalChecked);
  }

  return (
      <div className="form-group">
        <input type="checkbox" id="html" onClick={handleOnClick}/>
        <label htmlFor="html">
        { internalChecked && (
          <i className="fa-solid fa-star"></i>
        )}
        { !internalChecked && (
          <i className="fa-regular fa-star"></i>
        )}
        </label>
      </div>
  );
}

