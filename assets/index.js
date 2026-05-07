(() => {
  const DESKTOP_BREAKPOINT = 1200;

  const queryFirst = (...selectors) => {
    for (const selector of selectors) {
      const element = document.querySelector(selector);

      if (element) {
        return element;
      }
    }

    return null;
  };

  const classes = {
    topbarWithSidebarNavigation:
      'topbar_withSidebarNavigation__StandardAppLayout__rVqCZ',
    topbarWithoutSidebarNavigation:
      'topbar_withoutSidebarNavigation__StandardAppLayout__rVqCZ',
    mainDefault: 'mainDefault__StandardAppLayout__rVqCZ',
    mainFullWidth: 'mainFullWidth__StandardAppLayout__rVqCZ',
    sidebarWrapperOpen: 'sidebarWrapperOpen__StandardAppLayout__rVqCZ',
    sidebarWrapperClosed: 'sidebarWrapperClosed__StandardAppLayout__rVqCZ',
    instantaneous: 'instantaneous__StandardAppLayout__rVqCZ',
    chevronLeft: 'chevron_left__Chevron__RsFHI',
    chevronRight: 'chevron_right__Chevron__RsFHI'
  };

  const elements = {
    topbar: queryFirst(
      '[data-snapshot-section="viewer-topbar"]',
      '.topbar__StandardAppLayout__rVqCZ'
    ),
    topbarTabs: queryFirst(
      '[data-snapshot-section="sidebar-navigation"]',
      '.tabsContainer__TranscriptViewSidebarTabs__pqZc2'
    ),
    main: queryFirst(
      '[data-snapshot-section="viewer-main"]',
      '.main__StandardAppLayout__rVqCZ'
    ),
    sidebarWrapper: queryFirst(
      '[data-snapshot-section="sidebar-shell"]',
      '.sidebarWrapper__StandardAppLayout__rVqCZ'
    ),
    toggleButton: queryFirst(
      '[data-snapshot-action="sidebar-toggle"]',
      '.sidebarModeToggle__StandardAppLayout__rVqCZ button'
    ),
    toggleChevron: queryFirst(
      '[data-snapshot-action="sidebar-toggle"] svg',
      '.sidebarModeToggle__StandardAppLayout__rVqCZ svg'
    )
  };

  if (
    !elements.topbar ||
    !elements.main ||
    !elements.sidebarWrapper ||
    !elements.toggleButton ||
    !elements.toggleChevron
  ) {
    return;
  }

  const state = {
    isSidebarOpen: window.innerWidth >= DESKTOP_BREAKPOINT
  };

  const shouldShowSidebarNavigation = () =>
    window.innerWidth >= DESKTOP_BREAKPOINT || state.isSidebarOpen;

  const render = () => {
    const showSidebarNavigation = shouldShowSidebarNavigation();

    document.documentElement.dataset.snapshotBreakpoint =
      window.innerWidth >= DESKTOP_BREAKPOINT ? 'desktop' : 'narrow';
    document.documentElement.dataset.snapshotSidebar = state.isSidebarOpen
      ? 'open'
      : 'closed';
    document.documentElement.dataset.snapshotNavigation = showSidebarNavigation
      ? 'visible'
      : 'hidden';

    elements.topbar.classList.toggle(
      classes.topbarWithSidebarNavigation,
      showSidebarNavigation
    );
    elements.topbar.classList.toggle(
      classes.topbarWithoutSidebarNavigation,
      !showSidebarNavigation
    );

    if (elements.topbarTabs) {
      elements.topbarTabs.hidden = !showSidebarNavigation;
      elements.topbarTabs.querySelectorAll('button').forEach((button) => {
        button.type = 'button';
      });
    }

    elements.main.classList.toggle(classes.mainDefault, state.isSidebarOpen);
    elements.main.classList.toggle(
      classes.mainFullWidth,
      !state.isSidebarOpen
    );

    elements.sidebarWrapper.classList.toggle(
      classes.sidebarWrapperOpen,
      state.isSidebarOpen
    );
    elements.sidebarWrapper.classList.toggle(
      classes.sidebarWrapperClosed,
      !state.isSidebarOpen
    );
    elements.sidebarWrapper.classList.toggle(
      classes.instantaneous,
      !state.isSidebarOpen
    );

    elements.toggleButton.type = 'button';
    elements.toggleButton.setAttribute(
      'aria-expanded',
      String(state.isSidebarOpen)
    );
    elements.toggleChevron.classList.toggle(
      classes.chevronRight,
      state.isSidebarOpen
    );
    elements.toggleChevron.classList.toggle(
      classes.chevronLeft,
      !state.isSidebarOpen
    );
  };

  elements.toggleButton.addEventListener('click', () => {
    state.isSidebarOpen = !state.isSidebarOpen;
    render();
  });

  if (elements.topbarTabs) {
    elements.topbarTabs.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        if (!state.isSidebarOpen) {
          state.isSidebarOpen = true;
          render();
        }
      });
    });
  }

  window.addEventListener('resize', render, { passive: true });

  render();
})();

