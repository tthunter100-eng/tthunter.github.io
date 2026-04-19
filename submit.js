//global inventory
let globalInventory = [];

//personal information section
const personalInfo = document.createElement("div");
personalInfo.innerHTML = `
    <div style="height: 100px; width: 100%; top: 0; display: flex; flex-direction: row; position: absolute; gap: 28px;">
        <img src="personalicon.png" style="height: 45%; width: 8%; margin-top: 25px; margin-left: 15px;">
        <span style="font-size: 28px; font-weight: normal; text-align: left; justify-content: center; align-content: center; margin: 0;">Personal Information</span>
    </div>
    <div style="box-sizing: border-box; margin-top: 50px; height: 100%; width: 100%; position: relative; display: flex; flex-direction: column; padding: 20px 20px;">
        <form action="placeholder.php" id="pInfo" method="post">
            <label for="personname" style="font-size: 15px;">Full Name:</label><span style="color: red; font-weight: bold;">*</span><br>
            <input name="full_name" id="person-name" style="height: 20px; width: 100%; background-color: #ffffff; border: none;" required><br><br>
            <label for="personrole" style="font-size: 15px;">Role in School:</label><span style="color: red; font-weight: bold;">*</span><br>
            <select name="school_role" id="person-role" style="transition: 0.1s ease; height: 30px; min-width: 150px; background-color: transparent; border: none;" required><br><br>
                <option value="" disabled selected>Select a role</option>
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="guest">Guest</option>
            </select><br><br>
            <label for="studentnumber" style="font-size: 15px;">Student Number (if applicable):</label><span id="sym-num" style="color: red; font-weight: bold;">/</span><br>
            <input name="student_number" value="N/A" id="student-number" style="height: 20px; width: 100%; background-color: #d1d1d1; border: none;" disabled><br><br>
            <label for="studentprogram" style="font-size: 15px;">Program (if applicable):</label><span id="sym-prog" style="color: red; font-weight: bold;">/</span><br>
            <input name="student_program" value="N/A" id="student-program" style="height: 20px; width: 100%; background-color: #d1d1d1; border: none;" disabled><br><br>
            <label for="persondept" style="font-size: 15px;">Department (if applicable):</label><span id="sym-dept" style="color: red; font-weight: bold;">/</span><br>
            <input name="person_department" value="N/A" id="person-dept" style="height: 20px; width: 100%; background-color: #d1d1d1; border: none;"disabled><br><br>
            <label for="email" style="font-size: 15px;">Email Address:</label><span style="color: red; font-weight: bold;">*</span><br>
            <input name="person_email" id="email" style="height: 20px; width: 100%; background-color: #ffffff; border: none;" required><br><br>
            <label for="identification" style="font-size: 15px;">School ID/COR/Staff ID/Government ID for Verification:</label><span style="color: red; font-weight: bold;">*</span><br>
            <input name="id_image" type="file" accept="image/*" id="identification" style="height: 30px; width: 100%; border: none;" required><br><br>
        </form>
    </div>
`;
Object.assign(personalInfo.style, {
    height: "80%",
    width: "45%",
    left: "0",
    backgroundColor: "#eff0f2",
    margin: "30px",
    gap: "50px",
    border: "3px solid #c1c7d7",
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    boxSizing: "border-box",
    padding: "40px 20px",
});
document.querySelector(".div-container").appendChild(personalInfo);

//constants for personal data functions
const personName = document.getElementById("person-name");
const roleSelect = document.getElementById("person-role");
const studentNum = document.getElementById("student-number");
const studentProg = document.getElementById("student-program");
const deptInput = document.getElementById("person-dept");
const personMail = document.getElementById("email");

//select option logic
roleSelect.addEventListener("change", () => {
    const role = roleSelect.value;
    
    disabledField(studentNum, document.getElementById("sym-num"));
    disabledField(studentProg, document.getElementById("sym-prog"));
    disabledField(deptInput, document.getElementById("sym-dept"));

    if (role === "student") {
        enabledField(studentNum, document.getElementById("sym-num"));
        enabledField(studentProg, document.getElementById("sym-prog"));
    }
    else if (role === "staff") {
        enabledField(deptInput, document.getElementById("sym-dept"));
    }
});

