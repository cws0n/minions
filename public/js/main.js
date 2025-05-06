document.addEventListener('DOMContentLoaded', function() {
  // Tab management
  const tabsContainer = document.getElementById('tabsContainer');
  const contentArea = document.getElementById('contentArea');
  const newTabButton = document.getElementById('newTabButton');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  
  let tabs = JSON.parse(localStorage.getItem('tabs')) || [
    { id: 'newtab', title: 'New Tab', url: '/newtab' }
  ];
  let activeTabId = localStorage.getItem('activeTabId') || 'newtab';
  
  // Initialize tabs
  function renderTabs() {
    tabsContainer.innerHTML = '';
    
    tabs.forEach(tab => {
      const tabElement = document.createElement('div');
      tabElement.className = `tab ${tab.id === activeTabId ? 'active' : ''}`;
      tabElement.dataset.tabid = tab.id;
      tabElement.innerHTML = `
        <span>${tab.title}</span>
        <span class="close-tab">&times;</span>
      `;
      tabsContainer.appendChild(tabElement);
    });
    
    tabsContainer.appendChild(newTabButton);
    addTabEventListeners();
    updateContentArea();
  }
  
  function addTabEventListeners() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', function(e) {
        if (!e.target.classList.contains('close-tab')) {
          activeTabId = this.dataset.tabid;
          saveState();
          renderTabs();
        }
      });
      
      tab.querySelector('.close-tab').addEventListener('click', function(e) {
        e.stopPropagation();
        closeTab(this.parentElement.dataset.tabid);
      });
    });
  }
  
  function updateContentArea() {
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    if (activeTab) {
      if (activeTab.url.startsWith('/proxy')) {
        contentArea.innerHTML = `
          <div class="iframe-container">
            <iframe src="${activeTab.url}" id="tabContent" frameborder="0"></iframe>
          </div>
        `;
      } else {
        contentArea.innerHTML = `
          <div class="iframe-container">
            <iframe src="${activeTab.url}" id="tabContent" frameborder="0"></iframe>
          </div>
        `;
      }
    }
  }
  
  function createNewTab(url = '/newtab', title = 'New Tab') {
    const tabId = 'tab-' + Date.now();
    tabs.push({
      id: tabId,
      title: title,
      url: url
    });
    activeTabId = tabId;
    saveState();
    renderTabs();
  }
  
  function closeTab(tabId) {
    if (tabs.length <= 1) {
      createNewTab();
    }
    
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex > -1) {
      tabs.splice(tabIndex, 1);
      
      if (activeTabId === tabId) {
        activeTabId = tabs[tabs.length - 1].id;
      }
      
      saveState();
      renderTabs();
    }
  }
  
  function saveState() {
    localStorage.setItem('tabs', JSON.stringify(tabs));
    localStorage.setItem('activeTabId', activeTabId);
  }
  
  // New tab button
  newTabButton.addEventListener('click', function() {
    createNewTab();
  });
  
  // Search/navigation
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const url = searchInput.value.trim();
    
    if (url) {
      let processedUrl = url;
      
      // If it's not a valid URL, treat it as a search query
      if (!/^https?:\/\//i.test(url) && !/^www\./i.test(url)) {
        processedUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      } else if (!/^https?:\/\//i.test(url)) {
        processedUrl = `https://${url}`;
      }
      
      // Proxy the URL
      const proxyUrl = `/proxy?target=${encodeURIComponent(processedUrl)}`;
      
      // Update current tab
      const activeTabIndex = tabs.findIndex(tab => tab.id === activeTabId);
      if (activeTabIndex > -1) {
        tabs[activeTabIndex].url = proxyUrl;
        tabs[activeTabIndex].title = new URL(processedUrl).hostname;
        saveState();
        updateContentArea();
      }
    }
  });
  
  // Initial render
  renderTabs();
});
