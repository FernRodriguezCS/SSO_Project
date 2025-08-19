(async () => {
    const statusEl = document.getElementById('status');
    async function checkStatus() {
      const res = await fetch('/status', { credentials: 'include', cache: 'no-store' });
      const data = await res.json();
      statusEl.textContent = data.authenticated ? 'Logged In' : 'Logged Out';
    }
  
    // Retry a few times after landing from /callback so the session is definitely set
    for (let i = 0; i < 5; i++) {
      try { await checkStatus(); break; } catch {}
      await new Promise(r => setTimeout(r, 300));
    }
  
    document.getElementById('profileBtn')?.addEventListener('click', async () => {
      const res = await fetch('/profile', { credentials: 'include' });
      if (res.status === 401) return (window.location.href = '/login');
      const txt = await res.text();
      const pre = document.getElementById('out');
      pre.hidden = false;
      pre.textContent = txt;
    });
  })();