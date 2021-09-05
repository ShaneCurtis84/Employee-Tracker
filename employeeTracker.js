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


function Welcome() {

    console.log(`\n ---Welcome To Employee Tracker!!---`)
    mainMenu()
}

async function mainMenu() {


    console.log(`\n`)
    console.log(`\n ---Main Menu---`)
    console.log(`\n`)
    const mainMenuResponses = await inquirer.prompt([
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
                'Add New Employee',
                'Add New Department',
                'Add New Role',
                'Add Manager',
                'Remove Employee',
                'Remove Employee Department',
                'Remove Employee Role',
                'Remove Manager',
                'Exit',


            ]

        }
    ]);




    switch (mainMenuResponses.action) {

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

        case 'Add New Employee':
            return addNewEmployee();

        case 'Add New Department':
            return addNewDepartment();

        case 'Add New Role':
            return addNewRole();

        case 'Add Manager':
            return addManager();

        case 'Remove Employee':
            return removeEmployee();

        case 'Remove Employee Department':
            return removeEmployeeDepartment();

        case 'Remove Employee Role':
            return removeEmployeeRole();

        case 'Remove Manager':
            return removeManager();

        case 'Exit':
            return exit();

    }
};



function viewAllEmployees() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.department_name, roles.salary, manager_name FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN manager ON employee.manager_id = manager.id;",
        (err, res) => {
            if (err) throw err;
            console.log(`\n ---View all Employees---`);
            console.log(`\n`);
            console.table(res);
            console.log(`\n`);
            mainMenu();
        });
};

function viewByDepartment() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, department.department_name FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id ORDER BY department.id;", (err, res) => {
        if (err) throw err;
        console.log(`\n ---View Employees by Department---`);
        console.log(`\n`);
        console.table(res);
        console.log(`\n`);
        mainMenu();
    });
};

function viewByRole() {
    connection.query("SELECT employee.id, roles.title,department.department_name, employee.first_name, employee.last_name, roles.salary, manager_name FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN manager ON employee.manager_id = manager.id;", (err, res) => {
        if (err) throw err;
        console.log(`\n ---View Employees by Role---`);
        console.log(`\n`);
        console.table(res);
        console.log(`\n`);
        mainMenu();
    });
};


function viewByManager() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.department_name, employee.manager_id, manager.manager_name FROM employee LEFT JOIN manager on manager.id = employee.manager_id LEFT JOIN roles on roles.id = employee.role_id LEFT JOIN department ON department.id = roles.department_id WHERE manager_id;", (err, res) => {
        if (err) throw err;
        console.log(`\n ---View Employees by Manager---`);
        console.log(`\n`);
        console.table(res);
        console.log(`\n`);
        mainMenu();
    });
};


function viewBudgetByDepartment() {
    connection.query("SELECT department_id, department.department_name, SUM(salary) AS Amount FROM roles LEFT JOIN department on roles.department_id = department.id GROUP BY department_id;", (err, res) => {
        if (err) throw err;
        console.log(`\n ---View Budget by Department---`);
        console.log(`\n`);
        console.table(res);
        console.log(`\n`);
        mainMenu();
    });
};


async function updateEmployeeRole() {

    try {
        const employeeTable = await connection.query(`SELECT * FROM employee`);
        const employeeList = employeeTable.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        const rolesTable = await connection.query(`SELECT * FROM roles`);
        const listOfRoles = rolesTable.map((roles) => ({
            name: roles.title,
            value: roles.id,
        }));

        const updateRoleQuestions = await inquirer.prompt([
            {
                type: 'list',
                message: 'Select employee to update',
                name: 'employeeChosen',
                choices: employeeList,
            },
            {
                type: 'list',
                message: 'Please select a new role',
                name: 'roleChosen',
                choices: listOfRoles,
            }

        ])


        const updateRole = connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [
            updateRoleQuestions.employeeChosen,
            updateRoleQuestions.roleChosen,
        ]);
        console.log(
            `\n ---Role updated!--- `

        );
        mainMenu()

    } catch (err) {
        console.log(err);
        mainMenu();
    };
}


