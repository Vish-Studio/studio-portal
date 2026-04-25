import Layout from '../components/common/layout/layout';
import CalendarWidget from '../components/admin/calendar/calendar';

// The Calendar component embeds a full month grid, a day-level schedule panel,
// and add / edit / delete modals — all wired to useCalendarStore.
// Events created here automatically appear on the Dashboard widget (shared store).

const CalendarPage = () => (
  <Layout title="Calendar">
    <CalendarWidget />
  </Layout>
);

export default CalendarPage;
