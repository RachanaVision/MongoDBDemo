function ButtonClick() {
    window.location.href = "/Home/InsertUpdate";
    document.getElementById('removeAllHobbies').style.display = 'none';
}

function CancelButtonClick() {
    window.location.href = "/Home/Index";
}

function InsertUpdateRecord() {
    var FirstName = document.getElementById('firstname').value;
    var lastname = document.getElementById('lastname').value;
    var age = document.getElementById('age').value;
    var id = document.getElementById('id').value;
    var Hobbyid = document.getElementById('Hobbyid').value;
    console.log(Hobbyid);
    var hobby = document.querySelectorAll('input[type=checkbox]:checked');
    var selectedHobbies = [];
    hobby.forEach(function (checkbox) {
        selectedHobbies.push(checkbox.value);
    });
    //var hobbies = selectedHobbies.join(",");
    
    var gender = document.querySelectorAll('input[type="radio"]:checked');
    var selectedGender = gender[0].value;
    var hobbies = { Hobbies: selectedHobbies }
    var updatedHobbies = { Id: Hobbyid, Hobbies: selectedHobbies }


    var city = document.getElementById('city').value;

    var xhr = new XMLHttpRequest();
    
    if (id == "") {

        var requestedData = {
            FirstName: FirstName,
            LastName: lastname,
            Age: age,
            Hobby: hobbies,
            City: city,
            Gender: selectedGender
        }

        xhr.open("POST", "/Home/InsertRecord", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    alert("Record Inserted successfully..!!");
                    window.location.href = "/Home/Index";
                } else {
                    alert("Fail to Insert Record..!!");
                    window.location.href = "/Home/Index";
                }
            }
        };
        xhr.send(JSON.stringify(requestedData));
    }
    else { 
        var requestedData = {
            FirstName: FirstName,
            LastName: lastname,
            Age: age,
            Hobby: updatedHobbies,
            City: city,
            Gender: selectedGender,
            Id: id
        }

        xhr.open("PUT", "/Home/UpdateHobbies", true); // UpdateRecord() for update all records.
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    alert("Record Updated successfully..!!");
                    window.location.href = "/Home/Index";
                } else {
                    alert("Fail to Update Record..!!");
                    window.location.href = "/Home/Index";
                }
            }
        };
        xhr.send(JSON.stringify(requestedData));
    }
}

function GetAllRecords() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/Home/GetAllRecord", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                var employeeList = JSON.parse(xhr.responseText);
                console.log(employeeList);
                var setEmployeeList = document.getElementById('employeeList');

                for (var i = 0; i < employeeList.length; i++) {

                    var data = "<tr>" +
                       // "<td>" + employeeList[i].id + "</td>" +
                        "<td>" + employeeList[i].firstName + "</td>" +
                        "<td>" + employeeList[i].lastName + "</td>" +
                        "<td>" + employeeList[i].age + "</td>" +
                        "<td>" + employeeList[i].gender + "</td>" +
                        "<td>" + employeeList[i].city + "</td>" +
                        "<td>" + employeeList[i].hobby.hobbies + "</td>" +
                        "<td>" + "<input type='button' class='btn btn-default btn-info' value='Edit Hobbies' onclick=\"GetRecordById('" + employeeList[i].id + "')\">" + "</td>" +
                        "<td>" + "<input type='button' class='btn btn-default btn-info' value='Edit' onclick=\"GetRecordById('" + employeeList[i].id + "')\">" + "</td>" +
                        "<td>" + "<input type='button' value='Delete' class='btn btn-default btn-danger' onclick=\"DeleteRecord('" + employeeList[i].id + "')\">" + "</td>" +
                        "</tr>";

                    setEmployeeList.insertAdjacentHTML('beforeend', data);
                }

            } else {
                alert("Fail to Load Records..!!");
            }
        }
    };
    xhr.send();
}

function SetEmployeeDetails() {

    document.getElementById('removeAllHobbies').style.visibility = true;

    var employeeInformation = sessionStorage.getItem('EmployeeInformation');
    var employee = JSON.parse(employeeInformation);
    console.log(employee);
    document.getElementById('firstname').value = employee.firstName;
    document.getElementById('lastname').value = employee.lastName;
    document.getElementById('age').value = employee.age;
    document.getElementById('id').value = employee.id;
    document.getElementById('city').value = employee.city;
    document.getElementById('Hobbyid').value = employee.hobby.id;

    if (employee.gender == "Male") {
       
        document.getElementById('male').checked = true;
    }
    else {
        document.getElementById('female').checked = true;
    }

    var selectedHobbies = employee.hobby.hobbies;//.split(",");
    var hobbies = document.querySelectorAll('input[type="checkbox"]');
    hobbies.forEach(function (checkbox) {
        if (selectedHobbies.includes(checkbox.value)) {
            checkbox.checked = true;
        }
    });

    sessionStorage.clear();
}

function SetEmployeeHobbies() {

    document.getElementById('removeAllHobbies').style.display = 'block';

    var employeeInformation = sessionStorage.getItem('EmployeeInformation');
    var employee = JSON.parse(employeeInformation);

    document.getElementById('firstname').value = employee.firstName;
    document.getElementById('lastname').value = employee.lastName;
    document.getElementById('age').value = employee.age;
    document.getElementById('id').value = employee.id;
    document.getElementById('city').value = employee.city;
    document.getElementById('Hobbyid').value = employee.hobby.id;

    document.getElementById('firstname').disabled = true;
    document.getElementById('lastname').disabled = true;
    document.getElementById('age').disabled = true;    
    document.getElementById('city').disabled = true;  
   

    if (employee.gender == "Male") {

        document.getElementById('male').checked = true;
        document.getElementById('male').disabled = true;
    }
    else {
        document.getElementById('female').checked = true;
        document.getElementById('female').disabled = true;
    }   

    var selectedHobbies = employee.hobby.hobbies;//.split(",");
    var hobbies = document.querySelectorAll('input[type="checkbox"]');
    hobbies.forEach(function (checkbox) {
        if (selectedHobbies.includes(checkbox.value)) {
            checkbox.checked = true;
        }
    });
   
    sessionStorage.clear();
}

function GetRecordById(id) {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/Home/GetRecordById?id=" + id, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                var employee = JSON.parse(xhr.responseText);

                sessionStorage.setItem('EmployeeInformation', JSON.stringify(employee));
                window.location.href = "/Home/InsertUpdate";
            }
        }
    }
    xhr.send(); 
}

function DeleteRecord(id) {
    if (confirm('Are you Sure you want to Delete Record..??')) {
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "/Home/DeleteRecord?id=" + id, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    var employee = xhr.responseText;
                    console.log(employee);
                    alert('Record Deleted Successfully..!!');
                    document.getElementById('employeeList').innerHTML = '';
                    GetAllRecords();
                }
            }
        }
        xhr.send(); 
    }
}

function RemoveAllHobbies() {

    var hobbyId = document.getElementById('Hobbyid').value;
    var id = document.getElementById('id').value;
    console.log(hobbyId);
    if (confirm('Are you Sure you want to Remove all Hobbies..??')) {
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "/Home/DeleteAllHobbies?id=" + id, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    var employee = xhr.responseText;
                    console.log(employee);
                    alert('All Hobbies are removed Successfully..!!');
                    window.location.href = "/Home/Index";
                }
            }
        }
        xhr.send();
    }
}
