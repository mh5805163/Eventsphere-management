const image = (name) => `/images/${name}.jpg`;
export function createMockData() {
  const now = new Date();
  const future = (days, hour = 10) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    date.setHours(hour, 0, 0, 0);
    return date.toISOString();
  };
  const users = [
    ["admin", "Ayesha Khan", "admin", "admin@eventsphere.test"],
    ["exhibitor", "Sara Ahmed", "exhibitor", "exhibitor@eventsphere.test"],
    ["attendee", "Ali Hassan", "attendee", "attendee@eventsphere.test"],
    ["exhibitor-2", "Zain Malik", "exhibitor", "zain@eventsphere.test"],
    ["exhibitor-3", "Noor Siddiqui", "exhibitor", "noor@eventsphere.test"],
    ["attendee-2", "Mariam Raza", "attendee", "mariam@eventsphere.test"],
    ["attendee-3", "Omar Farooq", "attendee", "omar@eventsphere.test"],
    ["attendee-4", "Hina Shah", "attendee", "hina@eventsphere.test"],
  ].map(([_id, name, role, email]) => ({
    _id,
    name,
    role,
    email,
    demoAccount: true,
    active: true,
    createdAt: now.toISOString(),
  }));
  const events = [
    [
      "The Creative Collective",
      "Design & lifestyle",
      "expo",
      "Karachi Expo Centre",
      "photo-1511578314322-379afb476865",
      "A meeting of makers, designers, and extraordinary ideas. Discover independent brands, hands-on workshops, and your next creative collaboration.",
    ],
    [
      "A Greener Tomorrow",
      "Sustainability",
      "expo",
      "Lahore International Expo Centre",
      "photo-1416879595882-3373a0480b5b",
      "Explore thoughtful living through sustainable products, green innovations, and meaningful conversations.",
    ],
    [
      "An Evening in Bloom",
      "Celebrations",
      "event",
      "The Garden Pavilion, Karachi",
      "photo-1519741497674-611481863552",
      "An intimate garden celebration with beautiful flowers, live music, and exceptional dining.",
    ],
    [
      "Founders & Friends",
      "Business & technology",
      "expo",
      "Islamabad Convention Centre",
      "photo-1515187029135-18ee286d815b",
      "Meet the people shaping what comes next. A curated gathering of ambitious founders and innovative brands.",
    ],
    [
      "Little Moments, Big Magic",
      "Celebrations",
      "event",
      "Pearl Banquet, Karachi",
      "photo-1530103862676-de8c9debad1d",
      "A joyful family celebration filled with thoughtful details and unforgettable moments.",
    ],
    [
      "The Wedding Edit",
      "Weddings",
      "expo",
      "The Royal Palm, Lahore",
      "photo-1519225421980-715cb0215aed",
      "Discover contemporary wedding designers, floral artists, and the details that make a day yours.",
    ],
  ].map(([title, category, type, location, photo, description], i) => ({
    _id: `event-${i + 1}`,
    title,
    category,
    type,
    location,
    image: image(photo),
    description,
    date: future(7 + i * 7),
    endDate: future(7 + i * 7, 20),
    theme: category,
    capacity: 300 + i * 50,
    price: i % 2 ? 1500 : 0,
    owner: "admin",
    registrationCount: 0,
  }));
  const companies = [
    {
      _id: "company-1",
      user: "exhibitor",
      name: "Petal & Poise Studio",
      category: "Design & lifestyle",
      description:
        "Thoughtful floral installations, event styling, and objects for beautiful gatherings.",
      products: "Floral design, event styling, handcrafted decor",
      contact: "hello@petalandpoise.test",
      documents: [],
    },
    {
      _id: "company-2",
      user: "exhibitor-2",
      name: "Form & Function",
      category: "Business & technology",
      description:
        "Independent designers creating intuitive digital experiences and useful everyday objects.",
      products: "Brand design, digital products, interactive installations",
      contact: "studio@formfunction.test",
      documents: [],
    },
    {
      _id: "company-3",
      user: "exhibitor-3",
      name: "Rooted Living",
      category: "Sustainability",
      description:
        "Small steps toward greener homes, through conscious craft and considered materials.",
      products: "Planters, reusable homeware, sustainable decor",
      contact: "hello@rooted.test",
      documents: [],
    },
  ];
  const booths = events.flatMap((event) =>
    Array.from({ length: 16 }, (_, i) => ({
      _id: `${event._id}-booth-${i + 1}`,
      event: event._id,
      code: `${String.fromCharCode(65 + Math.floor(i / 4))}${(i % 4) + 1}`,
      size: i < 4 ? "6 × 6 m" : "3 × 3 m",
      price: i < 4 ? 950 : 450,
      products: "",
      staff: "",
      status: "available",
    })),
  );
  const applications = [
    {
      _id: "application-1",
      event: "event-1",
      user: "exhibitor",
      company: "company-1",
      status: "approved",
    },
    {
      _id: "application-2",
      event: "event-2",
      user: "exhibitor",
      company: "company-1",
      status: "pending",
    },
    {
      _id: "application-3",
      event: "event-1",
      user: "exhibitor-2",
      company: "company-2",
      status: "pending",
    },
    {
      _id: "application-4",
      event: "event-2",
      user: "exhibitor-3",
      company: "company-3",
      status: "approved",
    },
    {
      _id: "application-5",
      event: "event-6",
      user: "exhibitor-2",
      company: "company-2",
      status: "rejected",
    },
  ];
  const reservations = [
    {
      _id: "reservation-1",
      event: "event-1",
      booth: "event-1-booth-1",
      user: "exhibitor",
      status: "approved",
    },
    {
      _id: "reservation-2",
      event: "event-2",
      booth: "event-2-booth-3",
      user: "exhibitor-3",
      status: "pending",
    },
  ];
  reservations.forEach((reservation) => {
    const booth = booths.find((b) => b._id === reservation.booth);
    Object.assign(booth, {
      occupant: reservation.user,
      status: reservation.status === "approved" ? "occupied" : "reserved",
      products: "Thoughtfully crafted event collections",
      staff: "Studio team · Brand representatives",
    });
  });
  const sessions = events.flatMap((event, i) =>
    ["Opening conversations", "Ideas into action", "Meet the makers"].map(
      (title, s) => ({
        _id: `${event._id}-session-${s + 1}`,
        event: event._id,
        title,
        speaker: ["Ayesha Khan", "Zain Malik", "Sara Ahmed"][s],
        topic: event.theme,
        location: `Studio ${s + 1}`,
        start: future(7 + i * 7, 11 + s * 2),
        end: future(7 + i * 7, 12 + s * 2),
        capacity: 50,
        registrationCount: 0,
      }),
    ),
  );
  const registrations = [];
  const people = users.filter((user) => user.role === "attendee");
  events.forEach((event, i) => {
    people.slice(0, 1 + (i % 4)).forEach((user) => {
      registrations.push({
        _id: `registration-${registrations.length + 1}`,
        user: user._id,
        event: event._id,
        session: null,
      });
      if (i % 2 === 0)
        registrations.push({
          _id: `registration-${registrations.length + 1}`,
          user: user._id,
          event: event._id,
          session: `${event._id}-session-1`,
        });
    });
  });
  events.forEach(
    (event) =>
      (event.registrationCount = registrations.filter(
        (r) => r.event === event._id && !r.session,
      ).length),
  );
  sessions.forEach(
    (session) =>
      (session.registrationCount = registrations.filter(
        (r) => r.session === session._id,
      ).length),
  );
  return {
    users,
    events,
    companies,
    booths,
    sessions,
    applications,
    reservations,
    registrations,
    bookmarks: [
      { _id: "bookmark-1", user: "attendee", session: "event-1-session-2" },
    ],
    notifications: users.map((user) => ({
      _id: `welcome-${user._id}`,
      user: user._id,
      text: `Welcome, ${user.name.split(" ")[0]}. Your next great experience starts here.`,
      read: false,
      createdAt: now.toISOString(),
    })),
    feedback: [
      {
        _id: "feedback-1",
        user: "attendee-2",
        name: "Mariam Raza",
        message: "Could you add more hands-on design workshops?",
        kind: "feedback",
        rating: 5,
        publish: true,
        sample: true,
        status: "open",
        createdAt: now.toISOString(),
      },
      {
        _id: "feedback-2",
        name: "Jasmine R.",
        message:
          "Every detail felt considered. Every moment felt effortless. A beautiful experience from beginning to end.",
        kind: "feedback",
        rating: 5,
        publish: true,
        sample: true,
        status: "resolved",
        createdAt: now.toISOString(),
      },
      {
        _id: "feedback-3",
        user: "exhibitor",
        name: "Sara Ahmed",
        message: "Can you confirm the setup time for our booth?",
        kind: "support",
        status: "open",
        createdAt: now.toISOString(),
      },
    ],
    messages: [
      {
        _id: "message-1",
        from: "admin",
        to: "exhibitor",
        body: "Your place at The Creative Collective is confirmed. We look forward to welcoming your studio!",
        createdAt: now.toISOString(),
      },
    ],
    visits: [
      {
        _id: "visit-1",
        user: "attendee",
        booth: "event-1-booth-1",
        event: "event-1",
      },
    ],
    resets: [],
  };
}
