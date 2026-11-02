# Frontend verification

Verified on 31 October 2026 with Node.js 24.22.1 and npm 11.19.1.

- `npm install`: successful.
- `npm run dev`: Vite started the standalone frontend at `http://127.0.0.1:5173/`.
- `npm run build`: successful production build.
- `npm audit`: zero known vulnerabilities at the time checked.
- `npm test`: six tests passed, zero failed.

The six browser-data tests cover local accounts, signup, profile edits, sign-out, role checks, event creation/editing/deletion, schedule creation/deletion, application approval, reservation selection/approval/release, booth details, event/session bookings, duplicates, admission prerequisites, bookmarks, cancellation cleanup, messages, notifications, support resolution, review consent, and one-time local password reset.

Browser checks confirmed organizer, exhibitor, and attendee sample login; organizer dashboard pages; new-event creation and persistence after refresh; exhibitor booth selection and persistence after refresh; attendee event booking and persistence after refresh; redirecting an attendee away from an organizer URL; the reset confirmation and restoration of sample data; desktop rendering; and mobile navigation/search at a 390-pixel viewport without horizontal overflow.

Application data is stored only in the browser. There are no application HTTP calls, backend services, API integrations, or database dependencies. Seven images, seven font files, and font licenses are bundled locally. Vite's development connection is tooling, not an application API.

This is an interactive frontend demonstration. Accounts, bookings, messages, approvals, and reminders are simulated with saved local records. Authentication and permissions are interface demonstrations; they do not provide production security. Password recovery creates a local link without sending email. Reminders are checked while the app is open. Mock company information, reviews, and event content are fictional. File attachments are limited by browser storage.

Cross-browser certification, full screen-reader auditing, and every possible edge case have not been exhaustively tested. The documented workflows were checked using local-data tests and the in-app Chromium browser.
