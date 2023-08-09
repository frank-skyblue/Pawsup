import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { Col, Form, Button } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import { useCartContext } from "../providers/CartProvider";
import "./AddServiceToCart.css";

const AddServiceToCart = ({ serviceId }) => {
  const { userInfo, cartItems, setCartItems } = useCartContext();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [numberOfPets, setNumberOfPets] = useState(1);
  const [addedServiceToCart, setAddedServiceToCart] = useState(false);

  const addServiceToCart = () => {
    const startDateString = `${startDate.getFullYear()}-${`${
      startDate.getMonth() + 1
    }`.padStart(2, "0")}-${`${startDate.getDate()}`.padStart(2, "0")}`;
    const endDateString = `${endDate.getFullYear()}-${`${
      endDate.getMonth() + 1
    }`.padStart(2, "0")}-${`${endDate.getDate()}`.padStart(2, "0")}`;
    axios
      .post("/api/cart/service", {
        service_id: serviceId,
        start_date: startDateString,
        end_date: endDateString,
        number_of_pets: numberOfPets,
      })
      .then((response) => {
        setAddedServiceToCart(true);
        setCartItems({
          ...cartItems,
          services: [...cartItems.services, { service_id: serviceId }],
        });
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="d-grid gap-2">
      <Form.Group as={Col} controlId="startDate">
        <Form.Label>Start Date</Form.Label>
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            if (date > endDate) {
              setEndDate(date);
            }
          }}
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}
        />
      </Form.Group>
      <Form.Group as={Col} controlId="endDate">
        <Form.Label>End Date</Form.Label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
          minDate={startDate}
        />
      </Form.Group>
      <Form.Group as={Col} controlId="numberOfPets">
        <Form.Label>Number of Pets</Form.Label>
        <Form.Control
          type="number"
          value={numberOfPets}
          onChange={(e) => setNumberOfPets(e.target.value)}
        />
      </Form.Group>
      <Button
        className="mt-2"
        onClick={addServiceToCart}
        disabled={!userInfo.isLoggedIn || addedServiceToCart}
        variant="warning"
        size="lg"
      >
        {!addedServiceToCart ? "Add to Cart" : "Added to Cart"}
      </Button>
    </div>
  );
};

export default AddServiceToCart;
