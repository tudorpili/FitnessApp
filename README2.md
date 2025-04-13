Project setup
    ❯ npm create vite@latest frontend -- --template react
    ❯ cd frontend
    ❯ npm install
    ❯ npm install -D tailwindcss@3 postcss autoprefixer
    ❯ npm install react-router-dom chart.js react-chartjs-2
    ❯ npx tailwindcss init -p

    npm install react-icons

    ##npm run dev pentru frontend

    ❯ npm install -D vite-plugin-svgr

    user@app.com  password
    admin@app.com password





    🔐 Login Page – What to Include
✅ Basic Inputs
Email / Username

Password

"Remember me" checkbox (visual only for now)

➕ Optional (but good UX)
"Forgot Password?" link

Social login buttons (just design them for now)

Error handling (e.g., "Invalid credentials", hardcoded or use basic validation)

Success animation/redirect

🎨 Styling Ideas
Split layout: Left side = hero image or motivational quote, right = form

Icon inside input fields (<Input icon={<UserIcon />} />)

Micro-interactions:

hover:scale-105 on buttons

Shake animation for failed login

Tailwind classes like:

jsx
Copy
Edit
className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md"
🆕 Register Page – What to Include
✅ Inputs
Username

Email

Password

Confirm Password

➕ Optional
Choose fitness level (Beginner / Intermediate / Advanced) → sets up tailored plans later

Checkbox: “I agree to terms” (just for show for now)

Password strength meter (can be simple: weak/ok/strong based on length or pattern)

⚠️ Error Feedback
Show "Passwords don’t match"

Highlight empty fields if they try to submit blank

🖼️ Bonus UI Ideas (for both)
Background blur + semi-transparent card if you have a full-screen image

Motivational quote rotating on each visit

Dark mode from the start (if you're building it in)

🧠 Quick UX Enhancers
Auto-focus on first input

Enter key triggers submit

Loading animation when “logging in” (even fake delay for now)

Show password toggle (👁️ icon)