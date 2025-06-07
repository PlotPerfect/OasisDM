// Renders the Projects section
export function renderProjectsSection(mainContent) {
  // You can move the full projects rendering logic here
  mainContent.innerHTML = `
    <section class="projects-section">
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <div>
          <h2 style="display:inline-block; margin-right: 32px;">Projects</h2>
          <nav class="projects-tabs" style="display:inline-block;">
            <button class="project-tab active" data-tab="list">List</button>
            <button class="project-tab" data-tab="schedule">Schedule</button>
            <button class="project-tab" data-tab="gallery">Gallery</button>
          </nav>
        </div>
        <button id="add-project-btn" class="add-project-btn">+ Add Project</button>
      </div>
      <div id="projects-tab-content" class="projects-tab-content" style="margin-top:24px;">
        <div id="projects-list-table-container">
          <div class="projects-table-toolbar">
            <input id="project-search-input" class="projects-table-search" type="text" placeholder="Search projects..." />
            <select id="status-filter" class="projects-table-filter">
              <option value="">All Statuses</option>
              <option value="Quotation">Quotation</option>
              <option value="Pending">Pending</option>
              <option value="Preparation">Preparation</option>
              <option value="In progress">In progress</option>
              <option value="Done">Done</option>
              <option value="Handed over">Handed over</option>
              <option value="Billed">Billed</option>
              <option value="Postponed">Postponed</option>
              <option value="Archived">Archived</option>
            </select>
            <button id="projects-table-reset" class="projects-table-reset">Reset</button>
          </div>
          <table id="projects-list-table" class="projects-list-table">
            <thead>
              <tr id="projects-table-header-row">
                <th data-sort="name" draggable="true">Name <span class="sort-arrow"></span></th>
                <th data-sort="status" draggable="true">Status <span class="sort-arrow"></span></th>
                <th data-sort="location" draggable="true">Location <span class="sort-arrow"></span></th>
                <th data-sort="contractNumber" draggable="true">Contract number <span class="sort-arrow"></span></th>
                <th data-sort="beginning" draggable="true">Beginning <span class="sort-arrow"></span></th>
                <th data-sort="end" draggable="true">End <span class="sort-arrow"></span></th>
                <th data-sort="managerName" draggable="true">Project manager <span class="sort-arrow"></span></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="projects-list-tbody">
              <!-- Project rows will be inserted here -->
            </tbody>
          </table>
        </div>
      </div>
      <div id="add-project-panel" class="add-project-panel">
        <!-- Add Project form goes here -->
      </div>
    </section>
  `;
  // --- Projects Section Logic ---
  // Firebase db is assumed to be globally available (from firebaseAuth.js)
  let projects = [];
  let projectsSort = { key: 'name', asc: true };
  let projectsFilter = { search: '', status: '' };
  let uploadedImages = [];

  // Render tabs and set up listeners
  function setupProjectsTabs() {
    const tabButtons = document.querySelectorAll('.project-tab');
    const tabContent = document.getElementById('projects-tab-content');
    const addProjectBtn = document.getElementById('add-project-btn');
    const addProjectPanel = document.getElementById('add-project-panel');
    const closeAddProjectPanel = document.getElementById('close-add-project-panel');

    function updateAddProjectBtnVisibility(tab) {
      if (tab === 'gallery') {
        addProjectBtn.style.display = 'none';
      } else {
        addProjectBtn.style.display = '';
      }
    }

    tabButtons.forEach(tab => {
      tab.addEventListener('click', () => {
        tabButtons.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        updateAddProjectBtnVisibility(tab.dataset.tab);
        switch(tab.dataset.tab) {
          case 'list':
            renderProjectsListTab(tabContent);
            break;
          case 'schedule':
            renderProjectsScheduleTab(tabContent);
            break;
          case 'gallery':
            renderProjectsGalleryTab(tabContent);
            break;
        }
      });
    });
    // Set initial visibility
    updateAddProjectBtnVisibility('list');
    // Initial tab
    renderProjectsListTab(tabContent);
    // Add Project panel logic
    if (addProjectBtn) {
      addProjectBtn.addEventListener('click', () => {
        renderAddEditProjectForm();
      });
    }
    if (closeAddProjectPanel) {
      closeAddProjectPanel.addEventListener('click', () => {
        addProjectPanel.classList.remove('open');
      });
    }
  }

  // --- List Tab ---
  function renderProjectsListTab(tabContent) {
    tabContent.innerHTML = `
      <div id="projects-list-table-container">
        <div class="projects-table-toolbar">
          <input id="project-search-input" class="projects-table-search" type="text" placeholder="Search projects..." />
          <select id="status-filter" class="projects-table-filter">
            <option value="">All Statuses</option>
            <option value="Quotation">Quotation</option>
            <option value="Pending">Pending</option>
            <option value="Preparation">Preparation</option>
            <option value="In progress">In progress</option>
            <option value="Done">Done</option>
            <option value="Handed over">Handed over</option>
            <option value="Billed">Billed</option>
            <option value="Postponed">Postponed</option>
            <option value="Archived">Archived</option>
          </select>
          <button id="projects-table-reset" class="projects-table-reset">Reset</button>
        </div>
        <table id="projects-list-table" class="projects-list-table">
          <thead>
            <tr id="projects-table-header-row">
              <th data-sort="name" draggable="true">Name <span class="sort-arrow"></span></th>
              <th data-sort="status" draggable="true">Status <span class="sort-arrow"></span></th>
              <th data-sort="location" draggable="true">Location <span class="sort-arrow"></span></th>
              <th data-sort="contractNumber" draggable="true">Contract number <span class="sort-arrow"></span></th>
              <th data-sort="beginning" draggable="true">Beginning <span class="sort-arrow"></span></th>
              <th data-sort="end" draggable="true">End <span class="sort-arrow"></span></th>
              <th data-sort="managerName" draggable="true">Project manager <span class="sort-arrow"></span></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="projects-list-tbody">
            <!-- Project rows will be inserted here -->
          </tbody>
        </table>
      </div>
    `;
    fetchProjectsFromFirestore();
    setTimeout(enableProjectsTableColumnDrag, 0);
  }

  // --- Schedule Tab ---
  function renderProjectsScheduleTab(tabContent) {
    tabContent.innerHTML = `<div id="projects-calendar" style="background:#f6fafd; border-radius:10px; padding:18px 8px 8px 8px; min-height:420px;"></div>`;
    setTimeout(() => renderProjectsCalendar(), 0);
  }

  // --- Gallery Tab ---
  function renderProjectsGalleryTab(tabContent) {
    tabContent.innerHTML = `<div id="gallery-grid" style="display:flex;flex-wrap:wrap;gap:18px;padding-top:16px;"></div>`;
    (async () => {
      const galleryGrid = document.getElementById('gallery-grid');
      const snapshot = await db.collection('projects').get();
      let allImages = [];
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.images && Array.isArray(data.images)) {
          data.images.forEach(img => {
            allImages.push({ ...img, projectId: doc.id, projectName: data.name });
          });
        }
      });
      allImages.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      if (allImages.length === 0) {
        galleryGrid.innerHTML = '<p style="color:#888;font-size:18px;">No images uploaded yet.</p>';
        return;
      }
      allImages.forEach(img => {
        const imgDiv = document.createElement('div');
        imgDiv.style = 'width:180px;display:flex;flex-direction:column;align-items:center;gap:8px;background:#fff;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.06);padding:12px;';
        imgDiv.innerHTML = `
          <img src="${img.url}" alt="${img.name}" style="width:150px;height:120px;object-fit:cover;border-radius:7px;box-shadow:0 1px 4px rgba(0,0,0,0.08);" />
          <div style="font-size:14px;font-weight:600;">${img.projectName}</div>
          <div style="font-size:12px;color:#888;">${img.name}</div>
          <div style="font-size:12px;color:#888;">${new Date(img.uploadedAt).toLocaleString()}</div>
          <div style="font-size:12px;color:#007bff;">Uploaded by: ${img.uploadedBy || 'Unknown'}</div>
        `;
        galleryGrid.appendChild(imgDiv);
      });
    })();
  }

  // --- Firestore Logic ---
  async function fetchProjectsFromFirestore() {
    const snapshot = await db.collection('projects').get();
    projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderProjectsTable();
  }

  async function addProjectToFirestore(project) {
    if (!project.images) project.images = [];
    await db.collection('projects').add(project);
    await fetchProjectsFromFirestore();
  }

  async function deleteProjectFromFirestore(id) {
    await db.collection('projects').doc(id).delete();
    await fetchProjectsFromFirestore();
  }

  // --- Table Rendering ---
  function renderProjectsTable() {
    const tbody = document.getElementById('projects-list-tbody');
    if (!tbody) return;
    let filtered = projects.filter(proj => {
      const matchesSearch =
        projectsFilter.search === '' ||
        proj.name.toLowerCase().includes(projectsFilter.search) ||
        (proj.location && proj.location.toLowerCase().includes(projectsFilter.search));
      const matchesStatus =
        !projectsFilter.status || proj.status === projectsFilter.status;
      return matchesSearch && matchesStatus;
    });
    filtered = filtered.sort((a, b) => {
      let valA = a[projectsSort.key] || '';
      let valB = b[projectsSort.key] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return projectsSort.asc ? -1 : 1;
      if (valA > valB) return projectsSort.asc ? 1 : -1;
      return 0;
    });
    tbody.innerHTML = '';
    filtered.forEach((proj, idx) => {
      const tr = document.createElement('tr');
      tr.style.cursor = 'pointer';
      tr.innerHTML = `
        <td><span style="display:flex;align-items:center;gap:8px;"><span style="display:inline-block;width:16px;height:16px;border-radius:4px;background:${proj.color};"></span>${proj.name}</span></td>
        <td><span class="status-badge status-${proj.status.replace(/\s+/g,'-').toLowerCase()}">${proj.status}</span></td>
        <td>${proj.location || ''}</td>
        <td>${proj.contractNumber || ''}</td>
        <td>${proj.beginning || ''}</td>
        <td>${proj.end || ''}</td>
        <td>${proj.managerName || ''}</td>
        <td><button class="delete-project-btn" data-id="${proj.id}" style="color:#e74c3c;background:none;border:none;cursor:pointer;font-size:18px;">&times;</button></td>
      `;
      tr.addEventListener('click', function(e) {
        if (e.target.closest('.delete-project-btn')) return;
        openEditProjectPanel(proj);
      });
      tbody.appendChild(tr);
    });
    document.querySelectorAll('.delete-project-btn').forEach(btn => {
      btn.addEventListener('click', async function(e) {
        e.stopPropagation();
        if (confirm('Delete this project?')) {
          await deleteProjectFromFirestore(this.dataset.id);
        }
      });
    });
  }

  // --- Calendar ---
  function renderProjectsCalendar() {
    const calendarEl = document.getElementById('projects-calendar');
    if (!calendarEl) return;
    calendarEl.innerHTML = '';
    const events = projects.map(proj => ({
      title: `<div class='fc-event-title-custom'><b>Job Sheet</b><br><span style='font-size:13px;'><i class='fc-icon fc-icon-briefcase'></i> ${proj.contractNumber || ''} ${proj.name || ''}</span></div>`,
      start: proj.beginning,
      end: proj.end ? dayjs(proj.end).add(1, 'day').format('YYYY-MM-DD') : undefined,
      backgroundColor: proj.color || '#007bff',
      borderColor: proj.color || '#007bff',
      display: 'block',
      extendedProps: { ...proj }
    }));
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'timeGridWeek',
      height: 420,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events,
      eventContent: function(arg) {
        return { html: arg.event.title };
      },
      eventClick: function(info) {
        const proj = info.event.extendedProps;
        alert(`Project: ${proj.name}\nStatus: ${proj.status}\nStart: ${proj.beginning}\nEnd: ${proj.end}`);
      },
      eventDidMount: function(info) {
        info.el.style.cursor = 'pointer';
      }
    });
    calendar.render();
  }

  // --- Column Drag ---
  function enableProjectsTableColumnDrag() {
    const headerRow = document.getElementById('projects-table-header-row');
    if (!headerRow) return;
    let dragSrcIdx = null;
    const ths = Array.from(headerRow.children);
    ths.forEach((th, idx) => {
      th.addEventListener('dragstart', function(e) {
        dragSrcIdx = idx;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', idx);
        th.classList.add('dragging');
      });
      th.addEventListener('dragend', function() {
        th.classList.remove('dragging');
      });
      th.addEventListener('dragover', function(e) {
        e.preventDefault();
        th.classList.add('drag-over');
      });
      th.addEventListener('dragleave', function() {
        th.classList.remove('drag-over');
      });
      th.addEventListener('drop', function(e) {
        e.preventDefault();
        th.classList.remove('drag-over');
        const fromIdx = dragSrcIdx;
        const toIdx = idx;
        if (fromIdx === toIdx) return;
        const row = headerRow;
        if (fromIdx < toIdx) {
          row.insertBefore(row.children[fromIdx], row.children[toIdx + 1]);
        } else {
          row.insertBefore(row.children[fromIdx], row.children[toIdx]);
        }
        const table = document.getElementById('projects-list-table');
        Array.from(table.tBodies[0].rows).forEach(tr => {
          const cell = tr.children[fromIdx];
          if (fromIdx < toIdx) {
            tr.insertBefore(cell, tr.children[toIdx + 1]);
          } else {
            tr.insertBefore(cell, tr.children[toIdx]);
          }
        });
      });
    });
  }

  // --- Add/Edit Project Panel ---
  function renderAddEditProjectForm(editProj = null) {
    const addProjectPanel = document.getElementById('add-project-panel');
    if (!addProjectPanel) return;
    addProjectPanel.classList.add('open');
    addProjectPanel.innerHTML = `
      <div class="add-project-panel-content" style="overflow-y:auto; max-height:80vh; position:relative;">
        <button id="close-add-project-panel" class="close-add-project-panel" style="position:absolute; top:18px; right:18px; background:none; border:none; font-size:22px; cursor:pointer;">&times;</button>
        <h3 style="margin-top:0;">${editProj ? 'Edit Project' : 'Add Project'}</h3>
        <form id="add-project-form">
          <label for="project-name" style="font-weight:600;">Project Name<span style="color:red;">*</span></label>
          <input id="project-name" name="project-name" type="text" required placeholder="Enter project name" style="width:100%; padding:8px 12px; border-radius:5px; border:1px solid #ccc; font-size:15px; margin-bottom:18px;" value="${editProj ? (editProj.name || '') : ''}" />
          <label for="project-color" style="font-weight:600;">Colour:</label>
          <select id="project-color" name="project-color" style="width:100%; padding:7px 10px; border-radius:5px; border:1px solid #ccc; font-size:15px; margin-bottom:18px;">
            <option value="#f7b500" ${editProj && editProj.color==="#f7b500" ? 'selected' : ''}>Yellow</option>
            <option value="#0e6f4f" ${editProj && editProj.color==="#0e6f4f" ? 'selected' : ''}>Green</option>
            <option value="#007bff" ${editProj && editProj.color==="#007bff" ? 'selected' : ''}>Blue</option>
            <option value="#e74c3c" ${editProj && editProj.color==="#e74c3c" ? 'selected' : ''}>Red</option>
            <option value="#8e44ad" ${editProj && editProj.color==="#8e44ad" ? 'selected' : ''}>Purple</option>
            <option value="#222" ${editProj && editProj.color==="#222" ? 'selected' : ''}>Black</option>
          </select>
          <label for="project-status" style="font-weight:600;">Status</label>
          <select id="project-status" name="project-status" style="width:100%; padding:8px 12px; border-radius:5px; border:1px solid #ccc; font-size:15px; margin-bottom:18px;">
            <option value="Quotation" ${editProj && editProj.status==="Quotation" ? 'selected' : ''}>Quotation</option>
            <option value="Pending" ${editProj && editProj.status==="Pending" ? 'selected' : ''}>Pending</option>
            <option value="Preparation" ${editProj && editProj.status==="Preparation" ? 'selected' : ''}>Preparation</option>
            <option value="In progress" ${editProj && editProj.status==="In progress" ? 'selected' : ''}>In progress</option>
            <option value="Done" ${editProj && editProj.status==="Done" ? 'selected' : ''}>Done</option>
            <option value="Handed over" ${editProj && editProj.status==="Handed over" ? 'selected' : ''}>Handed over</option>
            <option value="Billed" ${editProj && editProj.status==="Billed" ? 'selected' : ''}>Billed</option>
            <option value="Postponed" ${editProj && editProj.status==="Postponed" ? 'selected' : ''}>Postponed</option>
            <option value="Archived" ${editProj && editProj.status==="Archived" ? 'selected' : ''}>Archived</option>
          </select>
          <label for="project-beginning" style="font-weight:600;">Beginning</label>
          <input id="project-beginning" name="project-beginning" type="date" style="width:100%; padding:8px 12px; border-radius:5px; border:1px solid #ccc; font-size:15px; margin-bottom:18px;" value="${editProj ? (editProj.beginning || '') : ''}" />
          <label for="project-end" style="font-weight:600;">End</label>
          <input id="project-end" name="project-end" type="date" style="width:100%; padding:8px 12px; border-radius:5px; border:1px solid #ccc; font-size:15px; margin-bottom:18px;" value="${editProj ? (editProj.end || '') : ''}" />
          <label for="project-description" style="font-weight:600;">Description</label>
          <textarea id="project-description" name="project-description" rows="3" placeholder="Add a description for this project..." style="width:100%; padding:8px 12px; border-radius:5px; border:1px solid #ccc; font-size:15px; margin-bottom:18px;">${editProj ? (editProj.description || '') : ''}</textarea>
          <label for="project-contract-number" style="font-weight:600;">Contract number</label>
          <input id="project-contract-number" name="project-contract-number" type="text" placeholder="Enter contract number" style="width:100%; padding:8px 12px; border-radius:5px; border:1px solid #ccc; font-size:15px; margin-bottom:18px;" value="${editProj ? (editProj.contractNumber || '') : ''}" />
          <label for="project-manager-name" style="font-weight:600;">Project manager</label>
          <input id="project-manager-name" name="project-manager-name" type="text" placeholder="Enter manager name" style="width:100%; padding:8px 12px; border-radius:5px; border:1px solid #ccc; font-size:15px; margin-bottom:18px;" value="${editProj ? (editProj.managerName || '') : ''}" />
          <button type="submit" class="add-project-btn" style="width:100%; margin-top:10px;">${editProj ? 'Save Changes' : 'Add Project'}</button>
        </form>
      </div>
    `;
    // Close logic
    document.getElementById('close-add-project-panel').onclick = function() {
      addProjectPanel.classList.remove('open');
    };
    // Form submit logic
    document.getElementById('add-project-form').onsubmit = async function(e) {
      e.preventDefault();
      const project = {
        name: document.getElementById('project-name').value.trim(),
        color: document.getElementById('project-color').value,
        status: document.getElementById('project-status').value,
        beginning: document.getElementById('project-beginning').value,
        end: document.getElementById('project-end').value,
        description: document.getElementById('project-description').value,
        contractNumber: document.getElementById('project-contract-number').value,
        managerName: document.getElementById('project-manager-name').value
      };
      if (editProj && editProj.id) {
        await db.collection('projects').doc(editProj.id).update(project);
      } else {
        await addProjectToFirestore(project);
      }
      addProjectPanel.classList.remove('open');
      fetchProjectsFromFirestore();
    };
  }

  // Replace previous panel logic with this
  function openEditProjectPanel(proj) {
    renderAddEditProjectForm(proj);
  }

  // --- Initial Setup ---
  setupProjectsTabs();
}
