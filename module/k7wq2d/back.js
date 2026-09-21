function L(v) {
  if (v == null) return "";
  if (typeof v === "object") {
    if (v[json.lang] != null) return String(v[json.lang]);
    return v.tr != null ? String(v.tr) : "";
  }
  return String(v);
}
function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

var d = json.desing || {};
var groups = Array.isArray(d.data) ? d.data : [];

var total = 0;
var maxTon = 0;
groups.forEach(function (g) {
  (g.items || []).forEach(function (it) {
    total += 1;
    if (L(it.u) === "TON" && Number(it.v) > maxTon) maxTon = Number(it.v);
  });
});

var statsHtml = "";
(Array.isArray(d.stats) ? d.stats : []).forEach(function (s) {
  var val = s.value != null ? L(s.value) : "";
  if (s.key === "total") val = String(total);
  if (s.key === "groups") val = String(groups.length);
  if (s.key === "max") val = maxTon + " Ton";
  statsHtml +=
    '<li class="modulex-ap-stat"><span class="modulex-ap-statval">' +
    esc(val) +
    '</span><span class="modulex-ap-statlabel">' +
    esc(L(s.label)) +
    "</span></li>";
});

var navHtml = "";
var groupsHtml = "";
groups.forEach(function (g, gi) {
  var anchor = "arac-" + esc(g.id || gi + 1);
  var items = g.items || [];
  var no = gi + 1 < 10 ? "0" + (gi + 1) : String(gi + 1);

  navHtml +=
    '<a class="modulex-ap-navlink" href="#' + anchor + '">' + esc(L(g.name)) + "</a>";

  var itemsHtml = "";
  items.forEach(function (it) {
    var hasUnit = L(it.u) !== "";
    itemsHtml +=
      '<li class="modulex-ap-item' +
      (hasUnit ? "" : " is-wide is-text") +
      '"><span class="modulex-ap-val">' +
      esc(L(it.v)) +
      "</span>" +
      (hasUnit ? '<span class="modulex-ap-unit">' + esc(L(it.u)) + "</span>" : "") +
      "</li>";
  });

  groupsHtml +=
    '<article class="modulex-ap-group" id="' + anchor + '">' +
    '<div class="modulex-ap-ghead">' +
    '<span class="modulex-ap-no" aria-hidden="true">' + no + "</span>" +
    "<div>" +
    '<h2 class="modulex-ap-gname">' + esc(L(g.name)) + "</h2>" +
    (L(g.desc) ? '<p class="modulex-ap-gdesc">' + esc(L(g.desc)) + "</p>" : "") +
    "</div>" +
    (items.length > 1
      ? '<span class="modulex-ap-count">' + items.length + " " + esc(L(d.countLabel)) + "</span>"
      : "") +
    "</div>" +
    '<ul class="modulex-ap-items">' + itemsHtml + "</ul>" +
    "</article>";
});

var digits = String(L(d.phone)).replace(/\D/g, "");
var telHref = digits.charAt(0) === "0" ? "+90" + digits.slice(1) : digits;

var out =
  '<header class="modulex-ap-hero">' +
  '<span class="modulex-ap-eyebrow">' + esc(L(d.eyebrow)) + "</span>" +
  '<h1 class="modulex-ap-title">' + esc(L(d.title)) + "</h1>" +
  '<p class="modulex-ap-spot">' + esc(L(d.spot)) + "</p>" +
  '<ul class="modulex-ap-stats">' + statsHtml + "</ul>" +
  "</header>" +
  '<nav class="modulex-ap-nav" aria-label="' + esc(L(d.eyebrow)) + '">' + navHtml + "</nav>" +
  groupsHtml +
  '<aside class="modulex-ap-cta">' +
  "<div>" +
  '<h2 class="modulex-ap-ctatitle">' + esc(L(d.ctaTitle)) + "</h2>" +
  '<p class="modulex-ap-ctainfo"><strong>' + esc(L(d.firm)) + "</strong><br>" +
  esc(L(d.address)) + "<br>" +
  esc(L(d.phoneLabel)) + ": " + esc(L(d.phone)) +
  (L(d.phone2) ? " · " + esc(L(d.phone2)) : "") +
  "</p>" +
  "</div>" +
  '<div class="modulex-ap-btns">' +
  '<a class="modulex-ap-btn is-primary" href="tel:' + esc(telHref) + '">' +
  '<span class="material-symbols-outlined" aria-hidden="true">call</span>' +
  esc(L(d.callLabel)) + "</a>" +
  '<a class="modulex-ap-btn is-ghost" href="' + wxLangInternalHref("iletisim") + '">' +
  esc(L(d.contactLabel)) + "</a>" +
  "</div>" +
  "</aside>";

html = html.replace(/{{html}}/g, function () {
  return out;
});
