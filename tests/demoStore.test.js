import { beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { demoStore, signOut } from '../src/services/demoStore.js';
class BrowserStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
  clear() { this.values.clear(); }
}
Object.defineProperty(globalThis, 'localStorage', { value: new BrowserStorage(), configurable: true });
Object.defineProperty(globalThis, 'sessionStorage', { value: new BrowserStorage(), configurable: true });
globalThis.window = new EventTarget();
const action = (path, body = {}, method = 'POST') => demoStore(path, { body, method });
const login = role => action('/auth/login', { email: `${role}@eventsphere.test`, password: 'EventSphere123!' });
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });
test('accounts, registration, profile edits, and sign-out work without a network', async () => {
  assert.equal((await login('admin')).user.role, 'admin');
  await assert.rejects(action('/auth/login', { email: 'admin@eventsphere.test', password: 'wrong' }));
  signOut(); await assert.rejects(demoStore('/portal'));
  const result = await action('/auth/register', { name: 'Demo Visitor', email: 'visitor@example.test', password: 'NewAccount123!', role: 'attendee', consent: true });
  assert.equal(result.user.name, 'Demo Visitor');
  await action('/auth/profile', { name: 'Updated Visitor' }, 'PATCH');
  signOut(); await action('/auth/login', { email: 'visitor@example.test', password: 'NewAccount123!' });
  assert.equal((await demoStore('/auth/me')).name, 'Updated Visitor');
});
test('event and schedule editing persist with notifications and deletion cleanup', async () => {
  await login('admin');
  const date = new Date(Date.now() + 86400000).toISOString();
  const endDate = new Date(Date.now() + 172800000).toISOString();
  const event = await action('/events', { title: 'Design Day', description: 'A creative gathering', date, endDate, location: 'Karachi Studio', category: 'Design', theme: 'Made together', type: 'expo', price: 0, capacity: 10 });
  assert.equal((await demoStore(`/events/${event._id}`)).booths.length, 16);
  await action(`/events/${event._id}`, { ...event, title: 'Updated Design Day' }, 'PUT');
  const session = await action('/sessions', { event: event._id, title: 'Design conversation', speaker: 'Ayesha Khan', topic: 'Design', location: 'Studio 1', start: new Date(Date.now() + 90000000).toISOString(), end: new Date(Date.now() + 93600000).toISOString(), capacity: 10 });
  assert.equal((await demoStore(`/events/${event._id}`)).event.title, 'Updated Design Day');
  assert.equal((await demoStore(`/events/${event._id}`)).sessions[0]._id, session._id);
  await action(`/sessions/${session._id}`, {}, 'DELETE');
  await action(`/events/${event._id}`, {}, 'DELETE');
  await assert.rejects(demoStore(`/events/${event._id}`));
});
test('application approval gates booth selection and cancellation releases the booth', async () => {
  await login('exhibitor');
  await assert.rejects(action('/booths/event-2-booth-5/reserve'));
  const applied = (await demoStore('/portal')).applications.find(item => item.event._id === 'event-2');
  await login('admin'); await action(`/applications/${applied._id}`, { status: 'approved' }, 'PATCH');
  await login('exhibitor');
  const reservation = await action('/booths/event-2-booth-5/reserve');
  await assert.rejects(action('/booths/event-2-booth-5/reserve'));
  await login('admin'); await action(`/reservations/${reservation._id}`, { status: 'approved' }, 'PATCH');
  assert.equal((await demoStore('/events/event-2')).booths.find(item => item._id === reservation.booth).status, 'occupied');
  await login('exhibitor'); await action(`/booths/${reservation.booth}`, { products: 'Flowers', staff: 'Sara, studio lead' }, 'PATCH');
  await action(`/reservations/${reservation._id}`, { status: 'cancelled' }, 'PATCH');
  assert.equal((await demoStore('/events/event-2')).booths.find(item => item._id === reservation.booth).status, 'available');
});
test('attendee bookings, session prerequisites, bookmarks, and cancellation are consistent', async () => {
  await login('attendee');
  const existing = (await demoStore('/portal')).registrations.find(item => item.event._id === 'event-2' && !item.session);
  await action(`/registrations/${existing._id}`, {}, 'DELETE');
  await assert.rejects(action('/events/event-2/register', { session: 'event-2-session-1' }), /admission/);
  const booking = await action('/events/event-2/register');
  await action('/events/event-2/register', { session: 'event-2-session-1' });
  await assert.rejects(action('/events/event-2/register'), /already registered/);
  await action('/sessions/event-2-session-2/bookmark');
  assert.ok((await demoStore('/portal')).bookmarks.some(item => item.session._id === 'event-2-session-2'));
  await action('/sessions/event-2-session-2/bookmark');
  await action(`/registrations/${booking._id}`, {}, 'DELETE');
  assert.equal((await demoStore('/portal')).registrations.filter(item => item.event._id === 'event-2').length, 0);
  await assert.rejects(action('/events', {}), /different dashboard/);
});
test('message conversations, notifications, and support changes are stored in the browser', async () => {
  await login('attendee');
  await action('/messages', { to: 'exhibitor', body: 'Can we meet at your booth?' });
  const feedback = await action('/feedback', { message: 'Please add a new workshop.', kind: 'support', rating: 5, publish: true });
  await login('exhibitor');
  assert.ok((await demoStore('/portal')).messages.some(item => item.body === 'Can we meet at your booth?'));
  assert.ok((await demoStore('/portal')).notifications.some(item => item.text.includes('New message')));
  await action('/notifications/read', {}, 'PATCH');
  assert.equal((await demoStore('/portal')).notifications.filter(item => !item.read).length, 0);
  await login('admin'); await action(`/feedback/${feedback._id}`, { status: 'resolved' }, 'PATCH');
  await login('attendee'); assert.equal((await demoStore('/portal')).feedback.find(item => item._id === feedback._id).status, 'resolved');
  assert.equal((await demoStore('/community')).reviews.some(item => item._id === feedback._id), false);
});
test('local password recovery produces a usable one-time link', async () => {
  const reset = await action('/auth/forgot', { email: 'attendee@eventsphere.test' });
  const token = new URL(reset.resetLink, 'http://localhost').searchParams.get('token');
  await action('/auth/reset', { token, password: 'NewDemoPassword123!' });
  await assert.rejects(action('/auth/reset', { token, password: 'AnotherPassword123!' }));
  await assert.rejects(login('attendee'));
  const account = await action('/auth/login', { email: 'attendee@eventsphere.test', password: 'NewDemoPassword123!' });
  assert.equal(account.user.role, 'attendee');
});