async function updateEmployeeManager() {

    try {
        const employeeTable = await connection.query(`SELECT * FROM employee`);
        const employeeList = employeeTable.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        const managerTable = await connection.query(`SELECT * FROM manager`);
        const listOfManagers = managerTable.map((manager) => ({
            name: manager.manager_name,
            value: manager.id,
        }));

        const updateRole = await inquirer.prompt([
            {
                type: 'list',
                message: 'Select employee to update',
                name: 'employeeChosen',
                choices: employeeList,
            },
            {
                type: 'list',
                message: 'Please select a new manager',
                name: 'managerChosen',
                choices: listOfManagers,
            }

        ])


        connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [
            updateRole.managerChosen,
            updateRole.employeeChosen,
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






async function addNewEmployee() {

    try {

        const rolesTable = await connection.query("SELECT * FROM roles");
        const rolesList = rolesTable.map((roles) => ({
            name: roles.title,
            value: roles.id,
        }));
        const managerTable = await connection.query("SELECT * FROM manager")
        const managerList = managerTable.map((manager) => ({
            name: manager.manager_name,
            value: manager.id,
        }));





        const newEmployeeQuestions = await inquirer.prompt([
            {
                type: "input",
                message: "Enter the first name of the employee you would like to add:",
                name: "first_name",

            },
            {
                type: "input",
                message: "Enter the last name of the employee you would like to add:",
                name: "last_name",

            },
            {
                type: "list",
                message: "Pease select this employees role:",
                name: "role_id",
                choices: rolesList,
            },
            {
                type: "list",
                message: "Pease select this employees manager:",
                name: "manager_id",
                choices: managerList,
            },

        ]);


        const newEmployee = await connection.query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
            [
                newEmployeeQuestions.first_name,
                newEmployeeQuestions.last_name,
                newEmployeeQuestions.role_id,
                newEmployeeQuestions.manager_id,

            ]
        )


        console.log(
            `\n ---New employee created!--- `

        );
        mainMenu()

    } catch (err) {
        console.log(err);
        mainMenu();
    };
}







async function addNewDepartment() {

    try {

        const newDepartmentQuestions = await inquirer.prompt([
            {
                type: 'input',
                message: 'Please enter a new Department name',
                name: 'name',

            },
        ])

        const newDepart = await connection.query(`INSERT INTO department (department_name) VALUES (?)`,
            [newDepartmentQuestions.name]
        );



        console.log(
            `\n ---New deparment created!--- `

        );
        mainMenu()

    } catch (err) {
        console.log(err);
        mainMenu();
    };
}




async function addNewRole() {

    try {
        const departmentsTable = await connection.query(
            "SELECT * from department"
        );

        const departmentArray = await departmentsTable.map((department) => ({
            name: department.department_name,
            value: department.id,
        }));

        const newRoleQuestions = await inquirer.prompt([
            {
                type: "input",
                message: "Enter the role you would like to add:",
                name: "name",

            },
            {
                type: "input",
                message: "Input your salary:",
                name: "salary",

            },
            {
                type: "list",
                message: "Which department does this role belong to:",
                name: "department_id",
                choices: departmentArray,
            },
        ]);

        const query = await connection.query(
            "INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)",
            [
                newRoleQuestions.name,
                newRoleQuestions.salary,
                newRoleQuestions.department_id,
            ]
        );


        console.log(
            `\n ---New role created!--- `

        );
        mainMenu()

    } catch (err) {
        console.log(err);
        mainMenu();
    };
}

async function addManager() {

    try {
        const managerQuestions = await inquirer.prompt([
            {
                type: "input",
                message: "Enter the managers full name:",
                name: "manager_name",

            }
        ])
        const newManager = await connection.query(
            "INSERT INTO manager (manager_name) VALUES (?)",
            [
                managerQuestions.manager_name,

            ]
        );


        console.log(
            `\n ---New manager created!--- `

        );
        mainMenu()

    } catch (err) {
        console.log(err);
        mainMenu();
    };
}


async function removeEmployee() {

    try {

        const employeeTable = await connection.query('SELECT * FROM employee');
        const employeeList = employeeTable.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));


        const removeEmployeeQuestions = await inquirer.prompt([
            {
                type: "list",
                message: "Select the Employee you would like to remove:",
                name: "removeEmployee",
                choices: employeeList,
            }
        ])


        const removeEmployee = await connection.query(`Delete FROM employee Where id=${removeEmployeeQuestions.removeEmployee}`);

        console.log(
            `\n ---Employee Removed!--- `

        );
        mainMenu()

    } catch (err) {
        console.log(err);
        mainMenu();
    };
}


async function removeEmployeeDepartment() {

    try {

        const departmentTable = await connection.query('SELECT * FROM department');
        const departmentsList = departmentTable.map((department) => ({
            name: department.department_name,
            value: department.id,
        }))

        const removeDepartmentQuestions = await inquirer.prompt([
            {
                type: "list",
                message: "Select the department you would like to remove:",
                name: "removeDepartment",

                choices: departmentsList,


            }
        ])

        const removeDepartment = await connection.query(`Delete FROM department Where id=${removeDepartmentQuestions.removeDepartment}`);





        console.log(
            `\n ---Department removed!--- `

        );
        mainMenu()

    } catch (err) {
        console.log(err);
        mainMenu();
    };
}


async function removeEmployeeRole() {

    try {

        const rolesTable = await connection.query('SELECT * FROM roles');
        const rolesList = rolesTable.map((roles) => ({
            name: roles.title,
            value: roles.id,
        }));

        const removeRoleQuestions = await inquirer.prompt([
            {
                type: "list",
                message: "Select the role you would like to remove:",
                name: "removeRole",
                choices: rolesList,

            }
        ])

        const removeRole = await connection.query(`Delete FROM roles Where id=${removeRoleQuestions.removeRole}`);




        console.log(
            `\n ---Role removed!--- `

        );
        mainMenu()

    } catch (err) {
        console.log(err);
        mainMenu();
    };
}

async function removeManager() {

    try {

        const managerTable = await connection.query('SELECT * FROM manager');
        const managerList = managerTable.map((manager) => ({
            name: manager.manager_name,
            value: manager.id,
        }));

        const removeManagerQuestions = await inquirer.prompt([
            {
                type: "list",
                message: "Select the manager you would like to remove:",
                name: "removeManager",
                choices: managerList,

            }
        ])

        const removeManager = await connection.query(`Delete FROM manager Where id=${removeManagerQuestions.removeManager}`);




        console.log(
            `\n ---Manager removed!--- `

        );
        mainMenu()

    } catch (err) {
        console.log(err);
        mainMenu();
    };
}


function exit() {
    console.log(
        `\n Thanks for using Employee Tracker!"`
    );
    connection.end();
    process.exit();
}



Welcome()

















