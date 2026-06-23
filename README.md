# CodeShield Engine 🛡️💻

### An Autonomous High-Scale Competitive Programming & Automated Evaluation Platform

CodeShield Engine is a production-grade, full-stack online judging ecosystem built for compiling, executing, and grading algorithmic solutions in real-time. The platform securely manages a robust bank of **100 Data Structures & Algorithms challenges** mapped across a multi-tiered evaluation pipeline powered by advanced AI models for contextual scoring.

🌐 **Live Application UI:** [https://project-ue9kq.vercel.app](https://project-ue9kq.vercel.app)  
⚙️ **Production Core API Layer:** [https://codeshield-backend-docker.onrender.com](https://codeshield-backend-docker.onrender.com)  
📂 **Source Code Repository:** [https://github.com/divyadharshini165/CodeShield-Engine](https://github.com/divyadharshini165/CodeShield-Engine)

---

## 🚀 Key Architectural Features

* **100-Problem Algorithmic Bank:** Comprises **40 Easy, 35 Medium, and 25 Hard** curated problems pre-validated and seeded directly into the cloud infrastructure.
* **Synchronous Automated Evaluation Engine:** Evaluates user source-code submissions inside isolated execution sequences, providing precision diagnostic badges for runtime verdicts.
* **AI-Assisted Evaluation (Groq API):** Seamlessly integrates with Groq's high-speed inference engine to generate deep textual diagnostics and cognitive analysis on user code optimization.
* **Anti-Plagiarism Copy-Paste Restrictions:** Implements strict security intercepts on the frontend code editor workspace, disabling copy, paste, and right-click actions to ensure exam and interview integrity.
* **User Engagement Streak Analytics Engine:** Tracks user submission intervals across timelines to compute daily consistency metrics, feeding a dynamic **Activity Streak Graph** on the user dashboard.
* **Rigorous Verification Vectors:** Each challenge maintains an hidden array of 3 to 5 automated input/expectedOutput test cases ensuring strict schema compliance.
* **Data Sanitization Seeding Pipeline:** Built-in programmatic seeding filters that automatically map, structure, and patch empty/boundary cases to prevent schema collisions during migration.

---

## 🛠️ Tech Stack & Distributed Deployment Topology

The system is engineered using a decoupled, high-performance architecture to ensure independent scaling of the user interface and code execution layers:

| Layer | Technology | Purpose | Hosting Platform |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | React.js, Tailwind CSS, Vite | State management, responsive secure coding workspace, streak analytics graphing. | **Vercel** Production Edge Network |
| **Backend Core** | Node.js (v20 LTS), Express, Docker | REST API architecture, native compilers toolchain (GCC/OpenJDK), Groq pipelines. | **Render** Docker Web Service Container |
| **Database Gateway** | MongoDB, Mongoose ORM | Document schemas for users, 100 granular problems, and submission history tracking. | **MongoDB Atlas Cloud Cluster** |

---

## 📊 Comprehensive Evaluation & Error Verdict Schema

The platform maps system and execution diagnostics to strict industry-standard grading verdicts:
* **Accepted (`AC`):** Source code executes flawlessly and matches 100% of the hidden validation test-case vectors.
* **Wrong Answer (`WA`):** The program compiles and runs successfully but returns malformed, incomplete, or incorrect data outputs for the hidden vectors.
* **Compile Error (`CE`):** Syntactical compilation failure within the code workspace prior to processing hidden test runs.
* **Time Limit Exceeded (`TLE`):** The program exceeded the designated processing time threshold (e.g., 1000ms–3000ms based on complexity tier).
* **Runtime Error (`RE`):** Unhandled programmatic exceptions, segmentation faults, or out-of-bounds memory profiles during execution.

---

## 📂 System File & Directory Architecture

```text
CodeShield-Engine/
├── backend/
│   ├── docker/
│   │   └── Dockerfile          # Multi-language compiler & runtime system image definition
│   ├── models/
│   │   └── Problem.js          # Mongoose schema enforcing test-case validations
│   ├── seedData/
│   │   ├── easy.js             # 40 Easy problem definitions with test vectors
│   │   ├── medium.js           # 35 Medium problem definitions with test vectors
│   │   ├── hard_new.js         # 21 Hard problem definitions with test vectors
│   │   ├── hard_extra.js       # 4 Hard boundary problem definitions with test vectors
│   │   └── tagMap.js           # Enrichment mapping for specialized topic categorization
│   ├── server.js               # Primary Express API entry point
│   └── seed.js                 # Programmatic cloud database seeding engine
└── frontend/                   # React web application workspace
