# EventSphere Management — Frontend

A complete React frontend demonstration with a blush, ivory, and muted rose design inspired by the supplied theme reference. It uses realistic sample data and browser storage for the event-management workflows.

## Start

Install Node.js 22.12 or newer, which includes npm. Extract the ZIP, open the `EventSphere-Frontend` folder in your editor or terminal, and run:

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite, normally `http://127.0.0.1:5173/`. No environment variables, database setup, credentials, or extra service are needed. The only development process is Vite.

## Try the dashboards

Open **Sign in** and choose **Organizer**, **Exhibitor**, or **Attendee** under **Explore a sample account**. Alternatively, use these credentials:

| Role | Email | Password |
| --- | --- | --- |
| Organizer | admin@eventsphere.test | EventSphere123! |
| Exhibitor | exhibitor@eventsphere.test | EventSphere123! |
| Attendee | attendee@eventsphere.test | EventSphere123! |

Signup creates a local demo account for the selected role. Role restrictions and sign-in demonstrate frontend behavior, rather than production security. Use fictional details when testing.

Changes are saved to localStorage. The current account is kept in sessionStorage so separate tabs can demonstrate different roles with the same saved event data. Changes also refresh other open tabs through the browser's storage event. Use the same origin consistently; `localhost` and `127.0.0.1` have separate browser storage.

## Included pages and interactions

**Public website:** landing page, our story, expos, events, event details, categories, gallery with enlargement, FAQs, contact form, community reviews, statistics, login, signup, forgot password, reset password, privacy notice, and a not-found page. Navigation uses React Router. Event discovery includes search and category filtering.

**Organizer:** overview metrics, charts, event creation/editing/deletion, categories, exhibitor applications, approval/rejection, booth allocation and reservation review, interactive floor plans, sessions and speakers, reports, CSV export, user access management, messaging, notifications, support inquiries, profile settings, and demo reset.

**Exhibitor:** overview, company profile, logo/document previews and attachments, expo discovery and applications, application status, booth selection and reservations, products and staff details, organizer/community messages, notifications, support, and account settings.

**Attendee:** overview, event registration, event details, session registration, bookmarks, floor plans, exhibitor search by category/products/keywords, booth locations, booth check-ins, messaging, saved sessions, registered events, cancellations, notifications, feedback, and profile settings.

Dialogs, confirmation controls, tabs, validation, loading, empty states, errors, and toast messages are included. The UI uses Tailwind, reusable shadcn-style components with Radix primitives, Lucide icons, and Recharts analytics. All custom styling is in JSX or the single global stylesheet.

## Suggested walkthrough

1. Sign in as the exhibitor. The company is approved for **The Creative Collective** and awaiting approval for **A Greener Tomorrow**.
2. Select a free booth in **Expo floor plans**. It becomes pending and cannot be selected again.
3. Sign in as the organizer in another tab. Review and approve the reservation. Return to the exhibitor tab to see the allocated space.
4. Create a new event as organizer. A 16-booth floor plan is added automatically. Add sessions, speakers, times, rooms, and capacities.
5. Sign in as attendee. Register for the new event, join its sessions, and save a session. Existing sample events already have representative attendee bookings.
6. Browse the exhibitor directory, follow a booth-location link, and start a conversation. Send a support inquiry and review it as organizer.
7. Open reports, inspect the charts, and download the CSV. Counts are computed from the demo records, including your changes.
8. Refresh to see that your work persists. Use **Account settings → Reset sample data** whenever you want a fresh demonstration.

Cancelling event admission also cancels its session bookings. Booth approval confirms a held space; rejection or cancellation releases it. Active booth reservations must be cancelled before rejecting the related application. Registration checks duplicates, available places, and event admission before session admission.

## Password reset, attachments, and reminders

Forgot password produces a clickable, local demo reset link; it sends no email. A link expires after 30 minutes and can be used once. Resetting a sample account changes its password, so use the normal form afterward or reset the sample data to restore the default credentials.

Company attachments use the browser FileReader API and are stored with the saved profile. Supported types are JPG, PNG, WebP, and PDF, up to 1 MB per file. Browser storage has a finite quota; the app reports storage-full errors. Attach only small fictional examples. There is no remote file upload.

Bookmarked sessions create an in-app reminder within an hour of starting while the demo is open. Browser storage updates are checked each minute. This does not send email, push messages, or reminders while the browser is closed.

## Source structure

```text
public/
  images/       Bundled event photography
  fonts/        Bundled typography and font licenses
src/
  components/   Shared UI components, event cards, and community statistics
  context/      Demo account state
  data/         Sample accounts, events, exhibitors, booths, and schedules
  layouts/      Public website and dashboard navigation
  pages/        Public pages and the three role workspaces
  routes/       React Router navigation and demo role guards
  services/     Local demo actions, browser storage, and subscriptions
  index.css     Tailwind setup, local fonts, and global styles
tests/          Tests of browser-data workflows
```

The strings used to select actions in `demoStore.js` are local action names. They do not make HTTP requests. There is no backend, Express application, API integration, database, or Socket.IO dependency in this project.

## Checks and production preview

```sh
npm test
npm run build
npm run preview
```

Six tests exercise local accounts, registration, profile changes, role checks, event/session editing, applications, booth reservations/approval/release, bookings, bookmarks, cancellation, messaging, notifications, support, and password recovery. `npm run build` generates `dist` when needed; neither `dist` nor `node_modules` is included in the source ZIP. See `VERIFICATION.md` for observed checks.

The bundled sample data is initialized on the first visit, with event dates relative to that day. All photos and fonts needed by the initial design are included locally. No connection is required for app functionality after dependencies are installed. If publishing the built frontend, configure the static host to serve `index.html` for React Router paths.
