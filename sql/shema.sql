DROP DATABASE work;
CREATE DATABASE work;

USE work;

CREATE TABLE departments(
    id INT  AUTO_INCREMENT,

    name VARCHAR(30) NOT NULL,

    PRIMARY KEY (id)
);

INSERT INTO departments(name) VALUE('SALES'); 


CREATE TABLE roles(
id INT  AUTO_INCREMENT,
title varchar(30) NOT NULL,
salary decimal NOT NULL,
department_id INT,

   PRIMARY KEY (id),
   foreign key (department_id) 
   references departments(id)
   
    );
    INSERT INTO roles(title,salary) VALUE('intern','40');
    DESCRIBE roles;
    
    CREATE TABLE employee(
id INT, 
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT,

PRIMARY KEY (id),

foreign key (role_id) references roles(id)

);
INSERT INTO employee(id,first_name,last_name,manager_id) VALUE('6','eric','barriga','0');

-- DESCRIBE departments;
-- SHOW FIELDS FROM employee; 
--  DESCRIBE employee;
--  TABLE employee;



