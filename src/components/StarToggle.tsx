import React, { FC, ReactElement, useState, useEffect } from 'react';
import './StarToggle.css';

export enum ToggleType {
  HEART = 0,
  CHECK = 1,
}

type StarToggleProps = {
  checked: boolean,
  onChecked: Function,
  type?: ToggleType,
}

export const StarToggle: FC<StarToggleProps> = ({checked, onChecked, type = ToggleType.HEART}): ReactElement => {

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
        <input className="hiddenInput" type="checkbox" id="html" onClick={handleOnClick}/>
        <label htmlFor="html">
        { (internalChecked && (type === ToggleType.CHECK)) && (
          <i className="fa-regular fa-circle-check"></i>
        )}
        { (internalChecked && (type === ToggleType.HEART)) && (
          <i className="redHeart fa-solid fa-heart"></i>
        )}
        { (!internalChecked && (type === ToggleType.CHECK)) && (
          <i className="fa-regular fa-circle"></i>
        )}
        { (!internalChecked && (type === ToggleType.HEART)) && (
          <i className="redHeart fa-regular fa-heart"></i>
        )}
        </label>
      </div>
  );
}