function enabledField(input, symbolSpan) {
    input.value = "";
    input.disabled = false;
    input.required = true;
    input.style.backgroundColor = "#ffffff";
    input.style.color = "#000000";
    if (symbolSpan) symbolSpan.innerText = "*";
}

function disabledField(input, symbolSpan) {
        input.value = "N/A";
        input.disabled = true;
        input.required = false;
        input.style.backgroundColor = "#d1d1d1";
        input.style.color = "#757575";
        if (symbolSpan) symbolSpan.innerText = "/";
}

//personal information form submission
const pForm = personalInfo.querySelector("form");
pForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const personalData = new FormData(pForm);

    if (studentNum.disabled) {
        personalData.append("student_number", "N/A");
    }
    if (studentProg.disabled) {
        personalData.append("student_program", "N/A");
    }
    if (deptInput.disabled) {
        personalData.append("person_department", "N/A");
    }
    
    fetch('placeholder.php/submit', {
            method: 'POST',
            body: personalData
    })

    .then(response => {
        if (!response.ok) throw new Error("Server error");
        return response.json();
    })
    .then(data => console.log("Success from server: ", data))
    .catch(error => console.error("Error: ", error));
});

//item information section
const itemInfo = document.createElement("div");
itemInfo.innerHTML = `
    <div style="height: 100px; width: 100%; top: 0; display: flex; flex-direction: row; position: absolute; gap: 28px;">
        <img src="itemicon.png" style="height: 50%; width: 9%; margin-top: 25px; margin-left: 30px;">
        <span style="font-size: 28px; font-weight: normal; text-align: left; justify-content: center; align-content: center; margin: 0;">Item Information</span>
    </div>
    <div style="box-sizing: border-box; margin-top: 90px; height: 100%; width: 100%; position: relative; display: flex; flex-direction: column; padding: 20px 40px;">
        <form action="placeholder.php" id="iInfo" method="post">
            <label for="itemcode" style="font-size: 15px;">Code:</label><span style="color: red; font-weight: bold;">*</span><br>
            <select name="item_code" id="item-code" style="transition: 0.1s ease; height: 30px; min-width: 150px; background-color: transparent; border: none;" required>
                <option value="" disabled selected>Select a code</option>
            </select><br><br>
            <label for="itemname" style="font-size: 15px;">Item Name:</label><span id="sym-itemname" style="color: red; font-weight: bold;">/</span><br>
            <input name="item_name" value="N/A" id="item-name" style="height: 20px; width: 100%; background-color: #d1d1d1; border: none;" disabled><br><br>
            <label for="itemdesc" style="font-size: 15px;">Item Description:</label><span id="sym-itemdesc" style="color: red; font-weight: bold;">/</span><br>
            <input name="item_desc" value="N/A" id="item-desc" style="height: 20px; width: 100%; background-color: #d1d1d1; border: none;" disabled><br><br>
            <label for="features" style="font-size: 15px;">Distinguishing Features:</label><br>
            <input name="item_features" id="features" style="height: 20px; width: 100%; background-color: #ffffff; border: none;"><br><br>
            <label for="lastknownloc" style="font-size: 15px;">Last Known Location:</label><span style="color: red; font-weight: bold;">*</span><br>
            <input name="last_location" id="last-loc" style="height: 20px; width: 100%; background-color: #ffffff; border: none;" required><br><br>
            <label for="lostdate" style="font-size: 15px;">Date Lost:</label><br>
            <input name="lost_date" type="date" id="lost-date" style="height: 20px; width: 100%; background-color: #ffffff; border: none;"><br><br>
            <label for="itempic" style="font-size: 15px;">Picture of the item (optional):</label><br>
            <input name="item_image" type="file" accept="image/*" id="item-pic" style="height: 30px; width: 100%; border: none;"><br><br>
        </form>
    </div>
`;
Object.assign(itemInfo.style, {
    height: "80%",
    width: "45%",
    right: "0",
    backgroundColor: "#eff0f2",
    margin: "30px",
    border: "3px solid #c1c7d7",
    display: "flex",
    position: "absolute",
    boxSizing: "border-box",
});
document.querySelector(".div-container").appendChild(itemInfo);

