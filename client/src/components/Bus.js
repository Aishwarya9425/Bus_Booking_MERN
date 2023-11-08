import React from "react";
import { useNavigate } from "react-router-dom";

function Bus({ bus }) {
  const navigate = useNavigate();
  return (
    <div className="card p-2">
      <h1 className="text-lg primary-text">
        {" "}
        <strong>{bus.name}</strong>
      </h1>
      <hr />
      <div className="d-flex justify-content-between">

      <div>
          <p className="text-sm">
            {" "}
            <strong>Type</strong>
          </p>
          <p className="text-sm">{bus.type}</p>
        </div>


        <div>
          <p className="text-sm">
            {" "}
            <strong>From</strong>
          </p>
          <p className="text-sm">{bus.from}</p>
        </div>

        <div>
          <p className="text-sm">
            {" "}
            <strong>To</strong>
          </p>
          <p className="text-sm">{bus.to}</p>
        </div>

        <div>
          <p className="text-sm">
            {" "}
            <strong>Fare</strong>
          </p>
          <p className="text-sm">₹ {bus.fare} /-</p>
        </div>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-end">
        <div>
          <p className="text-sm">
            {" "}
            <strong>Journey Date</strong>
          </p>
          <p className="text-sm">{bus.journeyDate}</p>
        </div>

        <h1
          className="text-lg underline secondary-text"
          onClick={() => {
            navigate(`/book-now/${bus._id}`);
          }}
        >
            <strong>Book Now</strong>
        </h1>
      </div>
    </div>
  );
}

export default Bus;
