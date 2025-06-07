// Renders the Tasks section
export function renderTasksSection(mainContent) {
  mainContent.innerHTML = `
    <section class="tasks-section">
      <div style="display:flex;align-items:center;gap:24px;margin-bottom:18px;">
        <h2 style="margin:0;">Tasks</h2>
        <nav style="display:flex;gap:0 12px;">
          <button class="tasks-tab active" data-tab="list" style="background:none;border:none;font-size:16px;font-weight:600;padding:8px 18px;cursor:pointer;border-bottom:2px solid #2563eb;color:#222;">List</button>
          <button class="tasks-tab" data-tab="schedule" style="background:none;border:none;font-size:16px;font-weight:600;padding:8px 18px;cursor:pointer;color:#888;">Schedule</button>
          <button class="tasks-tab" data-tab="templates" style="background:none;border:none;font-size:16px;font-weight:600;padding:8px 18px;cursor:pointer;color:#888;">Templates</button>
        </nav>
      </div>
      <div id="tasks-section-content">
        <p>This is the Tasks List. Add your task management UI here.</p>
      </div>
    </section>
  `;

  const sectionContent = mainContent.querySelector('#tasks-section-content');

  // --- Task List Table & Add/Edit Panel ---
  // Move selectedDocuments here so it persists across renders and is accessible to all handlers
  let selectedDocuments = [];
  function renderTaskList() {
    sectionContent.innerHTML = `
      <div class="projects-table-toolbar">
        <input class="projects-table-search" id="tasks-search" type="text" placeholder="Search tasks..." />
        <button class="add-project-btn" id="add-task-btn">+ Add Task</button>
      </div>
      <div style="overflow-x:auto;max-height:420px;overflow-y:auto;">
        <table class="projects-list-table" id="tasks-list-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Assignee</th>
              <th>Project</th>
              <th>Priority</th>
              <th>Start</th>
              <th>Due</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="tasks-list-tbody">
            <!-- Tasks will be rendered here -->
          </tbody>
        </table>
      </div>
      <div class="add-project-panel" id="add-task-panel" style="right:-420px;">
        <div class="add-project-panel-content">
          <button class="close-add-project-panel" id="close-add-task-panel">&times;</button>
          <h3 id="add-task-title">Choose Task Template</h3>
          <button class="add-project-btn" id="blank-template-btn" style="margin-top:18px;width:100%;">Blank Template</button>
        </div>
      </div>
      <div class="add-project-panel" id="blank-task-panel" style="right:-420px;">
        <div class="add-project-panel-content" style="background:#fff;border-radius:18px 0 0 18px;box-shadow:-2px 0 16px rgba(0,0,0,0.07);padding:36px 32px 32px 32px;min-width:370px;max-width:420px;height:100vh;overflow-y:auto;">
          <button class="close-add-project-panel" id="close-blank-task-panel" style="position:absolute;top:18px;right:22px;font-size:26px;background:none;border:none;color:#888;cursor:pointer;">&times;</button>
          <h3 style="font-size:1.45rem;font-weight:700;margin-bottom:28px;margin-top:0;">Add Task - Blank Template</h3>
          <div style="margin-bottom:22px;">
            <label style="display:block;font-weight:500;font-size:15px;margin-bottom:7px;">Task Name</label>
            <input id="blank-task-name-input" type="text" class="project-input" placeholder="Task name" style="width:100%;padding:10px 13px;font-size:15px;border:1.5px solid #e5e7eb;border-radius:7px;outline:none;" />
          </div>
          <div style="margin-bottom:22px;">
            <label style="display:block;font-weight:500;font-size:15px;margin-bottom:7px;">Status</label>
            <div style="display:flex;gap:8px;align-items:center;">
              <select id="blank-task-status-input" class="project-input" style="flex:1;padding:10px 13px;font-size:15px;border:1.5px solid #e5e7eb;border-radius:7px;outline:none;">
                <option value="Todo">Todo</option>
                <option value="New">New</option>
                <option value="In progress">In progress</option>
                <option value="Done">Done</option>
                <option value="Approved">Approved</option>
                <option value="Billed">Billed</option>
                <option value="Failed">Failed</option>
                <option value="Archived">Archived</option>
              </select>
              <input id="add-status-input" type="text" placeholder="New status" style="width:120px;padding:10px 13px;font-size:15px;border:1.5px solid #e5e7eb;border-radius:7px;outline:none;" />
              <button id="add-status-btn" type="button" style="padding:10px 18px;font-size:15px;background:#2563eb;color:#fff;border:none;border-radius:7px;font-weight:600;transition:background 0.15s;">Add</button>
            </div>
          </div>
          <div style="margin-bottom:22px;">
            <label style="display:block;font-weight:500;font-size:15px;margin-bottom:7px;">Priority</label>
            <div style="display:flex;gap:8px;align-items:center;">
              <select id="task-priority-input" class="project-input" style="flex:1;padding:10px 13px;font-size:15px;border:1.5px solid #e5e7eb;border-radius:7px;outline:none;">
                <option value="Highest">Highest</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
                <option value="Lowest">Lowest</option>
              </select>
              <input id="add-priority-input" type="text" placeholder="New priority" style="width:120px;padding:10px 13px;font-size:15px;border:1.5px solid #e5e7eb;border-radius:7px;outline:none;" />
              <button id="add-priority-btn" type="button" style="padding:10px 18px;font-size:15px;background:#2563eb;color:#fff;border:none;border-radius:7px;font-weight:600;transition:background 0.15s;">Add</button>
            </div>
          </div>
          <div style="margin-bottom:22px;">
            <label style="display:block;font-weight:500;font-size:15px;margin-bottom:7px;">Start</label>
            <div style="display:flex;gap:8px;align-items:center;">
              <input id="blank-task-start-date" type="date" class="project-input" style="flex:1;padding:10px 13px;font-size:15px;border:1.5px solid #e5e7eb;border-radius:7px;outline:none;" />
              <input id="blank-task-start-time" type="time" class="project-input" style="width:110px;padding:10px 13px;font-size:15px;border:1.5px solid #e5e7eb;border-radius:7px;outline:none;" />
            </div>
          </div>
          <div style="margin-bottom:22px;">
            <label style="display:block;font-weight:500;font-size:15px;margin-bottom:7px;">Due</label>
            <div style="display:flex;gap:8px;align-items:center;">
              <input id="blank-task-due-date" type="date" class="project-input" style="flex:1;padding:10px 13px;font-size:15px;border:1.5px solid #e5e7eb;border-radius:7px;outline:none;" />
              <input id="blank-task-due-time" type="time" class="project-input" style="width:110px;padding:10px 13px;font-size:15px;border:1.5px solid #e5e7eb;border-radius:7px;outline:none;" />
            </div>
          </div>
          <div style="margin-bottom:18px;">
            <label style="display:block;font-weight:500;font-size:15px;margin-bottom:7px;">Description</label>
            <textarea id="blank-task-desc-input" class="project-input" placeholder="Describe the task..." rows="3" style="resize:vertical;width:100%;padding:10px 13px;font-size:15px;border:1.5px solid #e5e7eb;border-radius:7px;outline:none;"></textarea>
          </div>
          <div style="margin-bottom:22px;">
            <button id="open-projects-panel-btn" type="button" style="width:100%;padding:12px 0;font-size:15px;background:#f3f4f6;color:#222;border:none;border-radius:7px;font-weight:600;transition:background 0.15s;display:block;">Projects</button>
            <div id="selected-project-name" style="display:none;margin-top:8px;font-size:16px;font-weight:600;color:#2563eb;"></div>
          </div>
          <div style="margin-bottom:22px;">
            <button id="open-crew-panel-btn" type="button" style="width:100%;padding:12px 0;font-size:15px;background:#f3f4f6;color:#222;border:none;border-radius:7px;font-weight:600;transition:background 0.15s;display:block;">Crew</button>
            <div id="selected-crew-name" style="display:none;margin-top:8px;font-size:16px;font-weight:600;color:#16a34a;"></div>
          </div>
          <div style="margin-bottom:22px;">
            <button id="open-documents-panel-btn" type="button" style="width:100%;padding:12px 0;font-size:15px;background:#f3f4f6;color:#222;border:none;border-radius:7px;font-weight:600;transition:background 0.15s;display:block;">Documents <span id="documents-badge" style="display:none;position:absolute;top:7px;right:18px;background:#2563eb;color:#fff;font-size:13px;font-weight:700;padding:2px 8px;border-radius:12px;">0</span></button>
            <div id="selected-documents-list" style="display:none;margin-top:8px;font-size:15px;color:#2563eb;"></div>
          </div>
          <!-- More fields can be added here -->
          <button id="save-task-btn" class="add-project-btn" style="margin-top:18px;width:100%;background:#2563eb;color:#fff;">Add Task</button>
        </div>
      </div>
      <div class="add-project-panel" id="projects-list-panel" style="right:-420px;">
        <div class="add-project-panel-content" style="background:#fff;border-radius:18px 0 0 18px;box-shadow:-2px 0 16px rgba(0,0,0,0.07);padding:36px 32px 32px 32px;min-width:370px;max-width:420px;">
          <button class="close-add-project-panel" id="close-projects-list-panel" style="position:absolute;top:18px;right:22px;font-size:26px;background:none;border:none;color:#888;cursor:pointer;">&times;</button>
          <h3 style="font-size:1.35rem;font-weight:700;margin-bottom:24px;margin-top:0;">Select a Project</h3>
          <div id="projects-list-container" style="max-height:340px;overflow-y:auto;">
            <!-- Project list will be rendered here -->
            <ul style="list-style:none;padding:0;margin:0;">
              <li style="padding:12px 0;border-bottom:1px solid #f1f1f1;cursor:pointer;">Project Alpha</li>
              <li style="padding:12px 0;border-bottom:1px solid #f1f1f1;cursor:pointer;">Project Beta</li>
              <li style="padding:12px 0;border-bottom:1px solid #f1f1f1;cursor:pointer;">Project Gamma</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="add-project-panel" id="crew-list-panel" style="right:-420px;">
        <div class="add-project-panel-content" style="background:#fff;border-radius:18px 0 0 18px;box-shadow:-2px 0 16px rgba(0,0,0,0.07);padding:36px 32px 32px 32px;min-width:370px;max-width:420px;">
          <button class="close-add-project-panel" id="close-crew-list-panel" style="position:absolute;top:18px;right:22px;font-size:26px;background:none;border:none;color:#888;cursor:pointer;">&times;</button>
          <h3 style="font-size:1.35rem;font-weight:700;margin-bottom:24px;margin-top:0;">Select Crew Member</h3>
          <div id="crew-list-container" style="max-height:340px;overflow-y:auto;">
            <ul style="list-style:none;padding:0;margin:0;">
              <li style="padding:12px 0;text-align:center;color:#888;">Loading...</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="add-project-panel" id="documents-panel" style="right:-420px;">
        <div class="add-project-panel-content" style="background:#fff;border-radius:18px 0 0 18px;box-shadow:-2px 0 16px rgba(0,0,0,0.07);padding:36px 32px 32px 32px;min-width:370px;max-width:420px;">
          <button class="close-add-project-panel" id="close-documents-panel" style="position:absolute;top:18px;right:22px;font-size:26px;background:none;border:none;color:#888;cursor:pointer;">&times;</button>
          <h3 style="font-size:1.35rem;font-weight:700;margin-bottom:24px;margin-top:0;">Attach Documents or Images</h3>
          <input id="documents-file-input" type="file" multiple style="margin-bottom:18px;" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,.7z,.json,.xml,.html,.md" />
          <ul id="documents-file-list" style="list-style:none;padding:0;margin:0;max-height:220px;overflow-y:auto;"></ul>
          <button id="documents-done-btn" type="button" style="margin-top:18px;width:100%;padding:12px 0;font-size:15px;background:#2563eb;color:#fff;border:none;border-radius:7px;font-weight:600;">Done</button>
        </div>
      </div>
    `;

    const addTaskBtn = sectionContent.querySelector('#add-task-btn');
    const addTaskPanel = sectionContent.querySelector('#add-task-panel');
    const closeAddTaskPanel = sectionContent.querySelector('#close-add-task-panel');
    const blankTemplateBtn = sectionContent.querySelector('#blank-template-btn');
    const blankTaskPanel = sectionContent.querySelector('#blank-task-panel');
    const closeBlankTaskPanel = sectionContent.querySelector('#close-blank-task-panel');
    const openProjectsPanelBtn = sectionContent.querySelector('#open-projects-panel-btn');
    const projectsListPanel = sectionContent.querySelector('#projects-list-panel');
    const closeProjectsListPanel = sectionContent.querySelector('#close-projects-list-panel');
    const openCrewPanelBtn = sectionContent.querySelector('#open-crew-panel-btn');
    const crewListPanel = sectionContent.querySelector('#crew-list-panel');
    const closeCrewListPanel = sectionContent.querySelector('#close-crew-list-panel');
    const openDocumentsPanelBtn = sectionContent.querySelector('#open-documents-panel-btn');
    const documentsPanel = sectionContent.querySelector('#documents-panel');
    const closeDocumentsPanel = sectionContent.querySelector('#close-documents-panel');
    const documentsFileInput = sectionContent.querySelector('#documents-file-input');
    const documentsFileList = sectionContent.querySelector('#documents-file-list');
    const documentsDoneBtn = sectionContent.querySelector('#documents-done-btn');
    const documentsBadge = sectionContent.querySelector('#documents-badge');
    const selectedDocumentsList = sectionContent.querySelector('#selected-documents-list');

    // Documents panel logic
    // Only declare these variables ONCE, here, at the top of renderTaskList
    let selectedDocuments = [];

    function updateDocumentsUI() {
      // Update badge
      if (documentsBadge) {
        if (selectedDocuments.length > 0) {
          documentsBadge.textContent = selectedDocuments.length;
          documentsBadge.style.display = 'inline-block';
        } else {
          documentsBadge.style.display = 'none';
        }
      }
      // Update file list below button
      if (selectedDocumentsList) {
        if (selectedDocuments.length > 0) {
          selectedDocumentsList.style.display = 'block';
          selectedDocumentsList.innerHTML = selectedDocuments.map(f => `<span style=\"display:inline-block;background:#e0e7ff;color:#222;padding:4px 10px;border-radius:7px;margin-right:7px;margin-bottom:4px;font-size:14px;\">${f.name}</span>`).join('');
        } else {
          selectedDocumentsList.style.display = 'none';
          selectedDocumentsList.innerHTML = '';
        }
      }
    }

    if (openDocumentsPanelBtn && documentsPanel) {
      openDocumentsPanelBtn.onclick = () => {
        documentsPanel.style.right = '0';
        documentsPanel.classList.add('open');
        // Render file list
        if (documentsFileList) {
          if (selectedDocuments.length === 0) {
            documentsFileList.innerHTML = '<li style="padding:12px 0;text-align:center;color:#888;">No files selected.</li>';
          } else {
            documentsFileList.innerHTML = selectedDocuments.map((f, idx) => `<li style=\"padding:10px 0;border-bottom:1px solid #f1f1f1;display:flex;align-items:center;justify-content:space-between;\"><span>${f.name}</span><button data-idx=\"${idx}\" style=\"background:none;border:none;color:#e53e3e;font-size:18px;cursor:pointer;\">&times;</button></li>`).join('');
            // Add remove logic
            documentsFileList.querySelectorAll('button[data-idx]').forEach(btn => {
              btn.onclick = () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                selectedDocuments.splice(idx, 1);
                updateDocumentsUI();
                // Re-render file list
                if (documentsFileList) {
                  if (selectedDocuments.length === 0) {
                    documentsFileList.innerHTML = '<li style="padding:12px 0;text-align:center;color:#888;">No files selected.</li>';
                  } else {
                    documentsFileList.innerHTML = selectedDocuments.map((f, idx) => `<li style=\"padding:10px 0;border-bottom:1px solid #f1f1f1;display:flex;align-items:center;justify-content:space-between;\"><span>${f.name}</span><button data-idx=\"${idx}\" style=\"background:none;border:none;color:#e53e3e;font-size:18px;cursor:pointer;\">&times;</button></li>`).join('');
                  }
                }
              };
            });
          }
        }
      };
    }
    if (closeDocumentsPanel && documentsPanel) {
      closeDocumentsPanel.onclick = () => {
        documentsPanel.style.right = '-420px';
        documentsPanel.classList.remove('open');
      };
    }
    if (documentsFileInput) {
      documentsFileInput.onchange = (e) => {
        const files = Array.from(e.target.files);
        // Add new files, avoid duplicates by name
        files.forEach(f => {
          if (!selectedDocuments.some(sf => sf.name === f.name && sf.size === f.size)) {
            selectedDocuments.push(f);
          }
        });
        updateDocumentsUI();
        // Re-render file list
        if (documentsFileList) {
          if (selectedDocuments.length === 0) {
            documentsFileList.innerHTML = '<li style="padding:12px 0;text-align:center;color:#888;">No files selected.</li>';
          } else {
            documentsFileList.innerHTML = selectedDocuments.map((f, idx) => `<li style=\"padding:10px 0;border-bottom:1px solid #f1f1f1;display:flex;align-items:center;justify-content:space-between;\"><span>${f.name}</span><button data-idx=\"${idx}\" style=\"background:none;border:none;color:#e53e3e;font-size:18px;cursor:pointer;\">&times;</button></li>`).join('');
            // Add remove logic
            documentsFileList.querySelectorAll('button[data-idx]').forEach(btn => {
              btn.onclick = () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                selectedDocuments.splice(idx, 1);
                updateDocumentsUI();
                // Re-render file list
                if (documentsFileList) {
                  if (selectedDocuments.length === 0) {
                    documentsFileList.innerHTML = '<li style="padding:12px 0;text-align:center;color:#888;">No files selected.</li>';
                  } else {
                    documentsFileList.innerHTML = selectedDocuments.map((f, idx) => `<li style=\"padding:10px 0;border-bottom:1px solid #f1f1f1;display:flex;align-items:center;justify-content:space-between;\"><span>${f.name}</span><button data-idx=\"${idx}\" style=\"background:none;border:none;color:#e53e3e;font-size:18px;cursor:pointer;\">&times;</button></li>`).join('');
                  }
                }
              };
            });
          }
        }
      };
    }
    if (documentsDoneBtn && documentsPanel) {
      documentsDoneBtn.onclick = () => {
        documentsPanel.style.right = '-420px';
        documentsPanel.classList.remove('open');
        updateDocumentsUI();
      };
    }
    updateDocumentsUI();

    // Panel open/close logic
    if (addTaskBtn && addTaskPanel && closeAddTaskPanel) {
      addTaskBtn.onclick = () => {
        addTaskPanel.style.right = '0';
        addTaskPanel.classList.add('open');
      };
      closeAddTaskPanel.onclick = () => {
        addTaskPanel.style.right = '-420px';
        addTaskPanel.classList.remove('open');
      };
    }
    if (blankTemplateBtn && blankTaskPanel && addTaskPanel) {
      blankTemplateBtn.onclick = () => {
        addTaskPanel.style.right = '-420px';
        addTaskPanel.classList.remove('open');
        blankTaskPanel.style.right = '0';
        blankTaskPanel.classList.add('open');
        // setupDocumentsPanel(sectionContent); // REMOVE this line, not needed
      };
    }
    if (closeBlankTaskPanel && blankTaskPanel) {
      closeBlankTaskPanel.onclick = () => {
        blankTaskPanel.style.right = '-420px';
        blankTaskPanel.classList.remove('open');
      };
    }
    if (openProjectsPanelBtn && projectsListPanel) {
      openProjectsPanelBtn.onclick = async () => {
        projectsListPanel.style.right = '0';
        projectsListPanel.classList.add('open');
        // Fetch projects from Firestore and render them
        const projectsListContainer = sectionContent.querySelector('#projects-list-container ul');
        if (projectsListContainer) {
          projectsListContainer.innerHTML = '<li style="padding:12px 0;text-align:center;color:#888;">Loading...</li>';
          try {
            // Defensive: check if window.db exists and is a Firestore instance
            if (!window.db || typeof window.db.collection !== 'function') {
              throw new Error('Firestore is not initialized.');
            }
            const snapshot = await window.db.collection('projects').get();
            if (!snapshot || typeof snapshot.forEach !== 'function') {
              throw new Error('Invalid Firestore response.');
            }
            if (snapshot.empty) {
              projectsListContainer.innerHTML = '<li style="padding:12px 0;text-align:center;color:#888;">No projects found.</li>';
            } else {
              let html = '';
              snapshot.forEach(doc => {
                const project = doc.data();
                html += `<li data-id="${doc.id}" style="padding:12px 0;border-bottom:1px solid #f1f1f1;cursor:pointer;">${project.name || 'Untitled Project'}</li>`;
              });
              projectsListContainer.innerHTML = html;
              projectsListContainer.querySelectorAll('li').forEach(li => {
                li.onclick = () => {
                  // Show selected project name below the button, hide Projects button if you want (or keep it for changing)
                  const selectedProjectName = sectionContent.querySelector('#selected-project-name');
                  const openProjectsPanelBtn = sectionContent.querySelector('#open-projects-panel-btn');
                  if (selectedProjectName && openProjectsPanelBtn) {
                    selectedProjectName.textContent = li.textContent;
                    selectedProjectName.style.display = 'block';
                  }
                  projectsListPanel.style.right = '-420px';
                  projectsListPanel.classList.remove('open');
                };
              });
            }
          } catch (err) {
            projectsListContainer.innerHTML = `<li style=\"padding:12px 0;text-align:center;color:#e53e3e;\">Failed to load projects: ${err.message}</li>`;
          }
        }
      };
    }
    if (closeProjectsListPanel && projectsListPanel) {
      closeProjectsListPanel.onclick = () => {
        projectsListPanel.style.right = '-420px';
        projectsListPanel.classList.remove('open');
      };
    }
    if (openCrewPanelBtn && crewListPanel) {
      openCrewPanelBtn.onclick = async () => {
        crewListPanel.style.right = '0';
        crewListPanel.classList.add('open');
        // Fetch users from Firestore and render them
        const crewListContainer = sectionContent.querySelector('#crew-list-container ul');
        if (crewListContainer) {
          crewListContainer.innerHTML = '<li style="padding:12px 0;text-align:center;color:#888;">Loading...</li>';
          try {
            if (!window.db || typeof window.db.collection !== 'function') {
              throw new Error('Firestore is not initialized.');
            }
            const user = firebase.auth().currentUser;
            let companyName = null;
            if (user) {
              // Get the user's companyName from Firestore
              const userDoc = await window.db.collection('users').doc(user.uid).get();
              companyName = userDoc.exists ? userDoc.data().companyName : null;
            }
            let query = window.db.collection('users');
            if (companyName) {
              query = query.where('companyName', '==', companyName);
            }
            const snapshot = await query.get();
            if (!snapshot || typeof snapshot.forEach !== 'function') {
              throw new Error('Invalid Firestore response.');
            }
            if (snapshot.empty) {
              crewListContainer.innerHTML = '<li style="padding:12px 0;text-align:center;color:#888;">No crew found.</li>';
            } else {
              let html = '';
              snapshot.forEach(doc => {
                const user = doc.data();
                html += `<li data-id="${doc.id}" style="padding:12px 0;border-bottom:1px solid #f1f1f1;cursor:pointer;">${user.userName || user.name || user.email || 'Unnamed User'}</li>`;
              });
              crewListContainer.innerHTML = html;
              crewListContainer.querySelectorAll('li').forEach(li => {
                li.onclick = () => {
                  const selectedCrewName = sectionContent.querySelector('#selected-crew-name');
                  if (selectedCrewName) {
                    selectedCrewName.textContent = li.textContent;
                    selectedCrewName.style.display = 'block';
                  }
                  crewListPanel.style.right = '-420px';
                  crewListPanel.classList.remove('open');
                };
              });
            }
          } catch (err) {
            crewListContainer.innerHTML = `<li style=\"padding:12px 0;text-align:center;color:#e53e3e;\">Failed to load crew: ${err.message}</li>`;
          }
        }
      };
    }
    if (closeCrewListPanel && crewListPanel) {
      closeCrewListPanel.onclick = () => {
        crewListPanel.style.right = '-420px';
        crewListPanel.classList.remove('open');
      };
    }
    // Clear selected project logic
    const clearSelectedProjectBtn = sectionContent.querySelector('#clear-selected-project');
    if (clearSelectedProjectBtn) {
      clearSelectedProjectBtn.onclick = () => {
        const selectedProjectDisplay = sectionContent.querySelector('#selected-project-display');
        const selectedProjectName = sectionContent.querySelector('#selected-project-name');
        if (selectedProjectDisplay && selectedProjectName) {
          selectedProjectName.textContent = '';
          selectedProjectDisplay.style.display = 'none';
        }
      };
    }
    // Change selected project logic (now clicking the project name opens the picker again)
    const selectedProjectName = sectionContent.querySelector('#selected-project-name');
    if (selectedProjectName) {
      selectedProjectName.onclick = () => {
        const projectsListPanel = sectionContent.querySelector('#projects-list-panel');
        if (projectsListPanel) {
          projectsListPanel.style.right = '0';
          projectsListPanel.classList.add('open');
        }
      };
    }
    // Change selected crew logic (clicking the name opens the picker again)
    const selectedCrewName = sectionContent.querySelector('#selected-crew-name');
    if (selectedCrewName) {
      selectedCrewName.onclick = () => {
        const crewListPanel = sectionContent.querySelector('#crew-list-panel');
        if (crewListPanel) {
          crewListPanel.style.right = '0';
          crewListPanel.classList.add('open');
        }
      };
    }

    // Fetch and display all tasks from Firestore on load
    async function loadTasksToTable() {
      const tbody = sectionContent.querySelector('#tasks-list-tbody');
      if (!tbody) return;
      tbody.innerHTML = '';
      try {
        if (!window.db || typeof window.db.collection !== 'function') throw new Error('Firestore not initialized');
        const snapshot = await window.db.collection('tasks').orderBy('createdAt', 'desc').get();
        if (!snapshot.empty) {
          snapshot.forEach(doc => {
            const task = doc.data();
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${task.name || ''}</td>
              <td>${task.crew || ''}</td>
              <td>${task.project || ''}</td>
              <td>${task.priority || ''}</td>
              <td>${task.start ? task.start.replace('T', ' ') : ''}</td>
              <td>${task.due ? task.due.replace('T', ' ') : ''}</td>
              <td><span class="status-badge status-${(task.status||'').toLowerCase().replace(/\s/g,'-')}">${task.status || ''}</span></td>
              <td></td>
            `;
            tbody.appendChild(tr);
          });
        }
      } catch (err) {
        tbody.innerHTML = `<tr><td colspan="8" style="color:#e53e3e;text-align:center;">Failed to load tasks: ${err.message}</td></tr>`;
      }
    }
    // Call on load
    loadTasksToTable();

    // Add status logic
    const statusSelect = sectionContent.querySelector('#blank-task-status-input');
    const addStatusInput = sectionContent.querySelector('#add-status-input');
    const addStatusBtn = sectionContent.querySelector('#add-status-btn');
    if (statusSelect && addStatusInput && addStatusBtn) {
      addStatusBtn.onclick = () => {
        const newStatus = addStatusInput.value.trim();
        if (newStatus && !Array.from(statusSelect.options).some(opt => opt.value.toLowerCase() === newStatus.toLowerCase())) {
          const opt = document.createElement('option');
          opt.value = newStatus;
          opt.textContent = newStatus;
          statusSelect.appendChild(opt);
          statusSelect.value = newStatus;
          addStatusInput.value = '';
        }
      };
    }
    // Add priority logic
    const prioritySelect = sectionContent.querySelector('#task-priority-input');
    const addPriorityInput = sectionContent.querySelector('#add-priority-input');
    const addPriorityBtn = sectionContent.querySelector('#add-priority-btn');
    if (prioritySelect && addPriorityInput && addPriorityBtn) {
      addPriorityBtn.onclick = () => {
        const newPriority = addPriorityInput.value.trim();
        if (newPriority && !Array.from(prioritySelect.options).some(opt => opt.value.toLowerCase() === newPriority.toLowerCase())) {
          const opt = document.createElement('option');
          opt.value = newPriority;
          opt.textContent = newPriority;
          prioritySelect.appendChild(opt);
          prioritySelect.value = newPriority;
          addPriorityInput.value = '';
        }
      };
    }
    // Add Task logic
    const saveTaskBtn = sectionContent.querySelector('#save-task-btn');
    if (saveTaskBtn) {
      saveTaskBtn.onclick = async () => {
        // Gather form values
        const name = sectionContent.querySelector('#blank-task-name-input')?.value.trim();
        const status = sectionContent.querySelector('#blank-task-status-input')?.value;
        const priority = sectionContent.querySelector('#task-priority-input')?.value;
        const startDate = sectionContent.querySelector('#blank-task-start-date')?.value;
        const startTime = sectionContent.querySelector('#blank-task-start-time')?.value;
        const dueDate = sectionContent.querySelector('#blank-task-due-date')?.value;
        const dueTime = sectionContent.querySelector('#blank-task-due-time')?.value;
        const desc = sectionContent.querySelector('#blank-task-desc-input')?.value.trim();
        const project = sectionContent.querySelector('#selected-project-name')?.textContent?.trim();
        const crew = sectionContent.querySelector('#selected-crew-name')?.textContent?.trim();
        // Defensive: use selectedDocuments from closure
        // Basic validation
        if (!name) {
          alert('Task name is required.');
          return;
        }
        // Prepare task object
        const task = {
          name,
          status,
          priority,
          start: startDate ? `${startDate}${startTime ? 'T'+startTime : ''}` : '',
          due: dueDate ? `${dueDate}${dueTime ? 'T'+dueTime : ''}` : '',
          desc,
          project,
          crew,
          documents: selectedDocuments.map(f => ({ name: f.name, size: f.size, type: f.type })), // Only meta for now
          createdAt: new Date(),
        };
        // Save to Firestore
        try {
          if (!window.db || typeof window.db.collection !== 'function') throw new Error('Firestore not initialized');
          await window.db.collection('tasks').add(task);
        } catch (err) {
          alert('Failed to save task: ' + err.message);
          return;
        }
        // Add to table UI (prepend row)
        const tbody = sectionContent.querySelector('#tasks-list-tbody');
        if (tbody) {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${task.name}</td>
            <td>${task.crew || ''}</td>
            <td>${task.project || ''}</td>
            <td>${task.priority || ''}</td>
            <td>${task.start ? task.start.replace('T', ' ') : ''}</td>
            <td>${task.due ? task.due.replace('T', ' ') : ''}</td>
            <td><span class="status-badge status-${(task.status||'').toLowerCase().replace(/\s/g,'-')}">${task.status || ''}</span></td>
            <td></td>
          `;
          tbody.prepend(tr);
        }
        // Close panel and reset form
        const blankTaskPanel = sectionContent.querySelector('#blank-task-panel');
        if (blankTaskPanel) {
          blankTaskPanel.style.right = '-420px';
          blankTaskPanel.classList.remove('open');
        }
        // After adding a new task, reload the table from Firestore
        loadTasksToTable();
        // Optionally, reset form fields here
      };
    }
  }

  // Initial render for List tab
  renderTaskList();

  // Tab switching logic
  const tabs = mainContent.querySelectorAll('.tasks-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabName = tab.dataset.tab;
      if (tabName === 'list') {
        renderTaskList();
      } else if (tabName === 'schedule') {
        sectionContent.innerHTML = '<p>This is the Tasks Schedule. Add your calendar or schedule UI here.</p>';
      } else if (tabName === 'templates') {
        sectionContent.innerHTML = '<p>This is the Tasks Templates. Add your templates UI here.</p>';
      }
    });
  });
}
