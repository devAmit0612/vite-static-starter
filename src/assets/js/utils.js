/**
 * Select elements and always return an iterable (NodeList or Array)
 */
export const select = (selector, context = document) =>
  typeof selector === 'string' ? context.querySelectorAll(selector) : [selector];

/**
 * Wait for the DOM to be fully loaded
 */
export const domReady = (callback) => {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
};

/**
 * Add event listener to one or multiple elements
 */
export const addEvent = (selector, event, handler) => {
  select(selector).forEach((el) => {
    if (el) el.addEventListener(event, handler);
  });
};

/**
 * Event Delegation
 */
export const delegateEvent = (wrapperSelector, event, targetSelector, handler) => {
  select(wrapperSelector).forEach((parent) => {
    if (!parent) return;
    parent.addEventListener(event, function (e) {
      const target = e.target.closest(targetSelector);
      if (target && parent.contains(target)) {
        handler.call(target, e, target);
      }
    });
  });
};

/**
 * Apply multiple CSS styles
 */
export const setStyles = (selector, styles) => {
  select(selector).forEach((el) => {
    if (el) Object.assign(el.style, styles);
  });
};

/**
 * Class manipulation helpers
 */
export const addClass = (selector, className) => {
  const classes = className.split(' ');
  select(selector).forEach((el) => {
    if (el) el.classList.add(...classes);
  });
};

export const removeClass = (selector, className) => {
  const classes = className.split(' ');
  select(selector).forEach((el) => {
    if (el) el.classList.remove(...classes);
  });
};

export const toggleClass = (selector, className) => {
  select(selector).forEach((el) => {
    if (el) el.classList.toggle(className);
  });
};

/**
 * Checks if ANY of the matched elements have the class
 */
export const hasClass = (selector, className) => {
  return Array.from(select(selector)).some((el) => el && el.classList.contains(className));
};

/**
 * Attach an event handler function for one or more events to the selected elements.
 * Supports multiple events space-separated (e.g., 'click mouseenter')
 */
export const on = (selector, events, handler, options = false) => {
  const eventList = events.split(' ');
  select(selector).forEach((el) => {
    if (el) {
      eventList.forEach((e) => el.addEventListener(e.trim(), handler, options));
    }
  });
};

/**
 * Remove an event handler function for one or more events from the selected elements.
 * IMPORTANT: The `handler` must be the exact same function reference used in `on`.
 */
export const off = (selector, events, handler, options = false) => {
  const eventList = events.split(' ');
  select(selector).forEach((el) => {
    if (el) {
      eventList.forEach((e) => el.removeEventListener(e.trim(), handler, options));
    }
  });
};
