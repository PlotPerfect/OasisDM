// Renders the Crew section
export function renderCrewSection(mainContent) {
  mainContent.innerHTML = `
    <section class="crew-section">
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <div>
          <h2 style="display:inline-block; margin-right: 32px;">Crew</h2>
        </div>
        <button id="add-user-btn" class="add-project-btn">+ Add User</button>
      </div>
      <div id="crew-list-table-container">
        <div class="crew-table-toolbar">
          <input id="crew-search-input" class="crew-table-search" type="text" placeholder="Search crew..." />
        </div>
        <table id="crew-list-table" class="crew-list-table" style="width:100%;margin-top:18px;">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody id="crew-list-tbody">
            <!-- Crew rows will be inserted here -->
          </tbody>
        </table>
      </div>
    </section>
  `;

  // --- Crew Section Logic ---
  let crewData = [];

  async function fetchCrewDataFromFirestore() {
    const user = firebase.auth().currentUser;
    if (!user) return [];
    let companyName = '';
    try {
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        companyName = userDoc.data().companyName;
      }
    } catch (err) {
      console.error('Error fetching user company:', err);
      return [];
    }
    if (!companyName) return [];
    const snapshot = await db.collection('users').where('companyName', '==', companyName).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.userName || '',
        email: data.email || '',
        phone: data.phone || '',
        color: data.color || '#007bff',
        initials: (data.userName || '').split(' ').map(n => n[0]).join('').toUpperCase()
      };
    });
  }

  function renderCrewTable(filter = '') {
    const tbody = document.getElementById('crew-list-tbody');
    if (!tbody) return;
    let filtered = crewData.filter(c =>
      c.name.toLowerCase().includes((filter||'').toLowerCase()) ||
      (c.email||'').toLowerCase().includes((filter||'').toLowerCase())
    );
    tbody.innerHTML = '';
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan='3' style='color:#888;text-align:center;'>No crew members found.</td></tr>`;
      return;
    }
    filtered.forEach((c, idx) => {
      const tr = document.createElement('tr');
      tr.style.background = idx % 2 === 0 ? '#f9fafb' : '#fff';
      tr.style.transition = 'background 0.2s';
      tr.onmouseover = () => tr.style.background = '#e6f0fa';
      tr.onmouseout = () => tr.style.background = idx % 2 === 0 ? '#f9fafb' : '#fff';
      tr.innerHTML = `
        <td style="padding:12px 10px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:38px;height:38px;border-radius:50%;background:${c.color};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:17px;color:#fff;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
              ${c.initials}
            </div>
            <div style="display:flex;flex-direction:column;">
              <span style="font-size:16px;font-weight:600;">${c.name}</span>
            </div>
          </div>
        </td>
        <td style="padding:12px 10px;font-size:15px;color:#444;">${c.email || ''}</td>
        <td style="padding:12px 10px;font-size:15px;color:#444;">${c.phone || ''}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Add User button logic
  let addUserBtn = document.getElementById('add-user-btn');
  if (addUserBtn) {
    addUserBtn.addEventListener('click', function() {
      let addUserPanel = document.getElementById('add-user-panel');
      if (!addUserPanel) {
        addUserPanel = document.createElement('div');
        addUserPanel.id = 'add-user-panel';
        addUserPanel.className = 'add-project-panel';
        addUserPanel.style.zIndex = 1200;
        addUserPanel.innerHTML = `
          <div class="add-project-panel-content" style="overflow-y:auto; max-height:80vh;">
            <button id="close-add-user-panel" class="close-add-project-panel" style="position:absolute; top:18px; right:18px; background:none; border:none; font-size:22px; cursor:pointer;">&times;</button>
            <h3 style="margin-top:0;">Invite User</h3>
            <form id="add-user-form">
              <div style="margin-bottom:18px;">
                <label for="user-first-name" style="font-weight:600;">First Name<span style="color:red;">*</span></label>
                <input id="user-first-name" name="user-first-name" type="text" required placeholder="Enter first name" style="width:100%; padding:8px 12px; border-radius:5px; border:1px solid #ccc; font-size:15px;" />
              </div>
              <div style="margin-bottom:18px;">
                <label for="user-last-name" style="font-weight:600;">Last Name<span style="color:red;">*</span></label>
                <input id="user-last-name" name="user-last-name" type="text" required placeholder="Enter last name" style="width:100%; padding:8px 12px; border-radius:5px; border:1px solid #ccc; font-size:15px;" />
              </div>
              <div style="margin-bottom:18px;">
                <label for="user-email" style="font-weight:600;">Email<span style="color:red;">*</span></label>
                <input id="user-email" name="user-email" type="email" required placeholder="Enter email address" style="width:100%; padding:8px 12px; border-radius:5px; border:1px solid #ccc; font-size:15px;" />
              </div>
              <div style="margin-bottom:18px;">
                <label for="user-phone" style="font-weight:600;">Phone</label>
                <input id="user-phone" name="user-phone" type="tel" placeholder="Enter phone number" style="width:100%; padding:8px 12px; border-radius:5px; border:1px solid #ccc; font-size:15px;" />
              </div>
              <div style="margin-bottom:18px;">
                <label for="user-role" style="font-weight:600;">Role</label>
                <input id="user-role" name="user-role" type="text" placeholder="Select role" style="width:100%; padding:8px 12px; border-radius:5px; border:1px solid #ccc; font-size:15px;" readonly />
                <button type="button" id="select-role-btn" class="add-project-btn" style="margin-top:8px;">Select Role</button>
              </div>
              <div style="margin-bottom:18px;">
                <label for="user-additional-info" style="font-weight:600;">Additional information</label>
                <textarea id="user-additional-info" name="user-additional-info" rows="2" placeholder="Add any extra details..." style="width:100%; padding:8px 12px; border-radius:5px; border:1px solid #ccc; font-size:15px;"></textarea>
              </div>
              <button type="submit" class="add-project-btn" style="width:100%; margin-top:10px;">Send Invite</button>
            </form>
          </div>
        `;
        document.body.appendChild(addUserPanel);
      }
      addUserPanel.classList.add('open');
      // Close logic
      const closeAddUserPanel = document.getElementById('close-add-user-panel');
      if (closeAddUserPanel) {
        closeAddUserPanel.onclick = function() {
          addUserPanel.classList.remove('open');
        };
      }
      // Role select logic
      const selectRoleBtn = document.getElementById('select-role-btn');
      if (selectRoleBtn) {
        selectRoleBtn.onclick = function() {
          openRolePanel();
        };
      }
      // Form submit placeholder
      const addUserForm = document.getElementById('add-user-form');
      if (addUserForm) {
        addUserForm.onsubmit = function(e) {
          e.preventDefault();
          alert('User invitation workflow coming soon!');
          addUserPanel.classList.remove('open');
        };
      }
    });
  }

  // Role selection panel logic
  function openRolePanel() {
    let rolePanel = document.getElementById('role-panel');
    if (!rolePanel) {
      rolePanel = document.createElement('div');
      rolePanel.id = 'role-panel';
      rolePanel.className = 'add-project-panel';
      rolePanel.style.zIndex = 1300;
      rolePanel.innerHTML = `
        <div class="add-project-panel-content" style="overflow-y:auto; max-height:80vh; position:relative;">
          <button id="close-role-panel" class="close-add-project-panel" style="position:absolute; top:18px; right:18px; background:none; border:none; font-size:22px; cursor:pointer;">&times;</button>
          <h3 style="margin-top:0;">Select Role</h3>
          <form id="role-select-form">
            <div style="margin-bottom:18px;">
              <label><input type="radio" name="role" value="Manager" required /> Manager</label>
            </div>
            <div style="margin-bottom:18px;">
              <label><input type="radio" name="role" value="Worker" required /> Worker</label>
            </div>
            <div style="margin-bottom:18px;">
              <label><input type="radio" name="role" value="Admin" required /> Admin</label>
            </div>
            <button type="submit" class="add-project-btn" style="width:100%; margin-top:10px;">Select</button>
          </form>
        </div>
      `;
      document.body.appendChild(rolePanel);
    }
    rolePanel.classList.add('open');
    // Close logic
    const closeRolePanel = document.getElementById('close-role-panel');
    if (closeRolePanel) {
      closeRolePanel.onclick = function() {
        rolePanel.classList.remove('open');
      };
    }
    // Select role logic
    const roleSelectForm = document.getElementById('role-select-form');
    if (roleSelectForm) {
      roleSelectForm.onsubmit = function(e) {
        e.preventDefault();
        const selected = document.querySelector('input[name="role"]:checked');
        if (selected) {
          document.getElementById('user-role').value = selected.value;
          document.getElementById('select-role-btn').textContent = selected.value;
        }
        rolePanel.classList.remove('open');
      };
    }
  }

  // Search logic
  const crewSearchInput = document.getElementById('crew-search-input');
  if (crewSearchInput) {
    crewSearchInput.addEventListener('input', function() {
      renderCrewTable(this.value);
    });
  }

  // Initial fetch and render
  (async () => {
    crewData = await fetchCrewDataFromFirestore();
    renderCrewTable();
  })();
}
