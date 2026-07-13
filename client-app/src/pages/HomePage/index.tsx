import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import EventCard from '../../components/EventCard';
import CalendarWidget from '../../components/CalendarWidget';
import { useStore } from '../../stores/rootStore';

const CATEGORIES = [
  { label: 'Sports',  value: 1 },
  { label: 'Science', value: 2 },
  { label: 'Leisure', value: 3 },
  { label: 'Other',   value: 4 },
];

const HomePage = observer(() => {
  const { eventStore } = useStore();
  const { events, isLoading, selectedCategory, setCategory, loadEvents } = eventStore;

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });

  return (
    <div className="bg-[#F3F4F6] py-10 px-6 lg:px-10">
      <div className="grid grid-cols-3 gap-6 items-start">

        {/* ستون چپ: ایونت‌ها */}
        <div className="col-span-2 grid grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-2 flex items-center justify-center py-20">
              <span className="text-[#14B8A6] text-[20px]">Loading events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="col-span-2 flex items-center justify-center py-20">
              <span className="text-gray-400 text-[20px]">No events found.</span>
            </div>
          ) : (
            events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={formatDate(event.startDate)}
                location={event.venue + (event.city ? `, ${event.city}` : '')}
                description={event.description}
                hostName="Host"
                imageUrl={`https://placehold.co/600x400/e2e8f0/64748b?text=${encodeURIComponent(event.category)}`}
              />
            ))
          )}
        </div>

        {/* ستون راست: sticky sidebar */}
        <div className="col-span-1 sticky top-[160px] self-start flex flex-col gap-6">

          {/* Event Type Widget */}
          <div
            className="bg-[#FFFFFF] rounded-[16px] p-6"
            style={{ boxShadow: '4px 4px 8px 0 rgba(0,0,0,0.25)' }}
          >
            <h3 className="text-2xl font-medium text-[#1F2937] mb-6">Event Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(selectedCategory === cat.value ? 0 : cat.value)}
                  className={`py-2 px-3 rounded-[16px] text-base font-medium border transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-[#14B8A6] text-white border-[#14B8A6]'
                      : 'border-[#14B8A6] text-[#14B8A6] hover:bg-teal-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Widget */}
          <div
            className="rounded-[16px] overflow-hidden"
            style={{ boxShadow: '4px 4px 8px 0 rgba(0,0,0,0.25)', height: '460px' }}
          >
            <CalendarWidget />
          </div>

        </div>
      </div>
    </div>
  );
});

export default HomePage;