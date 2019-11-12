-- To retrieve all sequences:

select * from information_schema.columns where extra like '%auto_increment%';

-- To check if hall is available on a particular day

select hall_id from hall_schedule where booking_id in (select booking_id from slot_schedule where booking_id in (select id from booking where event_id in (select id from events WHERE date_wanted='2019-11-11')) and slot_id='10')

-- To retrieve available slots for a particular hall

<<<<<<< HEAD
<<<<<<< HEAD
SELECT hall_id FROM hall_schedule WHERE booking_id in (select booking_id from slot_schedule where booking_id in (select id from booking where event_id in (select id from events WHERE date_wanted='2019-11-11')) and slot_id='9')
=======
select slot_id from slot_schedule where booking_id in (select booking_id from slot_schedule where booking_id in (select id from booking where event_id in (select id from events WHERE date_wanted='2019-11-11')) and slot_id='1')
>>>>>>> Add SQL for slot checking
=======
SELECT hall_id FROM hall_schedule WHERE booking_id in (select booking_id from slot_schedule where booking_id in (select id from booking where event_id in (select id from events WHERE date_wanted='2019-11-11')) and slot_id='9')
>>>>>>> Add SQL for slot
