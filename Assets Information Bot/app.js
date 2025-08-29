const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Gemini API details
const API_KEY = "YOUR_API_KEY_HERE"; 
const MODEL = "gemini-1.5-flash"; // or gemini-1.5-pro
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

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


  const loadingMsg = document.createElement("div");
  loadingMsg.classList.add("message", "bot-message");
  loadingMsg.innerText = "Thinking...";
  chatWindow.appendChild(loadingMsg);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: message }]
        }]
      })
    });

    const data = await response.json();
    chatWindow.removeChild(loadingMsg);

    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response";
    addMessage(botReply, false);
  } catch (error) {
    chatWindow.removeChild(loadingMsg);
    addMessage("❌ Error connecting to Gemini API", false);
    console.error(error);
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
