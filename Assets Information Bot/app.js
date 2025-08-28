const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// OpenRouter API details
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
// ⛔️Put your real key here
const API_KEY = "YOUR_API_KEY_HERE";  
const SITE_URL = "http://localhost";
const SITE_NAME = "My Chatbot";        


function addMessage(message, isUser = true) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", isUser ? "user-message" : "bot-message");
  msgDiv.innerHTML = isUser ? message : marked.parse(message);
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, true);
  userInput.value = "";

  // Show placeholder while waiting
  const loadingMsg = document.createElement("div");
  loadingMsg.classList.add("message", "bot-message");
  loadingMsg.innerText = "Thinking...";
  chatWindow.appendChild(loadingMsg);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`, // <-- replace at runtime
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    chatWindow.removeChild(loadingMsg);

    const botReply = data.choices?.[0]?.message?.content || "Error: No response";
    addMessage(botReply, false);
  } catch (error) {
    chatWindow.removeChild(loadingMsg);
    addMessage("Error connecting to API", false);
    console.error(error);
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
