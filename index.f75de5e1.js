/* eslint-disable max-len */ "use strict";
const QUERY = {
    "Name": 0,
    "Position": 1,
    "Office": 2,
    "Age": 3,
    "Salary": 4
};
const queryName = 0;
const queryPosition = 1;
const queryOffice = 2;
const queryAge = 3;
const querySalary = 4;
const notificationSuccess = "success";
const notificationError = "error";
const body = document.querySelector("body");
const thead = document.querySelector("thead");
const tbody = document.querySelector("tbody");
const employees = tbody.children;
let desc = false;
let query = "";
function sortEmployees(sortedQuery) {
    switch(sortedQuery){
        case queryName:
        case queryPosition:
        case queryOffice:
            return desc ? [
                ...employees
            ].sort((em1, em2)=>em2.children[sortedQuery].innerText.localeCompare(em1.children[sortedQuery].innerText)) : [
                ...employees
            ].sort((em1, em2)=>em1.children[sortedQuery].innerText.localeCompare(em2.children[sortedQuery].innerText));
        case queryAge:
            return desc ? [
                ...employees
            ].sort((em1, em2)=>+em2.children[sortedQuery].innerText - +em1.children[sortedQuery].innerText) : [
                ...employees
            ].sort((em1, em2)=>+em1.children[sortedQuery].innerText - +em2.children[sortedQuery].innerText);
        case querySalary:
            return desc ? [
                ...employees
            ].sort((em1, em2)=>getNumberSalary(em2.children[sortedQuery].innerText) - getNumberSalary(em1.children[sortedQuery].innerText)) : [
                ...employees
            ].sort((em1, em2)=>getNumberSalary(em1.children[sortedQuery].innerText) - getNumberSalary(em2.children[sortedQuery].innerText));
    }
}
function getNumberSalary(salary) {
    return +salary.slice(1).replaceAll(",", "");
}
function printNewTable(newEmployees) {
    tbody.innerHTML = "";
    newEmployees.forEach((emp)=>tbody.append(emp));
}
thead.addEventListener("click", (e)=>{
    desc = query === e.target.innerText ? !desc : false;
    query = e.target.innerText;
    const newEmployees = sortEmployees(QUERY[query]);
    printNewTable(newEmployees);
});
[
    ...employees
].forEach((empl)=>empl.addEventListener("click", ()=>{
        [
            ...employees
        ].forEach((e)=>{
            e.classList = "";
        });
        empl.classList.add("active");
    }));
const form = document.createElement("form");
form.classList = "new-employee-form";
form.innerHTML = `
<label>Name: <input name="name" type="text" data-qa="name"></label>
<label>Position: <input name="position" type="text" data-qa="position"></label>
<label>Office:
<select name="office" data-qa="office">
<option value="Tokyo">Tokyo</option>
<option value="Singapore">Singapore</option>
<option value="London">London</option>
<option value="New York">New York</option>
<option value="Edinburgh">Edinburgh</option>
<option value="San Francisco">San Francisco</option>
</select>
</label>
<label>Age: <input name="age" type="number" data-qa="age"></label>
<label>Salary: <input name="salary" type="number" data-qa="salary"></label>
<button>Save to table</button>
`;
body.append(form);
form.addEventListener("click", (e)=>{
    const target = e.target;
    const button = form.querySelector("button");
    if (target !== button) return;
    e.preventDefault();
    const formName = form.children[0].children[0].value;
    const formPosition = form.children[1].children[0].value;
    const formOffice = form.children[2].children[0].value;
    const formAge = form.children[3].children[0].value;
    const formSalary = form.children[4].children[0].value;
    if (!formPosition.trim() || !formOffice || !formSalary) {
        showErrorMessage("Error", "All inputs must be filled", notificationError);
        return;
    }
    if (formName.trim().length < 4) {
        showErrorMessage("Wrong name", "Name must contains at least 4 characters", notificationError);
        return;
    }
    if (+formAge < 18 || +formAge > 90) {
        showErrorMessage("Wrong age", "Age must be more than 18 and less than 90", notificationError);
        return;
    }
    showErrorMessage("Success", "Employee was created", notificationSuccess);
    tbody.insertAdjacentHTML("afterbegin", `
  <tr>
    <td>${formName.trim()}</td>
    <td>${formPosition.trim()}</td>
    <td>${formOffice}</td>
    <td>${formAge}</td>
    <td>$${formSalary.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
  </tr>
  `);
    form.reset();
});
function showErrorMessage(title, description, type) {
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.setAttribute("data-qa", "notification");
    switch(type){
        case notificationSuccess:
            notification.classList.add(notificationSuccess);
            break;
        case notificationError:
            notification.classList.add(notificationError);
            break;
    }
    notification.style.top = `15px`;
    notification.style.right = `15px`;
    const titleContext = document.createElement("h2");
    titleContext.classList.add("title");
    const descriptionContext = document.createElement("p");
    titleContext.innerText = title;
    descriptionContext.innerText = description;
    notification.append(titleContext);
    notification.append(descriptionContext);
    body.append(notification);
    setTimeout(()=>{
        notification.remove();
    }, 2000);
}
tbody.addEventListener("dblclick", (e)=>{
    const target = e.target;
    if (target.tagName === "TD") {
        const parentRow = target.parentElement;
        const originalText = target.innerText;
        const newInput = document.createElement("INPUT");
        const handleInput = ()=>{
            newInput.value.trim() === "" ? target.innerText = originalText : target.innerText = newInput.value;
            if (newInput.classList.contains("salary")) target.innerText = "$" + newInput.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };
        target.innerText = "";
        newInput.classList.add("cell-input");
        newInput.value = originalText;
        if (target === parentRow.children[3]) newInput.setAttribute("type", "number");
        if (target === parentRow.children[4]) {
            newInput.value = Number(originalText.replace(/\D/g, ""));
            newInput.setAttribute("type", "number");
            newInput.classList.add("salary");
        }
        target.append(newInput);
        newInput.focus();
        newInput.addEventListener("blur", ()=>{
            handleInput();
        });
        newInput.addEventListener("keypress", (press)=>{
            if (press.key === "Enter") handleInput();
        });
    }
});

//# sourceMappingURL=index.f75de5e1.js.map
