(() => {
  const SUPABASE_URL = 'https://argnkigepffzbykthksw.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyZ25raWdlcGZmemJ5a3Roa3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1Njc2NzUsImV4cCI6MjEwNDE0MzY3NX0.3IXLvKn9Lsux-FNWnQq_POZikuIKYubStjj4ceVYnE4';
  const supabase = window.supabase && window.supabase.createClient
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
  document.getElementById('connectionStatus').textContent = 'Login service ready';
  document.getElementById('connectionStatus').classList.add('admin-ready');
  const storageKey = 'tubeclose-admin-content';
  const defaults = {
    heroHeadline: 'We Build YouTube Systems That Generate Qualified Leads.',
    heroCta: 'Book Your Strategy Call',
    heroCtaLink: 'https://tally.so/r/xXW7YE',
    vslWistiaId: '',
    testimonialName: '',
    testimonialWistiaId: ''
  };

  const login = document.getElementById('adminLogin');
  const app = document.getElementById('adminApp');
  const loginForm = document.getElementById('loginForm');
  const loginButton = document.getElementById('loginButton');
  const loginError = document.getElementById('loginError');
  const form = document.getElementById('contentForm');
  const status = document.getElementById('saveStatus');
  const fields = Object.keys(defaults).reduce((result, key) => {
    result[key] = document.getElementById(key);
    return result;
  }, {});

  let mediaUrls = { vsl: '', testimonial: '' };

  async function openApp(session) {
    if (!session) return;
    login.hidden = true;
    app.hidden = false;
    await load();
  }

  async function signIn() {
    if (!document.getElementById('loginEmail').value || !document.getElementById('loginPassword').value) {
      loginError.textContent = 'Enter your Supabase email and password first.';
      return;
    }
    loginError.textContent = '';
    loginButton.disabled = true;
    loginButton.textContent = 'Connecting...';
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: document.getElementById('loginEmail').value.trim(),
          password: document.getElementById('loginPassword').value
        })
      });
      const data = await response.json();
      if (!response.ok) {
        loginError.textContent = data.error_description || data.msg || data.message || 'Invalid login credentials.';
      } else {
        window.sessionStorage.setItem('tubeclose-access-token', data.access_token);
        login.hidden = true;
        app.hidden = false;
        await load();
      }
    } catch (error) {
      loginError.textContent = error.message || 'Could not sign in. Check your connection.';
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = 'Sign in';
    }
  }

  loginButton.addEventListener('click', signIn);
  loginForm.addEventListener('submit', (event) => { event.preventDefault(); signIn(); });

  function getContent() {
    return Object.keys(fields).reduce((content, key) => {
      content[key] = fields[key].value.trim();
      return content;
    }, {});
  }

  function setStatus(message) {
    status.textContent = message;
    window.clearTimeout(setStatus.timeout);
    setStatus.timeout = window.setTimeout(() => { status.textContent = 'Saved locally'; }, 1800);
  }

  function renderMedia(container, source, emptyText) {
    container.replaceChildren();
    if (!source) {
      const empty = document.createElement('span');
      empty.textContent = emptyText;
      container.append(empty);
      return;
    }
    const video = document.createElement('video');
    video.src = source;
    video.controls = true;
    video.preload = 'metadata';
    container.append(video);
  }

  function render() {}

  async function load() {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || '{}');
    Object.keys(fields).forEach((key) => { fields[key].value = saved[key] ?? defaults[key]; });
    const { data } = await supabase.from('site_content').select('key,value');
    (data || []).forEach((row) => {
      const fieldKey = {
        vsl_wistia_id: 'vslWistiaId',
        testimonial_wistia_id: 'testimonialWistiaId',
        testimonial_client_name: 'testimonialName'
      }[row.key] || row.key;
      if (fields[fieldKey]) fields[fieldKey].value = row.value;
    });
    render();
  }

  Object.values(fields).forEach((field) => field.addEventListener('input', render));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const content = getContent();
    window.localStorage.setItem(storageKey, JSON.stringify(content));
    const databaseKeys = {
      vslWistiaId: 'vsl_wistia_id',
      testimonialWistiaId: 'testimonial_wistia_id',
      testimonialName: 'testimonial_client_name'
    };
    const updates = Object.entries(content).map(([key, value]) => ({ key: databaseKeys[key] || key, value, updated_at: new Date().toISOString() }));
    const { error } = await supabase.from('site_content').upsert(updates, { onConflict: 'key' });
    setStatus(error ? 'Save failed' : 'Saved to live database');
  });

  document.getElementById('resetContent').addEventListener('click', () => {
    window.localStorage.removeItem(storageKey);
    mediaUrls = { vsl: '', testimonial: '' };
    load();
    setStatus('Reset complete');
  });

  load();
  if (supabase) {
    supabase.auth.getSession().then(({ data }) => openApp(data.session));
    supabase.auth.onAuthStateChange((_event, session) => openApp(session));
  }
})();
