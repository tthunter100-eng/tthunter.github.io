//fetch data
let inventory = [];
const API_BASE_URL = "https://tthunter-github-io.onrender.com";

async function loadInventoryFromServer() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/inventory`);
        inventory = await response.json();
        renderInventory();
        filterAndHighlight();
    }
    catch (error) {
        console.error("Failed to load inventory", error);
        const itemList = document.querySelector(".item-list");
        itemList.classList.add("is-empty");
        itemList.innerHTML = "<p style='color: white; font-weight: bold;'>Unable to load items. Please try again later.</p>";
    }
}
loadInventoryFromServer();

//submit a ticket div
const lostSomething = document.createElement("div");
lostSomething.innerHTML = `
<h style="font-size: 50px; font-weight: bold; margin: 0; line-height: 1;">Lost Something?<br>We Got You.</h><br>
<h style="font-size: 20px; font-weight: normal; margin: 0; line-height: 1.1;">Browse surrendered items and claim what's yours.</h><br>
<div style="height: 60px; width: 200px; top: 10px; display: flex; position: relative;">
    <button class="create-ticket-btn" id="ticket-button">
    <img src="submitticket.png" style="position: relative; height: 95%; width: 20%;" alt="icon" class="submit-ticket-icon">
    <span>Submit a ticket</span>
    </button>
</div>
`;  
Object.assign(lostSomething.style, {
    position: "absolute",
    top: "170px",
    left: "110px",
    display: "flex",
    flexDirection: "column",
})
document.querySelector(".header").appendChild(lostSomething);

//anti double-injection
if (!document.getElementById("ticket-button")) {
    document.querySelector(".header").appendChild(lostSomething);
}

//redirect
const submitTicket = document.getElementById("ticket-button");
submitTicket.onclick = () => {
    window.location.href = "submitaticket.html";
};

//search function
const searchContainer = document.createElement("div");
searchContainer.innerHTML = `
<div style="position: relative; display: flex; align-items: center; border-radius: 40px; background-color: #ccc; height: 40px; width: 590px;">
    <img src="SearchIco.png" style="height: 100%; width: 8%; margin-left: 10px; z-index: 2000;">
    <input type="text" id="search-input" placeholder="Filter list..." style="padding: 6px 10px; background: transparent; border: none; width: 100%; font-size: 20px; outline: none;">
    <button id="clear-search" style="position: absolute; right: 8px; background: none; border: none; cursor: pointer; color: #888; font-weight: bold; display: none;">✕</button>
</div>
    <button id="all-categories" style="border-radius: 40px; background: transparent; color: #ffffff; border-color: #ffffff; border-width: 1px; padding: 6px; width: 50px; font-weight: bold; font-size: 15px;" value="All">All</button>
    <button style="border-radius: 40px; background: transparent; color: #ffffff; border-color: #ffffff; border-width: 1px; padding: 6px; font-weight: bold; font-size: 15px;" value="Electronics">Electronics</button>
    <button style="border-radius: 40px; background: transparent; color: #ffffff; border-color: #ffffff; border-width: 1px; padding: 6px; font-weight: bold; font-size: 15px;" value="Clothing">Clothing</button>
    <button style="border-radius: 40px; background: transparent; color: #ffffff; border-color: #ffffff; border-width: 1px; padding: 6px; font-weight: bold; font-size: 15px;" value="School Supplies">School Supplies</button>
    <button style="border-radius: 40px; background: transparent; color: #ffffff; border-color: #ffffff; border-width: 1px; padding: 6px; font-weight: bold; font-size: 15px;" value="Wallet">Wallet</button>
    <button style="border-radius: 40px; background: transparent; color: #ffffff; border-color: #ffffff; border-width: 1px; padding: 6px; width: 50px; font-weight: bold; font-size: 15px;" value="ID">ID</button>
    <button style="border-radius: 40px; background: transparent; color: #ffffff; border-color: #ffffff; border-width: 1px; padding: 6px; font-weight: bold; font-size: 15px;" value="Other">Other</button>
