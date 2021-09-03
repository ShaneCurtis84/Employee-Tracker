require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const util = require('util');


const connection = mysql.createConnection({

    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});



connection.connect((err) => {
    if (err) throw err;
});


connection.query = util.promisify(connection.query);




async function mainMenu() {

    console.log('Welcome To Employee Tracker!!')
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',

            choices: [
                'View All Employees',
                'View Employees By Department',
                'View Employees By Role',
                'View Employees By Manager',
                'View Budget By Department',
                'Update Employee Role',
                'Update Employee Manager',
                'Update Department',
                'Add Employee',
                'Add Role',
                'Add Department',

            ]

        }
    ]);




    switch (answers.action) {

        case "View All Employees":
            return viewAllEmployees()

        case 'View Employees By Department':
            return viewByDepartment();

        case 'View Employees By Role':
            return viewByRole();

        case 'View Employees By Manager':
            return viewByManager();

        case 'View Budget By Department':
            return viewBudgetByDepartment();

        case 'Update Employee Role':
            return updateEmployeeRole();

        case 'Update Employee Manager':
            return updateEmployeeManager();

        case 'Add Employee':
            return addEmployee();

            





    }

};



function viewAllEmployees() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.department_name, roles.salary, manager_name FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN manager ON employee.manager_id = manager.id;",
        (err, res) => {
            if (err) throw err;
            console.table(res);
            console.log(`\n`);
            mainMenu();
        });
};

function viewByDepartment() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, department.department_name FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id ORDER BY department.id;", (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log(`\n`);
        mainMenu();
    });
};

function viewByRole() {
    connection.query("SELECT employee.id, roles.title,department.department_name, employee.first_name, employee.last_name, roles.salary, manager_name FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN manager ON employee.manager_id = manager.id;", (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log(`\n`);
        mainMenu();
    });
};


function viewByManager() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.department_name, employee.manager_id, manager.manager_name FROM employee LEFT JOIN manager on manager.id = employee.manager_id LEFT JOIN roles on roles.id = employee.role_id LEFT JOIN department ON department.id = roles.department_id WHERE manager_id;", (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log(`\n`);
        mainMenu();
    });
};


function viewBudgetByDepartment() {
    connection.query("SELECT department_id, department.department_name, SUM(salary) AS Amount FROM roles LEFT JOIN department on roles.department_id = department.id GROUP BY department_id;", (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log(`\n`);
        mainMenu();
    });
};


async function updateEmployeeRole() {

    try {
        const employee = await connection.query(`SELECT * FROM employee`);
        const employeeList = employee.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        const roles = await connection.query(`SELECT * FROM roles`);
        const listOfRoles = roles.map((roles) => ({
            name: roles.title,
            value: roles.id,
        }));

        const updateRole = await inquirer.prompt([
            {
                type: 'list',
                message: 'Select employee to update',
                name: 'employeeSelection',
                choices: employeeList,
            },
            {
                type: 'list',
                message: 'Please select a new role',
                name: 'rolesSelection',
                choices: listOfRoles,
            }

        ])


        connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [
            updateRole.rolesSelection,
            updateRole.employeeSelection,
        ]);
        console.log(
            `\n ---Role has been updated!--- `
                
        );
        mainMenu()

    } catch (err) {
        console.log(err);
        mainMenu();
    };
}


async function updateEmployeeManager() {

    try {
        const employee = await connection.query(`SELECT * FROM employee`);
        const employeeList = employee.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        const manager = await connection.query(`SELECT * FROM manager`);
        const listOfManagers = manager.map((manager) => ({
            name: `${manager.manager_name}`,
            value: manager.id,
        }));

        const updateRole = await inquirer.prompt([
            {
                type: 'list',
                message: 'Select employee to update',
                name: 'employeeSelection',
                choices: employeeList,
            },
            {
                type: 'list',
                message: 'Please select a new manager',
                name: 'managerSelection',
                choices: listOfManagers,
            }

        ])


        connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [
            updateRole.managerSelection,
            updateRole.employeeSelection,
        ]);
        console.log(
            `\n ---Employees manager has been updated!--- `
                
        );
        mainMenu()

    } catch (err) {
        console.log(err);
        mainMenu();
    };
}


















async function newEmployee() {


}

mainMenu()

















