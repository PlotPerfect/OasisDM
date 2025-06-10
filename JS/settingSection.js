// filepath: JS/settingSection.js

export function renderSettingSection(mainContent) {
  mainContent.innerHTML = `
    <section class="settings-section" style="display: flex; height: 80vh; background: #f6f9fb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
      <nav class="settings-nav" style="width: 280px; background: #fff; border-right: 1px solid #e0e4ea; padding: 32px 0 32px 0; overflow-y: auto; display: flex; flex-direction: column; gap: 32px;">
        <div>
          <div style="font-size: 13px; color: #8a97a8; font-weight: 700; margin: 0 0 8px 32px;">PERSONAL</div>
          <button class="settings-nav-btn" onclick="showSettingDetail('personal1')">My account</button>
          <button class="settings-nav-btn" onclick="showSettingDetail('personal2')">My notifications</button>
        </div>
        <div>
          <div style="font-size: 13px; color: #8a97a8; font-weight: 700; margin: 0 0 8px 32px;">GENERAL</div>
          <button class="settings-nav-btn" onclick="showSettingDetail('general1')">Company account</button>
          <button class="settings-nav-btn" onclick="showSettingDetail('general2')">Billing</button>
          <button class="settings-nav-btn" onclick="showSettingDetail('general3')">What's new</button>
        </div>
        <div>
          <div style="font-size: 13px; color: #8a97a8; font-weight: 700; margin: 0 0 8px 32px;">PROJECTS</div>
          <button class="settings-nav-btn" onclick="showSettingDetail('projects1')">Tags</button>
          <button class="settings-nav-btn" onclick="showSettingDetail('projects2')">Custom fields</button>
        </div>
        <div>
          <div style="font-size: 13px; color: #8a97a8; font-weight: 700; margin: 0 0 8px 32px;">PEOPLE</div>
          <button class="settings-nav-btn" onclick="showSettingDetail('people1')">Crew</button>
        </div>
        <div>
          <div style="font-size: 13px; color: #8a97a8; font-weight: 700; margin: 0 0 8px 32px;">TASKS</div>
          <button class="settings-nav-btn" onclick="showSettingDetail('tasks1')">Task settings</button>
        </div>
        <div>
          <div style="font-size: 13px; color: #8a97a8; font-weight: 700; margin: 0 0 8px 32px;">TRACKER</div>
          <button class="settings-nav-btn" onclick="showSettingDetail('tracker1')">Tracker settings</button>
        </div>
      </nav>
      <div id="setting-detail" class="setting-detail" style="flex: 1; padding: 40px 48px; overflow-y: auto;"></div>
    </section>
    <style>
      .settings-nav-btn {
        display: block;
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        outline: none;
        padding: 12px 32px;
        font-size: 16px;
        color: #222b45;
        border-radius: 0 20px 20px 0;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
        margin-bottom: 2px;
      }
      .settings-nav-btn:hover, .settings-nav-btn.active {
        background: #e6f0fa;
        color: #007aff;
      }
      .settings-section::-webkit-scrollbar, .settings-nav::-webkit-scrollbar {
        width: 8px;
        background: #f6f9fb;
      }
      .settings-section, .settings-nav {
        scrollbar-width: thin;
        scrollbar-color: #e0e4ea #f6f9fb;
      }
    </style>
  `;

  window.showSettingDetail = async function(detail) {
    const detailDiv = document.getElementById('setting-detail');
    let title = '';
    switch(detail) {
      case 'personal1':
        title = 'My account';
        // Fetch user data from Firestore
        let userData = {
          userName: '',
          email: '',
          phone: '',
          companyName: '',
          areaCode: '+44 (United Kingdom)',
          language: 'English (United Kingdom)',
          timeFormat: '24-hour'
        };
        let userDocId = null;
        try {
          const user = firebase.auth().currentUser;
          if (user) {
            userDocId = user.uid;
            const doc = await db.collection('users').doc(user.uid).get();
            if (doc.exists) {
              const data = doc.data();
              userData.userName = data.userName || '';
              userData.email = data.email || '';
              userData.phone = data.phone || '';
              userData.companyName = data.companyName || '';
              userData.areaCode = data.areaCode || '+44 (United Kingdom)';
              userData.language = data.language || 'English (United Kingdom)';
              userData.timeFormat = data.timeFormat || '24-hour';
            }
          }
        } catch (e) {
          console.error('Failed to fetch user data:', e);
        }
        // Render the profile UI with fetched data (editable)
        detailDiv.innerHTML = `
          <form id="accountSettingsForm" style="background:#f6f9fb;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.04);max-width:420px;margin:auto;">
            <div style="display:flex;flex-direction:column;align-items:center;padding:32px 0 16px 0;background:#f6f9fb;border-radius:12px 12px 0 0;">
              <div style="width:110px;height:110px;background:#ffd8bc;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:48px;font-weight:700;color:#a05a1a;">${userData.userName ? userData.userName.split(' ').map(n=>n[0]).join('').toUpperCase() : 'AC'}</div>
            </div>
            <div style="padding:0 0 0 0;">
              <div style="border-top:1px solid #e0e4ea;padding:16px 24px 8px 24px;">
                <div style="font-size:13px;color:#8a97a8;">Your name <span style='color:#ff5a36;'>*</span></div>
                <input type="text" id="userNameInput" value="${userData.userName}" style="width:100%;border:none;background:transparent;font-size:18px;font-weight:600;color:#222b45;outline:none;" required />
              </div>
              <div style="border-top:1px solid #e0e4ea;padding:8px 24px 8px 24px;">
                <input type="email" id="emailInput" value="${userData.email}" placeholder="Email" style="width:100%;border:none;background:transparent;font-size:16px;color:#222b45;outline:none;" required />
              </div>
              <div style="display:flex;border-top:1px solid #e0e4ea;">
                <div style="flex:1;padding:8px 12px 8px 24px;">
                  <div style="font-size:13px;color:#8a97a8;">Area code</div>
                  <select id="areaCodeInput" style="width:100%;border:none;background:transparent;font-size:16px;color:#222b45;outline:none;">
                    <option ${userData.areaCode==='+44 (United Kingdom)'?'selected':''}>+44 (United Kingdom)</option>
                    <option ${userData.areaCode==='+1 (USA)'?'selected':''}>+1 (USA)</option>
                    <option ${userData.areaCode==='+61 (Australia)'?'selected':''}>+61 (Australia)</option>
                  </select>
                </div>
                <div style="flex:2;padding:8px 24px 8px 12px;">
                  <div style="font-size:13px;color:#8a97a8;">Phone</div>
                  <input type="tel" id="phoneInput" value="${userData.phone}" style="width:100%;border:none;background:transparent;font-size:16px;color:#222b45;outline:none;" />
                </div>
              </div>
              <div style="border-top:1px solid #e0e4ea;padding:8px 24px 8px 24px;">
                <div style="font-size:13px;color:#8a97a8;">Language</div>
                <select id="languageInput" style="width:100%;border:none;background:transparent;font-size:16px;color:#222b45;outline:none;">
                  <option ${userData.language==='English (United Kingdom)'?'selected':''}>English (United Kingdom)</option>
                  <option ${userData.language==='English (United States)'?'selected':''}>English (United States)</option>
                  <option ${userData.language==='French'?'selected':''}>French</option>
                  <option ${userData.language==='German'?'selected':''}>German</option>
                </select>
              </div>
              <div style="border-top:1px solid #e0e4ea;padding:8px 24px 8px 24px;">
                <div style="font-size:13px;color:#8a97a8;">Time format</div>
                <select id="timeFormatInput" style="width:100%;border:none;background:transparent;font-size:16px;color:#222b45;outline:none;">
                  <option ${userData.timeFormat==='24-hour'?'selected':''}>24-hour</option>
                  <option ${userData.timeFormat==='12-hour'?'selected':''}>12-hour</option>
                </select>
              </div>
              <div style="border-top:1px solid #e0e4ea;padding:16px 24px 16px 24px;display:flex;align-items:center;justify-content:space-between;">
                <div style="font-size:14px;color:#8a97a8;">Verify your email and phone to access other companies.<br><a href="#" style="color:#007aff;text-decoration:underline;font-size:13px;">Learn more</a></div>
                <button type="button" style="background:#fff;border:1px solid #007aff;color:#007aff;padding:8px 18px;border-radius:8px;font-weight:600;display:flex;align-items:center;gap:6px;cursor:pointer;">
                  <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="18" height="18" rx="4" fill="#E6F0FA"/><path d="M5 9l3 3 5-5" stroke="#007aff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Verify
                </button>
              </div>
              <div style="padding:0 24px 24px 24px;display:flex;justify-content:flex-end;">
                <button type="submit" id="saveAccountBtn" style="background:#007aff;color:#fff;padding:10px 28px;border:none;border-radius:8px;font-weight:600;font-size:16px;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,0.08);">Save</button>
              </div>
            </div>
          </form>
          <script>
            document.getElementById('accountSettingsForm').onsubmit = async function(e) {
              e.preventDefault();
              const userName = document.getElementById('userNameInput').value.trim();
              const email = document.getElementById('emailInput').value.trim();
              const areaCode = document.getElementById('areaCodeInput').value;
              const phone = document.getElementById('phoneInput').value.trim();
              const language = document.getElementById('languageInput').value;
              const timeFormat = document.getElementById('timeFormatInput').value;
              try {
                const user = firebase.auth().currentUser;
                if (user) {
                  const userDoc = await db.collection('users').doc(user.uid).get();
                  const prev = userDoc.exists ? userDoc.data() : {};
                  let updateObj = {};
                  if (userName !== (prev.userName || '')) updateObj.userName = userName;
                  if (email !== (prev.email || '')) updateObj.email = email;
                  if (areaCode !== (prev.areaCode || '+44 (United Kingdom)')) updateObj.areaCode = areaCode;
                  if (phone !== (prev.phone || '')) updateObj.phone = phone;
                  if (language !== (prev.language || 'English (United Kingdom)')) updateObj.language = language;
                  if (timeFormat !== (prev.timeFormat || '24-hour')) updateObj.timeFormat = timeFormat;
                  // Only update if something changed
                  if (Object.keys(updateObj).length > 0) {
                    // Only update email in Auth if it changed
                    if (updateObj.email) {
                      await user.updateEmail(email);
                    }
                    await db.collection('users').doc(user.uid).set(updateObj, { merge: true });
                    alert('✅ Account settings updated!');
                  } else {
                    alert('No changes to save.');
                  }
                }
              } catch (err) {
                alert('❌ Failed to update account: ' + err.message);
              }
            };
          <\/script>
        `;
        break;
      case 'personal2':
        title = 'My notifications';
        detailDiv.innerHTML = `
          <div style="background:#f6f9fb;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.04);max-width:600px;margin:auto;">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:24px 32px 0 32px;">
              <div style="font-size:20px;font-weight:600;color:#222b45;">Chat notifications</div>
              <label style="display:inline-flex;align-items:center;cursor:pointer;">
                <input type="checkbox" id="chatNotifToggle" checked style="width:0;height:0;opacity:0;position:absolute;" />
                <span style="width:42px;height:24px;background:#e0e4ea;border-radius:12px;position:relative;display:inline-block;transition:background 0.2s;">
                  <span id="chatNotifKnob" style="position:absolute;left:3px;top:3px;width:18px;height:18px;background:#fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.10);transition:left 0.2s;"></span>
                </span>
              </label>
            </div>
            <div style="padding:0 32px 24px 32px;font-size:16px;color:#5a6473;">
              <p style="margin:16px 0 0 0;">You will be notified about new chat messages through push notifications and inside the app.</p>
              <p style="margin:8px 0 0 0;">You can adjust each channel notifications separately in channel settings.</p>
            </div>
          </div>
          <script>
            const toggle = document.getElementById('chatNotifToggle');
            const knob = document.getElementById('chatNotifKnob');
            function updateToggle() {
              if(toggle.checked) {
                knob.style.left = '21px';
                knob.parentElement.style.background = '#007aff';
              } else {
                knob.style.left = '3px';
                knob.parentElement.style.background = '#e0e4ea';
              }
            }
            toggle.addEventListener('change', updateToggle);
            updateToggle();
          <\/script>
        `;
        break;
      case 'general1':
        title = 'Company account';
        // Fetch company data from Firestore (or localStorage fallback)
        let companyData = {
          companyName: '',
          logo: '',
          country: '',
          regNo: '',
          utrNo: '',
          timezone: '',
          currency: '',
          unitSystem: 'Metric'
        };
        // Dropdown options
        const countryOptions = [
          'United Kingdom', 'United States', 'Australia', 'Canada', 'Germany', 'France', 'Spain', 'Italy', 'India', 'China', 'Japan', 'South Africa', 'Brazil', 'Other'
        ];
        const timezoneOptions = [
          'GMT', 'BST', 'CET', 'EET', 'EST', 'EDT', 'CST', 'CDT', 'MST', 'MDT', 'PST', 'PDT', 'IST', 'CST (China)', 'JST', 'AEST', 'AEDT', 'Other'
        ];
        const currencyOptions = [
          'GBP', 'USD', 'EUR', 'AUD', 'CAD', 'INR', 'CNY', 'JPY', 'ZAR', 'BRL', 'Other'
        ];
        try {
          const user = firebase.auth().currentUser;
          if (user) {
            // Get companyName from user's Firestore doc (from registration)
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
              const userData = userDoc.data();
              companyData.companyName = userData.companyName || '';
            }
            // Get company details from companies collection
            const doc = await db.collection('companies').doc(user.uid).get();
            if (doc.exists) {
              const data = doc.data();
              companyData.logo = data.logo || '';
              companyData.country = data.country || '';
              companyData.regNo = data.regNo || '';
              companyData.utrNo = data.utrNo || '';
              companyData.timezone = data.timezone || '';
              companyData.currency = data.currency || '';
              companyData.unitSystem = data.unitSystem || 'Metric';
              if (data.companyName) companyData.companyName = data.companyName;
            }
            // Always check localStorage for a newer logo and update Firestore if different
            const localLogo = localStorage.getItem('companyLogo');
            if (localLogo && localLogo !== companyData.logo) {
              companyData.logo = localLogo;
              await db.collection('companies').doc(user.uid).set({ logo: localLogo }, { merge: true });
            }
            if (!companyData.logo) {
              companyData.logo = 'Images/CompanyLogoBaseIMG.svg';
            }
          }
        } catch (e) {
          console.error('Failed to fetch company data:', e);
        }
        detailDiv.innerHTML = `
          <form id="companySettingsForm" style="background:#f6f9fb;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.04);max-width:480px;margin:auto;">
            <div style="display:flex;flex-direction:column;align-items:center;padding:32px 0 0 0;background:#f6f9fb;border-radius:12px 12px 0 0;">
              <img id="companyLogoPreview" src="${companyData.logo || 'Images/CompanyLogoBaseIMG.svg'}" alt="Company Logo" style="width:110px;height:110px;object-fit:contain;border-radius:16px;border:1.5px solid #e0e4ea;background:#fff;" />
              <input id="companyLogoInput" type="file" accept="image/*" style="margin-top:12px;" />
            </div>
            <div style="padding:0 0 0 0;">
              <div style="border-top:1px solid #e0e4ea;padding:16px 24px 8px 24px;">
                <div style="font-size:13px;color:#8a97a8;">Company Name <span style='color:#ff5a36;'>*</span></div>
                <input type="text" id="companyNameInput" value="${companyData.companyName}" style="width:100%;border:none;background:transparent;font-size:18px;font-weight:600;color:#222b45;outline:none;" required />
              </div>
              <div style="border-top:1px solid #e0e4ea;padding:8px 24px 8px 24px;">
                <div style="font-size:13px;color:#8a97a8;">Country of Operation</div>
                <select id="countryInput" style="width:100%;border:none;background:transparent;font-size:16px;color:#222b45;outline:none;">
                  ${countryOptions.map(opt => `<option${companyData.country===opt?' selected':''}>${opt}</option>`).join('')}
                </select>
              </div>
              <div style="display:flex;gap:12px;border-top:1px solid #e0e4ea;padding:8px 24px 8px 24px;">
                <div style="flex:1;">
                  <div style="font-size:13px;color:#8a97a8;">Company Reg No.</div>
                  <input type="text" id="regNoInput" value="${companyData.regNo}" style="width:100%;border:none;background:transparent;font-size:16px;color:#222b45;outline:none;" />
                </div>
                <div style="flex:1;">
                  <div style="font-size:13px;color:#8a97a8;">Company UTR No.</div>
                  <input type="text" id="utrNoInput" value="${companyData.utrNo}" style="width:100%;border:none;background:transparent;font-size:16px;color:#222b45;outline:none;" />
                </div>
              </div>
              <div style="display:flex;gap:12px;border-top:1px solid #e0e4ea;padding:8px 24px 8px 24px;">
                <div style="flex:1;">
                  <div style="font-size:13px;color:#8a97a8;">Timezone</div>
                  <select id="timezoneInput" style="width:100%;border:none;background:transparent;font-size:16px;color:#222b45;outline:none;">
                    ${timezoneOptions.map(opt => `<option${companyData.timezone===opt?' selected':''}>${opt}</option>`).join('')}
                  </select>
                </div>
                <div style="flex:1;">
                  <div style="font-size:13px;color:#8a97a8;">Currency</div>
                  <select id="currencyInput" style="width:100%;border:none;background:transparent;font-size:16px;color:#222b45;outline:none;">
                    ${currencyOptions.map(opt => `<option${companyData.currency===opt?' selected':''}>${opt}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div style="border-top:1px solid #e0e4ea;padding:8px 24px 8px 24px;">
                <div style="font-size:13px;color:#8a97a8;">Unit System</div>
                <select id="unitSystemInput" style="width:100%;border:none;background:transparent;font-size:16px;color:#222b45;outline:none;">
                  <option${companyData.unitSystem==='Metric'?' selected':''}>Metric</option>
                  <option${companyData.unitSystem==='Imperial'?' selected':''}>Imperial</option>
                </select>
              </div>
              <div style="padding:0 24px 24px 24px;display:flex;justify-content:flex-end;">
                <button type="submit" id="saveCompanyBtn" style="background:#007aff;color:#fff;padding:10px 28px;border:none;border-radius:8px;font-weight:600;font-size:16px;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,0.08);">Save</button>
              </div>
            </div>
          </form>
          <script>
            const logoInput = document.getElementById('companyLogoInput');
            const logoPreview = document.getElementById('companyLogoPreview');
            let logoDataUrl = logoPreview.src;
            logoInput.onchange = function(e) {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                  logoPreview.src = evt.target.result;
                  logoDataUrl = evt.target.result;
                };
                reader.readAsDataURL(file);
              }
            };
            document.getElementById('companySettingsForm').onsubmit = async function(e) {
              e.preventDefault();
              const companyName = document.getElementById('companyNameInput').value.trim();
              const country = document.getElementById('countryInput').value;
              const regNo = document.getElementById('regNoInput').value.trim();
              const utrNo = document.getElementById('utrNoInput').value.trim();
              const timezone = document.getElementById('timezoneInput').value;
              const currency = document.getElementById('currencyInput').value;
              const unitSystem = document.getElementById('unitSystemInput').value;
              try {
                const user = firebase.auth().currentUser;
                if (user) {
                  await db.collection('companies').doc(user.uid).set({
                    companyName,
                    logo: logoDataUrl,
                    country,
                    regNo,
                    utrNo,
                    timezone,
                    currency,
                    unitSystem
                  }, { merge: true });
                  // Also update companyName in users collection for consistency
                  await db.collection('users').doc(user.uid).set({ companyName }, { merge: true });
                  alert('✅ Company details updated!');
                }
              } catch (err) {
                alert('❌ Failed to update company: ' + err.message);
              }
            };
          <\/script>
        `;
        break;
      case 'general2':
        title = 'Billing';
        // Set user to Pro plan if not already set
        try {
          const user = firebase.auth().currentUser;
          if (user) {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (!userDoc.exists || userDoc.data().subscriptionPlan !== 'Pro') {
              await db.collection('users').doc(user.uid).set({ subscriptionPlan: 'Pro' }, { merge: true });
            }
          }
        } catch (e) {
          console.error('Failed to set subscription plan:', e);
        }
        // Display the current plan
        let plan = 'Pro';
        detailDiv.innerHTML = `
          <div style="background:#f6f9fb;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.04);max-width:420px;margin:auto;padding:32px 0 32px 0;">
            <h2 style="text-align:center;margin-bottom:16px;">Your Subscription Plan</h2>
            <div style="display:flex;flex-direction:column;align-items:center;">
              <div style="font-size:22px;font-weight:700;color:#007aff;margin-bottom:8px;">${plan}</div>
              <div style="font-size:16px;color:#5a6473;">You are currently on the <b>Pro</b> plan.</div>
              <div style="margin-top:24px;">
                <button style="background:#007aff;color:#fff;padding:10px 28px;border:none;border-radius:8px;font-weight:600;font-size:16px;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,0.08);" disabled>Change Plan (Coming Soon)</button>
              </div>
              <div style="margin-top:32px;padding:18px 20px;background:#fff3e6;border-radius:8px;border:1px solid #ffe0b2;color:#a05a1a;font-size:15px;text-align:center;max-width:340px;">
                To cancel your subscription, please <a href="mailto:support@oasisdm.com" style="color:#007aff;text-decoration:underline;">contact us</a> and our team will assist you.
              </div>
            </div>
          </div>
        `;
        break;
      case 'general3':
        title = "What's new";
        detailDiv.innerHTML = `
          <div style="background:#f6f9fb;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.04);max-width:540px;margin:auto;padding:36px 36px 32px 36px;">
            <h2 style="text-align:center;margin-bottom:18px;">Welcome to Oasis!</h2>
            <div style="font-size:17px;color:#222b45;text-align:center;line-height:1.7;">
              Oasis is your all-in-one production management platform, designed for creative teams and agencies.<br><br>
              Organize your projects, people, tasks, and resources in one beautiful, modern workspace. Collaborate in real time, track progress, manage files, and keep everyone in sync—whether you're planning a shoot, running a campaign, or delivering client work.<br><br>
              We're building Oasis to help you work smarter, not harder. Stay tuned for new features and improvements!
            </div>
          </div>
        `;
        break;
      case 'projects1': title = 'Tags'; break;
      case 'projects2': title = 'Custom fields'; break;
      case 'people1': title = 'Crew'; break;
      case 'tasks1': title = 'Task settings'; break;
      case 'tracker1': title = 'Tracker settings'; break;
      default: title = detail;
        detailDiv.innerHTML = `<h2 style='margin-top:0;'>${title}</h2><p>Details for ${title} will appear here.</p>`;
    }
    // Highlight active button
    document.querySelectorAll('.settings-nav-btn').forEach(btn => btn.classList.remove('active'));
    const btns = Array.from(document.querySelectorAll('.settings-nav-btn'));
    const btn = btns.find(b => b.getAttribute('onclick').includes(detail));
    if(btn) btn.classList.add('active');
  };
  // Optionally, show the first detail by default
  window.showSettingDetail('personal1');
}
