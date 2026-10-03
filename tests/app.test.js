const { test, describe, before, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const app = require("../app");
const Person = require("../models/person");

let server;
let baseUrl;

before(async () => {
    server = await new Promise((resolve) => {
        const s = app.listen(0, () => resolve(s));
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await mongoose.connection.close();
});

describe("HTTP routes", () => {
    test("GET /health returns ok", async () => {
        const response = await fetch(`${baseUrl}/health`);
        assert.strictEqual(response.status, 200);
        assert.strictEqual(await response.text(), "ok");
    });

    test("unknown endpoint returns 404 with a JSON error", async () => {
        const response = await fetch(`${baseUrl}/no-such-route`);
        assert.strictEqual(response.status, 404);
        assert.deepStrictEqual(await response.json(), { error: "unknown endpoint" });
    });

    test("POST /api/persons without a number returns 400", async () => {
        const response = await fetch(`${baseUrl}/api/persons`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Test Person" }),
        });
        assert.strictEqual(response.status, 400);
        assert.deepStrictEqual(await response.json(), { error: "content missing" });
    });
});

describe("Person validation", () => {
    test("accepts a valid person", async () => {
        const person = new Person({ name: "Ada Lovelace", number: "040-1234567" });
        await assert.doesNotReject(person.validate());
    });

    test("rejects a name shorter than 3 characters", async () => {
        const person = new Person({ name: "Al", number: "040-1234567" });
        await assert.rejects(
            person.validate(),
            error => error instanceof mongoose.Error.ValidationError && Boolean(error.errors.name)
        );
    });

    test("rejects a number in the wrong format", async () => {
        const person = new Person({ name: "Ada Lovelace", number: "1234567" });
        await assert.rejects(
            person.validate(),
            error => error instanceof mongoose.Error.ValidationError && Boolean(error.errors.number)
        );
    });
});
