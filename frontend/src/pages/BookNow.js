import { Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import StripeCheckout from "react-stripe-checkout";

function BookNow() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);
  const getBus = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/buses/get-bus-by-id", {
        _id: params.id,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        setBus(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const bookNow = async (transactionId) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/bookings/book-seat", {
        bus: bus._id,
        seats: selectedSeats,
        transactionId,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/bookings");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const onToken = async (token) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/bookings/make-payment", {
        token,
        amount: selectedSeats.length * bus.fare * 100,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        bookNow(response.data.data.transactionId);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  useEffect(() => {
    getBus();
  }, []);

  return (
    <div>
      {bus && (
        <Row className="mt-3" gutter={[30, 30]}>
          <Col lg={12} xs={24} sm={24}>
            <h1 className="text-2xl primary-text fw-bold">{bus.name}</h1>
            <br />
            <h1 className="text-md">
              {bus.from} - {bus.to}
            </h1>
            <br />
            <h1 className="text-md">{bus.type}</h1>
            <hr />

            <div className="flex flex-col gap-2">
              <p className="text-md">
                Journey Date : <b> {bus.journeyDate} </b>
              </p>
              <p className="text-md">
                Fare : <b> ₹ {bus.fare} </b> /-
              </p>
              <p className="text-md">
                Departure Time : <b> {bus.departure}</b>
              </p>
              <p className="text-md">
                Arrival Time : <b> {bus.arrival}</b>
              </p>
              <p className="text-md">
                Capacity : <b> {bus.capacity}</b>
              </p>
              <p className="text-md">
                Seats Left : <b> {bus.capacity - bus.seatsBooked.length}</b>
              </p>
            </div>
            <hr />

            <div className="flex flex-col gap-2">
              <h1 className="text-2xl">
                Selected Seats : <b> {selectedSeats.join(", ")}</b>
              </h1>
              <h1 className="text-2xl mt-2">
                Fare : ₹ <b> {bus.fare * selectedSeats.length} </b> /-
              </h1>
              <hr />

              <StripeCheckout
                billingAddress
                token={onToken}
                amount={bus.fare * selectedSeats.length * 100}
                currency="INR"
                stripeKey="pk_test_51OABS9SBfK11D6WFBvHmC5D095uOdGEbZglJqrI5fIwJuIC4Tt0hsUex7sCnHKoVoCzJ02DR2uScdIEHVUStqrKx00ge3jh3yc"
              >
                <button
                  className={`primary-btn ${
                    selectedSeats.length === 0 && "disabled-btn"
                  }`}
                  disabled={selectedSeats.length === 0}
                >
                  Book Now
                </button>
              </StripeCheckout>
            </div>
          </Col>
          <Col lg={12} xs={24} sm={24}>
            <SeatSelection
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              bus={bus}
            />
          </Col>
        </Row>
      )}
    </div>
  );
}

export default BookNow;
