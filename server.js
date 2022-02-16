
const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const dotenv = require('dotenv');
const ctable = require('console.table')
dotenv.config()

let connection = mysql2.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.connect((err) => {
    if (err) throw err
    console.log('database connected');
    askQuestion()
})

// make  array of one start question

// list type of options departments ,employees role ect...

//view what // consditinal switch 

employees = [];

const startQuestion = [
    {
        type: 'list',
        message: 'where do you want to go',
        choices: [
            'view departments',
            'view employees',
            'view roles',
            'add employees',
            'add departments',
            'add role',
            'up date employee role',
        ],
        name: 'options'
    },

]

//make array questions of what your adding departments employees ect.. 


// enquirer prompt data base query 

// function to see each departments , employee, role ,
async function viewDepartments() {
    let rows = await connection.promise().query(`SELECT * FROM departments;`)
    console.table(rows[0])
    askQuestion()
}

async function viewEmployees() {
    let rows = await connection.promise().query(`SELECT * FROM employee;`)
    console.table(rows[0])
    askQuestion()
}

async function viewRoles() {
    let rows = await connection.promise().query(`SELECT * FROM roles;`)
    console.table(rows[0])
    askQuestion()
}
////////// get employeee info  

// add employee 
const addEmployee = () => {
    inquirer.prompt([
        {
            name: 'first',
            type: 'input',
            message: 'what is the first name',

        },
        {
            name: 'last',
            type: 'input',
            message: 'what is the last name',

        },
        {
            name: 'id',
            type: 'input',
            message: 'if manager enter id if not enter 0',

        },
    ])
        .then((answers) => {
            console.log('employee added successfully');
            let sql = `INSERT INTO employee (first_name,last_name,manager_id) VALUES(?,?,?);`
            connection.promise().query(sql, [answers.first, answers.last, answers.id,], (error, response) => {
                if (error) throw Error
            })
        })
}

const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'department',
            type: 'input',
            message: 'what department would you like to add',

        },

    ])
        .then((answers) => {
            console.log(answers);
            let sql = `INSERT INTO departments (name) VALUES(?);`
            connection.promise().query(sql, answers.department, (error, response) => {
                if (error) throw Error
            })
        })
}

const addRole = () => {
    inquirer.prompt([
        {
            name: 'role',
            type: 'list',
            message: 'what role would you like to add ',
            choices: ['manager', 'engineer', 'intern']
        },
        {
            name: 'salary',
            type: 'input',
            message: 'what is the salary for this role'
        }
    ])
        .then((answers) => {
            let sql = `INSERT INTO roles (title,salary) VALUES(?,?);`
            connection.promise().query(sql, [answers.role, answers.salary], (error, response) => {
                if (error) throw Error
            })

        })
}

const upDateERole = () => {
    const sql = `SELECT * FROM departments`
    connection.query(sql, (error, response) => {
        if (error) throw Error
        let departmentArray = []
        response.forEach((departments) => { departmentArray.push(departments.name) })

        console.log(departmentArray);
    })
}




// make function that starts  everything that does promt with start question
function askQuestion() {
    inquirer.prompt(startQuestion).then((answers) => {
        // console.log(answers)
        if (answers.options === 'view departments') {
            // call view department function 
            viewDepartments()
        } else if (answers.options === 'view employees') {
            viewEmployees()
            //call view employees function
        } else if (answers.options === 'view roles') {
            viewRoles()
            // call view roles function
        } else if (answers.options === 'add employees') {
            addEmployee()
            // call add employees
        } else if (answers.options === 'add departments') {
            addDepartment()
            // call add departments
        } else if (answers.options === 'add role') {
            addRole()
            // call add role
        } else {
            upDateERole()
            // call up date employee role 
        }
    })
}



