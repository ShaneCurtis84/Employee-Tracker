
USE employee_db;

INSERT INTO department (department_name)
VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES

('Sales Lead', 100000, 1),
('Sales Person', 80000, 1),
('Lead Engineer', 150000, 2),
('Software Engineer', 120000, 2),
('Accountant', 100000, 3),
('Finance Manager', 125000, 3),
('Legal Team Lead', 150000, 4),
('Lawyer', 120000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Lebron', 'James', 1, NULL),
('Kevin', 'Durant', 2, 1),
('Michael', 'Jordan', 3, Null),
('Kobe', 'Bryant', 4, 2),
('Kyle', 'Lowry', 5, NULL),
('Vince', 'Carter', 6, 3),
('Reggie', 'Miller', 7, NULL),
('Demar', 'Derozan', 8, 4);


INSERT INTO
  manager (id, manager_name)
VALUES
  (1, 'Lebron James'),
  (2, 'Michael Jordan'),
  (3, 'Kyle Lowry'),
  (4, 'Reggie Miller');
  
