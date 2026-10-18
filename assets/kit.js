/* WhalePage Kit v1.0 — 交互脚本（零依赖，约 3KB） */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;

  /* 标记 JS 可用：CSS 里 .js .reveal 才会先隐藏 */
  root.classList.add('js');

  /* ---------- 1. 顶部导航滚动态 ---------- */
  var header = doc.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('stuck', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 2. 移动端菜单 ---------- */
  var nav = doc.querySelector('.nav');
  var menuBtn = doc.querySelector('.menu-btn');
  if (nav && menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  /* ---------- 3. 滚动入场（IntersectionObserver + 交错延迟） ---------- */
  var items = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el, i) {
      el.style.setProperty('--i', i % 6);
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* 兜底：后台标签页里 IntersectionObserver 不回调，2.5s 后把视口内的元素直接显示 */
  setTimeout(function () {
    var vh = window.innerHeight || 800;
    items.forEach(function (el) {
      if (el.classList.contains('in')) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add('in');
    });
  }, 2500);

  /* ---------- 4. 数字滚动 ---------- */
  var counters = doc.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var animate = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var dec = (String(target).split('.')[1] || '').length;
      var start = performance.now();
      var dur = 1100;
      var tick = function (now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(dec) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(dec) + suffix;
      };
      requestAnimationFrame(tick);
    };
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animate(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- 5. 光标聚光（桌面端，轻量） ---------- */
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover) {
    var sp = doc.querySelector('.spotlight');
    if (sp) {
      sp.classList.add('on');
      var raf = null;
      doc.addEventListener('mousemove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          sp.style.setProperty('--mx', e.clientX + 'px');
          sp.style.setProperty('--my', e.clientY + 'px');
          raf = null;
        });
      }, { passive: true });
    }
  }

  /* ---------- 6. 年份 ---------- */
  doc.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
