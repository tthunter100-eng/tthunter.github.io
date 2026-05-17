// Data Storage
let items = [];
let tickets = [];
let currentlyViewingId = null;
let currentSection = 'items'; // Track if we are in 'items' or 'tickets'
let currentFilter = 'all'; // Track current filter (e.g., claimed, unclaimed, archived, pending, approved, unapproved)

// DOM Elements
const itemsPanel = document.getElementById('itemsPanel');
const searchAdd = document.querySelector('.search-add');
const itemForm = document.getElementById('itemForm');
const statusSelect = document.getElementById('status');
const claimedFields = document.getElementById('claimedFields');
const saveBtn = document.getElementById('saveBtn');
const editStatusSelect = document.getElementById('editStatusSelect');
const editClaimedBy = document.getElementById('editClaimedBy');
const editDateClaimed = document.getElementById('editDateClaimed');
const navItems = document.querySelectorAll('.nav-item');
const filterBlocks = document.querySelectorAll('.filter-block');
const searchUnderlay = document.querySelector('.search-underlay');
const searchBar = document.querySelector('.search-bar');
const sidebar = document.querySelector('.right-sidebar');
const sectionConfigs = {
    items: {
        title: 'Item',
        filters: ['Claimed', 'Unclaimed', 'Archived'],
        filterValues: ['claimed', 'unclaimed', 'archived']
    },
    tickets: {
        title: 'Ticket',
        filters: ['Approved', 'Pending', 'Unapproved'],
        filterValues: ['approved', 'pending', 'unapproved']
    }
};




editStatusSelect.addEventListener('change', function() {
    const isClaimed = this.value === 'claimed';
    document.getElementById('viewClaimedGroup').style.display = isClaimed ? 'block' : 'none';
    editClaimedBy.style.display = isClaimed ? 'block' : 'none';
    editDateClaimed.style.display = isClaimed ? 'block' : 'none';

    document.getElementById('viewClaimedBy').style.display = isClaimed ? 'none' : 'block';
    document.getElementById('viewDateClaimed').style.display = isClaimed ? 'none' : 'block';
});

// --- Navigation & Sidebar Logic ---

document.addEventListener('DOMContentLoaded', async () => {
    const itemsBtn = document.getElementById('items');
    if (itemsBtn) {
        itemsBtn.classList.add('selected');
        itemsPanel.style.display = 'flex';
    }
    
    try {
      const itemRes = await fetch('/api/inventory');
      items = await itemRes.json();

      const ticketRes = await fetch('/api/tickets');
      tickets = await ticketRes.json();

      renderList();
    }
    catch (err) {
      console.error("Failed to load data.", err);
    }
});

searchAdd.addEventListener('click', () => {
    sidebar.style.display = 'block';
});

statusSelect.addEventListener('change', function() {
    claimedFields.style.display = this.value === 'claimed' ? 'block' : 'none';
});


// --- Search & Filter Logic ---

searchBar.addEventListener('input', renderList);

filterBlocks.forEach(block => {
    block.addEventListener('click', function() {
        filterBlocks.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        currentFilter = this.getAttribute('data-filter');
        renderList();
    });
});

