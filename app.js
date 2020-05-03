const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const joi = require('joi');

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const employees = [];
const schema = joi.object().keys({
    name: joi.string().regex(/^[a-zA-Z\ \.\d]+$/).min(3),
    id: joi.number().min(100).max(999999),
    email: joi.string().email(),
    office: joi.number().min(1000).max(9999),
    github: joi.string().regex(/^([a-z\d]+-)*[a-z\d]+$/i).min(3).max(39)
})


const newEmployee = async () => {
    employee = [];
    if (employees.length === 0) {
        console.log(`No manager has been entered yet. The first employee created will be your manager.`);
        employee.employeeRole = `Manager`;
    }
    else {
        const { employeeRole } = await inquirer.prompt({
            message: `Please choose a role for the employee.`,
            choices: [`Engineer`, `Intern`],
            name: `employeeRole`,
            type: `list`,
        })
        employee.employeeRole = employeeRole
    }
    const questions = [
        {
            message: `Enter the name of the new ${employee.employeeRole}:`,
            name: `employeeName`,
            type: `input`,
            validate: validateName
        },
        {
            message: `Enter the 3 to 6 digit employee ID of the new ${employee.employeeRole}:`,
            name: `employeeID`,
            type: `input`,
            validate: validateID
        },
        {
            message: `Enter the employee email address of the new ${employee.employeeRole}:`,
            name: `employeeEmail`,
            type: `input`,
            validate: validateEmail
        }
    ]
    if (employee.employeeRole === "Manager") {
        questions.push(
            {
                message: `Enter the 4 digit office number of the new ${employee.employeeRole}:`,
                name: `employeeOfficeNumber`,
                type: `input`,
                validate: validateOffice
            }
        )
    }
    else if (employee.employeeRole === "Engineer") {
        questions.push(
            {
                message: `Enter the Github username of the new ${employee.employeeRole}:`,
                name: `employeeGithub`,
                type: `input`,
                validate: validateGithub
            }
        )
    }
    else {
        questions.push(
            {
                message: `Enter the school the new ${employee.employeeRole} attends:`,
                name: `employeeSchool`,
                type: `input`,
                validate: validateSchool
            }
        )
    }

    const employeeData = await inquirer.prompt(questions);
    employeeData.employeeRole = employee.employeeRole;
    employeeData.employeeName = employeeData.employeeName.toLowerCase();
    employeeData.employeeEmail = employeeData.employeeEmail.toLowerCase();
    return employeeData;

}

const validateName = async data => {
    return joi.validate({ name: data }, schema, function (err, value) {
        if (err) {
            return 'Name may only contain alpha numeric characters, spaces, and periods.';
        }
        return true;
    });
}

const validateID = async data => {
    return joi.validate({ id: data }, schema, function (err, value) {
        if (err) {
            return `Employee ID should be a number between 3 and 6 digits`;
        }
        return true;
    })
}
const validateEmail = async data => {
    return joi.validate({ email: data }, schema, function (err, value) {
        if (err) {
            return `Please enter a valid email address`;
        }
        return true;
    })
}
const validateOffice = async data => {
    return joi.validate({ office: data }, schema, function (err, value) {
        if (err) {
            return `Office number should be a 4 digit number`;
        }
        return true;
    })
}
const validateGithub = async data => {
    return joi.validate({ github: data }, schema, function (err, value) {
        if (err) {
            return `Github user names may only contain alpha numeric characters or hyphens (but not at the beginning or end) and should be between 3 and 40 characters`;
        }
        return true;
    })
}

const validateSchool = async data => {
    return joi.validate({ name: data }, schema, function (err, value) {
        if (err) {
            return 'School name may only contain alpha numeric characters, spaces, and periods.';
        }
        return true;
    });
}


const addEmployee = async () => {
    const employee = await newEmployee();
    if (employee.employeeRole === `Manager`) {
        return new Manager(employee.employeeName, employee.employeeID, employee.employeeEmail, employee.employeeOfficeNumber);
    }
    else if (employee.employeeRole === `Engineer`) {
        return new Engineer(employee.employeeName, employee.employeeID, employee.employeeEmail, employee.employeeGithub.toLowerCase());
    }
    else {
        return new Intern(employee.employeeName, employee.employeeID, employee.employeeEmail, employee.employeeSchool.toLowerCase());
    }
}

const employeeLoop = async () => {
    let exitLoop = false;
    while (exitLoop === false) {
        employees.push(await addEmployee());
        let { addMore } = await inquirer.prompt(
            {
                message: `Do you wish to add another employee?`,
                type: `confirm`,
                name: `addMore`,
            }
        )
        exitLoop = !addMore
    }
    fs.mkdir(OUTPUT_DIR, { recursive: true }, (err) => {
        if (err) throw err;
    });
    fs.writeFileSync(outputPath, await render(employees));
}

employeeLoop();