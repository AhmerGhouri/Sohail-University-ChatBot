# Chatbot Integration Guide for WordPress

This guide will help you integrate your AI Chatbot into your WordPress website (`test.sohailuniversity.edu.pk`) using a professional floating chat icon.

## Step 1: Deploy your Chatbot
WordPress cannot run Next.js code directly, so you must host your chatbot application online.

1.  **Host on Vercel (Recommended):** 
    - Go to [vercel.com](https://vercel.com) and connect your GitHub repository.
    - During setup, add the environment variable `HF_API_TOKEN` with your Hugging Face token.
2.  **Get your Live URL:**
    - After deployment, Vercel will give you a URL like `https://chatbot-xxx.vercel.app`.
    - **Your widget URL will be:** `https://your-deployment.vercel.app/widget`

---

## Step 2: Integration Logic (Copy & Paste)
Paste this code into the **Footer** of your WordPress site (using the "WPCode" plugin or your theme's `footer.php`).

> [!IMPORTANT]
> Change `YOUR_LIVE_URL` to your actual Vercel/Hosting URL in the script below.

```html
<!-- Sohail University AI Chatbot -->
<script>
(function() {
    // --- CONFIGURATION ---
    const DEPLOYED_URL = "YOUR_LIVE_URL/widget"; 
    const PRIMARY_COLOR = "#3b82f6";
    const SECONDARY_COLOR = "#8b5cf6";
    // ---------------------

    // 1. Create Floating Styles
    const style = document.createElement('style');
    style.innerHTML = `
        #hf-chat-container {
            position: fixed; bottom: 30px; right: 30px; z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        #hf-chat-bubble {
            width: 65px; height: 65px; border-radius: 50%;
            background: linear-gradient(135deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 100%);
            box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255,255,255,0.1);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
            color: white; transform: scale(1);
        }
        #hf-chat-bubble:hover { transform: scale(1.1) translateY(-5px); box-shadow: 0 12px 30px rgba(59, 130, 246, 0.5); }
        #hf-chat-bubble svg { width: 32px; height: 32px; transition: all 0.3s; }
        
        #hf-chat-window {
            position: fixed; bottom: 110px; right: 30px;
            width: 420px; height: 650px; max-height: 85vh; max-width: 90vw;
            border-radius: 24px; overflow: hidden;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            display: none; flex-direction: column;
            border: 1px solid rgba(255,255,255,0.1);
            background: #0a0e1a;
            transform: translateY(30px); opacity: 0;
            transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
            pointer-events: none;
        }
        #hf-chat-window.open {
            display: flex; opacity: 1; transform: translateY(0); pointer-events: all;
        }
        #hf-chat-iframe { width: 100%; height: 100%; border: none; }
        
        /* Tooltip */
        #hf-chat-tooltip {
            position: absolute; right: 80px; bottom: 15px;
            background: white; color: #1e293b; padding: 12px 18px;
            border-radius: 14px; font-size: 14px; font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            white-space: nowrap; transition: all 0.3s; opacity: 1;
            transform: translateX(0); border: 1px solid #e2e8f0;
        }
        #hf-chat-bubble.open + #hf-chat-tooltip { opacity: 0; transform: translateX(20px); pointer-events: none; }

        @media (max-width: 480px) {
            #hf-chat-window { 
                width: 100%; height: 100%; bottom: 0; right: 0; 
                max-height: 100vh; max-width: 100vw; border-radius: 0; 
            }
            #hf-chat-container { bottom: 20px; right: 20px; }
        }
    `;
    document.head.appendChild(style);

    // 2. Create Elements
    const container = document.createElement('div');
    container.id = 'hf-chat-container';
    
    // SVG Icons
    const chatIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
    const closeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

    container.innerHTML = `
        <div id="hf-chat-window">
            <iframe id="hf-chat-iframe" src="${DEPLOYED_URL}"></iframe>
        </div>
        <div id="hf-chat-bubble">${chatIcon}</div>
        <div id="hf-chat-tooltip">Hi! How can I help you? 👋</div>
    `;
    document.body.appendChild(container);

    // 3. Logic
    const bubble = document.getElementById('hf-chat-bubble');
    const chatWindow = document.getElementById('hf-chat-window');
    let isOpen = false;

    bubble.onclick = function() {
        isOpen = !isOpen;
        if (isOpen) {
            chatWindow.style.display = 'flex';
            bubble.classList.add('open');
            setTimeout(() => chatWindow.classList.add('open'), 10);
            bubble.innerHTML = closeIcon;
        } else {
            chatWindow.classList.remove('open');
            bubble.classList.remove('open');
            setTimeout(() => {
                chatWindow.style.display = 'none';
            }, 400);
            bubble.innerHTML = chatIcon;
        }
    };

    // Close tooltip after 10 seconds
    setTimeout(() => {
        const tooltip = document.getElementById('hf-chat-tooltip');
        if (tooltip) tooltip.style.opacity = '0';
    }, 10000);

    // Listen for "close" from iframe
    window.addEventListener('message', (e) => {
        if (e.data === 'close-chatbot' && isOpen) bubble.click();
    });
})();
</script>
```

---

## Step 3: Best Practices
1.  **Mobile Ready**: The script automatically detects mobile devices and makes the chat full-screen for a better experience.
2.  **Performance**: The iframe only starts loading content when the page loads, and it uses minimal resources while closed.
3.  **Cross-Origin**: Make sure your Vercel deployment and WordPress site both use `https://`.
