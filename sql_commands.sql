-- To retrieve all sequences:

select * from information_schema.columns where extra like '%auto_increment%';

-- To check if hall is available on a particular day and to retrieve available slots for a particular hall

SELECT halls FROM booking WHERE event_id IN (SELECT id FROM events WHERE date_wanted = '2019-11-14')