//constants for item data functions
const itemCode = document.getElementById("item-code");
const itemName = document.getElementById("item-name");
const itemDesc = document.getElementById("item-desc");
const itemFeatures = document.getElementById("features");
const lastLocation = document.getElementById("last-loc");
const lostDate = document.getElementById("lost-date");

//code select logic
window.itemCodes = () => {
    if(!itemCode) return;

    fetch('placeholder.php/get-inventory')
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
    })
    .then(inventory => {
        itemCode.innerHTML = `<option value="" disabled selected>Select a code</option>`;
        globalInventory = inventory;

        inventory.forEach(item => {
            const option = document.createElement("option");
            option.value = item.code;
            option.textContent = item.code;
            itemCode.appendChild(option); 
        });
    })
    .catch(error => {
        console.error("Error fetching inventory: ", error);
        itemCode.innerHTML = `<option value="" disabled selected>Select a code</option>`;
    });
};  

itemCode.addEventListener("change", (e) => {
    const selectedCode = e.target.value;
    const matchedItem = globalInventory.find(item => item.code === selectedCode);

    if (matchedItem) {  
        enabledField(itemName, document.getElementById("sym-itemname"));
        enabledField(itemDesc, document.getElementById("sym-itemdesc"));
        itemName.value = matchedItem.name;
        itemDesc.value = matchedItem.desc;
    }
    else {
        disabledField(itemName, document.getElementById("sym-itemname"));
        disabledField(itemDesc, document.getElementById("sym-itemdesc"));
    }
});

//submit button
const submitAndCancel = document.createElement("div");
submitAndCancel.innerHTML = `
    <input type="checkbox" id="policy-check" style="height: 18px; width: 18px; background-color: transparent; border: 2px solid #898989;" required>
    <button id="submit-cancel" style="height: 50px; width: 120px; justify-content: center; align-items: center; background-color: #c0c0c0; border: none; cursor: pointer; font-weight: bold; font-size: 15px; color: black; margin-right: 20px;">Cancel</button>
    <button type="submit" id="submit-ticket" style="height: 50px; width: 120px; justify-content: center; align-items: center; background-color: #2e4279; border: none; cursor: pointer; font-weight: bold; font-size: 15px; color: white; margin-right: 45px;">Submit</button>
`;
Object.assign(submitAndCancel.style, {
    bottom: "40px",
    height: "60px",
    width: "100%",
    position: "absolute",
    display: "flex",
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    border: "none",
    padding: "10px 15px",
});
document.querySelector(".div-container").appendChild(submitAndCancel);

//submit button function
const submitTicket = document.getElementById("submit-ticket");
submitTicket.onclick = () => {
    const validatePersonal = validate(pForm);
    const validateItem = validate(iForm);

    if (validatePersonal && validateItem) {
        pForm.requestSubmit();
        iForm.requestSubmit();
        submitTicket.disabled = true;
        submitTicket.textContent = "Submitted!";
    }
};

//cancel button function
const cancelButton = document.getElementById("submit-cancel");
cancelButton.onclick = () => {
    if(confirm("Are you sure? Your progress will be lost.")) {
    pForm.reset();
    iForm.reset();
    window.location.href = "user.html"
    }
};

//required
function validate(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll("[required]");

    requiredFields.forEach(field => {
        if (!field.value || field.value.trim() === "") {
            field.style.border = "2px solid red";
            isValid = false;
        }
        else {
            field.style.border = "none";
        }
    });
    return isValid;
}

//item information submission
const iForm = itemInfo.querySelector("form");
iForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const itemData = new FormData(iForm);

    if (itemName.disabled) {
        itemData.append("item_name", "N/A");
    }
    if (itemDesc.disabled) {
        itemData.append("item_desc", "N/A");
    }
    
    fetch('placeholder.php/submit', {
            method: 'POST',
            body: itemData
    })

    .then(response => {
        if (!response.ok) throw new Error("Server error");
        return response.json();
    })
    .then(data => console.log("Success from server: ", data))
    .catch(error => console.error("Error: ", error));
});
