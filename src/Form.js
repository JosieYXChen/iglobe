import React, { useState } from 'react';
import './Form.css';

import Search from './Search';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { dateDiff, updateDataBase, updateLocalStorage, handleSignOut } from './helper'

const Form = (props) => {
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [isActive, setActive] = useState(false);

  const handleChange = (event) => {
    switch(event.target.name) {
      case 'address':
        setAddress(event.target.value);
        break;
      case 'latitude':
        setLatitude(event.target.value);
        break;
      case 'longitude':
        setLongitude(event.target.value);
        break;
      case 'start':
        setStart(event.target.value);
        break;
      case 'end':
        setEnd(event.target.value);
        break;
      default: return;
    }
  }

  const handleSearchChange = (address) => {
    setAddress(address);
  }

  const handleSelect = async address => {
    try {
      const results = await geocodeByAddress(address);
      const fullAddress = results[0].formatted_address;
      const { lat, lng } = await getLatLng(results[0]);
      setAddress(fullAddress);
      setLatitude(lat);
      setLongitude(lng);
    } catch (err) {
      console.error('Error', err);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const years = dateDiff(
      event.target.start.value,
      event.target.end.value
    );
    const name = address.split(',')[0];
    const lat = Number(latitude);
    const lng = Number(longitude);

    const newPlace = {
      name,
      lat,
      lng,
      years,
    };
    props.places.push(newPlace);
    props.isSignedIn ? updateDataBase(newPlace) : updateLocalStorage(newPlace);

    setAddress('');
    setLatitude('');
    setLongitude('');
    setStart('');
    setEnd('');
    return;
  }

  //toggle button
  const handleFormBtnClick = () => {
    setActive(!isActive);
  }

  return (
    <div id="form-container">
      <div className="form">
      <form className="flexbox" onSubmit={handleSubmit}>
        <Search
          address={address}
          handleSelect={handleSelect}
          handleChange={handleSearchChange}
        />
        <div className="label-input">
          <label>Since</label>
          <input
            name="start"
            type="date"
            value={start}
            onChange={handleChange}
            required={true}
          ></input>
        </div>
        <div className="label-input">
          <label>Till</label>
          <input
            name="end"
            type="date"
            value={end}
            onChange={handleChange}
            required={true}
          ></input>
        </div>
        <button id="submit-button" type="submit">
          Submit
        </button>
        {props.isSignedIn &&
          <button id="signout-button" type="button" onClick={handleSignOut}>
            Signout
          </button>
        }
        <p className="copy-mark">&copy; IGLOBE 2020</p>
      </form>
      </div>
      <div className="form-btn">
        <i className="fab fa-wpforms" onClick={handleFormBtnClick}></i>
      </div>
    </div>
  );
}

export default Form;