`;

Object.assign(searchContainer.style, {
    position: "sticky",
    top: "0",
    width: "100%",
    display: "flex",
    opacity: "0.85",
    gap: "15px",
    margin: "0",
    alignItems: "center",
    backgroundColor: "#2d4f81",
    padding: "10px 10px",
    borderRadius: "40px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: "3000",
    height: "55px",
    boxSizing: "border-box",
    overflow: "hidden",
    transition: "opacity 0.1s ease",
});
document.querySelector(".item-list-container").prepend(searchContainer);

//button flavors
function setActiveButton(activeBtn, allBtns) {
    allBtns.forEach(btn => {
        Object.assign(btn.style, {
            backgroundColor: "transparent",
            borderColor: "white",
        });
    });

    Object.assign(activeBtn.style, {
        backgroundColor: "black",
        borderColor: "white",
    });
}

const allBtns = searchContainer.querySelectorAll("button[value]");
allBtns.forEach(btn => {
    btn.addEventListener('click', () => setActiveButton(btn, allBtns))
});

//search function logic
let currentCategory = "All";
const searchInput = searchContainer.querySelector("#search-input");
const clearBtn = searchContainer.querySelector("#clear-search");
const categorySelect = searchContainer.querySelectorAll("button[value]");

const filterAndHighlight = () => {
    const query = searchInput.value.toLowerCase();
    const items = document.querySelectorAll(".item-list li");
   
    clearBtn.style.display = query.length > 0 ? "block" : "none";


    items.forEach(item => {
        if (!item.dataset.original) item.dataset.original = item.innerHTML;
        const itemCategory = item.dataset.category || "";
       
        // compute raw text excluding status badge
        let rawText = item.innerText.toLowerCase();
        const badge = item.querySelector('.status-badge');
        if (badge) {
            rawText = rawText.replace(badge.innerText.toLowerCase(), '');
        }
        const matchesCategory = currentCategory === "All" || itemCategory.toLowerCase() === currentCategory.toLowerCase();
        const matchesQuery = rawText.includes(query);

        item.style.display = (matchesCategory && matchesQuery) ? "block" : "none";
    });
};
categorySelect.forEach(btn => {
    btn.addEventListener('click', () => {
        currentCategory = btn.getAttribute("value");
        setActiveButton(btn, categorySelect);
        filterAndHighlight();
    });
});
searchInput.oninput = filterAndHighlight;
clearBtn.onclick = () => {
    searchInput.value = "";
    filterAndHighlight();
    searchInput.focus();
};

const allCategory = document.getElementById("all-categories");
if (allCategory) {
    setActiveButton(allCategory, allBtns);
}

function renderInventory() {
    const itemList = document.querySelector(".item-list");
    itemList.innerHTML = "";

    if (inventory.length === 0) {
        itemList.classList.add("is-empty");
        itemList.innerHTML = "<p style='color: white; text-align: center; margin-top: 20px; '>No items surrendered yet. Check back soon!</p>";
        return;
    }

    itemList.classList.remove("is-empty");
    inventory.forEach(item => {
        const li = document.createElement("li");

        li.dataset.code = item.code;
        li.dataset.name = item.name;
        li.dataset.category = item.category;
        li.dataset.desc = item.desc;

        Object.assign(li.style, {
            padding: "5px 5px",
            position: "relative",
            listStyle: "none",
        });

        li.innerHTML = `
            <div style="display: flex; flex-direction: row; height: 80px; width: 100%; gap: 0;">
                <div style="width: 50%; height: 100%; margin-bottom: 8px; padding: 3px;">
                    <span style="font-weight: 900; font-size: 30px;">${item.code}</span>
                </div>
                <div style="width: 75%; height: 100%; margin-bottom: 8px; padding: 3px; align-items: center; margin-top: 10px;">
                    <span style="font-weight: bold; font-size: 20px; text-align: right; margin-right: 15px;">${item.name}</span>
                </div>
            </div>
            <div style="height: 50px; font-size: 16px; color: #b0b0b0; line-height: 1.4; text-align: center; padding: 3px; width: 100%;">
                ${item.desc || "No additional details"}
            </div>
        `;

        itemList.appendChild(li);
    });
}

//search bar flavor
const searchOpacity = () => {
    setTimeout(() => {
        const isHovered = searchContainer.matches(':hover');
        const isFocused = document.activeElement === searchInput;
        const isButtonFocused = Array.from(allBtns).includes(document.activeElement);

        if (isHovered || isFocused || isButtonFocused) {
            searchContainer.style.opacity = "0.85";
        }
        else {
            searchContainer.style.opacity = "0.4";
        }
    }, 50);

    allBtns.forEach(btn => {
        btn.addEventListener('focus', searchOpacity);
        btn.addEventListener('blur', searchOpacity);
        btn.addEventListener('click', searchOpacity);
    });
};
searchContainer.onmouseenter = searchOpacity;
searchContainer.onmouseleave = searchOpacity;
searchInput.onfocus = searchOpacity;
searchInput.onblur = searchOpacity;
