// The grading logic lives in app.py. This file collects the form data,
// sends it to the /calculate route, shows the response and keeps a list
// of saved students in the browser (localStorage).
const DEFAULTS = ["Maths", "English", "Science"];
const STORE_KEY = "student-grade-calculator:students";

const rowsEl = document.getElementById("rows");
const errEl = document.getElementById("err");
const calcBtn = document.getElementById("calc");
const nameEl = document.getElementById("name");

let students = [];       // saved results
let activeId = null;     // student currently shown

const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ---------- storage ---------- */
function loadStudents() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch (e) { return []; }
}
function persist() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(students)); } catch (e) { /* storage unavailable */ }
}

/* ---------- form ---------- */
function addRow(subject = "", obtained = "", max = 100) {
  const r = document.createElement("div");
  r.className = "row";
  r.innerHTML = `
    <input class="subj" type="text" placeholder="Subject name" aria-label="Subject name" value="${esc(subject)}">
    <input class="got" type="number" min="0" step="any" placeholder="0" aria-label="Marks obtained" value="${esc(obtained)}">
    <input class="max" type="number" min="1" step="any" aria-label="Maximum marks" value="${esc(max)}">
    <button type="button" class="icon del" aria-label="Remove subject">✕</button>`;
  r.querySelector(".del").onclick = () => { if (rowsEl.children.length > 1) r.remove(); };
  rowsEl.appendChild(r);
}

function resetForm() {
  rowsEl.innerHTML = "";
  DEFAULTS.forEach(s => addRow(s));
  nameEl.value = "";
  document.getElementById("result").hidden = true;
  errEl.textContent = "";
  activeId = null;
  renderSaved();
}

/* ---------- result ---------- */
function showResult(d) {
  document.getElementById("who").textContent = d.name;
  document.getElementById("grade").textContent = d.grade;
  document.getElementById("total").textContent = `${d.total_obtained} / ${d.total_max}`;
  document.getElementById("pct").textContent = d.percentage.toFixed(2) + "%";
  document.getElementById("status").innerHTML =
    `<span class="badge ${d.passed ? "pass" : "fail"}">${d.passed ? "Pass" : "Fail"}</span>`;
  document.getElementById("body").innerHTML = d.subjects.map(s => `
    <tr><td>${esc(s.subject)}</td><td>${s.obtained} / ${s.max}</td>
    <td>${s.percentage.toFixed(1)}%</td><td>${s.grade}</td>
    <td><div class="bar"><i style="width:${s.percentage}%"></i></div></td></tr>`).join("");
  const res = document.getElementById("result");
  res.hidden = false;
  res.scrollIntoView({behavior: "smooth", block: "nearest"});
}

/* ---------- saved students ---------- */
function saveStudent(result) {
  // Same name (ignoring case) updates that student; a new name adds a new one.
  const key = result.name.toLowerCase();
  const existing = students.find(s => s.name.toLowerCase() === key);
  if (existing) {
    Object.assign(existing, result, {id: existing.id});
    activeId = existing.id;
  } else {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    students.push({id, ...result});
    activeId = id;
  }
  persist();
  renderSaved();
}

function renderSaved() {
  document.getElementById("count").textContent = students.length;
  document.getElementById("emptyMsg").hidden = students.length > 0;
  document.getElementById("savedTable").hidden = students.length === 0;
  document.getElementById("clearSaved").hidden = students.length === 0;
  document.getElementById("savedBody").innerHTML = students.map(s => `
    <tr class="${s.id === activeId ? "active" : ""}">
      <td>${esc(s.name)}</td>
      <td>${s.percentage.toFixed(1)}%</td>
      <td>${esc(s.grade)}</td>
      <td><span class="badge ${s.passed ? "pass" : "fail"}">${s.passed ? "Pass" : "Fail"}</span></td>
      <td><div class="sbtns">
        <button type="button" data-view="${s.id}">View</button>
        <button type="button" data-del="${s.id}" aria-label="Delete ${esc(s.name)}">Delete</button>
      </div></td>
    </tr>`).join("");
}

function viewStudent(id) {
  const s = students.find(x => x.id === id);
  if (!s) return;
  activeId = id;
  nameEl.value = s.name;
  rowsEl.innerHTML = "";
  s.subjects.forEach(x => addRow(x.subject, x.obtained, x.max));
  errEl.textContent = "";
  showResult(s);
  renderSaved();
}

document.getElementById("savedBody").addEventListener("click", e => {
  const view = e.target.closest("[data-view]");
  const del = e.target.closest("[data-del]");
  if (view) viewStudent(view.dataset.view);
  if (del) {
    const id = del.dataset.del;
    students = students.filter(s => s.id !== id);
    persist();
    if (activeId === id) resetForm(); else renderSaved();
  }
});

document.getElementById("clearSaved").onclick = () => {
  if (!students.length || !confirm("Delete all saved students?")) return;
  students = [];
  persist();
  resetForm();
};

/* ---------- calculate ---------- */
async function calculate() {
  errEl.textContent = "";
  const payload = {
    name: nameEl.value.trim(),
    subjects: [...rowsEl.children].map(r => ({
      subject: r.querySelector(".subj").value.trim(),
      obtained: r.querySelector(".got").value,
      max: r.querySelector(".max").value
    }))
  };

  calcBtn.disabled = true;
  try {
    const res = await fetch("/calculate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) { errEl.textContent = data.error || "Something went wrong."; return; }
    saveStudent(data);
    showResult(data);
  } catch (e) {
    errEl.textContent = "Could not reach the server. Check that the app is running.";
  } finally {
    calcBtn.disabled = false;
  }
}

document.getElementById("add").onclick = () => addRow();
calcBtn.onclick = calculate;
document.getElementById("reset").onclick = resetForm;
document.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.tagName === "INPUT") calculate(); });

students = loadStudents();
resetForm();