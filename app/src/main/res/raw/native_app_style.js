(function() {
    if (window.__nobookNativeAppStyleLoaded) return;
    window.__nobookNativeAppStyleLoaded = true;

    const styleId = 'nobook-native-app-style';

    function installStyle() {
        let style = document.getElementById(styleId);
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            document.documentElement.appendChild(style);
        }

        style.textContent = `
            :root {
                --nobook-fb-bg: #18191a;
                --nobook-fb-card: #242526;
                --nobook-fb-card-soft: #303134;
                --nobook-fb-border: #3a3b3c;
                --nobook-fb-primary-text: #e4e6eb;
                --nobook-fb-secondary-text: #b0b3b8;
                --nobook-fb-blue: #2374e1;
            }

            html,
            body {
                background: var(--nobook-fb-bg) !important;
                color: var(--nobook-fb-primary-text) !important;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
                color-scheme: dark !important;
            }

            body,
            div[role='main'],
            div[role='feed'],
            div[data-pagelet],
            div[data-type='vscroller'] {
                background-color: var(--nobook-fb-bg) !important;
            }

            div[role='banner'],
            div[role='navigation'],
            div[role='tablist'],
            div[data-mcomponent='MContainer'][data-type='container'] {
                background-color: var(--nobook-fb-card) !important;
                border-color: var(--nobook-fb-border) !important;
            }

            div[role='article'],
            div[data-pagelet*='FeedUnit'],
            div[data-pagelet*='Stories'] {
                background-color: var(--nobook-fb-card) !important;
                border-top: 1px solid var(--nobook-fb-border) !important;
                border-bottom: 1px solid var(--nobook-fb-border) !important;
                border-radius: 0 !important;
                margin-block: 8px !important;
                overflow: hidden !important;
            }

            div[role='article'] [role='button'],
            div[role='article'] a,
            div[role='tab'],
            div[role='tablist'] [role='button'] {
                border-radius: 12px !important;
            }

            a[href*='/stories/'],
            a[href*='/story.php'],
            div[aria-label*='story' i],
            div[aria-label*='stories' i] {
                border-radius: 16px !important;
                overflow: hidden !important;
            }

            input,
            textarea,
            [contenteditable='true'],
            div[role='textbox'] {
                background-color: var(--nobook-fb-card-soft) !important;
                color: var(--nobook-fb-primary-text) !important;
                border: 1px solid var(--nobook-fb-border) !important;
                border-radius: 999px !important;
            }

            a,
            span,
            div[role='button'],
            div[role='tab'] {
                color: inherit;
            }

            [aria-selected='true'],
            div[role='tab'][aria-selected='true'] {
                color: var(--nobook-fb-blue) !important;
                border-color: var(--nobook-fb-blue) !important;
            }

            hr,
            div[role='separator'] {
                background-color: var(--nobook-fb-border) !important;
                border-color: var(--nobook-fb-border) !important;
            }
        `;
    }

    function applySurfaceHints(root = document) {
        const cardSelectors = [
            "div[role='article']",
            "div[role='banner']",
            "div[role='navigation']",
            "div[role='tablist']"
        ];
        const pageSelectors = [
            "div[role='feed']",
            "div[role='main']"
        ];

        cardSelectors.forEach(selector => {
            root.querySelectorAll?.(selector).forEach(element => {
                element.style.setProperty('background-color', '#242526', 'important');
            });
        });

        pageSelectors.forEach(selector => {
            root.querySelectorAll?.(selector).forEach(element => {
                element.style.setProperty('background-color', '#18191a', 'important');
            });
        });
    }

    installStyle();
    applySurfaceHints();

    new MutationObserver(mutations => {
        let shouldApply = false;
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                shouldApply = true;
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) applySurfaceHints(node);
                });
            }
        }
        if (shouldApply && !document.getElementById(styleId)) installStyle();
    }).observe(document.documentElement, { childList: true, subtree: true });
})();