function viewItem(mongoId) {
    const activeData = currentSection === 'items' ? items : tickets;
    const entry = activeData.find(e => (e._id === mongoId || e.id === mongoId));
    if (!entry) return;

    currentlyViewingId = mongoId.toString();
    document.getElementById('itemForm').style.display = 'none';
    document.getElementById('itemView').style.display = 'block';
    sidebar.style.display = 'block';

    if (currentSection === 'tickets') {
  document.getElementById('ticketView').style.display = 'block';

  // hide item-specific fields
  document.getElementById('viewCode').parentElement.style.display = 'none';
  document.getElementById('viewDescription').parentElement.style.display = 'none';
  document.getElementById('viewWhen').parentElement.style.display = 'none';
  document.getElementById('viewWhere').parentElement.style.display = 'none';
  document.getElementById('viewSurrendered').parentElement.style.display = 'none';
  document.getElementById('viewClaimedGroup').style.display = 'none';
  document.getElementById('viewStatusBadge').style.display = 'none';

  // populate ticket fields
  document.getElementById('viewFullName').textContent = entry.fullName;
  document.getElementById('viewRole').textContent = entry.role;
  document.getElementById('viewStudentNumber').textContent = entry.studentNumber;
  document.getElementById('viewProgram').textContent = entry.program;
  document.getElementById('viewDepartment').textContent = entry.department;
  document.getElementById('viewEmail').textContent = entry.email;
} else {
  // Hide ticket view
  document.getElementById('ticketView').style.display = 'none';

  // ✅ Re-show item-specific fields
  document.getElementById('viewCode').parentElement.style.display = 'block';
  document.getElementById('viewDescription').parentElement.style.display = 'block';
  document.getElementById('viewWhen').parentElement.style.display = 'block';
  document.getElementById('viewWhere').parentElement.style.display = 'block';
  document.getElementById('viewSurrendered').parentElement.style.display = 'block';
  document.getElementById('viewStatusBadge').style.display = 'inline-block';

  // Reset UI to 'View Mode'
  document.getElementById('editStatusSelect').style.display = 'none';
  document.getElementById('editClaimedBy').style.display = 'none';
  document.getElementById('editDateClaimed').style.display = 'none';
  document.getElementById('saveEditBtn').style.display = 'none';
  document.getElementById('deleteBtn').style.display = 'none';
  document.getElementById('editBtn').style.display = 'inline-block';

  // Populate item fields
  document.getElementById('viewItemName').textContent = entry.name;
  document.getElementById('viewCode').textContent = entry.code;
  document.getElementById('viewDescription').textContent = entry.description;
  document.getElementById('viewWhen').textContent = entry.seenWhen;
  document.getElementById('viewWhere').textContent = entry.seenWhere;
  document.getElementById('viewSurrendered').textContent = entry.surrenderedBy;
  document.getElementById('viewClaimedBy').textContent = entry.claimedBy || 'N/A';
  document.getElementById('viewDateClaimed').textContent = entry.dateClaimed || 'N/A';

  // Status badge color
  const badge = document.getElementById('viewStatusBadge');
  badge.textContent = entry.status.toUpperCase();
  badge.style.background =
    entry.status === 'claimed' ? '#27ae60' :
    (entry.status === 'archived' ? '#e74c3c' : '#f1c40f');

  // Claimed group visibility
  const claimedGroup = document.getElementById('viewClaimedGroup');
  claimedGroup.style.display = entry.status === 'claimed' ? 'block' : 'none';
}

// Helper to style the badge
function updateStatusBadge(status) {
    const badge = document.getElementById('viewStatusBadge');
    badge.textContent = status.toUpperCase();
    badge.style.background = status === 'claimed' ? '#27ae60' : (status === 'archived' ? '#e74c3c' : '#f1c40f');
}
}
// --- Edit & Delete Event Listeners ---

// Pressing "Edit Status"
document.getElementById('editBtn').addEventListener('click', () => {
  const activeData = currentSection === 'items' ? items : tickets;
  const entry = activeData.find(e => (e._id || e.id) === currentlyViewingId);

  // Toggle UI to 'Edit Mode'
  document.getElementById('viewStatusBadge').style.display = 'none';
  document.getElementById('editBtn').style.display = 'none';
  document.getElementById('editStatusSelect').style.display = 'inline-block';
  document.getElementById('saveEditBtn').style.display = 'inline-block';
  document.getElementById('deleteBtn').style.display = 'inline-block';

  // ✅ Dynamically set dropdown options depending on section
  const editSelect = document.getElementById('editStatusSelect');
  editSelect.innerHTML = ''; // clear old options

  if (currentSection === 'tickets') {
    ['approved', 'pending', 'unapproved'].forEach(status => {
      const opt = document.createElement('option');
      opt.value = status;
      opt.textContent = status.charAt(0).toUpperCase() + status.slice(1);
      editSelect.appendChild(opt);
    });
  } else {
    ['unclaimed', 'claimed', 'archived'].forEach(status => {
      const opt = document.createElement('option');
      opt.value = status;
      opt.textContent = status.charAt(0).toUpperCase() + status.slice(1);
      editSelect.appendChild(opt);
    });
  }

  // Set current value to entry’s status
  editSelect.value = entry.status;

  // If item is claimed, show claimed inputs
  if (currentSection === 'items' && entry.status === 'claimed') {
    document.getElementById('editClaimedBy').style.display = 'block';
    document.getElementById('editDateClaimed').style.display = 'block';
    document.getElementById('viewClaimedBy').style.display = 'none';
    document.getElementById('viewDateClaimed').style.display = 'none';
  }
});

