-- To retrieve all sequences:

select * from information_schema.columns where extra like '%auto_increment%';
