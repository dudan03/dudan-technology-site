const formatINR = (value) => `₹${Math.round(value).toLocaleString("en-IN")}`;

const form = document.getElementById("estimateForm");
const estimateLow = document.getElementById("estimateLow");
const estimateHigh = document.getElementById("estimateHigh");
const breakdown = document.getElementById("breakdown");

function getEstimate() {
  const chosenServices = [...form.querySelectorAll('input[name="service"]:checked')];
  const chosenAddons = [...form.querySelectorAll('input[name="addon"]:checked')];
  const multiplier = Number(form.querySelector('input[name="complexity"]:checked').value);
  const base = chosenServices.reduce((total, item) => total + Number(item.value), 0);
  const complexity = Math.round(base * multiplier);
  const addons = chosenAddons.reduce((total, item) => total + Number(item.value), 0);
  const total = base + complexity + addons;
  const weeks = total < 30000 ? 2 : total < 75000 ? 3 : total < 150000 ? 5 : 8;
  const selectedCount = chosenServices.length;

  estimateLow.textContent = formatINR(total || 0);
  estimateHigh.textContent = total ? `up to ${formatINR(total * 1.15)} · ~${weeks} weeks delivery` : "Select a service to begin";
  breakdown.innerHTML = `${selectedCount ? `Base (${selectedCount} service${selectedCount > 1 ? "s" : ""})` : "No service selected"} <b>${formatINR(base)}</b>`;
  return { chosenServices, chosenAddons, total, weeks, multiplier };
}

form.addEventListener("change", getEstimate);
getEstimate();

document.getElementById("sendEstimate").addEventListener("click", () => {
  const { chosenServices, chosenAddons, total, weeks } = getEstimate();
  const services = chosenServices.map((item) => item.dataset.name).join(", ") || "Not selected";
  const addons = chosenAddons.map((item) => item.dataset.name).join(", ") || "None";
  const message = `Hi Dudan Technology, I would like a quote.\n\nServices: ${services}\nAdd-ons: ${addons}\nIndicative estimate: ${formatINR(total)}\nTimeline: ~${weeks} weeks\n\nPlease contact me to discuss.`;
  window.open(`https://wa.me/917008872724?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = `Hi Dudan Technology, I would like to discuss a project.\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nPhone: ${data.get("phone")}\nService: ${data.get("service")}\nBudget: ${data.get("budget")}\n\nProject details:\n${data.get("message")}`;
  window.open(`https://wa.me/917008872724?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

const botResponse = document.getElementById("botResponse");
document.querySelectorAll(".quick-prompts button").forEach((button) => {
  button.addEventListener("click", () => { botResponse.textContent = button.dataset.reply; });
});

const botInput = document.getElementById("botInput");
function answerBot() {
  const question = botInput.value.trim();
  if (!question) return;
  botResponse.textContent = "Thanks for asking! For a tailored answer, our team can help on WhatsApp within an hour. We build websites, apps, AI chatbots, stores and growth campaigns.";
  botInput.value = "";
}
document.getElementById("botSend").addEventListener("click", answerBot);
botInput.addEventListener("keydown", (event) => { if (event.key === "Enter") answerBot(); });

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
