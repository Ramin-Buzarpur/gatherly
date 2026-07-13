import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/rootStore';
import agent from '../../api/agent';
import type { EventDetails, AttendeeDto } from '../../types/event';

const EventDetailPage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const { authStore } = useStore();
  const { user } = authStore;

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadEvent = async () => {
    if (!id) return;
    try {
      const data = await agent.Events.details(id);
      setEvent(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [id]);

  // محاسبه وضعیت کاربر نسبت به ایونت
  const currentAttendee: AttendeeDto | undefined = event?.attendees.find(
    (a) => a.id === user?.id
  );
  const isHost      = currentAttendee?.isHost === true;
  const isAttendee  = !!currentAttendee && !isHost;
  const isCancelled = event?.isCancelled === true;

  const host = event?.attendees.find((a) => a.isHost);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });

  const handleAttend = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await agent.Events.attend(id);
      await loadEvent(); // reload تا state آپدیت بشه
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <span className="text-[#14B8A6] text-[20px]">Loading event...</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center py-40">
        <span className="text-gray-400 text-[20px]">Event not found.</span>
      </div>
    );
  }

  return (
    <div className="bg-[#F3F4F6] py-10 px-6 lg:px-10">
      <div className="grid grid-cols-3 gap-6 items-start">

        {/* ستون چپ */}
        <div className="col-span-2 flex flex-col gap-6">

          {/* تصویر Hero با اطلاعات روی آن */}
          <div
            className="relative w-full h-[320px] rounded-[16px] overflow-hidden"
            style={{ boxShadow: '4px 4px 8px 0 rgba(0,0,0,0.25)' }}
          >
            <img
              src={`https://placehold.co/1200x400/e2e8f0/64748b?text=${encodeURIComponent(event.category)}`}
              alt={event.title}
              className="w-full h-full object-cover"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Badge Cancelled */}
            {isCancelled && (
              <div className="absolute top-4 left-4 bg-white text-red-500 text-[14px] font-medium px-4 py-1 rounded-full">
                Cancelled
              </div>
            )}

            {/* اطلاعات پایین Hero */}
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-[22px] font-semibold">{event.title}</p>
              <p className="text-[14px] opacity-90">{formatDate(event.startDate)}</p>
              <p className="text-[14px] opacity-90">
                hosted by{' '}
                <span className="underline cursor-pointer">{host?.displayName ?? 'Unknown'}</span>
              </p>
            </div>

            {/* دکمه‌های action */}
            <div className="absolute bottom-4 right-4 flex gap-3">
              {isHost ? (
                <>
                  {/* Host: Cancel یا Reactivate + Manage */}
                  <button
                    onClick={handleAttend}
                    disabled={isSubmitting}
                    className={`px-5 py-2 rounded-full text-[15px] font-medium transition-colors ${
                      isCancelled
                        ? 'bg-[#14B8A6] text-white hover:bg-[#0d9488]'
                        : 'bg-[#F87171] text-white hover:bg-[#ef4444]'
                    }`}
                  >
                    {isCancelled ? 'Reactivate' : 'Cancel Event'}
                  </button>
                  <button className="px-5 py-2 rounded-full text-[15px] font-medium bg-white/20 border border-white text-white hover:bg-white/30 transition-colors">
                    Manage Event
                  </button>
                </>
              ) : isAttendee ? (
                /* Attendee: Cancel Attendance */
                <button
                  onClick={handleAttend}
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-full text-[15px] font-medium bg-[#14B8A6] text-white hover:bg-[#0d9488] transition-colors"
                >
                  Cancel Attendance
                </button>
              ) : (
                /* Guest: Join Event */
                <button
                  onClick={handleAttend}
                  disabled={isSubmitting || isCancelled}
                  className="px-5 py-2 rounded-full text-[15px] font-medium bg-[#14B8A6] text-white hover:bg-[#0d9488] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join Event
                </button>
              )}
            </div>
          </div>

          {/* جزئیات ایونت */}
          <div
            className="bg-white rounded-[16px] p-8 flex flex-col gap-6"
            style={{ boxShadow: '4px 4px 8px 0 rgba(0,0,0,0.25)' }}
          >
            {/* عنوان */}
            <div className="flex items-center gap-4">
              <div className="text-[#14B8A6]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              <span className="text-[#1F2937] text-[20px]">{event.title}</span>
            </div>

            {/* تاریخ */}
            <div className="flex items-center gap-4">
              <div className="text-[#14B8A6]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-[#1F2937] text-[20px]">{formatDate(event.startDate)}</span>
            </div>

            {/* لوکیشن */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-[#14B8A6]">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-[#1F2937] text-[20px]">{event.venue}</span>
              </div>
              <button className="text-[#14B8A6] text-[16px] hover:underline">show map</button>
            </div>

            {/* توضیحات */}
            <div className="flex items-start gap-4">
              <div className="text-[#14B8A6] mt-1">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-[#1F2937] text-[18px] leading-relaxed">{event.description}</p>
            </div>
          </div>
        </div>

        {/* ستون راست: Attendees */}
        <div
          className="col-span-1 sticky top-[160px] self-start bg-white rounded-[16px] overflow-hidden"
          style={{ boxShadow: '4px 4px 8px 0 rgba(0,0,0,0.25)' }}
        >
          {/* هدر */}
          <div className="bg-[#14B8A6] px-6 py-4">
            <p className="text-white text-[18px] font-medium text-center">
              {event.attendees.length} {event.attendees.length === 1 ? 'person' : 'people'} going
            </p>
          </div>

          {/* لیست شرکت‌کنندگان */}
          <div className="divide-y divide-gray-100">
            {event.attendees.map((attendee) => (
              <div key={attendee.id} className="flex items-center gap-4 px-6 py-4">
                <img
                  src={
                    attendee.imageUrl ||
                    `https://placehold.co/100x100/e2e8f0/64748b?text=${attendee.displayName.charAt(0)}`
                  }
                  alt={attendee.displayName}
                  className="w-[70px] h-[70px] rounded-[12px] object-cover flex-shrink-0"
                />
                <span className="text-[#1F2937] text-[18px] font-medium flex-1">
                  {attendee.displayName}
                </span>
                {attendee.isHost && (
                  <span className="bg-[#F87171] text-white text-[13px] font-medium px-3 py-1 rounded-full">
                    Host
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
});

export default EventDetailPage;