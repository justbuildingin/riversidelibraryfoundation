import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Smooth scroll, the load sequence, reveals, counters and the deadline clock.
 *
 * All of it is additive. The page is complete and readable before any of it
 * runs, and every figure is written at its true value before it is animated,
 * so a blocked script can never leave a real number showing zero.
 */

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = () => window.matchMedia('(pointer: coarse)').matches;

export const initMotion = (): void => {
  gsap.registerPlugin(ScrollTrigger);

  if (!reduced() && !coarse()) {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
  }

  loadSequence();
  reveals();
  counters();
  deadlineClock();
};

/**
 * The signature. A rule draws, foil catches the light once, then the masthead
 * lines rise from behind it. Nothing bounces and nothing scales in: the point
 * of the page is that this institution is steady.
 */
const loadSequence = (): void => {
  const rule = document.querySelector<HTMLElement>('[data-hero-rule]');
  const sheen = document.querySelector<HTMLElement>('[data-sheen]');
  const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]');
  const tail = gsap.utils.toArray<HTMLElement>('[data-hero-tail]');
  const figure = document.querySelector<HTMLElement>('[data-hero-figure]');

  if (reduced()) {
    gsap.set([rule, ...lines, ...tail].filter(Boolean), { clearProps: 'all' });
    if (rule) rule.style.transform = 'scaleX(1)';
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (rule) {
    gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });
    tl.to(rule, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0.1);
  }
  if (sheen) {
    tl.fromTo(sheen, { xPercent: -130 }, { xPercent: 130, duration: 1.1, ease: 'power1.inOut' }, 0.55);
  }
  if (lines.length) {
    tl.from(lines, { yPercent: 106, duration: 0.95, stagger: 0.085 }, 0.42);
  }
  if (tail.length) {
    tl.from(tail, { opacity: 0, y: 18, duration: 0.7, stagger: 0.1 }, 1.05);
  }
  // A very slow drift on the plate, so the hero is never quite still.
  if (figure && !coarse()) {
    gsap.to(figure, { scale: 1.06, duration: 22, ease: 'none', repeat: -1, yoyo: true });
  }
};

const reveals = (): void => {
  const items = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
  if (!items.length) return;
  if (reduced()) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        const group = el.closest('[data-reveal-group]');
        const delay = group ? Array.from(group.querySelectorAll('.reveal')).indexOf(el) * 75 : 0;
        window.setTimeout(() => el.classList.add('is-in'), Math.min(delay, 600));
        io.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
  );
  items.forEach((el) => io.observe(el));
};

/**
 * Figures roll up the first time they are seen. The true value is written
 * first, so a figure is never wrong even if the animation never runs.
 */
const counters = (): void => {
  const nums = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
  const fmt = (n: number, el: HTMLElement) =>
    (el.dataset.prefix ?? '') + n.toLocaleString('en-US') + (el.dataset.suffix ?? '');

  for (const el of nums) {
    const target = Number(el.dataset.count ?? '0');
    el.textContent = fmt(Number.isFinite(target) ? target : 0, el);
    if (!Number.isFinite(target) || target <= 0 || reduced()) continue;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.disconnect();
          const box = { v: 0 };
          gsap.to(box, {
            v: target,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = fmt(Math.round(box.v), el);
            },
            onComplete: () => {
              el.textContent = fmt(target, el);
            },
          });
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
  }
};

/**
 * The live accent: a real countdown to the real RSVP deadline. If the deadline
 * has passed it says so rather than counting backwards, which is the failure
 * mode every deadline widget eventually hits.
 */
const deadlineClock = (): void => {
  const clock = document.querySelector<HTMLElement>('[data-deadline]');
  if (!clock) return;
  const target = new Date(clock.dataset.deadline ?? '').getTime();
  if (!Number.isFinite(target)) return;

  const units = ['days', 'hours', 'minutes', 'seconds'] as const;
  const cells = Object.fromEntries(
    units.map((u) => [u, clock.querySelector<HTMLElement>(`[data-unit="${u}"] [data-v]`)]),
  ) as Record<(typeof units)[number], HTMLElement | null>;

  const tick = () => {
    const left = target - Date.now();
    if (left <= 0) {
      clock.dataset.state = 'closed';
      return;
    }
    const s = Math.floor(left / 1000);
    const v = {
      days: Math.floor(s / 86400),
      hours: Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60,
    };
    for (const u of units) {
      const cell = cells[u];
      if (cell) cell.textContent = String(v[u]).padStart(2, '0');
    }
  };

  tick();
  window.setInterval(tick, 1000);
};
