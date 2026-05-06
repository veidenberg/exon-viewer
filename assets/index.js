(() => {
  const DESKTOP_BREAKPOINT = 1200;

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
    topbar: document.querySelector('.topbar__StandardAppLayout__rVqCZ'),
    topbarTabs: document.querySelector(
      '.tabsContainer__TranscriptViewSidebarTabs__pqZc2'
    ),
    main: document.querySelector('.main__StandardAppLayout__rVqCZ'),
    sidebarWrapper: document.querySelector(
      '.sidebarWrapper__StandardAppLayout__rVqCZ'
    ),
    toggleButton: document.querySelector(
      '.sidebarModeToggle__StandardAppLayout__rVqCZ button'
    ),
    toggleChevron: document.querySelector(
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
    elements.toggleButton.setAttribute('aria-expanded', String(state.isSidebarOpen));
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