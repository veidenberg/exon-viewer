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
  const sequenceLegendView = 'sequence-legend';
  const state = {
    view: defaultView
  };

  const normalizeView = (view) => {
    if (view === externalReferencesView || view === sequenceLegendView) {
      return view;
    }

    return defaultView;
  };

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
  const sequenceView = 'sequence';
  const state = {
    view: defaultView
  };

  const normalizeView = (view) => {
    if (
      view === proteinView ||
      view === exonsView ||
      view === sequenceView
    ) {
      return view;
    }

    return defaultView;
  };

  const getViewFromUrl = () => {
    const url = new URL(window.location.href);

    return normalizeView(url.searchParams.get('view'));
  };

  const updateUrl = (view, { replace = false } = {}) => {
    const url = new URL(window.location.href);

    if (
      view === proteinView ||
      view === exonsView ||
      view === sequenceView
    ) {
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

    document
      .querySelectorAll('[data-sequence-map-overlay="primary"]')
      .forEach((overlay) => {
        overlay.style.opacity = state.view === sequenceView ? '1' : '0';
        overlay.style.pointerEvents =
          state.view === sequenceView ? 'auto' : 'none';
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
          start,
          end,
          phase: row.phase,
          utrs: row.utrs,
          variants: row.variants,
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

      const legendList = document.querySelector(
        '[data-snapshot-section="sequence-legend-list"]'
      );
      const sequenceList = document.querySelector(
        '[data-snapshot-section="transcript-sequence-list"]'
      );
      const sequenceViewport = document.querySelector(
        '[data-snapshot-section="transcript-sequence-viewport"]'
      );
      const sequenceMapSvg = document.querySelector(
        '[data-snapshot-section="transcript-sequence-map-svg"]'
      );
      const primarySequenceMapSvg = document.querySelector(
        '[data-snapshot-section="transcript-content"] .svg__GeneOverviewImage__v0BUT'
      );
      const sequenceActiveLocation = document.querySelector(
        '[data-snapshot-section="transcript-sequence-active-location"]'
      );
      const intronToggle = document.querySelector(
        '[data-snapshot-action="toggle-sequence-introns"]'
      );
      const sequenceViewButton = tabContainer.querySelector(
        '[data-transcript-view-trigger="sequence"]'
      );

      const escapeHtml = (value) =>
        String(value)
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll('"', '&quot;')
          .replaceAll("'", '&#39;');

      const clamp = (value, min, max) =>
        Math.min(max, Math.max(min, value));

      const createCoordinateScale = (rangeStart, rangeEnd) => {
        const totalSpan = Math.max(
          sequenceState.totalRangeEnd - sequenceState.totalRangeStart,
          1
        );
        const span = rangeEnd - rangeStart;

        return (coordinate) =>
          rangeStart +
          ((coordinate - sequenceState.totalRangeStart) / totalSpan) * span;
      };

      const formatBp = (value) =>
        `${Math.round(value).toLocaleString('en-US')} bp`;

      const createSvgElement = (tagName) =>
        document.createElementNS('http://www.w3.org/2000/svg', tagName);

      const liveExonSequenceTypeCodes =
        window.liveExonSequenceTypeCodes || {};
      const liveExonSequenceRanges = window.liveExonSequenceRanges || {};

      const legendItems = [
        {
          key: 'flanking-sequence',
          label: 'Flanking sequence',
          description: 'Sequence shown immediately outside the transcript bounds.'
        },
        {
          key: 'intron-sequence',
          label: 'Intron sequence',
          description: 'Intronic sequence rendered in lowercase between exons.'
        },
        {
          key: 'utr',
          label: 'UTR',
          description: 'Untranslated sequence annotated as UTR on the live transcript.'
        },
        {
          key: 'five-prime-utr',
          label: "5' UTR",
          description: '5 prime untranslated sequence highlighted on the transcript exons view.'
        },
        {
          key: 'three-prime-utr',
          label: "3' UTR",
          description: '3 prime untranslated sequence highlighted on the transcript exons view.'
        },
        {
          key: 'coding-sequence',
          label: 'Coding sequence',
          description: 'Coding bases without an additional variant-consequence highlight.'
        },
        {
          key: 'translated-sequence',
          label: 'Translated sequence',
          description: 'Translated sequence styling carried over from the live Ensembl view.'
        },
        {
          key: 'missense-or-start-lost',
          label: 'Missense / start lost',
          description: 'Live Ensembl uses the same highlight for missense and start-lost consequences.'
        },
        {
          key: 'frameshift',
          label: 'Frameshift',
          description: 'Frameshift consequence from the live transcript annotation.'
        },
        {
          key: 'synonymous',
          label: 'Synonymous',
          description: 'Coding change without amino-acid substitution.'
        },
        {
          key: 'splice-acceptor-or-donor',
          label: 'Splice acceptor / donor',
          description: 'Live Ensembl uses the same highlight for splice acceptor and donor consequences.'
        },
        {
          key: 'splice-region',
          label: 'Splice region',
          description: 'Variant consequence near a splice junction.'
        },
        {
          key: 'stop-gained-or-stop-lost',
          label: 'Stop gained / stop lost',
          description: 'Live Ensembl uses the same highlight for stop gained and stop lost consequences.'
        },
        {
          key: 'inframe-indel',
          label: 'Inframe deletion / insertion',
          description: 'Inframe indel consequence using the live transcript highlight.'
        },
        {
          key: 'protein-altering-variant',
          label: 'Protein altering variant',
          description: 'Protein-altering consequence highlighted on the live transcript.'
        }
      ];
      const sequenceAnnotationLabels = Object.fromEntries(
        legendItems.map((item) => [item.key, item.label])
      );
      const getSequenceAnnotationLabel = (type) =>
        sequenceAnnotationLabels[type] ||
        type
          .split('-')
          .map((part) =>
            part.length ? part.charAt(0).toUpperCase() + part.slice(1) : part
          )
          .join(' ');

      if (legendList) {
        legendList.innerHTML = legendItems
          .map(
            (item) => `
              <div data-snapshot-section="sequence-legend-item">
                <span
                  data-snapshot-section="sequence-legend-swatch"
                  data-sequence-annotation="${item.key}"
                  aria-hidden="true"
                ></span>
                <div data-snapshot-section="sequence-legend-copy">
                  <div data-snapshot-section="sequence-legend-label">${item.label}</div>
                  <div data-snapshot-section="sequence-legend-description">${item.description}</div>
                </div>
              </div>
            `
          )
          .join('');
      }

      if (
        !sequenceList ||
        !sequenceViewport ||
        !sequenceMapSvg ||
        !sequenceActiveLocation ||
        !intronToggle
      ) {
        return;
      }

      const upstreamFlankSequence =
        'ttgctcttgagttttccctgagtagtagtctccagttcatttgccagtgagaagatag';
      const downstreamFlankSequence =
        'ttttgttttttatttatgttgttttcctgagacagagtctcactctgtcacccaggct';
      const sequenceState = {
        showIntrons: Boolean(intronToggle.checked),
        segments: [],
        segmentElements: [],
        segmentsById: new Map(),
        mapInstances: [],
        activeSegmentId: null,
        syncFrame: 0,
        targetTimeout: 0,
        targetSegmentId: null,
        totalRangeStart: 0,
        totalRangeEnd: 0
      };

      const firstExon = exonRowsWithSequence[0];
      const lastExon = exonRowsWithSequence[exonRowsWithSequence.length - 1];

      const parseUtrLength = (utrs) => {
        const match = typeof utrs === 'string' ? utrs.match(/(\d+) bp/) : null;

        return match ? Number(match[1]) : 0;
      };

      const normalizeAnnotations = (sequenceLength, annotations) => {
        const normalized = [];

        annotations
          .slice()
          .sort((first, second) => first.start - second.start)
          .forEach((annotation) => {
            const start = clamp(annotation.start, 1, sequenceLength);
            const end = clamp(annotation.end, start, sequenceLength);
            const previous = normalized[normalized.length - 1];

            if (previous && start <= previous.end) {
              return;
            }

            normalized.push({
              start,
              end,
              type: annotation.type
            });
          });

        return normalized;
      };

      const buildSequenceParts = (sequence, baseType, annotations) => {
        const parts = [];
        let cursor = 1;

        annotations.forEach((annotation) => {
          if (annotation.start > cursor) {
            parts.push({
              type: baseType,
              text: sequence.slice(cursor - 1, annotation.start - 1)
            });
          }

          parts.push({
            type: annotation.type,
            text: sequence.slice(annotation.start - 1, annotation.end)
          });
          cursor = annotation.end + 1;
        });

        if (cursor <= sequence.length) {
          parts.push({
            type: baseType,
            text: sequence.slice(cursor - 1)
          });
        }

        return parts.filter((part) => part.text);
      };

      const renderSequenceParts = (parts) =>
        parts
          .map((part) => {
            const label = getSequenceAnnotationLabel(part.type);

            return `<span data-sequence-annotation="${part.type}" title="${escapeHtml(
              label
            )}">${escapeHtml(part.text)}</span>`;
          })
          .join('');

      const buildIntronSequence = (length, index) => {
        const donorMotifs = ['gtaagt', 'gtgagt', 'gtatgt'];
        const acceptorMotifs = ['tttcag', 'ctgcag', 'ttacag'];
        const fillerMotifs = [
          'ctttgacatgct',
          'ttgagaaacctg',
          'gttttctctgcc',
          'catttgttcaaa'
        ];

        const donor = donorMotifs[index % donorMotifs.length];
        const acceptor = acceptorMotifs[index % acceptorMotifs.length];
        const filler = fillerMotifs[index % fillerMotifs.length];
        const repeatCount = Math.max(1, Math.min(4, Math.round(length / 800)));
        const repeated = filler.repeat(repeatCount + 1);

        return `${donor}${repeated.slice(0, 12)}...${repeated.slice(-10)}${acceptor}`;
      };

      const getDefaultExonSequenceType = (row) => {
        const utrLength = parseUtrLength(row.utrs);

        if (row.utrs.startsWith("5' UTR") && utrLength >= row.sequence.length) {
          return 'five-prime-utr';
        }

        if (row.utrs.startsWith("3' UTR") && utrLength >= row.sequence.length) {
          return 'three-prime-utr';
        }

        return 'coding-sequence';
      };

      const resolveLiveSequenceType = (row, code) => {
        const type = liveExonSequenceTypeCodes[code] || code;

        if (type !== 'utr-highlight') {
          return type;
        }

        if (row.utrs.startsWith("5' UTR")) {
          return 'five-prime-utr';
        }

        if (row.utrs.startsWith("3' UTR")) {
          return 'three-prime-utr';
        }

        return 'utr';
      };

      const buildExonAnnotations = (row) => {
        const liveAnnotations = Array.isArray(liveExonSequenceRanges[row.exonId])
          ? liveExonSequenceRanges[row.exonId].map(([start, end, code]) => ({
              start,
              end,
              type: resolveLiveSequenceType(row, code)
            }))
          : [];

        if (liveAnnotations.length) {
          return normalizeAnnotations(row.sequence.length, liveAnnotations);
        }

        const annotations = [];
        const utrLength = parseUtrLength(row.utrs);

        if (row.utrs.startsWith("5' UTR")) {
          annotations.push({
            start: 1,
            end: Math.min(utrLength || row.sequence.length, row.sequence.length),
            type: 'five-prime-utr'
          });
        }

        if (row.utrs.startsWith("3' UTR")) {
          annotations.push({
            start: Math.max(row.sequence.length - utrLength + 1, 1),
            end: row.sequence.length,
            type: 'three-prime-utr'
          });
        }

        return normalizeAnnotations(row.sequence.length, annotations);
      };

      const buildSequenceSegments = () => {
        const segments = [
          {
            id: 'segment-upstream-flank',
            kind: 'flank',
            label: 'Upstream flank',
            subtitle: `${upstreamFlankSequence.length} bp shown before exon 1`,
            location: `${Math.max(firstExon.start - upstreamFlankSequence.length, 1)}-${firstExon.start - 1}`,
            mapStart: Math.max(firstExon.start - upstreamFlankSequence.length, 1),
            mapEnd: firstExon.start - 1,
            parts: buildSequenceParts(upstreamFlankSequence, 'flanking-sequence', [])
          }
        ];

        exonRowsWithSequence.forEach((row, index) => {
          segments.push({
            id: `segment-exon-${row.order}`,
            kind: 'exon',
            exonId: row.exonId,
            order: row.order,
            label: `Exon ${row.order}`,
            subtitle: `${row.exonId} · ${row.location} · ${formatBp(
              row.exonLength
            )}`,
            detail: row.utrs !== 'None' ? row.utrs : 'Coding sequence',
            location: row.location,
            mapStart: row.start,
            mapEnd: row.end,
            parts: buildSequenceParts(
              row.sequence,
              getDefaultExonSequenceType(row),
              buildExonAnnotations(row)
            )
          });

          const nextRow = exonRowsWithSequence[index + 1];

          if (!nextRow) {
            return;
          }

          const intronLength = Math.max(nextRow.start - row.end - 1, 0);
          const intronSequence = buildIntronSequence(intronLength, index);

          segments.push({
            id: `segment-intron-${row.order}-${nextRow.order}`,
            kind: 'intron',
            label: `Intron ${row.order}-${nextRow.order}`,
            subtitle: `${formatBp(intronLength)} between exon ${row.order} and exon ${nextRow.order}`,
            detail: 'Intron sequence',
            location: `${row.end + 1}-${nextRow.start - 1}`,
            mapStart: row.end + 1,
            mapEnd: nextRow.start - 1,
            parts: buildSequenceParts(intronSequence, 'intron-sequence', [])
          });
        });

        segments.push({
          id: 'segment-downstream-flank',
          kind: 'flank',
          label: 'Downstream flank',
          subtitle: `${downstreamFlankSequence.length} bp shown after exon 27`,
          location: `${lastExon.end + 1}-${lastExon.end + downstreamFlankSequence.length}`,
          mapStart: lastExon.end + 1,
          mapEnd: lastExon.end + downstreamFlankSequence.length,
          parts: buildSequenceParts(
            downstreamFlankSequence,
            'flanking-sequence',
            []
          )
        });

        return segments;
      };

      const allSequenceSegments = buildSequenceSegments();
      const exonSegments = allSequenceSegments.filter(
        (segment) => segment.kind === 'exon'
      );

      sequenceState.totalRangeStart = allSequenceSegments[0].mapStart;
      sequenceState.totalRangeEnd =
        allSequenceSegments[allSequenceSegments.length - 1].mapEnd;

      const defaultMapScale = createCoordinateScale(10, 685);
      const primaryMapRange = (() => {
        if (!primarySequenceMapSvg) {
          return null;
        }

        const baseRects = Array.from(
          primarySequenceMapSvg.querySelectorAll(
            '.transcript__GeneOverviewImage__v0BUT rect[y="0"]'
          )
        );

        if (!baseRects.length) {
          return null;
        }

        const minX = Math.min(
          ...baseRects.map((rect) => Number(rect.getAttribute('x') || 0))
        );
        const maxX = Math.max(
          ...baseRects.map(
            (rect) =>
              Number(rect.getAttribute('x') || 0) +
              Number(rect.getAttribute('width') || 0)
          )
        );

        return {
          start: minX,
          end: maxX
        };
      })();

      const renderSequenceSegments = () => {
        const segments = sequenceState.showIntrons
          ? allSequenceSegments
          : allSequenceSegments.filter((segment) => segment.kind !== 'intron');

        sequenceState.segments = segments;
        sequenceState.segmentsById = new Map(
          segments.map((segment) => [segment.id, segment])
        );

        sequenceList.innerHTML = segments
          .map(
            (segment) =>
              `<span id="${segment.id}" data-sequence-segment="${segment.id}" data-sequence-segment-kind="${segment.kind}"><span data-sequence-segment-sequence>${renderSequenceParts(
                segment.parts
              )}</span></span>`
          )
          .join('');

        sequenceState.segmentElements = Array.from(
          sequenceList.querySelectorAll('[data-sequence-segment]')
        );
      };

      const updateSegmentStates = () => {
        sequenceState.segmentElements.forEach((element) => {
          const segmentId = element.dataset.sequenceSegment;
          const isActive = segmentId === sequenceState.activeSegmentId;
          const isTargeted = segmentId === sequenceState.targetSegmentId;

          element.toggleAttribute('data-sequence-active', isActive);
          element.toggleAttribute('data-sequence-targeted', isTargeted);
        });

        sequenceState.mapInstances.forEach((instance) => {
          instance.rectsBySegmentId.forEach((rect, segmentId) => {
            rect.dataset.sequenceMapState =
              segmentId === sequenceState.activeSegmentId ? 'active' : 'idle';
          });
        });
      };

      const updateOverviewLocation = (segment, coordinate) => {
        if (!segment) {
          return;
        }

        sequenceState.activeSegmentId = segment.id;
        updateSegmentStates();

        const coordinateLabel = Math.round(coordinate).toLocaleString('en-US');

        sequenceActiveLocation.textContent = `${segment.label} · ${coordinateLabel} bp`;

        const totalSpan = Math.max(
          sequenceState.totalRangeEnd - sequenceState.totalRangeStart,
          1
        );
        const windowWidth = Math.max(
          totalSpan * (sequenceViewport.clientHeight / Math.max(sequenceViewport.scrollHeight, 1)),
          600
        );
        const windowStart = clamp(
          coordinate - windowWidth / 2,
          sequenceState.totalRangeStart,
          sequenceState.totalRangeEnd - windowWidth
        );
        const windowEnd = Math.min(
          windowStart + windowWidth,
          sequenceState.totalRangeEnd
        );

        sequenceState.mapInstances.forEach((instance) => {
          const markerX = instance.scale(coordinate);
          instance.marker.setAttribute('x1', String(markerX));
          instance.marker.setAttribute('x2', String(markerX));
          instance.window.setAttribute('x', String(instance.scale(windowStart)));
          instance.window.setAttribute(
            'width',
            String(
              Math.max(instance.scale(windowEnd) - instance.scale(windowStart), 10)
            )
          );
        });
      };

      const syncSequenceOverviewToScroll = () => {
        const viewportRect = sequenceViewport.getBoundingClientRect();
        const viewportAnchor = viewportRect.top + 2;

        if (!sequenceState.segmentElements.length) {
          return;
        }

        const exonElements = sequenceState.segmentElements.filter(
          (element) => element.dataset.sequenceSegmentKind === 'exon'
        );

        const topmostVisibleExon = exonElements.find((element) => {
          const elementRect = element.getBoundingClientRect();

          return (
            elementRect.bottom >= viewportRect.top &&
            elementRect.top <= viewportRect.bottom
          );
        });

        const activeElement =
          topmostVisibleExon ||
          exonElements.reduce((closest, element) => {
            const distance = Math.abs(
              element.getBoundingClientRect().top - viewportAnchor
            );

            if (!closest || distance < closest.distance) {
              return {
                distance,
                element
              };
            }

            return closest;
          }, null)?.element;

        if (!activeElement) {
          return;
        }

        const activeSegment = sequenceState.segmentsById.get(
          activeElement.dataset.sequenceSegment
        );

        if (!activeSegment) {
          return;
        }

        const activeElementRect = activeElement.getBoundingClientRect();
        const activeAnchor = clamp(
          viewportAnchor,
          activeElementRect.top,
          activeElementRect.bottom
        );

        const localProgress = clamp(
          (activeAnchor - activeElementRect.top) /
            Math.max(activeElementRect.height, 1),
          0,
          1
        );
        const coordinate =
          activeSegment.mapStart +
          (activeSegment.mapEnd - activeSegment.mapStart) * localProgress;

        updateOverviewLocation(activeSegment, coordinate);
      };

      const scheduleOverviewSync = () => {
        if (sequenceState.syncFrame) {
          return;
        }

        sequenceState.syncFrame = window.requestAnimationFrame(() => {
          sequenceState.syncFrame = 0;
          syncSequenceOverviewToScroll();
        });
      };

      const highlightSequenceTarget = (segmentId) => {
        window.clearTimeout(sequenceState.targetTimeout);
        sequenceState.targetSegmentId = null;
        updateSegmentStates();
      };

      const scrollToSequenceSegment = (segmentId) => {
        const targetElement = sequenceList.querySelector(`#${segmentId}`);
        const targetSegment = sequenceState.segmentsById.get(segmentId);

        if (!targetElement) {
          return;
        }

        if (targetSegment) {
          updateOverviewLocation(
            targetSegment,
            targetSegment.mapStart + (targetSegment.mapEnd - targetSegment.mapStart) / 2
          );
        }

        highlightSequenceTarget(segmentId);
        const viewportRect = sequenceViewport.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        const nextTop =
          sequenceViewport.scrollTop +
          (targetRect.top - viewportRect.top) -
          6;

        sequenceViewport.scrollTo({
          top: Math.max(nextTop, 0),
          behavior: 'instant'
        });

        window.requestAnimationFrame(scheduleOverviewSync);
      };

      const renderSequenceMap = (
        svg,
        {
          clear = true,
          showTrack = true,
          showEndLabels = true,
          overlayId = null,
          rectY = 4,
          rectHeight = 10,
          windowY = 3,
          windowHeight = 12,
          markerStartY = 2,
          markerEndY = 16,
          scale = defaultMapScale,
          rectRadius = 0,
          windowRadius = 0
        } = {}
      ) => {
        const rectsBySegmentId = new Map();
        let target = svg;

        if (clear) {
          svg.innerHTML = '';
        }

        if (overlayId) {
          const existingOverlay = svg.querySelector(
            `[data-sequence-map-overlay="${overlayId}"]`
          );

          if (existingOverlay) {
            existingOverlay.remove();
          }

          target = createSvgElement('g');
          target.setAttribute('data-sequence-map-overlay', overlayId);
          svg.appendChild(target);
        }

        if (showTrack) {
          const track = createSvgElement('rect');
          track.setAttribute('x', '10');
          track.setAttribute('y', '8');
          track.setAttribute('width', '675');
          track.setAttribute('height', '2');
          track.setAttribute('rx', '1');
          track.setAttribute('data-sequence-map-backbone', 'true');
          target.appendChild(track);
        }

        const windowRect = createSvgElement('rect');
        windowRect.setAttribute('y', String(windowY));
        windowRect.setAttribute('height', String(windowHeight));
        windowRect.setAttribute('rx', String(windowRadius));
        windowRect.setAttribute('data-sequence-map-window', 'true');
        target.appendChild(windowRect);

        exonSegments.forEach((segment) => {
          const rect = createSvgElement('rect');
          const x = scale(segment.mapStart);
          const width = Math.max(
            scale(segment.mapEnd) - scale(segment.mapStart),
            6
          );

          rect.setAttribute('x', String(x));
          rect.setAttribute('y', String(rectY));
          rect.setAttribute('width', String(width));
          rect.setAttribute('height', String(rectHeight));
          rect.setAttribute('rx', String(rectRadius));
          rect.setAttribute('tabindex', '0');
          rect.setAttribute('role', 'button');
          rect.setAttribute(
            'aria-label',
            `Scroll to ${segment.label.toLowerCase()} in the sequence view`
          );
          rect.dataset.sequenceMapExon = String(segment.order);
          rect.dataset.sequenceMapState = 'idle';
          rect.setAttribute('data-sequence-map-exon', 'true');

          rect.addEventListener('click', () => {
            scrollToSequenceSegment(segment.id);
          });
          rect.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') {
              return;
            }

            event.preventDefault();
            scrollToSequenceSegment(segment.id);
          });

          rectsBySegmentId.set(segment.id, rect);
          target.appendChild(rect);
        });

        const marker = createSvgElement('line');
        marker.setAttribute('y1', String(markerStartY));
        marker.setAttribute('y2', String(markerEndY));
        marker.setAttribute('data-sequence-map-marker', 'true');
        target.appendChild(marker);

        if (showEndLabels) {
          const leftLabel = createSvgElement('text');
          leftLabel.setAttribute('x', '0');
          leftLabel.setAttribute('y', '17');
          leftLabel.textContent = "5'";
          leftLabel.setAttribute('data-sequence-map-end-label', 'start');
          target.appendChild(leftLabel);

          const rightLabel = createSvgElement('text');
          rightLabel.setAttribute('x', '688');
          rightLabel.setAttribute('y', '17');
          rightLabel.textContent = "3'";
          rightLabel.setAttribute('data-sequence-map-end-label', 'end');
          target.appendChild(rightLabel);
        }

        return {
          rectsBySegmentId,
          window: windowRect,
          marker,
          scale
        };
      };

      intronToggle.addEventListener('change', () => {
        sequenceState.showIntrons = intronToggle.checked;
        renderSequenceSegments();
        scheduleOverviewSync();
      });

      sequenceViewport.addEventListener('scroll', syncSequenceOverviewToScroll, {
        passive: true
      });
      window.addEventListener('resize', scheduleOverviewSync, { passive: true });

      if (sequenceViewButton) {
        sequenceViewButton.addEventListener('click', () => {
          window.requestAnimationFrame(scheduleOverviewSync);
        });
      }

      renderSequenceSegments();
      sequenceState.mapInstances = [
        renderSequenceMap(sequenceMapSvg, {
          scale: defaultMapScale
        })
      ];

      if (primarySequenceMapSvg) {
        const primaryMapHost =
          primarySequenceMapSvg.querySelector('g[transform]') || primarySequenceMapSvg;

        sequenceState.mapInstances.push(
          renderSequenceMap(primaryMapHost, {
            clear: false,
            showTrack: false,
            showEndLabels: false,
            overlayId: 'primary',
            rectY: 0,
            rectHeight: 7,
            windowY: -1,
            windowHeight: 9,
            markerStartY: -1,
            markerEndY: 8,
            scale: createCoordinateScale(
              primaryMapRange?.start ?? 1,
              primaryMapRange?.end ?? 692
            ),
            rectRadius: 0,
            windowRadius: 0
          })
        );
      }

      scheduleOverviewSync();
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