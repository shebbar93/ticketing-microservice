import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if id does not exists", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  // const id = "aaaaaaaaaaaaaaaaaaaaaaa";
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({ title: "asdfg", price: 20 })
    .expect(404);
});

it("returns a 401 if the user is not authenciated  ", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  // const id = "aaaaaaaaaaaaaaaaaaaaaaa";
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "asdfg", price: 20 })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", signin())
    .send({
      title: "qwerty",
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", signin())
    .send({
      title: "qwerty",
      price: 200,
    })
    .expect(401);
});

it("returns a 400 if the user provides a invalid title or price", async () => {
  const cookie = signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "qwerty",
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "qwertyuiop",
      price: -20,
    })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "qwerty",
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title test",
      price: 200,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("new title test");
  expect(ticketResponse.body.price).toEqual(200);
});

it("publishes an event", async () => {
  const cookie = signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "qwerty",
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title test",
      price: 200,
    })
    .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
