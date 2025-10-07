(function(){
    // DOM elements
    const keywordEl = document.getElementById('keyword');
    const locationEl = document.getElementById('location');
    const remoteOnlyEl = document.getElementById('remoteOnly');
    const searchForm = document.getElementById('searchForm');
    const resultsRow = document.getElementById('resultsRow');
    const paginationEl = document.getElementById('pagination');
    const statTotal = document.getElementById('statTotal');
    const statRemote = document.getElementById('statRemote');
    const statPages = document.getElementById('statPages');
    const searchBtn = document.getElementById('searchBtn');
    const yearEl = document.getElementById('year');
    const githubBtn = document.getElementById('githubBtn');
    const repoLink = document.getElementById('repoLink');

    yearEl.textContent = new Date().getFullYear();

    // Config
    const BASE = 'https://www.arbeitnow.com/api/job-board-api';
    let currentPage = 1;
    let totalPages = null; // we'll try to populate this from API if possible
    let lastResponseMeta = null; // fallback
    let lastQuery = { keyword: '', location: '', remoteOnly: false };

    // Utilities
    function safeText(s){ return s ? String(s) : ''; }
    function formatRelativeTime(iso){ // iso: created_at maybe
      try {
        const t = Date.parse(iso);
        if (isNaN(t)) return 'Unknown';
        const diff = Date.now() - t;
        const s = Math.floor(diff/1000);
        if (s < 60) return s + 's ago';
        const m = Math.floor(s/60);
        if (m < 60) return m + 'm ago';
        const h = Math.floor(m/60);
        if (h < 24) return h + 'h ago';
        const d = Math.floor(h/24);
        if (d < 30) return d + 'd ago';
        const date = new Date(t);
        return date.toLocaleDateString();
      } catch (e) {
        return 'Unknown';
      }
    }

    function clearResults(){
      resultsRow.innerHTML = '';
      paginationEl.innerHTML = '';
    }

    function showLoading(){
      resultsRow.innerHTML = '<div class="col-12 text-center py-5 text-muted"><div class="spinner-border text-light" role="status" aria-hidden="true"></div><div class="mt-2">Loading jobs…</div></div>';
    }

    function showError(message){
      resultsRow.innerHTML = '<div class="col-12 text-center py-5 text-danger">' + (message || 'Failed to fetch jobs') + '</div>';
    }

    // Build query string for API
    function buildUrl(page=1, keyword='', location=''){
      // The ArbeitNow endpoint generally accepts ?page=1&search=KEYWORD&location=LOCATION
      const params = new URLSearchParams();
      params.set('page', page);
      if (keyword && keyword.trim() !== '') params.set('search', keyword.trim());
      if (location && location.trim() !== '') params.set('location', location.trim());
      return BASE + '?' + params.toString();
    }

    // Render one job card
    function renderJobCard(job){
      // defensive reading of properties (API field names vary slightly across time)
      const title = safeText(job.title || job.position || job.name);
      const company = safeText(job.company_name || job.company || job.organization);
      const location = safeText(job.location || job.city || job.remote ? 'Remote' : '');
      const tags = Array.isArray(job.tags) ? job.tags : (job.tag_list || job.job_types || []);
      const url = job.url || job.job_url || job.slug || '#';
      const created = job.created_at || job.published_at || job.created || job.date;
      const remoteFlag = (job.remote === true) || (String(job.remote).toLowerCase() === 'true') || (String(location).toLowerCase().indexOf('remote') !== -1);

      // tags can be string sometimes
      let tagHtml = '';
      if (Array.isArray(tags)) {
        tagHtml = tags.slice(0,6).map(t => `<span class="badge me-1 mb-1 badge-tag">${escapeHtml(t)}</span>`).join('');
      } else if (typeof tags === 'string' && tags.trim().length){
        tagHtml = tags.split(',').slice(0,6).map(t=> `<span class="badge me-1 mb-1 badge-tag">${escapeHtml(t.trim())}</span>`).join('');
      }

      // create card column
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6 col-lg-4 position-relative';

      // ribbon
      const ribbon = document.createElement('div');
      ribbon.className = 'ribbon ' + (remoteFlag ? 'ribbon-remote' : 'ribbon-onsite');
      ribbon.textContent = remoteFlag ? 'REMOTE' : 'ON-SITE';
      // hide ribbon on small screens handled by CSS

      const card = document.createElement('div');
      card.className = 'card job-card glass';

      card.innerHTML = `
        <div class="d-flex align-items-start gap-3">
          <div class="flex-shrink-0" style="width:56px;">
            <div class="rounded-3 d-flex align-items-center justify-content-center" style="width:56px;height:56px;background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));border:1px solid rgba(255,255,255,0.03)">
              <i class="bi bi-building" style="font-size:1.2rem"></i>
            </div>
          </div>

          <div class="flex-grow-1">
            <h5 class="mb-1" style="font-weight:700;line-height:1.05">${escapeHtml(title)}</h5>
            <div class="text-muted small mb-2">${escapeHtml(company)} • <i class="bi bi-geo-alt-fill"></i> ${escapeHtml(location)}</div>
            <div class="mb-2">${tagHtml}</div>
            <div class="d-flex justify-content-between align-items-center">
              <div class="small text-muted">${formatRelativeTime(created)}</div>
              <div>
                <a class="btn btn-sm btn-outline-light" href="${escapeAttr(url)}" target="_blank" rel="noopener">View Details</a>
              </div>
            </div>
          </div>
        </div>
      `;

      // append ribbon + card into col
      col.appendChild(ribbon);
      col.appendChild(card);
      return col;
    }

    // Escape helper for safety
    function escapeHtml(s){
      return String(s)
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;')
        .replaceAll('"','&quot;')
        .replaceAll("'",'&#39;');
    }
    function escapeAttr(u){
      try {
        // simple sanitize
        return encodeURI(String(u));
      } catch(e){
        return '#';
      }
    }

    // Render pagination UI
    function renderPagination(current, pages){
      paginationEl.innerHTML = '';
      if (!pages || pages <= 1) return;

      // Prev
      const prevLi = document.createElement('li');
      prevLi.className = 'page-item' + (current <= 1 ? ' disabled' : '');
      prevLi.innerHTML = `<button class="page-link">Prev</button>`;
      prevLi.addEventListener('click', ()=>{ if (current>1) goToPage(current-1); });
      paginationEl.appendChild(prevLi);

      // show a limited range of pages centered on current
      const maxButtons = 7;
      let start = Math.max(1, current - Math.floor(maxButtons/2));
      let end = Math.min(pages, start + maxButtons - 1);
      if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);

      if (start > 1) {
        paginationEl.appendChild(makePageButton(1, current));
        if (start > 2) {
          const dots = document.createElement('li'); dots.className='page-item disabled'; dots.innerHTML = `<span class="page-link">…</span>`;
          paginationEl.appendChild(dots);
        }
      }

      for (let p = start; p <= end; p++){
        paginationEl.appendChild(makePageButton(p, current));
      }

      if (end < pages) {
        if (end < pages - 1) {
          const dots = document.createElement('li'); dots.className='page-item disabled'; dots.innerHTML = `<span class="page-link">…</span>`;
          paginationEl.appendChild(dots);
        }
        paginationEl.appendChild(makePageButton(pages, current));
      }

      // Next
      const nextLi = document.createElement('li');
      nextLi.className = 'page-item' + (current >= pages ? ' disabled' : '');
      nextLi.innerHTML = `<button class="page-link">Next</button>`;
      nextLi.addEventListener('click', ()=>{ if (current < pages) goToPage(current+1); });
      paginationEl.appendChild(nextLi);
    }

    function makePageButton(n, current){
      const li = document.createElement('li');
      li.className = 'page-item' + (n === current ? ' active' : '');
      li.innerHTML = `<button class="page-link">${n}</button>`;
      li.addEventListener('click', ()=>{ if (n !== current) goToPage(n); });
      return li;
    }

    // fetch data from API
    async function fetchJobs(page=1, keyword='', location=''){
      clearResults();
      showLoading();

      const url = buildUrl(page, keyword, location);

      try {
        const res = await fetch(url, {cache: 'no-store'});
        if (!res.ok) {
          showError('API returned an error: ' + res.status);
          return;
        }

        const json = await res.json();

        // The API historically has fields like: data (array) or jobs (array) or the root as an object with data property.
        // We'll try different shapes.
        let jobs = null;
        let pages = null;

        // common patterns
        if (Array.isArray(json.data)) {
          jobs = json.data;
        } else if (Array.isArray(json.jobs)) {
          jobs = json.jobs;
        } else if (Array.isArray(json)) {
          jobs = json;
        } else if (Array.isArray(json.page)) {
          jobs = json.page;
        } else if (Array.isArray(json.results)) {
          jobs = json.results;
        } else if (json.jobs_list && Array.isArray(json.jobs_list)) {
          jobs = json.jobs_list;
        } else if (json.data && json.data.jobs && Array.isArray(json.data.jobs)) {
          jobs = json.data.jobs;
        } else {
          // If none matched, try looking for 'job' like entries in any property
          for (const k of Object.keys(json)) {
            if (Array.isArray(json[k]) && json[k].length && typeof json[k][0] === 'object' && (json[k][0].title || json[k][0].company_name || json[k][0].position)) {
              jobs = json[k];
              break;
            }
          }
        }

        // pagination meta detection
        // Many implementations provide 'last_page', 'total_pages', 'meta' or 'links' next/prev. Try to read.
        if (json.last_page) pages = Number(json.last_page);
        else if (json.total_pages) pages = Number(json.total_pages);
        else if (json.meta && json.meta.last_page) pages = Number(json.meta.last_page);
        else if (json.pagination && json.pagination.total_pages) pages = Number(json.pagination.total_pages);
        else if (json.meta && json.meta.total_pages) pages = Number(json.meta.total_pages);
        else if (json.page && json.page.last_page) pages = Number(json.page.last_page);

        // If the API returns next/prev links, try to extract maximum page
        if (!pages && json.links && json.links.last) {
          try {
            const lastUrl = new URL(json.links.last);
            if (lastUrl.searchParams.has('page')) pages = Number(lastUrl.searchParams.get('page'));
          } catch(e){}
        }

        // if still null, try to set to an approximate using meta.total or fallback to 20
        if (!pages) {
          // Some implementations include 'total' (count). If present, approximate pages with 10 per page.
          if (json.total) pages = Math.ceil(Number(json.total) / 10);
          else pages = 10; // safe fallback
        }

        // If jobs still not found, show message.
        if (!jobs || !jobs.length) {
          statTotal.textContent = '0';
          statRemote.textContent = '0';
          statPages.textContent = pages || '—';
          showError('No jobs found. Try different keywords or location.');
          return;
        }

        // CLIENT-SIDE SEARCH + LOCATION FILTER
        // Perform robust, case-insensitive substring matching against title/company/description/location.
        const kw = (keyword || '').trim().toLowerCase();
        const locQuery = (location || '').trim().toLowerCase();
        const remoteOnly = remoteOnlyEl.checked || false;

        const filteredJobs = jobs.filter(j => {
          // defensive fields
          const title = (j.title || j.position || j.name || '').toString().toLowerCase();
          const company = (j.company_name || j.company || j.organization || '').toString().toLowerCase();
          const description = (j.description || j.content || j.snippet || '').toString().toLowerCase();
          const loc = (j.location || j.city || '').toString().toLowerCase();
          const isRemote = (j.remote === true) || (String(j.remote || '').toLowerCase() === 'true') || loc.indexOf('remote') !== -1;

          // keyword match: any of title, company, description
          const keywordMatch = !kw || title.includes(kw) || company.includes(kw) || description.includes(kw);

          // location match: match against location field; special-case "remote"
          let locationMatch = true;
          if (locQuery) {
            if (locQuery === 'remote') locationMatch = isRemote;
            else locationMatch = loc.includes(locQuery);
          }

          // remoteOnly filter
          if (remoteOnly && !isRemote) return false;

          return keywordMatch && locationMatch;
        });

        // Render job cards using filteredJobs
        resultsRow.innerHTML = '';
        if (!filteredJobs.length) {
          statTotal.textContent = jobs.length;
          statRemote.textContent = jobs.filter(j => (j.remote === true) || (String(j.remote).toLowerCase() === 'true') || (String(j.location || '').toLowerCase().includes('remote'))).length;
          statPages.textContent = pages || '—';
          showError('No jobs match your search criteria.');
          return;
        }

        for (const job of filteredJobs) {
          const col = renderJobCard(job);
          resultsRow.appendChild(col);
        }

        // Stats (total = total available from API; remote = count within full set)
        statTotal.textContent = jobs.length;
        statRemote.textContent = jobs.filter(j => (j.remote === true) || (String(j.remote).toLowerCase() === 'true') || (String(j.location || '').toLowerCase().includes('remote'))).length;
        statPages.textContent = pages || '—';

        // pagination (keeps pages from API; navigation will re-fetch but maintain lastQuery)
        totalPages = pages;
        currentPage = page;
        renderPagination(currentPage, totalPages);

        // store meta
        lastResponseMeta = json;

      } catch (err) {
        console.error(err);
        showError('Network error while fetching jobs');
      }
    }

    // navigate to a page
    function goToPage(page){
      // maintain last query
      const { keyword, location, remoteOnly } = lastQuery;
      fetchJobs(page, keyword, location);
    }

    // handle search
    searchForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const keyword = keywordEl.value || '';
      const location = locationEl.value || '';
      lastQuery = { keyword, location, remoteOnly: remoteOnlyEl.checked };
      // always start from page 1 for a new search
      fetchJobs(1, keyword, location);
    });

    // remote toggle should re-run the current search to apply filter
    remoteOnlyEl.addEventListener('change', () => {
      // re-run same page to apply filter
      fetchJobs(currentPage, lastQuery.keyword || keywordEl.value || '', lastQuery.location || locationEl.value || '');
    });

    // repo button
    githubBtn.addEventListener('click', ()=>{
      // update to your repo URL if needed
      window.open(repoLink.href, '_blank', 'noopener');
    });

    // initial load: popular defaults
    (function initial(){
      // default search: remote jobs (no keyword)
      remoteOnlyEl.checked = true;
      lastQuery = { keyword: '', location: '', remoteOnly: true };
      fetchJobs(1, '', '');
    })();

    // Expose for debugging (safe)
    window.jobPulse = {
      fetchJobs, goToPage
    };

  })();