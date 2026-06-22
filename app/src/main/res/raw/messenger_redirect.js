(function() {
    if (window.__nobookMessengerRedirectLoaded) return;
    window.__nobookMessengerRedirectLoaded = true;

    const MESSENGER_ICON = '󱥊';

    function getButtonText(element) {
        return [
            element.getAttribute?.('aria-label') || '',
            element.getAttribute?.('href') || '',
            element.innerText || '',
            element.textContent || ''
        ].join(' ').toLowerCase();
    }

    function isTopBarElement(element) {
        const rect = element.getBoundingClientRect();
        if (rect.top > 140) return false;

        return Boolean(element.closest("div[role='banner'], header, nav, div[role='navigation']")) || rect.top < 96;
    }

    function isMessengerButton(element) {
        if (!element || element.id === 'custom-settings-btn') return false;
        if (!isTopBarElement(element)) return false;

        const rect = element.getBoundingClientRect();
        const text = getButtonText(element);
        const hasMessengerText = /messenger|messages|message|chats?/.test(text);
        const hasMessengerPath = /\/messages|\/messenger|fb-messenger/.test(text);
        const hasMessengerIcon = Array.from(element.querySelectorAll?.('span') || [])
            .some(span => span.textContent === MESSENGER_ICON);
        const isRightSideHeaderButton = rect.left > window.innerWidth * 0.45;

        return hasMessengerText || hasMessengerPath || (hasMessengerIcon && isRightSideHeaderButton);
    }

    function openMessenger(event) {
        const button = event.target?.closest?.("a, button, div[role='button']");
        if (!isMessengerButton(button)) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        window.MessengerBridge?.openMessenger?.();
    }

    document.addEventListener('click', openMessenger, true);
    document.addEventListener('auxclick', openMessenger, true);
})();