// Pressing "Save Changes"
document.getElementById('saveEditBtn').addEventListener('click', async () => {
    const isItem = currentSection === 'items';
    const activeData = isItem ? items : tickets;
    const BASE_URL = 'http://localhost:5000';


    
    const entryIndex = activeData.findIndex(e => (e._id || e.id) === currentlyViewingId);
    if (entryIndex === -1) {
        alert("Error: Item not found in local list.");
        return;
    }

    const newStatus = document.getElementById('editStatusSelect').value;
    const updatedFields = { status: newStatus };

    if (isItem) {
        updatedFields.claimedBy = document.getElementById('editClaimedBy').value;
        updatedFields.dateClaimed = document.getElementById('editDateClaimed').value;
    }

    try {
        const response = await fetch(`${BASE_URL}${isItem ? '/api/inventory' : '/api/tickets'}/${currentlyViewingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedFields)
        });

        if (response.ok) {
            activeData[entryIndex] = { ...activeData[entryIndex], ...updatedFields };
            renderList(); 
            viewItem(currentlyViewingId);
            alert("Changes saved!");
        } else {
            const err = await response.json();
            alert("Server Error: " + err.error);
        }
    } catch (err) {
        alert("Connection failed. Is the server running?");
    }
});

// Pressing "Delete Item"
document.getElementById('deleteBtn').addEventListener('click', async () => {
    console.log("DEBUG: Clicked delete. currentlyViewingId is:", currentlyViewingId);
    const BASE_URL = 'http://localhost:5000';
    

    if (!currentlyViewingId) {
        alert("Error: No ID found to delete!");
        return;
    }

    if (confirm("Are you sure you want to delete this permanently?")) {
        const isItem = currentSection === 'items';
        
        try {
            const endpoint = isItem 
                ? `/api/inventory/${currentlyViewingId}` 
                : `/api/tickets/${currentlyViewingId}`;

            console.log("DEBUG: Sending DELETE fetch to:", endpoint);

            const response = await fetch(`${BASE_URL}/api/inventory/${currentlyViewingId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                if (isItem) {
                    items = items.filter(i => (i._id || i.id) !== currentlyViewingId);
                } else {
                    tickets = tickets.filter(t => (t._id || t.id) !== currentlyViewingId);
                }

                sidebar.style.display = 'none';
                renderList(); 
                alert("Deleted successfully!");
            } else {
                const errText = await response.text();
                console.error("Server rejected delete:", errText);
                alert("Failed to delete from server.");
            }
        } catch (err) {
            console.error("Delete Error:", err);
            alert("Error connecting to server.");
        }
    }
});

document.getElementById('closeViewBtn').addEventListener('click', () => {
    sidebar.style.display = 'none';
});

// --- Navigation Logic ---

navItems.forEach(nav => {
    nav.addEventListener('click', function() {
        // Remove selection from all and add to clicked
        navItems.forEach(n => n.classList.remove('selected'));
        this.classList.add('selected');
        
        currentSection = this.id; // 'items', 'tickets', etc.
        
        // Reset filter state to "All" when switching tabs
        currentFilter = 'all';
        filterBlocks.forEach(b => b.classList.remove('selected'));
        const allFilter = document.getElementById('filterAll');
        if (allFilter) allFilter.classList.add('selected');

        // Execute UI updates for the section
        if (currentSection === 'items' || currentSection === 'tickets') {
            updateUIForSection(); // Ensure this matches your function name exactly
            renderList();        // Ensure this matches your function name exactly
        }
    });
});

function updateUIForSection() {
  const config = sectionConfigs[currentSection];
  if (!config) return;

  // Update filter block text and data attributes
  const filter1 = document.getElementById('filterClaimed');
  const filter2 = document.getElementById('filterUnclaimed');
  const filter3 = document.getElementById('filterArchived');

  if (filter1) {
    filter1.textContent = config.filters[0];
    filter1.setAttribute('data-filter', config.filterValues[0]);
  }
  if (filter2) {
    filter2.textContent = config.filters[1];
    filter2.setAttribute('data-filter', config.filterValues[1]);
  }
  if (filter3) {
    filter3.textContent = config.filters[2];
    filter3.setAttribute('data-filter', config.filterValues[2]);
  }

  // Update form header
  const formHeader = document.querySelector('.item-form h3');
  if (formHeader) {
    formHeader.textContent = `Add New ${config.title}`;
  }

  // Toggle fields
  document.getElementById('ticketFields').style.display =
    currentSection === 'tickets' ? 'block' : 'none';
  document.getElementById('itemSpecificFields').style.display =
    currentSection === 'items' ? 'block' : 'none';
}
// --- Unified Rendering & Search Logic ---

