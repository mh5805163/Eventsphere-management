import { createMockData } from "../data/mockData.js";
const storageKey = "eventsphere-frontend-v1";
const userKey = "eventsphere-demo-user";
export const asset = (value) => value;
const id = () => crypto.randomUUID();
const timestamp = () => new Date().toISOString();
const publicUser = (user) => ({
  _id: user._id,
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  active: user.active,
});
function read() {
  const saved = localStorage.getItem(storageKey);
  if (saved) return JSON.parse(saved);
  const state = createMockData();
  localStorage.setItem(storageKey, JSON.stringify(state));
  return state;
}
function save(state) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    throw new Error(
      "Your browser storage is full. Remove some attached files or reset the demo from account settings.",
    );
  }
  window.dispatchEvent(new Event("eventsphere-change"));
}
function requireRecord(records, recordId, label = "Record") {
  const record = records.find((item) => item._id === recordId);
  if (!record) throw new Error(`${label} was not found.`);
  return record;
}
function requireRole(user, ...roles) {
  if (!user || !user.active) throw new Error("Please sign in to continue.");
  if (roles.length && !roles.includes(user.role))
    throw new Error("This action belongs to a different dashboard.");
}
function notify(state, user, text) {
  state.notifications.unshift({
    _id: id(),
    user,
    text,
    read: false,
    createdAt: timestamp(),
  });
}
async function fingerprint(password) {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password)),
    ),
  )
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
function validatePassword(password) {
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,100}$/.test(password || ""))
    throw new Error(
      "Use at least 10 characters with uppercase, lowercase, and a number.",
    );
}
function checkEvent(body) {
  if (
    !body.title?.trim() ||
    !body.location?.trim() ||
    !Number.isFinite(new Date(body.date).getTime())
  )
    throw new Error("Please complete the title, location, and start date.");
  if (body.endDate && new Date(body.endDate) <= new Date(body.date))
    throw new Error("End time must follow start time.");
  if (Number(body.capacity) < 1 || Number(body.price) < 0)
    throw new Error("Check the capacity and price.");
}
function addBooths(state, event) {
  for (let index = 0; index < 16; index++)
    state.booths.push({
      _id: id(),
      event,
      code: `${String.fromCharCode(65 + Math.floor(index / 4))}${(index % 4) + 1}`,
      size: index < 4 ? "6 × 6 m" : "3 × 3 m",
      price: index < 4 ? 950 : 450,
      status: "available",
      staff: "",
      products: "",
    });
}
function releaseBooth(state, reservation) {
  const booth = requireRecord(state.booths, reservation.booth);
  Object.assign(booth, {
    status: "available",
    occupant: null,
    products: "",
    staff: "",
  });
}
function cancelBooking(state, registration) {
  const children = state.registrations.filter(
    (item) =>
      item.user === registration.user &&
      item.event === registration.event &&
      (!registration.session || item._id === registration._id),
  );
  for (const item of children) {
    const target = item.session
      ? state.sessions.find((s) => s._id === item.session)
      : state.events.find((e) => e._id === item.event);
    if (target)
      target.registrationCount = Math.max(0, target.registrationCount - 1);
  }
  state.registrations = state.registrations.filter(
    (item) => !children.some((child) => child._id === item._id),
  );
}
export function subscribeDemo(callback) {
  const onStorage = (event) => {
    if (!event.key || event.key === storageKey) callback();
  };
  window.addEventListener("eventsphere-change", callback);
  window.addEventListener("storage", onStorage);
  const interval = window.setInterval(callback, 60000);
  return () => {
    window.removeEventListener("eventsphere-change", callback);
    window.removeEventListener("storage", onStorage);
    window.clearInterval(interval);
  };
}
export function signOut() {
  sessionStorage.removeItem(userKey);
}
export function hasDemoSession() {
  return !!sessionStorage.getItem(userKey);
}
export function resetDemo() {
  localStorage.removeItem(storageKey);
  signOut();
  window.location.assign("/");
}
function portal(state, user) {
  const event = (value) =>
    state.events.find((item) => item._id === value) || null;
  const session = (value) =>
    state.sessions.find((item) => item._id === value) || null;
  const person = (value) => {
    const found = state.users.find((item) => item._id === value);
    return found ? publicUser(found) : null;
  };
  const own = (items) =>
    user.role === "admin"
      ? items
      : items.filter((item) => item.user === user._id);
  for (const bookmark of state.bookmarks.filter(
    (item) => item.user === user._id && !item.remindedAt,
  )) {
    const target = session(bookmark.session);
    const remaining = new Date(target?.start).getTime() - Date.now();
    if (remaining > 0 && remaining <= 3600000) {
      bookmark.remindedAt = timestamp();
      notify(state, user._id, `Starting within an hour: ${target.title}.`);
      localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }
  return {
    events: state.events
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date)),
    users: state.users.map((personItem) =>
      user.role === "admin"
        ? publicUser(personItem)
        : {
            _id: personItem._id,
            name: personItem.name,
            role: personItem.role,
            active: personItem.active,
          },
    ),
    applications: own(state.applications).map((item) => ({
      ...item,
      event: event(item.event),
      user: person(item.user),
      company: state.companies.find((company) => company._id === item.company),
    })),
    reservations: own(state.reservations).map((item) => ({
      ...item,
      event: event(item.event),
      booth: state.booths.find((booth) => booth._id === item.booth),
      user: person(item.user),
    })),
    registrations: own(state.registrations).map((item) => ({
      ...item,
      event: event(item.event),
      session: session(item.session),
      user: person(item.user),
    })),
    bookmarks: own(state.bookmarks).map((item) => ({
      ...item,
      session: session(item.session)
        ? {
            ...session(item.session),
            event: event(session(item.session).event),
          }
        : null,
    })),
    notifications: state.notifications.filter((item) => item.user === user._id),
    company:
      state.companies.find((company) => company.user === user._id) || null,
    companies: state.companies.map((company) => ({
      ...company,
      user: person(company.user),
      locations: state.booths
        .filter(
          (booth) =>
            booth.occupant === company.user && booth.status === "occupied",
        )
        .map((booth) => ({ ...booth, event: event(booth.event) })),
    })),
    booths: state.booths
      .filter((booth) => user.role === "admin" || booth.occupant === user._id)
      .map((booth) => ({ ...booth, event: event(booth.event) })),
    messages: state.messages
      .filter((item) => item.from === user._id || item.to === user._id)
      .map((item) => ({
        ...item,
        from: person(item.from),
        to: person(item.to),
      })),
    feedback: own(state.feedback),
    visits: user.role === "admin" ? state.visits : [],
  };
}
export async function demoStore(action, options = {}) {
  const state = read();
  const method = options.method || "GET";
  const body = options.body || {};
  const [pathname, query = ""] = action.split("?");
  const parts = pathname.split("/").filter(Boolean);
  const [collection, recordId, operation] = parts;
  const user = state.users.find(
    (item) => item._id === sessionStorage.getItem(userKey),
  );
  if (collection === "auth") {
    if (recordId === "me") {
      requireRole(user);
      return publicUser(user);
    }
    if (recordId === "login") {
      const account = state.users.find(
        (item) =>
          item.email.toLowerCase() === body.email?.trim().toLowerCase() &&
          item.active,
      );
      const valid =
        account &&
        (account.demoAccount
          ? body.password === "EventSphere123!"
          : account.passwordHash === (await fingerprint(body.password)));
      if (!valid) throw new Error("Email or password is incorrect.");
      sessionStorage.setItem(userKey, account._id);
      return { user: publicUser(account) };
    }
    if (recordId === "register") {
      validatePassword(body.password);
      if (
        !body.consent ||
        body.name?.trim().length < 2 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email || "")
      )
        throw new Error("Complete your name, email, and consent.");
      if (
        state.users.some(
          (item) => item.email.toLowerCase() === body.email.toLowerCase(),
        )
      )
        throw new Error("That email already has a demo account.");
      if (!["admin", "exhibitor", "attendee"].includes(body.role))
        throw new Error("Choose an account role.");
      const account = {
        _id: id(),
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        role: body.role,
        active: true,
        passwordHash: await fingerprint(body.password),
      };
      state.users.push(account);
      notify(state, account._id, "Welcome to your EventSphere demo.");
      save(state);
      sessionStorage.setItem(userKey, account._id);
      return { user: publicUser(account) };
    }
    if (recordId === "forgot") {
      const account = state.users.find(
        (item) => item.email.toLowerCase() === body.email?.trim().toLowerCase(),
      );
      if (!account)
        throw new Error(
          "No demo account uses that email. Try one of the sample accounts or sign up.",
        );
      const token = id();
      state.resets.push({
        token,
        user: account._id,
        expires: Date.now() + 1800000,
      });
      save(state);
      return {
        message:
          "Your demo reset link is ready. No email is sent in this frontend preview.",
        resetLink: `/reset-password?token=${token}`,
      };
    }
    if (recordId === "reset") {
      validatePassword(body.password);
      const reset = state.resets.find(
        (item) => item.token === body.token && item.expires > Date.now(),
      );
      if (!reset)
        throw new Error(
          "This demo reset link has expired or was already used.",
        );
      const account = requireRecord(state.users, reset.user);
      account.passwordHash = await fingerprint(body.password);
      account.demoAccount = false;
      state.resets = state.resets.filter((item) => item.token !== body.token);
      save(state);
      return {
        message: "Your demo password was updated. You can sign in now.",
      };
    }
    if (recordId === "profile") {
      requireRole(user);
      if (body.name?.trim().length < 2)
        throw new Error("Please enter your name.");
      user.name = body.name.trim();
      save(state);
      return publicUser(user);
    }
  }
  if (collection === "community")
    return {
      events: state.events.length,
      exhibitors: state.companies.length,
      registrations: state.registrations.filter((item) => !item.session).length,
      booths: state.booths.length,
      reviews: state.feedback
        .filter((item) => item.kind === "feedback" && item.publish)
        .slice(0, 3),
    };
  if (collection === "events" && method === "GET") {
    if (!recordId) {
      const params = new URLSearchParams(query);
      return state.events
        .filter(
          (event) =>
            (!params.get("type") || event.type === params.get("type")) &&
            (!params.get("category") ||
              event.category === params.get("category")),
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    const event = requireRecord(state.events, recordId, "Event");
    return {
      event,
      sessions: state.sessions
        .filter((session) => session.event === recordId)
        .sort((a, b) => new Date(a.start) - new Date(b.start)),
      booths: state.booths
        .filter((booth) => booth.event === recordId)
        .map((booth) => ({
          ...booth,
          occupant: state.users.find((person) => person._id === booth.occupant)
            ? publicUser(
                state.users.find((person) => person._id === booth.occupant),
              )
            : null,
        })),
      exhibitors: state.applications
        .filter((item) => item.event === recordId && item.status === "approved")
        .map((item) =>
          state.companies.find((company) => company._id === item.company),
        )
        .filter(Boolean),
    };
  }
  if (
    collection === "contact" ||
    (collection === "feedback" && method === "POST")
  ) {
    if (!body.message?.trim()) throw new Error("Please write a message.");
    const feedback = {
      ...body,
      _id: id(),
      user: user?._id,
      name: user?.name || body.name,
      rating: Number(body.rating || 5),
      publish: body.kind === "feedback" && !!body.publish,
      status: "open",
      createdAt: timestamp(),
    };
    state.feedback.unshift(feedback);
    notify(state, "admin", "A new community inquiry is waiting in support.");
    save(state);
    return feedback;
  }
  requireRole(user);
  if (collection === "portal") return portal(state, user);
  let result = { message: "Saved in this browser." };
  if (collection === "events") {
    if (operation === "register") {
      requireRole(user, "attendee");
      const event = requireRecord(state.events, recordId, "Event");
      if (new Date(event.endDate || event.date) < new Date())
        throw new Error("This event has ended.");
      const session = body.session
        ? requireRecord(state.sessions, body.session, "Session")
        : null;
      if (session && session.event !== event._id)
        throw new Error("Choose a session from this event.");
      if (
        session &&
        !state.registrations.some(
          (item) =>
            item.user === user._id && item.event === recordId && !item.session,
        )
      )
        throw new Error("Book event admission before joining a session.");
      if (
        state.registrations.some(
          (item) =>
            item.user === user._id &&
            item.event === recordId &&
            (item.session || null) === (body.session || null),
        )
      )
        throw new Error("You are already registered.");
      const target = session || event;
      if (target.registrationCount >= target.capacity)
        throw new Error("This experience is fully booked.");
      target.registrationCount++;
      result = {
        _id: id(),
        user: user._id,
        event: recordId,
        session: body.session || null,
      };
      state.registrations.push(result);
      notify(state, user._id, `Registration confirmed: ${target.title}.`);
    } else if (operation === "apply") {
      requireRole(user, "exhibitor");
      const event = requireRecord(state.events, recordId, "Expo");
      const company = state.companies.find((item) => item.user === user._id);
      if (!company) throw new Error("Complete your company profile first.");
      if (
        event.type !== "expo" ||
        new Date(event.endDate || event.date) < new Date()
      )
        throw new Error("This expo is unavailable.");
      if (
        state.applications.some(
          (item) => item.user === user._id && item.event === recordId,
        )
      )
        throw new Error("You have already applied to this expo.");
      result = {
        _id: id(),
        event: recordId,
        user: user._id,
        company: company._id,
        status: "pending",
        note: body.note || "",
      };
      state.applications.push(result);
      notify(state, "admin", `${company.name} applied to ${event.title}.`);
    } else {
      requireRole(user, "admin");
      if (method === "DELETE") {
        const event = requireRecord(state.events, recordId);
        const sessionIds = state.sessions
          .filter((item) => item.event === recordId)
          .map((item) => item._id);
        state.registrations
          .filter((item) => item.event === recordId)
          .forEach((item) =>
            notify(state, item.user, `${event.title} has been cancelled.`),
          );
        for (const key of [
          "events",
          "booths",
          "sessions",
          "applications",
          "reservations",
          "registrations",
          "visits",
        ])
          state[key] = state[key].filter((item) =>
            key === "events" ? item._id !== recordId : item.event !== recordId,
          );
        state.bookmarks = state.bookmarks.filter(
          (item) => !sessionIds.includes(item.session),
        );
      } else {
        checkEvent(body);
        const values = {
          ...body,
          capacity: Number(body.capacity),
          price: Number(body.price),
        };
        if (recordId) {
          result = requireRecord(state.events, recordId);
          if (values.capacity < result.registrationCount)
            throw new Error("Capacity is below current registrations.");
          Object.assign(result, values);
          state.registrations
            .filter((item) => item.event === recordId && !item.session)
            .forEach((item) =>
              notify(
                state,
                item.user,
                `Event details updated: ${result.title}.`,
              ),
            );
        } else {
          result = {
            ...values,
            _id: id(),
            owner: user._id,
            registrationCount: 0,
          };
          state.events.push(result);
          addBooths(state, result._id);
        }
      }
    }
  } else if (collection === "company") {
    requireRole(user, "exhibitor");
    if (!body.name?.trim() || !body.description?.trim())
      throw new Error("Add your company name and story.");
    result = state.companies.find((item) => item.user === user._id);
    if (result) Object.assign(result, body);
    else {
      result = { ...body, _id: id(), user: user._id };
      state.companies.push(result);
    }
  } else if (collection === "applications") {
    requireRole(user, "admin");
    result = requireRecord(state.applications, recordId);
    if (!["approved", "rejected"].includes(body.status))
      throw new Error("Choose approve or reject.");
    if (
      body.status === "rejected" &&
      state.reservations.some(
        (item) =>
          item.user === result.user &&
          item.event === result.event &&
          ["pending", "approved"].includes(item.status),
      )
    )
      throw new Error(
        "Cancel active booth reservations before rejecting this application.",
      );
    result.status = body.status;
    notify(state, result.user, `Your expo application was ${body.status}.`);
  } else if (collection === "booths") {
    const booth = requireRecord(state.booths, recordId, "Booth");
    if (operation === "reserve") {
      requireRole(user, "admin", "exhibitor");
      const owner = user.role === "admin" ? body.user : user._id;
      if (booth.status !== "available")
        throw new Error(
          "This booth is already reserved. Choose another space.",
        );
      if (
        !state.applications.some(
          (item) =>
            item.user === owner &&
            item.event === booth.event &&
            item.status === "approved",
        )
      )
        throw new Error("An approved expo application is required.");
      Object.assign(booth, { status: "reserved", occupant: owner });
      result = {
        _id: id(),
        event: booth.event,
        booth: booth._id,
        user: owner,
        status: "pending",
      };
      state.reservations.push(result);
      notify(state, "admin", `Booth ${booth.code} is waiting for approval.`);
    } else if (operation === "visit") {
      requireRole(user, "attendee");
      if (
        booth.status !== "occupied" ||
        !state.registrations.some(
          (item) =>
            item.user === user._id &&
            item.event === booth.event &&
            !item.session,
        )
      )
        throw new Error(
          "Register for the event, then choose an allocated booth.",
        );
      if (
        !state.visits.some(
          (item) => item.user === user._id && item.booth === recordId,
        )
      )
        state.visits.push({
          _id: id(),
          user: user._id,
          booth: recordId,
          event: booth.event,
        });
      result = { message: "Booth check-in saved." };
    } else {
      requireRole(user, "admin", "exhibitor");
      if (user.role !== "admin" && booth.occupant !== user._id)
        throw new Error("You can edit only your own booth.");
      Object.assign(booth, { products: body.products, staff: body.staff });
      result = booth;
    }
  } else if (collection === "reservations") {
    requireRole(user, "admin", "exhibitor");
    result = requireRecord(state.reservations, recordId);
    if (!["pending", "approved"].includes(result.status))
      throw new Error("This reservation is already closed.");
    if (
      user.role !== "admin" &&
      (result.user !== user._id || body.status !== "cancelled")
    )
      throw new Error("Only the organizer can review reservations.");
    if (!["approved", "rejected", "cancelled"].includes(body.status))
      throw new Error("Choose a valid reservation status.");
    result.status = body.status;
    if (body.status === "approved")
      requireRecord(state.booths, result.booth).status = "occupied";
    else releaseBooth(state, result);
    notify(state, result.user, `Your booth reservation is ${body.status}.`);
  } else if (collection === "sessions") {
    if (operation === "bookmark") {
      requireRole(user, "attendee");
      requireRecord(state.sessions, recordId);
      const old = state.bookmarks.find(
        (item) => item.user === user._id && item.session === recordId,
      );
      if (old)
        state.bookmarks = state.bookmarks.filter(
          (item) => item._id !== old._id,
        );
      else
        state.bookmarks.push({ _id: id(), user: user._id, session: recordId });
      result = { bookmarked: !old };
    } else {
      requireRole(user, "admin");
      if (method === "DELETE") {
        const session = requireRecord(state.sessions, recordId);
        const affected = [
          ...state.registrations.filter((item) => item.session === recordId),
          ...state.bookmarks.filter((item) => item.session === recordId),
        ];
        affected.forEach((item) =>
          notify(state, item.user, `Session cancelled: ${session.title}.`),
        );
        state.sessions = state.sessions.filter((item) => item._id !== recordId);
        state.registrations = state.registrations.filter(
          (item) => item.session !== recordId,
        );
        state.bookmarks = state.bookmarks.filter(
          (item) => item.session !== recordId,
        );
      } else {
        const event = requireRecord(state.events, body.event);
        if (
          !body.title?.trim() ||
          !body.speaker?.trim() ||
          new Date(body.end) <= new Date(body.start) ||
          new Date(body.start) < new Date(event.date) ||
          (event.endDate && new Date(body.end) > new Date(event.endDate))
        )
          throw new Error(
            "Complete the session details and use a time within the event dates.",
          );
        if (Number(body.capacity) < 1)
          throw new Error("Session capacity must be at least one.");
        const values = { ...body, capacity: Number(body.capacity) };
        if (recordId) {
          result = requireRecord(state.sessions, recordId);
          if (values.capacity < result.registrationCount)
            throw new Error("Capacity is below current registrations.");
          Object.assign(result, values);
          [...state.registrations, ...state.bookmarks]
            .filter((item) => item.session === recordId)
            .forEach((item) =>
              notify(state, item.user, `Schedule updated: ${result.title}.`),
            );
        } else {
          result = { ...values, _id: id(), registrationCount: 0 };
          state.sessions.push(result);
        }
      }
    }
  } else if (collection === "registrations") {
    requireRole(user, "attendee");
    const registration = requireRecord(state.registrations, recordId);
    if (registration.user !== user._id)
      throw new Error("This booking belongs to another attendee.");
    cancelBooking(state, registration);
  } else if (collection === "notifications")
    state.notifications
      .filter((item) => item.user === user._id)
      .forEach((item) => (item.read = true));
  else if (collection === "messages") {
    if (!body.body?.trim() || body.to === user._id)
      throw new Error("Choose a recipient and write a message.");
    requireRecord(state.users, body.to);
    result = {
      _id: id(),
      from: user._id,
      to: body.to,
      body: body.body.trim(),
      createdAt: timestamp(),
    };
    state.messages.push(result);
    notify(state, body.to, `New message from ${user.name}.`);
  } else if (collection === "feedback") {
    requireRole(user, "admin");
    result = requireRecord(state.feedback, recordId);
    result.status = body.status;
    if (result.user)
      notify(state, result.user, `Your inquiry is ${body.status}.`);
  } else if (collection === "users") {
    requireRole(user, "admin");
    result = requireRecord(state.users, recordId);
    if (result.role === "admin")
      throw new Error("Organizer accounts stay active in this demo.");
    result.active = !!body.active;
  } else if (collection === "uploads") {
    requireRole(user, "exhibitor");
    const file = body.get("file");
    if (
      !file ||
      !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(
        file.type,
      ) ||
      file.size > 1024 * 1024
    )
      throw new Error(
        "Choose a JPG, PNG, WebP, or PDF under 1 MB for this browser demo.",
      );
    const url = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("This file could not be read."));
      reader.readAsDataURL(file);
    });
    return { url };
  } else throw new Error("That demo action is unavailable.");
  save(state);
  return structuredClone(result);
}
