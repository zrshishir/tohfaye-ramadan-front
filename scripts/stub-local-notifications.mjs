// Stub for @capacitor/local-notifications so the scheduler can be checked in Node.
export const LocalNotifications = {
  async requestPermissions() { return { display: 'granted' }; },
  async getPending() { return { notifications: [] }; },
  async cancel() {},
  async schedule() {},
};
