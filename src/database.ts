import { Reminder } from "./models";

const reminders: Reminder[] = [];

export const db = {
  getAll: () => reminders,
  getById: (id: string) => reminders.find(reminder => reminder.id === id),
  create: (reminder: Reminder) => reminders.push(reminder),
  update: (id: string, updatedData: Partial<Reminder>) => {
    const index = reminders.findIndex(reminder => reminder.id === id);
    if (index === -1) return null;
    reminders[index] = { ...reminders[index], ...updatedData };
    return reminders[index];
  },
  delete: (id: string) => {
    const index = reminders.findIndex(reminder => reminder.id === id);
    if (index === -1) return false;
    reminders.splice(index, 1);
    return true;
  },
};
