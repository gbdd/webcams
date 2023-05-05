import React, { FC, ReactElement, useState, useEffect } from 'react';
import './WebcamFilterDialog.css';
import { LcFilters } from '../tools/consts';
import iconCity from'../assets/icon-city.png';
import iconSea from'../assets/icon-sea.png';
import iconMountain from'../assets/icon-mountain.png';
import iconRoad from'../assets/icon-road.png';
import iconLake from'../assets/icon-lake.png';
import iconCountry from'../assets/icon-country.png';

type WebcamFilterDialogProps = {
  filters: LcFilters,
  onFilterChanged: Function,
  onClose: Function,
}

export const WebcamFilterDialog: FC<WebcamFilterDialogProps> = ({filters, onFilterChanged, onClose}): ReactElement => {
  const [checkPreferred , setCheckPreferred] = useState<boolean>(false);

  useEffect(
    () => {
      setCheckPreferred(filters.pref);
    }
  , [filters]);

  const isChecked = (type:string) => {
    return filters.types.includes(type);
  }

  const handleOnClick = (id:string) => {
    const newTypes = [...filters.types];

    const tidx:number = newTypes.findIndex(t => t === id);
    if (tidx === -1) {
      newTypes.push(id);
    } else {
      newTypes.splice(tidx, 1);
    }

    callChangesOnFilters(filters.pref, newTypes);
  }
  const handleOnChangePreferred = (evt:any) => {
    callChangesOnFilters(!filters.pref, filters.types);
  }

  const callChangesOnFilters = (pref:boolean, types:string[]) => {
    const newFilters:LcFilters = {
      pref,
      types,
    };
    onFilterChanged(newFilters);
  }

  return (
    <div className="filterDialog">
      <div className='filtersContainer'>
        <div className='filterButton' onClick={handleOnChangePreferred}>
            <i className={checkPreferred ? 'redHeartFilter fa-solid fa-heart checkedIcon' : 'redHeartFilter fa-regular fa-heart uncheckedIcon'}></i>
        </div>
        <div className='separator'></div>
        <div className='filterButton' onClick={() => {handleOnClick('city')}}>
            <img className={isChecked('city') ? 'checkedIcon' : 'uncheckedIcon'} src={iconCity} alt=""></img>
        </div>
        <div className='filterButton' onClick={() => {handleOnClick('mountain')}}>
            <img className={isChecked('mountain') ? 'checkedIcon' : 'uncheckedIcon'} src={iconMountain} alt=""></img>
        </div>
        <div className='filterButton' onClick={() => {handleOnClick('sea')}}>
            <img className={isChecked('sea') ? 'checkedIcon' : 'uncheckedIcon'} src={iconSea} alt=""></img>
        </div>
        <div className='filterButton' onClick={() => {handleOnClick('country')}}>
            <img className={isChecked('country') ? 'checkedIcon' : 'uncheckedIcon'} src={iconCountry} alt=""></img>
        </div>
        <div className='filterButton' onClick={() => {handleOnClick('lake')}}>
            <img className={isChecked('lake') ? 'checkedIcon' : 'uncheckedIcon'} src={iconLake} alt=""></img>
        </div>
        <div className='filterButton' onClick={() => {handleOnClick('road')}}>
            <img className={isChecked('road') ? 'checkedIcon' : 'uncheckedIcon'} src={iconRoad} alt=""></img>
        </div>
      </div>
    </div>
  );
}
