(function() {
    if (window.__nobookMessengerRedirectLoaded) return;
    window.__nobookMessengerRedirectLoaded = true;

    const MESSENGER_ICON = '󱥊';
    const BUTTON_ID = 'custom-messenger-btn';

    const ICON_SVG = `
      <svg width="26" height="26" fill="%FILL%" viewBox="0 0 24 24">
        <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.99-.88c.17-.07.36-.09.54-.04.91.25 1.88.39 2.9.39 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2Zm6 7.46-2.93 4.66c-.47.74-1.47.93-2.18.4l-2.33-1.75a.6.6 0 0 0-.72 0l-3.15 2.39c-.42.32-.97-.18-.69-.63l2.93-4.66c.47-.74 1.47-.93 2.18-.4l2.33 1.75c.21.16.51.16.72 0l3.15-2.39c.42-.32.97.18.69.63Z"/>
      </svg>`;

    const getFillColor = () => {
        const color = document.querySelector('meta[name="theme-color"]')?.content?.toLowerCase();
        return color === '#ffffff' ? '#242526' : '#d0d0d0';
    };

    // Locate Facebook's native Messages/Messenger button in the top bar.
    const findNativeMessenger = () => {
        // mobile: the glyph span sits inside the messages button.
        const iconSpan = Array.from(document.querySelectorAll('span'))
            .find(span => span.textContent === MESSENGER_ICON);
        if (iconSpan) {
            const btn = iconSpan.closest("div[role='button'], a");
            if (btn && btn.id !== BUTTON_ID) return btn;
        }

        // desktop: messenger link inside the banner/header.
        const banner = document.querySelector("div[role='banner'], header");
        if (banner) {
            const link = banner.querySelector(
                "a[href*='/messages'], a[href*='/messenger'], a[aria-label*='Messenger' i]"
            );
            if (link) return link.closest("div[role='button']") || link;
        }

        return null;
    };

    // Hide the native button but keep it in the DOM:
    // the settings button anchors off the same glyph span.
    const hideNative = (btn) => {
        if (!btn || btn.id === BUTTON_ID) return;
        btn.style.setProperty('display', 'none', 'important');
    };

    const updateColor = () => {
        const svg = document.querySelector(`#${BUTTON_ID} svg`);
        if (svg) svg.setAttribute('fill', getFillColor());
    };

    const createButton = (floating) => {
        const btn = document.createElement('button');
        btn.id = BUTTON_ID;
        btn.setAttribute('aria-label', 'Messenger');
        btn.setAttribute('style', `
            position: ${floating ? 'fixed' : 'relative'};
            ${floating ? 'top: 8px; right: 8px;' : ''}
            background: transparent;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px;
            z-index: 9999;
            pointer-events: auto;
        `);
        btn.innerHTML = ICON_SVG.replace('%FILL%', getFillColor());
        btn.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            window.MessengerBridge?.openMessenger?.();
        };
        return btn;
    };

    // Hide native messenger + insert our own button into the same top-bar spot.
    // Falls back to a fixed top-right overlay if the bar container isn't found,
    // so the button is never lost.
    const apply = () => {
        const native = findNativeMessenger();
        hideNative(native);

        if (document.getElementById(BUTTON_ID)) return;

        const container = native ? native.parentNode : null;
        if (container) {
            container.insertBefore(createButton(false), container.firstChild);
        } else {
            document.body.appendChild(createButton(true));
        }
    };

    const onReady = (fn) => {
        if (document.readyState === 'loading')
            document.addEventListener('DOMContentLoaded', fn);
        else fn();
    };

    onReady(() => {
        apply();

        // Facebook is a SPA; re-hide native and re-insert on re-render.
        // Bounded to once per animation frame to avoid thrash on the feed.
        let scheduled = false;
        new MutationObserver(() => {
            if (scheduled) return;
            scheduled = true;
            requestAnimationFrame(() => {
                scheduled = false;
                apply();
            });
        }).observe(document.body, { childList: true, subtree: true });

        const themeMeta = document.querySelector('meta[name="theme-color"]');
        if (themeMeta) {
            new MutationObserver(updateColor).observe(themeMeta, {
                attributes: true,
                attributeFilter: ['content']
            });
        }
    });
})();
