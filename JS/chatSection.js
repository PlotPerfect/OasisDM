// Renders the Chat section
export function renderChatSection(mainContent) {
  mainContent.innerHTML = `
    <section class="chat-section" style="display:flex;height:80vh;background:#f8fafc;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);overflow:hidden;">
      <!-- Sidebar -->
      <aside style="width:340px;background:#fff;border-right:1px solid #e5e7eb;display:flex;flex-direction:column;">
        <div style="padding:24px 20px 12px 20px;display:flex;align-items:center;gap:12px;">
          <h2 style="font-size:22px;font-weight:700;margin:0;flex:1;">Chat</h2>
          <input id="chat-search" type="text" placeholder="Search" style="background:#f3f4f6;border:none;border-radius:8px;padding:7px 12px;font-size:15px;width:44px;transition:width 0.2s;" onfocus="this.style.width='160px'" onblur="this.style.width='44px'" />
        </div>
        <nav style="display:flex;gap:0 24px;padding:0 20px 8px 20px;border-bottom:1px solid #f3f4f6;">
          <button class="chat-tab active" data-tab="all" style="background:none;border:none;font-size:16px;font-weight:600;padding:8px 0 10px 0;cursor:pointer;border-bottom:2px solid #fbbf24;color:#222;">All</button>
          <button class="chat-tab" data-tab="groups" style="background:none;border:none;font-size:16px;font-weight:600;padding:8px 0 10px 0;cursor:pointer;color:#888;">Groups</button>
          <button class="chat-tab" data-tab="people" style="background:none;border:none;font-size:16px;font-weight:600;padding:8px 0 10px 0;cursor:pointer;color:#888;">People</button>
        </nav>
        <div id="chat-convo-list" style="flex:1;overflow-y:auto;padding:0 0 0 0;background:#fff;"></div>
        <button id="create-group-btn" style="margin:16px 20px 20px 20px;padding:10px 0;font-size:15px;font-weight:600;background:#2563eb;color:#fff;border:none;border-radius:8px;cursor:pointer;">+ Create Group</button>
      </aside>
      <!-- Main Chat Area -->
      <main id="chat-main-area" style="flex:1;display:flex;flex-direction:column;background:#f8fafc;">
        <div id="chat-header" style="height:64px;display:flex;align-items:center;padding:0 32px;border-bottom:1px solid #e5e7eb;">
          <span id="chat-header-title" style="font-size:18px;font-weight:600;color:#222;">Select a conversation</span>
        </div>
        <div id="chat-messages" style="flex:1;overflow-y:auto;padding:32px 32px 16px 32px;display:flex;flex-direction:column;gap:18px;"></div>
        <form id="chat-message-form" style="display:flex;align-items:center;padding:18px 32px 18px 32px;border-top:1px solid #e5e7eb;background:#f8fafc;">
          <input id="chat-message-input" type="text" placeholder="Message" style="flex:1;padding:12px 16px;border-radius:8px;border:1px solid #e5e7eb;font-size:16px;background:#fff;" autocomplete="off" />
          <button type="submit" style="margin-left:12px;padding:10px 22px;background:#2563eb;color:#fff;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;">Send</button>
        </form>
      </main>
    </section>
  `;
  // --- Firebase Chat Logic ---
  let crewList = [];
  let conversations = [];
  let currentUser = null;
  let currentChat = null;
  let unsubscribeMessages = null;

  // Fetch crew for People tab and group creation
  async function fetchCrew() {
    const user = firebase.auth().currentUser;
    if (!user) return [];
    let companyName = '';
    try {
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (userDoc.exists) companyName = userDoc.data().companyName;
    } catch (err) { return []; }
    if (!companyName) return [];
    const snapshot = await db.collection('users').where('companyName', '==', companyName).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.userName || '',
        email: data.email || '',
        color: data.color || '#007bff',
        initials: (data.userName || '').split(' ').map(n => n[0]).join('').toUpperCase()
      };
    });
  }

  // Fetch conversations (direct and group)
  async function fetchConversations() {
    const user = firebase.auth().currentUser;
    if (!user) return [];
    // Direct messages
    const directSnap = await db.collection('conversations')
      .where('type', '==', 'direct')
      .where('members', 'array-contains', user.uid)
      .get();
    // Groups
    const groupSnap = await db.collection('conversations')
      .where('type', '==', 'group')
      .where('members', 'array-contains', user.uid)
      .get();
    return [
      ...directSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ...groupSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    ];
  }

  // Render conversation list
  function renderConvoList(tab = 'all', search = '') {
    const convoList = document.getElementById('chat-convo-list');
    if (!convoList) return;
    let filtered = conversations;
    if (tab === 'groups') filtered = filtered.filter(c => c.type === 'group');
    if (tab === 'people') filtered = filtered.filter(c => c.type === 'direct');
    if (search) {
      filtered = filtered.filter(c => (c.name || c.groupName || '').toLowerCase().includes(search.toLowerCase()));
    }
    convoList.innerHTML = '';
    if (filtered.length === 0) {
      convoList.innerHTML = '<div style="color:#888;padding:24px;text-align:center;">No conversations found.</div>';
      return;
    }
    filtered.forEach(c => {
      const isGroup = c.type === 'group';
      const name = isGroup ? c.groupName : c.displayName;
      const color = isGroup ? (c.color || '#2563eb') : (c.color || '#007bff');
      const initials = isGroup
        ? (c.groupName || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
        : (c.displayName || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
      const members = isGroup ? `${c.members.length} members` : '';
      const lastMsg = c.lastMessage ? `<div style='font-size:13px;color:#888;'>${c.lastMessage.senderName}: ${c.lastMessage.text}</div>` : '';
      const el = document.createElement('div');
      el.style = 'display:flex;align-items:center;gap:12px;padding:14px 18px;cursor:pointer;border-bottom:1px solid #f3f4f6;transition:background 0.15s;';
      el.onmouseover = () => el.style.background = '#f3f4f6';
      el.onmouseout = () => el.style.background = '';
      el.innerHTML = `
        <div style="width:38px;height:38px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:17px;color:#fff;">${initials}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>
          ${lastMsg}
          <div style="font-size:12px;color:#aaa;">${members}</div>
        </div>
      `;
      el.onclick = () => openConversation(c);
      convoList.appendChild(el);
    });
  }

  // Open a conversation and listen for messages
  function openConversation(convo) {
    currentChat = convo;
    const chatHeader = document.getElementById('chat-header');
    const chatHeaderTitle = document.getElementById('chat-header-title');
    chatHeaderTitle.textContent = convo.type === 'group' ? convo.groupName : convo.displayName;
    // Add delete group button for group chats
    let deleteBtn = document.getElementById('delete-group-btn');
    if (deleteBtn) deleteBtn.remove();
    if (convo.type === 'group') {
      const btn = document.createElement('button');
      btn.id = 'delete-group-btn';
      btn.textContent = 'Delete Group';
      btn.style = 'margin-left:18px;padding:7px 16px;background:#e74c3c;color:#fff;border:none;border-radius:7px;font-size:14px;font-weight:600;cursor:pointer;';
      btn.onclick = async function() {
        if (!confirm('Are you sure you want to delete this group? This cannot be undone.')) return;
        // Delete all messages in the group
        const msgsSnap = await db.collection('conversations').doc(convo.id).collection('messages').get();
        const batch = db.batch();
        msgsSnap.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        // Delete the group conversation
        await db.collection('conversations').doc(convo.id).delete();
        // Remove from UI
        currentChat = null;
        document.getElementById('chat-header-title').textContent = 'Select a conversation';
        document.getElementById('chat-messages').innerHTML = '';
        conversations = await fetchConversations();
        renderConvoList(currentTab, document.getElementById('chat-search').value);
      };
      chatHeader.appendChild(btn);
    }
    renderMessages([]); // Clear
    if (unsubscribeMessages) unsubscribeMessages();
    unsubscribeMessages = db.collection('conversations').doc(convo.id).collection('messages')
      .orderBy('timestamp')
      .onSnapshot(snapshot => {
        const msgs = snapshot.docs.map(doc => doc.data());
        renderMessages(msgs);
      });
  }

  // Render messages in chat
  function renderMessages(msgs) {
    const msgArea = document.getElementById('chat-messages');
    if (!msgArea) return;
    msgArea.innerHTML = '';
    msgs.forEach(msg => {
      const isMe = msg.senderId === currentUser.uid;
      const div = document.createElement('div');
      div.style = `display:flex;align-items:flex-end;gap:10px;${isMe ? 'flex-direction:row-reverse;' : ''}`;
      div.innerHTML = `
        <div style="width:34px;height:34px;border-radius:50%;background:${msg.senderColor||'#007bff'};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;color:#fff;">${msg.senderInitials||''}</div>
        <div style="max-width:340px;padding:10px 16px;border-radius:12px;background:${isMe ? '#2563eb' : '#f3f4f6'};color:${isMe ? '#fff' : '#222'};font-size:15px;box-shadow:0 1px 4px rgba(0,0,0,0.04);">
          <div style="font-weight:600;font-size:14px;margin-bottom:2px;">${msg.senderName||''}</div>
          <div>${msg.text}</div>
          <div style="font-size:11px;color:#bbb;text-align:right;margin-top:2px;">${msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleString() : ''}</div>
        </div>
      `;
      msgArea.appendChild(div);
    });
    msgArea.scrollTop = msgArea.scrollHeight;
  }

  // Send message
  const msgForm = document.getElementById('chat-message-form');
  if (msgForm) {
    msgForm.onsubmit = async function(e) {
      e.preventDefault();
      const input = document.getElementById('chat-message-input');
      const text = input.value.trim();
      if (!text || !currentChat) return;
      const user = firebase.auth().currentUser;
      const userDoc = await db.collection('users').doc(user.uid).get();
      const userName = userDoc.exists ? userDoc.data().userName : user.email;
      const color = userDoc.exists ? (userDoc.data().color || '#007bff') : '#007bff';
      const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
      const msg = {
        text,
        senderId: user.uid,
        senderName: userName,
        senderColor: color,
        senderInitials: initials,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      await db.collection('conversations').doc(currentChat.id).collection('messages').add(msg);
      // Update last message for preview
      await db.collection('conversations').doc(currentChat.id).update({
        lastMessage: {
          text,
          senderName: userName,
          timestamp: new Date()
        }
      });
      input.value = '';
    };
  }

  // Tab switching
  const chatTabs = document.querySelectorAll('.chat-tab');
  let currentTab = 'all';
  chatTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      chatTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      renderConvoList(currentTab, document.getElementById('chat-search').value);
    });
  });

  // Search
  const chatSearch = document.getElementById('chat-search');
  if (chatSearch) {
    chatSearch.addEventListener('input', function() {
      renderConvoList(currentTab, this.value);
    });
  }

  // Create group
  const createGroupBtn = document.getElementById('create-group-btn');
  if (createGroupBtn) {
    createGroupBtn.onclick = async function() {
      crewList = await fetchCrew();
      // Simple group creation modal
      let modal = document.getElementById('create-group-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'create-group-modal';
        modal.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.18);z-index:3000;display:flex;align-items:center;justify-content:center;';
        modal.innerHTML = `
          <div style="background:#fff;width:400px;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.18);padding:32px;position:relative;">
            <button id="close-create-group-modal" style="position:absolute;top:18px;right:18px;background:none;border:none;font-size:22px;cursor:pointer;">&times;</button>
            <h3 style="margin-top:0;">Create Group</h3>
            <form id="create-group-form">
              <label style="font-weight:600;">Group Name</label>
              <input id="group-name" type="text" required style="width:100%;padding:8px 12px;border-radius:5px;border:1px solid #ccc;font-size:15px;margin-bottom:18px;" />
              <label style="font-weight:600;">Add People</label>
              <div id="group-people-list" style="max-height:180px;overflow-y:auto;margin-bottom:18px;"></div>
              <button type="submit" class="add-project-btn" style="width:100%;margin-top:10px;">Create Group</button>
            </form>
          </div>
        `;
        document.body.appendChild(modal);
      }
      // Render people list
      const peopleList = modal.querySelector('#group-people-list');
      peopleList.innerHTML = crewList.map(c => `
        <label style='display:flex;align-items:center;gap:8px;margin-bottom:8px;'><input type='checkbox' value='${c.id}' style='width:18px;height:18px;'/> <span style='background:${c.color};color:#fff;width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;font-weight:600;'>${c.initials}</span> ${c.name}</label>
      `).join('');
      // Close logic
      modal.querySelector('#close-create-group-modal').onclick = () => { modal.remove(); };
      // Submit logic
      modal.querySelector('#create-group-form').onsubmit = async function(e) {
        e.preventDefault();
        const groupName = document.getElementById('group-name').value.trim();
        const checked = Array.from(peopleList.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);
        const user = firebase.auth().currentUser;
        if (!groupName || checked.length === 0) return;
        const group = {
          type: 'group',
          groupName,
          members: [user.uid, ...checked],
          color: '#2563eb',
          createdAt: new Date(),
          lastMessage: null,
          createdBy: user.uid // Only creator can delete
        };
        const docRef = await db.collection('conversations').add(group);
        modal.remove();
        conversations = await fetchConversations();
        renderConvoList(currentTab, chatSearch.value);
        openConversation({ id: docRef.id, ...group });
      };
      modal.style.display = 'flex';
    };
  }

  // Initial load
  firebase.auth().onAuthStateChanged(async user => {
    if (!user) return;
    currentUser = user;
    crewList = await fetchCrew();
    conversations = await fetchConversations();
    // For direct messages, set displayName and color
    conversations = conversations.map(c => {
      if (c.type === 'direct') {
        const otherId = c.members.find(id => id !== user.uid);
        const other = crewList.find(cw => cw.id === otherId);
        return {
          ...c,
          displayName: other ? other.name : 'Unknown',
          color: other ? other.color : '#007bff'
        };
      }
      return c;
    });
    renderConvoList(currentTab, chatSearch ? chatSearch.value : '');
  });
  // You can now wire up Firebase chat logic, group creation, and real-time updates here.
}