function renderList() {
  const searchText = searchBar.value.toLowerCase();
  const activeData = currentSection === 'items' ? items : tickets;

  searchUnderlay.innerHTML = '';

  const filteredData = activeData.filter(entry => {
    const matchesFilter = currentFilter === 'all' || entry.status === currentFilter;
    const matchesSearch = currentSection === 'items'
      ? (entry.code?.toLowerCase().includes(searchText) || entry.name?.toLowerCase().includes(searchText))
      : (entry.fullName?.toLowerCase().includes(searchText) || entry.studentNumber?.toLowerCase().includes(searchText));
    return matchesFilter && matchesSearch;
  });

  filteredData.forEach(entry => {
    const itemEl = document.createElement('div');
    itemEl.className = 'list-item-entry';
    itemEl.style.cursor = 'pointer';
    itemEl.addEventListener('click', () => viewItem(entry._id));


    const colors = {
      claimed: '#27ae60', approved: '#27ae60',
      unclaimed: '#f1c40f', pending: '#f1c40f',
      archived: '#e74c3c', unapproved: '#e74c3c'
    };
    const statusColor = colors[entry.status] || '#888';

    itemEl.innerHTML = currentSection === 'items'
  ? `
    <span class="item-code">${entry.code}</span>
    <span class="item-name">${entry.name}</span>
    <span class="item-description">${entry.description || ''}</span>
    <div class="status-container">
      <span class="status-text" style="color: ${statusColor}">${entry.status.toUpperCase()}</span>
      <span class="status-indicator" style="background: ${statusColor}"></span>
    </div>
  `
  : `
    <span class="item-code">${entry.studentNumber}</span>
    <span class="item-name">${entry.fullName}</span>
    <div class="status-container">
      <span class="status-text" style="color: ${statusColor}">${entry.status.toUpperCase()}</span>
      <span class="status-indicator" style="background: ${statusColor}"></span>
    </div>
  `;

    searchUnderlay.appendChild(itemEl);
  });
}

// Global Search Listener
searchBar.addEventListener('input', renderList);

// Global Filter Block Listener
filterBlocks.forEach(block => {
    block.addEventListener('click', function() {
        filterBlocks.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        currentFilter = this.getAttribute('data-filter');
        renderList();
    });
});

// Single Add Button Listener
searchAdd.addEventListener('click', () => {
    document.getElementById('itemView').style.display = 'none';
    document.getElementById('itemForm').style.display = 'block';
    sidebar.style.display = 'block';
});

// Single Save Button Listener
saveBtn.addEventListener('click', async () => {
  const isTicket = currentSection === 'tickets';
  const endpoint = isTicket ? '/api/tickets' : '/api/inventory';
  let entry = {};

  try {
    if (isTicket) {
      const fullName = document.getElementById('fullName').value.trim();
      const role = document.getElementById('role').value.trim();
      const studentNumber = document.getElementById('studentNumber').value.trim();
      const program = document.getElementById('program').value.trim();
      const department = document.getElementById('department').value.trim();
      const email = document.getElementById('email').value.trim();
      const status = document.getElementById('ticketStatus').value;

      if (!fullName || !role || !studentNumber || !program || !department || !email) {
        alert("Please fill in all ticket fields.");
        return;
      }

      entry = { fullName, role, studentNumber, program, department, email, status };
    }
    else {
      const code = document.getElementById('code').value.trim();
      const name = document.getElementById('itemName').value.trim();

      // 2. Validate values directly
      if (!code || !name) {
          alert("Please fill in the Code and Item Name.");
          return;
      }

      // 3. Create the entry object
      entry = {
        code,
        name,
        status: statusSelect.value,
        description: document.getElementById('description').value,
        seenWhen: document.getElementById('seenWhen').value,
        seenWhere: document.getElementById('seenWhere').value,
        surrenderedBy: document.getElementById('surrenderedBy').value,
        claimedBy: document.getElementById('claimedBy').value,
        dateClaimed: document.getElementById('dateClaimed').value
      };
    }
      // 4. Push to correct array based on currentSection
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });

      if (response.ok) {
        const savedData = await response.json();

        if (isTicket) {
          tickets.push(savedData);
        }
        else {
          items.push(savedData);
        }

          //Sidebar UI cleanup
        sidebar.style.display = 'none';
        const formElement = document.querySelector('#itemForm form');
        if (formElement) formElement.reset();
      
        renderList();
        alert(`${isTicket ? 'Ticket' : 'Item'} saved successfully!`);
      }
      else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save to database");
      }
    }
    catch (err) {
      console.error("Save Error:", err);
      alert("Error connecting to server. Please try again.");
    }
});
