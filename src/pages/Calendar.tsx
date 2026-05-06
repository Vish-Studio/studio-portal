import Layout from '../components/common/layout/layout';
import CalendarWidget from '../components/admin/calendar/calendar';

const CalendarPage = () => {
  return (
    <Layout title="Calendar">
      <div className="flex flex-col gap-4 pb-10">
        <CalendarWidget />
      </div>
    </Layout>
  );
};

export default CalendarPage;
