/* populate dev database with mock users */
INSERT INTO users (id, email, name, password, created_at)
VALUES
  (1, 'johnjohnson@example.com', 'John Johnson', 'randompassword1', NOW()),
  (2, 'emilyjohnson@example.com', 'Emily Johnson', 'randompassword2', NOW()),
  (3, 'michaeljohnson@example.com', 'Michael Johnson', 'randompassword3', NOW()),
  (4, 'emmawilliams@example.com', 'Emma Williams', 'randompassword4', NOW()),
  (5, 'danielwilliams@example.com', 'Daniel Williams', 'randompassword5', NOW()),
  (6, 'sophiawilliams@example.com', 'Sophia Williams', 'randompassword6', NOW()),
  (7, 'matthewmiller@example.com', 'Matthew Miller', 'randompassword7', NOW()),
  (8, 'oliviamiller@example.com', 'Olivia Miller', 'randompassword8', NOW()),
  (9, 'jacobmiller@example.com', 'Jacob Miller', 'randompassword9', NOW()),
  (10, 'isabelladavis@example.com', 'Isabella Davis', 'randompassword10', NOW()),
  (11, 'williamdavis@example.com', 'William Davis', 'randompassword11', NOW()),
  (12, 'avadavis@example.com', 'Ava Davis', 'randompassword12', NOW()),
  (13, 'jamesjones@example.com', 'James Jones', 'randompassword13', NOW()),
  (14, 'miajones@example.com', 'Mia Jones', 'randompassword14', NOW()),
  (15, 'benjaminjones@example.com', 'Benjamin Jones', 'randompassword15', NOW()),
  (16, 'sophiebrown@example.com', 'Sophie Brown', 'randompassword16', NOW()),
  (17, 'alexanderbrown@example.com', 'Alexander Brown', 'randompassword17', NOW()),
  (18, 'charlottebrown@example.com', 'Charlotte Brown', 'randompassword18', NOW()),
  (19, 'davidsmith@example.com', 'David Smith', 'randompassword19', NOW()),
  (20, 'ellasmith@example.com', 'Ella Smith', 'randompassword20', NOW());

/* now same thing for families */
INSERT INTO families (admin_id, surname, created_at)
VALUES
  (1, 'Johnson', NOW()),
  (4, 'Williams', NOW()),
  (7, 'Miller', NOW()),
  (10, 'Davis', NOW()),
  (13, 'Jones', NOW());
