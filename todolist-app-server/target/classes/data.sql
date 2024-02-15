INSERT IGNORE INTO roles(name) VALUES('ROLE_USER');
INSERT IGNORE INTO roles(name) VALUES('ROLE_ADMIN');

insert ignore into tasks (created_by, completed, note, priority , title) values (2, false, 'save this task to calendar', 1, 'my first task');
insert ignore into tasks (created_by, completed, note, priority , title) values (2, false, 'remind to setup alarm first', 1, 'wake up early');
