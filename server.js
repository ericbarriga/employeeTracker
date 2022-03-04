
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
async function addEmployee() {
    const roleResponse = await connection.promise().query(`SELECT * FROM roles`)
    const roles = roleResponse[0].map((rol) => {
        return `${rol.id}-${rol.title}`
    })
    // 
    const manResponse = await connection.promise().query(`SELECT * FROM employee WHERE manager_id is NULL`)
    // console.log(manResponse);
    const manager = manResponse[0].map((man) => {
        return `${man.id}-${man.first_name} ${man.last_name}`
    })
    manager.push('this employee is a manager')

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
            name: 'manager',
            type: 'list',
            message: 'choose your manager',
            choices: manager

        },
        {
            name: 'role',
            type: 'list',
            message: 'what is the role of the employee',
            choices: roles,
        },
    ])
        .then(async (answers) => {
            console.log(answers.manager);
            const manager_id = answers.manager === 'this employee is a manager' ? null : Number(answers.manager[0])
            let sql = `INSERT INTO employee (first_name,last_name,manager_id,role_id) VALUES(?,?,?,?);`
            await connection.promise().query(sql, [answers.first, answers.last, manager_id, Number(answers.role[0])])
            askQuestion()
        })

}

async function addDepartment() {
    inquirer.prompt([
        {
            name: 'department',
            type: 'input',
            message: 'what department would you like to add',

        },

    ])
        .then(async (answers) => {
            console.log(answers);
            let sql = `INSERT INTO departments (name) VALUES(?);`
            await connection.promise().query(sql, answers.department)
            askQuestion()
        })
}

const getDepartment = () => {
    const sql = `SELECT * FROM depatments`
    connection.query(sql, (error, response) => {
        if (error) throw Error
        let departmentsArray = []
        response.forEach((departments) => { departmentsArray.push(departments.name) })

        console.log(departmentsArray);
    })
}

const addRole = async () => {
    const response = await connection.promise().query(`SELECT * FROM departments`)
    // make a array of department choices to use in the prompt ;;
    const department = response[0].map((dep) => {
        return `${dep.id} - ${dep.name}`
    })
    // console.log(department);
    inquirer.prompt([
        {
            name: 'role',
            type: 'input',
            message: 'add name of new role ',

        },
        {
            name: 'salary',
            type: 'input',
            message: 'what is the salary for this role'
        },
        {
            name: 'department',
            type: 'list',
            choices: department,
            message: 'what department is the role in '
        }
    ])
        .then(async (answers) => {
            // console.log(Number(answers.department[0]));
            let sql = `INSERT INTO roles (title,salary,department_id) VALUES(?,?,?);`
            await connection.promise().query(sql, [answers.role, answers.salary, Number(answers.department[0])],)
            askQuestion()
        })
}

const upDateERole = async () => {
    const roleResponse = await connection.promise().query(`SELECT * FROM roles`)
    const roles = roleResponse[0].map((rol) => {
        return `${rol.id}-${rol.title}`
    })

    //
    const empResponse = await connection.promise().query(`SELECT * FROM employee `)
    // console.log(manResponse);
    const employee = empResponse[0].map((emp) => {
        return `${emp.id}-${emp.first_name} ${emp.last_name}`
    })


    inquirer.prompt([
        {
            name: 'employee',
            type: 'list',
            message: 'what employee would you like to update ',
            choices: employee
        },
        {
            name: 'role',
            type: 'list',
            message: 'what is there new role  ',
            choices: roles,
        },

    ])

        .then(async (answers) => {
            const roleId = Number(answers.role[0])
            const empId = Number(answers.employee[0])
            console.log(answers);
            let sql = `UPDATE employee SET role_id = ${roleId} WHERE id= ${empId}`;
            await connection.promise().query(sql)
            askQuestion()
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



