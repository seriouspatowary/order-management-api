import request from "supertest";
import { describe, it, expect } from "vitest";

import app from "../src/app.js";
import { FoodItem } from "../src/models/foodItem.models.js";

describe("POST /api/order/create", () => {
  it("should create an order", async () => {

    // Arrange
    const foodItem = await FoodItem.create({
      name: "Chicken Burger",
      description: "Chicken burger with cheese",
      price: 200,
      image: "burger.jpg",
      isAvailable: true,
      availableQuantity: 10,
    });

    // Act
    const response = await request(app)
      .post("/api/order/create")
      .send({
        customerName: "Simanta",
        address: "Guwahati, Assam",
        phone: "9876543210",
        items: [
          {
            foodItemId: foodItem._id.toString(),
            quantity: 2,
          },
        ],
      });

    expect(response.status).toBe(201);
  });
});





describe("GET /api/order/track/:orderNumber", () => {
  it("should return the order by order number", async () => {
    // Arrange
    const foodItem = await FoodItem.create({
      name: "Chicken Burger",
      description: "Chicken burger with cheese",
      price: 200,
      image: "burger.jpg",
      isAvailable: true,
      availableQuantity: 10,
    });

    const createResponse = await request(app)
      .post("/api/order/create")
      .send({
        customerName: "Simanta",
        address: "Guwahati, Assam",
        phone: "9876543210",
        items: [
          {
            foodItemId: foodItem._id.toString(),
            quantity: 1,
          },
        ],
      });

    const orderNumber =
      createResponse.body.data.orderNumber;

    // Act
    const response = await request(app)
      .get(`/api/order/track/${orderNumber}`);

    

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.data.order.orderNumber)
      .toBe(orderNumber);

    expect(response.body.data.order.status)
      .toBe("RECEIVED");
  });
});


describe("PATCH /api/order/:orderNumber/status", () => {
  it("should update the order status", async () => {
    // Arrange
    const foodItem = await FoodItem.create({
      name: "Chicken Burger",
      description: "Chicken burger with cheese",
      price: 200,
      image: "burger.jpg",
      isAvailable: true,
      availableQuantity: 10,
    });

    const createResponse = await request(app)
      .post("/api/order/create")
      .send({
        customerName: "Simanta",
        address: "Guwahati, Assam",
        phone: "9876543210",
        items: [
          {
            foodItemId: foodItem._id.toString(),
            quantity: 1,
          },
        ],
      });

    expect(createResponse.status).toBe(201);

    const orderNumber =
      createResponse.body.data.orderNumber;

    // Act
    const response = await request(app)
      .patch(`/api/order/${orderNumber}/status`)
      .send({
        status: "PREPARING",
      });


    
    // Assert
      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data.status)
        .toBe("PREPARING");
  });
});


it("should reject order when customer name is missing", async () => {
  const response = await request(app)
    .post("/api/order/create")
    .send({
      address: "Guwahati, Assam",
      phone: "9876543210",
      items: [
        {
          foodItemId: "some-valid-food-id",
          quantity: 1,
        },
      ],
    });

  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
});


it("should reject an invalid phone number", async () => {
  const response = await request(app)
    .post("/api/order/create")
    .send({
      customerName: "Simanta",
      address: "Tinsukia, Assam",
      phone: "123",
      items: [
        {
          foodItemId: "some-valid-food-id",
          quantity: 1,
        },
      ],
    });

  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
});

it("should reject invalid item quantity", async () => {
  const response = await request(app)
    .post("/api/order/create")
    .send({
      customerName: "Simanta",
      address: "Guwahati, Assam",
      phone: "9876543210",
      items: [
        {
          foodItemId: "some-valid-food-id",
          quantity: 0,
        },
      ],
    });

  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
});

it("should reject an invalid order status", async () => {
  const response = await request(app)
    .patch("/api/order/ORD-123/status")
    .send({
      status: "COOKING",
    });

  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
});