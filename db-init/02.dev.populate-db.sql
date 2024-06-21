/* populate dev database with mock users */
INSERT INTO users (email, name)
VALUES
  ('johnjohnson@example.com', 'John Johnson'),
  ('emilyjohnson@example.com', 'Emily Johnson'),
  ('michaeljohnson@example.com', 'Michael Johnson'),
  ('emmawilliams@example.com', 'Emma Williams'),
  ('danielwilliams@example.com', 'Daniel Williams'),
  ('sophiawilliams@example.com', 'Sophia Williams'),
  ('matthewmiller@example.com', 'Matthew Miller'),
  ('oliviamiller@example.com', 'Olivia Miller'),
  ('jacobmiller@example.com', 'Jacob Miller'),
  ('isabelladavis@example.com', 'Isabella Davis'),
  ('williamdavis@example.com', 'William Davis'),
  ('avadavis@example.com', 'Ava Davis'),
  ('jamesjones@example.com', 'James Jones'),
  ('miajones@example.com', 'Mia Jones'),
  ('benjaminjones@example.com', 'Benjamin Jones'),
  ('sophiebrown@example.com', 'Sophie Brown'),
  ('alexanderbrown@example.com', 'Alexander Brown'),
  ('charlottebrown@example.com', 'Charlotte Brown'),
  ('davidsmith@example.com', 'David Smith'),
  ('ellasmith@example.com', 'Ella Smith')
;

/* now same thing for families */
INSERT INTO families (admin_id, surname)
VALUES
  (1, 'Johnson'),
  (4, 'Williams'),
  (7, 'Miller'),
  (10, 'Davis'),
  (13, 'Jones')
;

INSERT INTO family_members (family_id, member_id)
VALUES 
  (1, 1),
  (2, 4),
  (3, 7),
  (4, 10),
  (5, 13)
;