(() => {
  const tabContainer = document.querySelector(
    '[data-snapshot-section="sidebar-navigation"]'
  );

  if (!tabContainer) {
    return;
  }

  const buttons = Array.from(
    tabContainer.querySelectorAll('[data-sidebar-view-trigger]')
  );
  const panels = Array.from(
    document.querySelectorAll('[data-sidebar-view-panel]')
  );

  if (!buttons.length || !panels.length) {
    return;
  }

  const classes = {
    selected: 'selected__Tabs__EblES',
    selectedTab: 'selectedTab__TranscriptViewSidebarTabs__pqZc2'
  };
  const defaultView = 'overview';
  const externalReferencesView = 'external-references';
  const state = {
    view: defaultView
  };

  const normalizeView = (view) =>
    view === externalReferencesView ? externalReferencesView : defaultView;

  const render = () => {
    document.documentElement.dataset.snapshotSidebarView = state.view;

    buttons.forEach((button) => {
      const isSelected = button.dataset.sidebarViewTrigger === state.view;

      button.classList.toggle(classes.selected, isSelected);
      button.classList.toggle(classes.selectedTab, isSelected);
      button.setAttribute('aria-selected', String(isSelected));
      button.tabIndex = isSelected ? 0 : -1;
    });

    panels.forEach((panel) => {
      const isSelected = panel.dataset.sidebarViewPanel === state.view;

      panel.hidden = !isSelected;
    });
  };

  buttons.forEach((button) => {
    button.type = 'button';
    button.addEventListener('click', () => {
      state.view = normalizeView(button.dataset.sidebarViewTrigger);
      render();
    });
  });

  render();
})();

(() => {
  const triggers = Array.from(
    document.querySelectorAll('[data-snapshot-collapsible-trigger]')
  );

  if (!triggers.length) {
    return;
  }

  const chevronUpClass = 'chevron_up__Chevron__RsFHI';

  const render = (trigger) => {
    const panelId = trigger.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    const chevron = trigger.querySelector('.chevron__Chevron__RsFHI');

    if (panel) {
      panel.hidden = !isExpanded;
    }

    if (chevron) {
      chevron.classList.toggle(chevronUpClass, isExpanded);
    }
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isExpanded));
      render(trigger);
    });

    render(trigger);
  });
})();

(() => {
  const tabContainer = document.querySelector('[data-transcript-view-tabs]');

  if (!tabContainer) {
    return;
  }

  const buttons = Array.from(
    tabContainer.querySelectorAll('[data-transcript-view-trigger]')
  );
  const panels = Array.from(
    document.querySelectorAll('[data-transcript-view-panel]')
  );

  if (!buttons.length || !panels.length) {
    return;
  }

  const classes = {
    selected: 'selected__Tabs__EblES',
    selectedTab: 'tabSelected__TranscriptViewTabs__A0dJm'
  };
  const defaultView = 'transcript';
  const proteinView = 'protein';
  const state = {
    view: defaultView
  };

  const normalizeView = (view) =>
    view === proteinView ? proteinView : defaultView;

  const getViewFromUrl = () => {
    const url = new URL(window.location.href);

    return normalizeView(url.searchParams.get('view'));
  };

  const updateUrl = (view, { replace = false } = {}) => {
    const url = new URL(window.location.href);

    if (view === proteinView) {
      url.searchParams.set('view', proteinView);
    } else {
      url.searchParams.delete('view');
    }

    const method = replace ? 'replaceState' : 'pushState';
    window.history[method](window.history.state, '', url);
  };

  const render = () => {
    document.documentElement.dataset.snapshotTranscriptView = state.view;

    buttons.forEach((button) => {
      const isSelected =
        button.dataset.transcriptViewTrigger === state.view;

      button.classList.toggle(classes.selected, isSelected);
      button.classList.toggle(classes.selectedTab, isSelected);
      button.setAttribute('aria-selected', String(isSelected));
      button.tabIndex = isSelected ? 0 : -1;
    });

    panels.forEach((panel) => {
      const isSelected = panel.dataset.transcriptViewPanel === state.view;

      panel.hidden = !isSelected;
    });
  };

  const setView = (view, options = {}) => {
    const { replace = false, updateBrowserUrl = true } = options;
    state.view = normalizeView(view);
    render();

    if (updateBrowserUrl) {
      updateUrl(state.view, { replace });
    }
  };

  buttons.forEach((button) => {
    button.type = 'button';
    button.addEventListener('click', () => {
      const nextView = button.dataset.transcriptViewTrigger;

      if (!nextView || nextView === state.view) {
        return;
      }

      setView(nextView);
    });
  });

  document
    .querySelectorAll('[data-transcript-view-link]')
    .forEach((link) => {
      link.addEventListener('click', (event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        event.preventDefault();
        setView(link.dataset.transcriptViewLink);
      });
    });

  window.addEventListener('popstate', () => {
    setView(getViewFromUrl(), { updateBrowserUrl: false });
  });

  setView(getViewFromUrl(), { replace: true });
})();