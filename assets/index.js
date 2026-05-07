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
  const exonsView = 'exons';
  const state = {
    view: defaultView
  };

  const normalizeView = (view) =>
    view === proteinView || view === exonsView ? view : defaultView;

  const getViewFromUrl = () => {
    const url = new URL(window.location.href);

    return normalizeView(url.searchParams.get('view'));
  };

  const updateUrl = (view, { replace = false } = {}) => {
    const url = new URL(window.location.href);

    if (view === proteinView || view === exonsView) {
      url.searchParams.set('view', view);
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


    (() => {
      const tableBody = document.querySelector(
        '[data-snapshot-section="transcript-exons-table-body"]'
      );

      if (!tableBody) {
        return;
      }

      const exonSequences = {
        ENSE00004011581: [
          'AGAGGCGGAGCCGCTGTGGCACTGCTGCGCCTCTGCTGCGCCTCGGGTGTCTTTTGCGGCGGTGGGTCGCCGCCGGGAGAAGCGTGAGGGGACAGATTTG',
          'TGACCGGCGCGGTTTTTGTCAGCTTACTCCGGCCAAAAAAGAACTGCACCTCTGGAGCGG'
        ].join(''),
        ENSE00001484009: [
          'ACTTATTTACCAAGCATTGGAGGAATATCGTAGGTAAAAATGCCTATTGGATCCAAAGAGAGGCCAACATTTTTTGAAATTTTTAAGACACGCTGCAACA',
          'AAGCAG'
        ].join(''),
        ENSE00003666217: [
          'ATTTAGGACCAATAAGTCTTAATTGGTTTGAAGAACTTTCTTCAGAAGCTCCACCCTATAATTCTGAACCTGCAGAAGAATCTGAACATAAAAACAACAA',
          'TTACGAACCAAACCTATTTAAAACTCCACAAAGGAAACCATCTTATAATCAGCTGGCTTCAACTCCAATAATATTCAAAGAGCAAGGGCTGACTCTGCCG',
          'CTGTACCAATCTCCTGTAAAAGAATTAGATAAATTCAAATTAGACTTAG'
        ].join(''),
        ENSE00003659301: [
          'GAAGGAATGTTCCCAATAGTAGACATAAAAGTCTTCGCACAGTGAAAACTAAAATGGATCAAGCAGATGATGTTTCCTGTCCACTTCTAAATTCTTGTCT',
          'TAGTGAAAG'
        ].join(''),
        ENSE00003739878: 'TCCTGTTGTTCTACAATGTACACATGTAACACCACAAAGAGATAAGTCAG',
        ENSE00003747332: 'TGGTATGTGGGAGTTTGTTTCATACACCAAAGTTTGTGAAG',
        ENSE00003749714: [
          'GGTCGTCAGACACCAAAACATATTTCTGAAAGTCTAGGAGCTGAGGTGGATCCTGATATGTCTTGGTCAAGTTCTTTAGCTACACCACCCACCCTTAGTT',
          'CTACTGTGCTCATAG'
        ].join(''),
        ENSE00003714754: 'TCAGAAATGAAGAAGCATCTGAAACTGTATTTCCTCATGATACTACTGCT',
        ENSE00003731761: [
          'AATGTGAAAAGCTATTTTTCCAATCATGATGAAAGTCTGAAGAAAAATGATAGATTTATCGCTTCTGTGACAGACAGTGAAAACACAAATCAAAGAGAAG',
          'CTGCAAGTCATG'
        ].join(''),
        ENSE00000939167: [
          'GATTTGGAAAAACATCAGGGAATTCATTTAAAGTAAATAGCTGCAAAGACCACATTGGAAAGTCAATGCCAAATGTCCTAGAAGATGAAGTATATGAAAC',
          'AGTTGTAGATACCTCTGAAGAAGATAGTTTTTCATTATGTTTTTCTAAATGTAGAACAAAAAATCTACAAAAAGTAAGAACTAGCAAGACTAGGAAAAAA',
          'ATTTTCCATGAAGCAAACGCTGATGAATGTGAAAAATCTAAAAACCAAGTGAAAGAAAAATACTCATTTGTATCTGAAGTGGAACCAAATGATACTGATC',
          'CATTAGATTCAAATGTAGCAAATCAGAAGCCCTTTGAGAGTGGAAGTGACAAAATCTCCAAGGAAGTTGTACCGTCTTTGGCCTGTGAATGGTCTCAACT',
          'AACCCTTTCAGGTCTAAATGGAGCCCAGATGGAGAAAATACCCCTATTGCATATTTCTTCATGTGACCAAAATATTTCAGAAAAAGACCTATTAGACACA',
          'GAGAACAAAAGAAAGAAAGATTTTCTTACTTCAGAGAATTCTTTGCCACGTATTTCTAGCCTACCAAAATCAGAGAAGCCATTAAATGAGGAAACAGTGG',
          'TAAATAAGAGAGATGAAGAGCAGCATCTTGAATCTCATACAGACTGCATTCTTGCAGTAAAGCAGGCAATATCTGGAACTTCTCCAGTGGCTTCTTCATT',
          'TCAGGGTATCAAAAAGTCTATATTCAGAATAAGAGAATCACCTAAAGAGACTTTCAATGCAAGTTTTTCAGGTCATATGACTGATCCAAACTTTAAAAAA',
          'GAAACTGAAGCCTCTGAAAGTGGACTGGAAATACATACTGTTTGCTCACAGAAGGAGGACTCCTTATGTCCAAATTTAATTGATAATGGAAGCTGGCCAG',
          'CCACCACCACACAGAATTCTGTAGCTTTGAAGAATGCAGGTTTAATATCCACTTTGAAAAAGAAAACAAATAAGTTTATTTATGCTATACATGATGAAAC',
          'ATCTTATAAAGGAAAAAAAATACCGAAAGACCAAAAATCAGAACTAATTAACTGTTCAGCCCAGTTTGAAGCAAATGCTTTTGAAGCACCACTTACATTT',
          'GCAAATGCTGATTCAG'
        ].join(''),
        ENSE00000939168: [
          'GTTTATTGCATTCTTCTGTGAAAAGAAGCTGTTCACAGAATGATTCTGAAGAACCAACTTTGTCCTTAACTAGCTCTTTTGGGACAATTCTGAGGAAATG',
          'TTCTAGAAATGAAACATGTTCTAATAATACAGTAATCTCTCAGGATCTTGATTATAAAGAAGCAAAATGTAATAAGGAAAAACTACAGTTATTTATTACC',
          'CCAGAAGCTGATTCTCTGTCATGCCTGCAGGAAGGACAGTGTGAAAATGATCCAAAAAGCAAAAAAGTTTCAGATATAAAAGAAGAGGTCTTGGCTGCAG',
          'CATGTCACCCAGTACAACATTCAAAAGTGGAATACAGTGATACTGACTTTCAATCCCAGAAAAGTCTTTTATATGATCATGAAAATGCCAGCACTCTTAT',
          'TTTAACTCCTACTTCCAAGGATGTTCTGTCAAACCTAGTCATGATTTCTAGAGGCAAAGAATCATACAAAATGTCAGACAAGCTCAAAGGTAACAATTAT',
          'GAATCTGATGTTGAATTAACCAAAAATATTCCCATGGAAAAGAATCAAGATGTATGTGCTTTAAATGAAAATTATAAAAACGTTGAGCTGTTGCCACCTG',
          'AAAAATACATGAGAGTAGCATCACCTTCAAGAAAGGTACAATTCAACCAAAACACAAATCTAAGAGTAATCCAAAAAAATCAAGAAGAAACTACTTCAAT',
          'TTCAAAAATAACTGTCAATCCAGACTCTGAAGAACTTTTCTCAGACAATGAGAATAATTTTGTCTTCCAAGTAGCTAATGAAAGGAATAATCTTGCTTTA',
          'GGAAATACTAAGGAACTTCATGAAACAGACTTGACTTGTGTAAACGAACCCATTTTCAAGAACTCTACCATGGTTTTATATGGAGACACAGGTGATAAAC',
          'AAGCAACCCAAGTGTCAATTAAAAAAGATTTGGTTTATGTTCTTGCAGAGGAGAACAAAAATAGTGTAAAGCAGCATATAAAAATGACTCTAGGTCAAGA',
          'TTTAAAATCGGACATCTCCTTGAATATAGATAAAATACCAGAAAAAAATAATGATTACATGAACAAATGGGCAGGACTCTTAGGTCCAATTTCAAATCAC',
          'AGTTTTGGAGGTAGCTTCAGAACAGCTTCAAATAAGGAAATCAAGCTCTCTGAACATAACATTAAGAAGAGCAAAATGTTCTTCAAAGATATTGAAGAAC',
          'AATATCCTACTAGTTTAGCTTGTGTTGAAATTGTAAATACCTTGGCATTAGATAATCAAAAGAAACTGAGCAAGCCTCAGTCAATTAATACTGTATCTGC',
          'ACATTTACAGAGTAGTGTAGTTGTTTCTGATTGTAAAAATAGTCATATAACCCCTCAGATGTTATTTTCCAAGCAGGATTTTAATTCAAACCATAATTTA',
          'ACACCTAGCCAAAAGGCAGAAATTACAGAACTTTCTACTATATTAGAAGAATCAGGAAGTCAGTTTGAATTTACTCAGTTTAGAAAACCAAGCTACATAT',
          'TGCAGAAGAGTACATTTGAAGTGCCTGAAAACCAGATGACTATCTTAAAGACCACTTCTGAGGAATGCAGAGATGCTGATCTTCATGTCATAATGAATGC',
          'CCCATCGATTGGTCAGGTAGACAGCAGCAAGCAATTTGAAGGTACAGTTGAAATTAAACGGAAGTTTGCTGGCCTGTTGAAAAATGACTGTAACAAAAGT',
          'GCTTCTGGTTATTTAACAGATGAAAATGAAGTGGGGTTTAGGGGCTTTTATTCTGCTCATGGCACAAAACTGAATGTTTCTACTGAAGCTCTGCAAAAAG',
          'CTGTGAAACTGTTTAGTGATATTGAGAATATTAGTGAGGAAACTTCTGCAGAGGTACATCCAATAAGTTTATCTTCAAGTAAATGTCATGATTCTGTTGT',
          'TTCAATGTTTAAGATAGAAAATCATAATGATAAAACTGTAAGTGAAAAAAATAATAAATGCCAACTGATATTACAAAATAATATTGAAATGACTACTGGC',
          'ACTTTTGTTGAAGAAATTACTGAAAATTACAAGAGAAATACTGAAAATGAAGATAACAAATATACTGCTGCCAGTAGAAATTCTCATAACTTAGAATTTG',
          'ATGGCAGTGATTCAAGTAAAAATGATACTGTTTGTATTCATAAAGATGAAACGGACTTGCTATTTACTGATCAGCACAACATATGTCTTAAATTATCTGG',
          'CCAGTTTATGAAGGAGGGAAACACTCAGATTAAAGAAGATTTGTCAGATTTAACTTTTTTGGAAGTTGCGAAAGCTCAAGAAGCATGTCATGGTAATACT',
          'TCAAATAAAGAACAGTTAACTGCTACTAAAACGGAGCAAAATATAAAAGATTTTGAGACTTCTGATACATTTTTTCAGACTGCAAGTGGGAAAAATATTA',
          'GTGTCGCCAAAGAGTCATTTAATAAAATTGTAAATTTCTTTGATCAGAAACCAGAAGAATTGCATAACTTTTCCTTAAATTCTGAATTACATTCTGACAT',
          'AAGAAAGAACAAAATGGACATTCTAAGTTATGAGGAAACAGACATAGTTAAACACAAAATACTGAAAGAAAGTGTCCCAGTTGGTACTGGAAATCAACTA',
          'GTGACCTTCCAGGGACAACCCGAACGTGATGAAAAGATCAAAGAACCTACTCTATTGGGTTTTCATACAGCTAGCGGGAAAAAAGTTAAAATTGCAAAGG',
          'AATCTTTGGACAAAGTGAAAAACCTTTTTGATGAAAAAGAGCAAGGTACTAGTGAAATCACCAGTTTTAGCCATCAATGGGCAAAGACCCTAAAGTACAG',
          'AGAGGCCTGTAAAGACCTTGAATTAGCATGTGAGACCATTGAGATCACAGCTGCCCCAAAGTGTAAAGAAATGCAGAATTCTCTCAATAATGATAAAAAC',
          'CTTGTTTCTATTGAGACTGTGGTGCCACCTAAGCTCTTAAGTGATAATTTATGTAGACAAACTGAAAATCTCAAAACATCAAAAAGTATCTTTTTGAAAG',
          'TTAAAGTACATGAAAATGTAGAAAAAGAAACAGCAAAAAGTCCTGCAACTTGTTACACAAATCAGTCCCCTTATTCAGTCATTGAAAATTCAGCCTTAGC',
          'TTTTTACACAAGTTGTAGTAGAAAAACTTCTGTGAGTCAGACTTCATTACTTGAAGCAAAAAAATGGCTTAGAGAAGGAATATTTGATGGTCAACCAGAA',
          'AGAATAAATACTGCAGATTATGTAGGAAATTATTTGTATGAAAATAATTCAAACAGTACTATAGCTGAAAATGACAAAAATCATCTCTCCGAAAAACAAG',
          'ATACTTATTTAAGTAACAGTAGCATGTCTAACAGCTATTCCTACCATTCTGATGAGGTATATAATGATTCAGGATATCTCTCAAAAAATAAACTTGATTC',
          'TGGTATTGAGCCAGTATTGAAGAATGTTGAAGATCAAAAAAACACTAGTTTTTCCAAAGTAATATCCAATGTAAAAGATGCAAATGCATACCCACAAACT',
          'GTAAATGAAGATATTTGCGTTGAGGAACTTGTGACTAGCTCTTCACCCTGCAAAAATAAAAATGCAGCCATTAAATTGTCCATATCTAATAGTAATAATT',
          'TTGAGGTAGGGCCACCTGCATTTAGGATAGCCAGTGGTAAAATCGTTTGTGTTTCACATGAAACAATTAAAAAAGTGAAAGACATATTTACAGACAGTTT',
          'CAGTAAAGTAATTAAGGAAAACAACGAGAATAAATCAAAAATTTGCCAAACGAAAATTATGGCAGGTTGTTACGAGGCATTGGATGATTCAGAGGATATT',
          'CTTCATAACTCTCTAGATAATGATGAATGTAGCACGCATTCACATAAGGTTTTTGCTGACATTCAGAGTGAAGAAATTTTACAACATAACCAAAATATGT',
          'CTGGATTGGAGAAAGTTTCTAAAATATCACCTTGTGATGTTAGTTTGGAAACTTCAGATATATGTAAATGTAGTATAGGGAAGCTTCATAAGTCAGTCTC',
          'ATCTGCAAATACTTGTGGGATTTTTAGCACAGCAAGTGGAAAATCTGTCCAGGTATCAGATGCTTCATTACAAAACGCAAGACAAGTGTTTTCTGAAATA',
          'GAAGATAGTACCAAGCAAGTCTTTTCCAAAGTATTGTTTAAAAGTAACGAACATTCAGACCAGCTCACAAGAGAAGAAAATACTGCTATACGTACTCCAG',
          'AACATTTAATATCCCAAAAAGGCTTTTCATATAATGTGGTAAATTCATCTGCTTTCTCTGGATTTAGTACAGCAAGTGGAAAGCAAGTTTCCATTTTAGA',
          'AAGTTCCTTACACAAAGTTAAGGGAGTGTTAGAGGAATTTGATTTAATCAGAACTGAGCATAGTCTTCACTATTCACCTACGTCTAGACAAAATGTATCA',
          'AAAATACTTCCTCGTGTTGATAAGAGAAACCCAGAGCACTGTGTAAACTCAGAAATGGAAAAAACCTGCAGTAAAGAATTTAAATTATCAAATAACTTAA',
          'ATGTTGAAGGTGGTTCTTCAGAAAATAATCACTCTATTAAAGTTTCTCCATATCTCTCTCAATTTCAACAAGACAAACAACAGTTGGTATTAGGAACCAA',
          'AGTGTCACTTGTTGAGAACATTCATGTTTTGGGAAAAGAACAGGCTTCACCTAAAAACGTAAAAATGGAAATTGGTAAAACTGAAACTTTTTCTGATGTT',
          'CCTGTGAAAACAAATATAGAAGTTTGTTCTACTTACTCCAAAGATTCAGAAAACTACTTTGAAACAGAAGCAGTAGAAATTGCTAAAGCTTTTATGGAAG',
          'ATGATGAACTGACAGATTCTAAACTGCCAAGTCATGCCACACATTCTCTTTTTACATGTCCCGAAAATGAGGAAATGGTTTTGTCAAATTCAAGAATTGG',
          'AAAAAGAAGAGGAGAGCCCCTTATCTTAGTGG'
        ].join(''),
        ENSE00000939169: 'GAGAACCCTCAATCAAAAGAAACTTATTAAATGAATTTGACAGGATAATAGAAAATCAAGAAAAATCCTTAAAGGCTTCAAAAAGCACTCCAGATG',
        ENSE00000939171: 'GCACAATAAAAGATCGAAGATTGTTTATGCATCATGTTTCTTTAGAGCCGATTACCTGTGTACCCTTTCG',
        ENSE00000939173: [
          'CACAACTAAGGAACGTCAAGAGATACAGAATCCAAATTTTACCGCACCTGGTCAAGAATTTCTGTCTAAATCTCATTTGTATGAACATCTGACTTTGGAA',
          'AAATCTTCAAGCAATTTAGCAGTTTCAGGACATCCATTTTATCAAGTTTCTGCTACAAGAAATGAAAAAATGAGACACTTGATTACTACAGGCAGACCAA',
          'CCAAAGTCTTTGTTCCACCTTTTAAAACTAAATCACATTTTCACAGAGTTGAACAGTGTGTTAGGAATATTAACTTGGAGGAAAACAGACAAAAGCAAAA',
          'CATTGATGGACATGGCTCTGATGATAGTAAAAATAAGATTAATGACAATGAGATTCATCAGTTTAACAAAAACAACTCCAATCAAGCAGTAGCTGTAACT',
          'TTCACAAAGTGTGAAGAAGAACCTTTAG'
        ].join(''),
        ENSE00000939174: [
          'ATTTAATTACAAGTCTTCAGAATGCCAGAGATATACAGGATATGCGAATTAAGAAGAAACAAAGGCAACGCGTCTTTCCACAGCCAGGCAGTCTGTATCT',
          'TGCAAAAACATCCACTCTGCCTCGAATCTCTCTGAAAGCAGCAGTAGGAGGCCAAGTTCCCTCTGCGTGTTCTCATAAACAG'
        ].join(''),
        ENSE00000939175: [
          'CTGTATACGTATGGCGTTTCTAAACATTGCATAAAAATTAACAGCAAAAATGCAGAGTCTTTTCAGTTTCACACTGAAGATTATTTTGGTAAGGAAAGTT',
          'TATGGACTGGAAAAGGAATACAGTTGGCTGATGGTGGATGGCTCATACCCTCCAATGATGGAAAGGCTGGAAAAGAAGAATTTTATAG'
        ].join(''),
        ENSE00001394102: [
          'GGCTCTGTGTGACACTCCAGGTGTGGATCCAAAGCTTATTTCTAGAATTTGGGTTTATAATCACTATAGATGGATCATATGGAAACTGGCAGCTATGGAA',
          'TGTGCCTTTCCTAAGGAATTTGCTAATAGATGCCTAAGCCCAGAAAGGGTGCTTCTTCAACTAAAATACAG'
        ].join(''),
        ENSE00000939177: [
          'ATATGATACGGAAATTGATAGAAGCAGAAGATCGGCTATAAAAAAGATAATGGAAAGGGATGACACAGCTGCAAAAACACTTGTTCTCTGTGTTTCTGAC',
          'ATAATTTCATTGAGCGCAAATATATCTGAAACTTCTAGCAATAAAACTAGTAGTGCAGATACCCAAAAAGTGGCCATTATTGAACTTACAGATGGGTGGT',
          'ATGCTGTTAAGGCCCAGTTAGATCCTCCCCTCTTAGCTGTCTTAAAGAATGGCAGACTGACAGTTGGTCAGAAGATTATTCTTCATGGAGCAGAACTGGT',
          'GGGCTCTCCTGATGCCTGTACACCTCTTGAAGCCCCAGAATCTCTTATGTTAAAG'
        ].join(''),
        ENSE00000939178: [
          'ATTTCTGCTAACAGTACTCGGCCTGCTCGCTGGTATACCAAACTTGGATTCTTTCCTGACCCTAGACCTTTTCCTCTGCCCTTATCATCGCTTTTCAGTG',
          'ATGGAGGAAATGTTGGTTGTGTTGATGTAATTATTCAAAGAGCATACCCTATACAG'
        ].join(''),
        ENSE00000939180: [
          'TGGATGGAGAAGACATCATCTGGATTATACATATTTCGCAATGAAAGAGAGGAAGAAAAGGAAGCAGCAAAATATGTGGAGGCCCAACAAAAGAGACTAG',
          'AAGCCTTATTCACTAAAATTCAGGAGGAATTTGAAGAACATGAAG'
        ].join(''),
        ENSE00003461148: [
          'AAAACACAACAAAACCATATTTACCATCACGTGCACTAACAAGACAGCAAGTTCGTGCTTTGCAAGATGGTGCAGAGCTTTATGAAGCAGTGAAGAATGC',
          'AGCAGACCCAGCTTACCTTGAG'
        ].join(''),
        ENSE00000939183: [
          'GGTTATTTCAGTGAAGAGCAGTTAAGAGCCTTGAATAATCACAGGCAAATGTTGAATGATAAGAAACAAGCTCAGATCCAGTTGGAAATTAGGAAGGCCA',
          'TGGAATCTGCTGAACAAAAGGAACAAGGTTTATCAAGGGATGTCACAACCGTGTGGAAGTTGCGTATTGTAAGCTATTCAAAAAAAGAAAAAGATTCAG'
        ].join(''),
        ENSE00000939185: [
          'TTATACTGAGTATTTGGCGTCCATCATCAGATTTATATTCTCTGTTAACAGAAGGAAAGAGATACAGAATTTATCATCTTGCAACTTCAAAATCTAAAAG',
          'TAAATCTGAAAGAGCTAACATACAGTTAGCAGCGACAAAAAAAACTCAGTATCAACAACTACCG'
        ].join(''),
        ENSE00000939187: [
          'GTTTCAGATGAAATTTTATTTCAGATTTACCAGCCACGGGAGCCCCTTCACTTCAGCAAATTTTTAGATCCAGACTTTCAGCCATCTTGTTCTGAGGTGG',
          'ACCTAATAGGATTTGTCGTTTCTGTTGTGAAAAAAACAG'
        ].join(''),
        ENSE00000939189: [
          'GACTTGCCCCTTTCGTCTATTTGTCAGACGAATGTTACAATTTACTGGCAATAAAGTTTTGGATAGACCTTAATGAGGACATTATTAAGCCTCATATGTT',
          'AATTGCTGCAAGCAACCTCCAGTGGCGACCAGAATCCAAATCAGGCCTTCTTACTTTATTTGCTGGAGATTTTTCTGTGTTTTCTGCTAGTCCAAAAGAG',
          'GGCCACTTTCAAGAGACATTCAACAAAATGAAAAATACTGTTGAG'
        ].join(''),
        ENSE00003560258: [
          'AATATTGACATACTTTGCAATGAAGCAGAAAACAAGCTTATGCATATACTGCATGCAAATGATCCCAAGTGGTCCACCCCAACTAAAGACTGTACTTCAG',
          'GGCCGTACACTGCTCAAATCATTCCTGGTACAGGAAACAAGCTTCTG'
        ].join(''),
        ENSE00003717596: [
          'ATGTCTTCTCCTAATTGTGAGATATATTATCAAAGTCCTTTATCACTTTGTATGGCCAAAAGGAAGTCTGTTTCCACACCTGTCTCAGCCCAGATGACTT',
          'CAAAGTCTTGTAAAGGGGAGAAAGAGATTGATGACCAAAAGAACTGCAAAAAGAGAAGAGCCTTGGATTTCTTGAGTAGACTGCCTTTACCTCCACCTGT',
          'TAGTCCCATTTGTACATTTGTTTCTCCGGCTGCACAGAAGGCATTTCAGCCACCAAGGAGTTGTGGCACCAAATACGAAACACCCATAAAGAAAAAAGAA',
          'CTGAATTCTCCTCAGATGACTCCATTTAAAAAATTCAATGAAATTTCTCTTTTGGAAAGTAATTCAATAGCTGACGAAGAACTTGCATTGATAAATACCC',
          'AAGCTCTTTTGTCTGGTTCAACAGGAGAAAAACAATTTATATCTGTCAGTGAATCCACTAGGACTGCTCCCACCAGTTCAGAAGATTATCTCAGACTGAA',
          'ACGACGTTGTACTACATCTCTGATCAAAGAACAGGAGAGTTCCCAGGCCAGTACGGAAGAATGTGAGAAAAATAAGCAGGACACAATTACAACTAAAAAA',
          'TATATCTAAGCATTTGCAAAGGCGACAATAAATTATTGACGCTTAACCTTTCCAGTTTATAAGACTGGAATATAATTTCAAACCACACATTAGTACTTAT',
          'GTTGCACAATGAGAAAAGAAATTAGTTTCAAATTTACCTCAGCGTTTGTGTATCGGGCAAAAATCGTTTTGCCCGATTCCGTATTGGTATACTTTTGCTT',
          'CAGTTGCATATCTTAAAACTAAATGTAATTTATTAACTAATCAAGAAAAACATCTTTGGCTGAGCTCGGTGGCTCATGCCTGTAATCCCAACACTTTGAG',
          'AAGCTGAGGTGGGAGGAGTGCTTGAGGCCAGGAGTTCAAGACCAGCCTGGGCAACATAGGGAGACCCCCATCTTTACAAAGAAAAAAAAAAGGGGAAAAG',
          'AAAATCTTTTAAATCTTTGGATTTGATCACTACAAGTATTATTTTACAAGTGAAATAAACATACCATTTTCTTTTAGATTGTGTCATTAAATGGAATGAG',
          'GTCTCTTAGTACAGTTATTTTGATGCAGATAATTCCTTTTAGTTTAGCTACTATTTTAGGGGATTTTTTTTAGAGGTAACTCACTATGAAATAGTTCTCC',
          'TTAATGCAAATATGTTGGTTCTGCTATAGTTCCATCCTGTTCAAAAGTCAGGATGAATATGAAGAGTGGTGTTTCCTTTTGAGCAATTCTTCATCCTTAA',
          'GTCAGCATGATTATAAGAAAAATAGAACCCTCAGTGTAACTCTAATTCCTTTTTACTATTCCAGTGTGATCTCTGAAATTAAATTACTTCAACTAAAAAT',
          'TCAAATACTTTAAATCAGAAGATTTCATAGTTAATTTATTTTTTTTTTCAACAAAATGGTCATCCAAACTCAAACTTGAGAAAATATCTTGCTTTCAAAT',
          'TGGCACTGATTCTGCCTGCTTTATTTTTAGCGCTATCACAGGACCCAGAGCCTATGCCCTTTTAAACTTACCACAAAAGCAGAAGATTAATTCAATTTAA',
          'GATGATACTCTCATTTGTTACGTCCTTTTTTTTTTTTTTTGGAGATGGAGTCTTGCTTTGTCGCCCATGCTGGAGTGCAGTGGCATGATCCTGGCTCACT',
          'GCAGCCTCCACTTCCCGGGTTCACGTAATTCTCCCACCTCAAGCCTCCCTAGTAGCTGGGATTACAGGGACGCACCACCATGCCCAGCTAATTTTTGCAT',
          'TTTTAGTAGAGACTGGGTTTTACCATGTTGGCCAAGCTGGTCTCAAACTCCTGATGTCAGGTGATCCATCTGCCTCAGCCTCCCAAAGTGCTGGGATTAT',
          'AGGCGTGAGCCACTGTGCCCGGCCAATATTTGTTACTTTCTTAGGTTTAATAGAGAAAAGGGATAAAACATTTCTAACTGGGAGTTAATTGCATGGAGAA',
          'GGTCTTAAATCAGATGTTTTAATGCCTTAAATGTCTGTATAATATCATGTTTTCAAATCTAATTATAAATACGTTTAAAGCCAAGAATAAATCTTTTAAA',
          'AAATTGA'
        ].join('')
      };

      const exonRows = [
        { order: 1, exonId: 'ENSE00004011581', location: '1-160', phase: '-1 / -1', utrs: "5' UTR 160 bp", variants: 127 },
        { order: 2, exonId: 'ENSE00001484009', location: '915-1020', phase: '-1 / 1', utrs: "5' UTR 39 bp", variants: 147 },
        { order: 3, exonId: 'ENSE00003666217', location: '3570-3818', phase: '1 / 1', utrs: 'None', variants: 370 },
        { order: 4, exonId: 'ENSE00003659301', location: '9569-9677', phase: '1 / 2', utrs: 'None', variants: 131 },
        { order: 5, exonId: 'ENSE00003739878', location: '10594-10643', phase: '2 / 1', utrs: 'None', variants: 88 },
        { order: 6, exonId: 'ENSE00003747332', location: '10735-10775', phase: '1 / 0', utrs: 'None', variants: 64 },
        { order: 7, exonId: 'ENSE00003749714', location: '10992-11106', phase: '0 / 1', utrs: 'None', variants: 183 },
        { order: 8, exonId: 'ENSE00003714754', location: '13936-13985', phase: '1 / 0', utrs: 'None', variants: 71 },
        { order: 9, exonId: 'ENSE00003731761', location: '15412-15523', phase: '0 / 1', utrs: 'None', variants: 182 },
        { order: 10, exonId: 'ENSE00000939167', location: '16765-17880', phase: '1 / 1', utrs: 'None', variants: 1586 },
        { order: 11, exonId: 'ENSE00000939168', location: '20758-25689', phase: '1 / 1', utrs: 'None', variants: 7275 },
        { order: 12, exonId: 'ENSE00000939169', location: '29051-29146', phase: '1 / 1', utrs: 'None', variants: 116 },
        { order: 13, exonId: 'ENSE00000939171', location: '31320-31389', phase: '1 / 2', utrs: 'None', variants: 114 },
        { order: 14, exonId: 'ENSE00000939173', location: '39354-39781', phase: '2 / 1', utrs: 'None', variants: 591 },
        { order: 15, exonId: 'ENSE00000939174', location: '40921-41102', phase: '1 / 0', utrs: 'None', variants: 271 },
        { order: 16, exonId: 'ENSE00000939175', location: '42235-42422', phase: '0 / 2', utrs: 'None', variants: 266 },
        { order: 17, exonId: 'ENSE00001394102', location: '47016-47186', phase: '2 / 2', utrs: 'None', variants: 258 },
        { order: 18, exonId: 'ENSE00000939177', location: '47672-48026', phase: '2 / 0', utrs: 'None', variants: 558 },
        { order: 19, exonId: 'ENSE00000939178', location: '54895-55050', phase: '0 / 0', utrs: 'None', variants: 241 },
        { order: 20, exonId: 'ENSE00000939180', location: '55449-55593', phase: '0 / 1', utrs: 'None', variants: 204 },
        { order: 21, exonId: 'ENSE00003461148', location: '61163-61284', phase: '1 / 0', utrs: 'None', variants: 181 },
        { order: 22, exonId: 'ENSE00000939183', location: '63810-64008', phase: '0 / 1', utrs: 'None', variants: 286 },
        { order: 23, exonId: 'ENSE00000939185', location: '64243-64406', phase: '1 / 0', utrs: 'None', variants: 294 },
        { order: 24, exonId: 'ENSE00000939187', location: '64500-64638', phase: '0 / 1', utrs: 'None', variants: 196 },
        { order: 25, exonId: 'ENSE00000939189', location: '79182-79426', phase: '1 / 0', utrs: 'None', variants: 381 },
        { order: 26, exonId: 'ENSE00003560258', location: '81391-81537', phase: '0 / 0', utrs: 'None', variants: 175 },
        { order: 27, exonId: 'ENSE00003717596', location: '82655-84761', phase: '0 / -1', utrs: "3' UTR 1498 bp", variants: 1446 }
      ];

      const exonRowsWithSequence = exonRows.map((row) => {
        const sequence = exonSequences[row.exonId] ?? '';
        const [start, end] = row.location.split('-').map(Number);

        return {
          order: row.order,
          exonId: row.exonId,
          location: row.location,
          phase: row.phase,
          exonLength: sequence.length || end - start + 1,
          sequence
        };
      });

      const sequencePreviewLength = 15;

      tableBody.innerHTML = exonRowsWithSequence
        .map(
          (row) => `
            <tr>
              <td>${row.order}</td>
              <td>${row.exonId}</td>
              <td>${row.location}</td>
              <td>${row.phase}</td>
              <td>${row.exonLength}</td>
              <td>
                <span
                  data-snapshot-section="transcript-exons-sequence"
                  title="${row.sequence}"
                  aria-label="${row.sequence}"
                >${row.sequence.slice(0, sequencePreviewLength)}</span>
              </td>
            </tr>
          `
        )
        .join('');
    })();
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