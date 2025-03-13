import { Hono } from "hono";
import { db } from "./database";
import { Reminder } from "./models";

const app = new Hono();

// 1️⃣ Create a reminder
app.post("/reminders", async (c) => {
  const body: Reminder = await c.req.json();
  if (!body.id || !body.title || !body.dueDate) {
    return c.json({ error: "Missing required fields" }, 400);
  }
  db.create(body);
  return c.json({ message: "Reminder created successfully" }, 201);
});

// 2️⃣ Get a reminder by ID
app.get("/reminders/:id", (c) => {
  const reminder = db.getById(c.req.param("id"));
  return reminder ? c.json(reminder) : c.json({ error: "Reminder not found" }, 404);
});

// 3️⃣ Get all reminders
app.get("/reminders", (c) => {
  const reminders = db.getAll();
  return reminders.length ? c.json(reminders) : c.json({ error: "No reminders found" }, 404);
});

// 4️⃣ Update a reminder
app.patch("/reminders/:id", async (c) => {
  const id = c.req.param("id");
  const body: Partial<Reminder> = await c.req.json();
  const updated = db.update(id, body);
  return updated ? c.json(updated) : c.json({ error: "Reminder not found" }, 404);
});

// 5️⃣ Delete a reminder
app.delete("/reminders/:id", (c) => {
  return db.delete(c.req.param("id")) ? c.json({ message: "Reminder deleted" }) : c.json({ error: "Reminder not found" }, 404);
});

// 6️⃣ Mark reminder as completed
app.post("/reminders/:id/mark-completed", (c) => {
  const updated = db.update(c.req.param("id"), { isCompleted: true });
  return updated ? c.json(updated) : c.json({ error: "Reminder not found" }, 404);
});

// 7️⃣ Unmark reminder as completed
app.post("/reminders/:id/unmark-completed", (c) => {
  const updated = db.update(c.req.param("id"), { isCompleted: false });
  return updated ? c.json(updated) : c.json({ error: "Reminder not found" }, 404);
});

// 8️⃣ Get all completed reminders
app.get("/reminders/completed", (c) => {
  const completed = db.getAll().filter(r => r.isCompleted);
  return completed.length ? c.json(completed) : c.json({ error: "No completed reminders found" }, 404);
});

// 9️⃣ Get all not completed reminders
app.get("/reminders/not-completed", (c) => {
  const notCompleted = db.getAll().filter(r => !r.isCompleted);
  return notCompleted.length ? c.json(notCompleted) : c.json({ error: "No uncompleted reminders found" }, 404);
});

// 🔟 Get all reminders due today
app.get("/reminders/due-today", (c) => {
  const today = new Date().toISOString().split("T")[0];
  const dueToday = db.getAll().filter(r => r.dueDate === today);
  return dueToday.length ? c.json(dueToday) : c.json({ error: "No reminders due today" }, 404);
});

export { app };
