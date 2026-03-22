/**
 * Cloud-LB embeddable widget
 * Usage:
 *   <script src="https://YOUR_DOMAIN/widget.js" data-bot-id="BOT_UUID" async></script>
 */
(function () {
  var script = document.currentScript;
  var botId = script && script.getAttribute("data-bot-id");
  var base =
    (script && script.src && script.src.replace(/\/widget\.js.*$/, "")) ||
    "";

  if (!botId) {
    console.warn("[Cloud-LB] Missing data-bot-id on widget script tag.");
    return;
  }

  var root = document.createElement("div");
  root.id = "cloud-lb-widget-root";
  root.style.cssText =
    "position:fixed;bottom:1.25rem;right:1.25rem;z-index:2147483647;font-family:system-ui,sans-serif;";
  document.body.appendChild(root);

  var btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Chat";
  btn.style.cssText =
    "background:#0d9488;color:#fff;border:none;border-radius:9999px;padding:0.75rem 1rem;font-weight:600;cursor:pointer;box-shadow:0 10px 25px rgba(13,148,136,0.35);";
  root.appendChild(btn);

  var panel = document.createElement("div");
  panel.style.cssText =
    "display:none;margin-top:0.5rem;width:min(100vw - 2rem, 22rem);background:#fff;border:1px solid #e2e8f0;border-radius:1rem;box-shadow:0 25px 50px rgba(15,23,42,0.15);overflow:hidden;";
  root.appendChild(panel);

  var header = document.createElement("div");
  header.textContent = "Clinic assistant";
  header.style.cssText =
    "padding:0.75rem 1rem;background:#f8fafc;font-weight:600;font-size:0.875rem;border-bottom:1px solid #e2e8f0;";
  panel.appendChild(header);

  var log = document.createElement("div");
  log.style.cssText =
    "height:14rem;overflow:auto;padding:0.75rem;font-size:0.875rem;display:flex;flex-direction:column;gap:0.5rem;background:#f8fafc;";
  panel.appendChild(log);

  var row = document.createElement("div");
  row.style.cssText = "display:flex;gap:0.5rem;padding:0.75rem;border-top:1px solid #e2e8f0;";
  var input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Ask a question…";
  input.style.cssText =
    "flex:1;border:1px solid #cbd5e1;border-radius:0.5rem;padding:0.5rem 0.75rem;font-size:0.875rem;";
  var send = document.createElement("button");
  send.type = "button";
  send.textContent = "Send";
  send.style.cssText =
    "border:none;border-radius:9999px;background:#0f172a;color:#fff;font-weight:600;padding:0.5rem 0.75rem;cursor:pointer;font-size:0.875rem;";
  row.appendChild(input);
  row.appendChild(send);
  panel.appendChild(row);

  function append(role, text) {
    var bubble = document.createElement("div");
    bubble.textContent = text;
    bubble.style.cssText =
      role === "user"
        ? "align-self:flex-end;max-width:85%;background:#0d9488;color:#fff;padding:0.5rem 0.75rem;border-radius:0.75rem;"
        : "align-self:flex-start;max-width:85%;background:#fff;border:1px solid #e2e8f0;padding:0.5rem 0.75rem;border-radius:0.75rem;";
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
  }

  btn.addEventListener("click", function () {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  });

  function sendMessage() {
    var text = (input.value || "").trim();
    if (!text) return;
    input.value = "";
    append("user", text);
    append("assistant", "…");
    var pending = log.lastChild;

    fetch(base + "/api/widget/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ botId: botId, message: text }),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        log.removeChild(pending);
        append("assistant", data.reply || data.error || "Error.");
      })
      .catch(function () {
        log.removeChild(pending);
        append("assistant", "Network error.");
      });
  }

  send.addEventListener("click", sendMessage);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendMessage();
  });
})();
