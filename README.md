# Employee-Summary
![Github Issues](https://img.shields.io/github/issues/ravalash/Good-README-Generator)![Github Forks](https://img.shields.io/github/forks/ravalash/Good-README-Generator)![Github Stars](https://img.shields.io/github/stars/ravalash/Good-README-Generator)![Github Issues](https://img.shields.io/github/license/ravalash/Good-README-Generator)

## Description
Week 10 Homework - Template Engine - Employee Summary

## Motivation
This homework will delivery an employee roster generator viewable as an HTML file with information gathered through a CLI. This will allow for practice in developing skills using the Inquirer NPM package, ES6 JavaScript classes, and TDD software development practice

## Code Style
This project is written using JavaScript and uses async functions to gather information from the user before returning data for processing. The question array is built in a similar fashion to the employee class construction with a set of base questions being defined and additional questions being pushed based on the selected role.

```javascript
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
  ```

  ```javascript
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
  ```

  The returned object is assesed for the role assigned and pushed to an array based on the required class.

  ```javascript
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
  ```

Validation is handled by the Joi NPM package and will reject values with a prompt to help users select the right input.

![Rejected Name Screenshot](/screenshots/rejectedname.JPG "Rejected Name")

![Rejected ID Screenshot](/screenshots/rejectedid.JPG "Rejected ID")

![Rejected Email Screenshot](/screenshots/rejectedemail.JPG "Rejected Email")

Employees can be entered until the user chooses to stop at which point the array is processed for rendering.

![End of Entry Screenshot](/screenshots/applicationend.JPG "Application End")

The generated HTML file uses text transform to properly display information regardless of user entry.

![Sample Roster Screenshot](/screenshots/sampleroster.JPG "Sample Roster")


## Features
Validation is handled via the inquirer prompt itself which allows for immediate correction if the provided answer is unacceptable.

Questions for inquirer are built from the ground up to reduce uneccesary code and allow for easier customization in the future.

Employee role options are specified based on the existing array and will not allow for anything other than one manager with each roster.

# How to Use
Dependencies must be installed individually or via package.json file
* inquirer
* joi

Execution is completed by running app.js and entering information in the CLI.