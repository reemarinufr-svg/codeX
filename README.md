<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />

---<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />



# [Relationship Detector] 🎯


## Basic Details
### Team Name: [CodeX]


### Team Members
- Team Lead: [Reema Rinu] - [College Of Engineering, Attingal]
- Member 2: [Ajmal. N] - [College Of Engineering, Attingal]

### Project Description
[Our project is a relationship detector. here, the user can upload a 5 sec live video or recorded video. It analyzes the user's facial expressions and predicts their relationship status.]

### The Problem (that doesn't exist)
[What is your relationship status?]

### The Solution (that nobody asked for)
[Catching through facial expressions!]

## Technical Details
### Technologies/Components Used
For Software:
- [html,css,node js,python]
- [Tensorflow , Keras , openCV ]
- [os, sys, numpy, json,time, argparse]
- [flask]

For Hardware:
- [List main components]
- [List specifications]
- [List tools required]

### Implementation

**Installation:**
```bash
# No installation required! Just clone the repo.
git clone https://github.com/reemarinufr-svg/codeX.git
cd codeX
```

**Run (Option 1 — Python local server):**
```bash
python -m http.server 8080
# Then open http://localhost:8080 in your browser
```

**Run (Option 2 — Node.js):**
```bash
npx serve .
# Then open the URL shown in terminal
```

**Run (Option 3 — Direct file):**
```
Open index.html directly in your browser.
Note: Webcam recording may require a local server due to browser security policies.
```

**Run (Option 4 — GitHub Pages):**
```
Push to your repo. Enable GitHub Pages (root branch).
Your app is instantly live. No build step needed.
```

---


### Project Documentation
For Software:

# Screenshots (Add at least 3)
![c:\Users\Y O G A\Pictures\Screenshots\Screenshot 2026-09-12 043255.png]
It is the opening interface of our website "Relationshoip Detector".

![c:\Users\Y O G A\Pictures\Screenshots\Screenshot 2026-09-12 043608.png, c:\Users\Y O G A\Pictures\Screenshots\Screenshot 2026-09-12 043726.png]
It is the running interface. Here the user can upload the video proof and the analysed report is shown.

![c:\Users\Y O G A\Pictures\Screenshots\Screenshot 2026-09-12 043803.png]
Here we can download our roast card

# Diagrams

### 🔄 Relationship Detector System Workflow Diagram

```mermaid
graph TD
    classDef startEnd fill:#0d0d2b,stroke:#00f5ff,stroke-width:2px,color:#00f5ff;
    classDef process fill:#131338,stroke:#b347ff,stroke-width:1px,color:#e8e8ff;
    classDef decision fill:#200d38,stroke:#ff2d78,stroke-width:2px,color:#ff2d78;
    classDef outcome fill:#092518,stroke:#39ff14,stroke-width:2px,color:#39ff14;

    A[User Opens Website] :::startEnd --> B[Department of Vibes™ Landing Page]
    B --> C[Click 'Investigate Me' / Evidence Intake]
    
    C --> D{Select Evidence Intake} :::decision
    D -->|Option A| E[Upload Recorded Video .mp4 / .webm] :::process
    D -->|Option B| F[Record 5-Second Live Webcam Selfie] :::process
    
    E --> G[Initiate Forensic Scanner Engine] :::process
    F --> G
    
    G --> H[Run 13-Stage Sci-Fi Visual & Audio Scan] :::process
    H --> I[Execute Facial Expression Classifier Model] :::process
    
    I --> J[Calculate 7-Emotion Probability Breakdown] :::process
    J --> K{Facial Emotion to Status Mapping} :::decision
    
    K -->|😄 Happy| L[❤️ COMMITTED: Terminally in Love] :::outcome
    K -->|😢 Sad / 🤢 Disgust / 😠 Angry| M[💔 SINGLE: Single & Heartbroken] :::outcome
    K -->|😍 Romantic / 😲 Surprise / 😨 Fear| N[💕 DATING: Flirting & Involved] :::outcome
    K -->|😐 Neutral| O[😐 SINGLE / COMMITTED: Secretly Committed] :::outcome
    
    L --> P[Generate Classified Romance Dossier] :::process
    M --> P
    N --> P
    O --> P
    
    P --> Q[Log Full Matrix Breakdown to Developer Console] :::process
    P --> R[Render Interactive Results Dashboard & 7-Emotion Bars] :::process
    P --> S[Generate & Download Custom Roast Dossier PNG Card] :::startEnd
```

*System workflow diagram illustrating the end-to-end user journey, webcam/video evidence processing, facial expression neural classification, emotion-to-relationship mapping, and roast card export.*

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    index.html (Shell)                        │
│   React 18 UMD + Babel Standalone + Canvas + Web Audio      │
└──────────────────────────┬──────────────────────────────────┘
                           │
          ┌────────────────▼──────────────────┐
          │           App.jsx (State Machine)  │
          │   hero → upload → scanning → results│
          └────────┬──────────────────────────-┘
                   │
    ┌──────────────┼──────────────────────────────┐
    │              │                              │
    ▼              ▼                              ▼
┌────────┐   ┌──────────┐                  ┌──────────┐
│  Hero  │   │  Upload  │                  │ Results  │
│ Section│   │ Section  │                  │Dashboard │
└────────┘   │ (Webcam  │                  └────┬─────┘
             │  Recorder│                       │
             └────┬─────┘               ┌───────▼──────┐
                  │                     │  Share Card  │
                  ▼                     │   Modal      │
           ┌──────────────┐             └──────────────┘
           │  Scanner HUD │
           │ (Canvas + Audio)
           └──────┬───────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
    ▼                           ▼
┌─────────────┐         ┌─────────────┐
│  Forensics  │         │   Sound     │
│  Engine     │         │  Utility    │
│ (Seeded RNG)│         │ (Web Audio) │
└─────────────┘         └─────────────┘
```

---


For Hardware:

# Schematic & Circuit
![Circuit](Add your circuit diagram here)
*Add caption explaining connections*

![Schematic](Add your schematic diagram here)
*Add caption explaining the schematic*

# Build Photos
![Components](Add photo of your components here)
*List out all components shown*

![Build](Add photos of build process here)
*Explain the build steps*

![Final](Add photo of final product here)
*Explain the final build*

### Project Demo
# Video
[https://drive.google.com/drive/folders/1g_ktJ3iz1XTjAMi4b0kQ9WroBOga41h6]
The video demonstrates the working of our website.First we can see an opening interface and then an interface for uploading live or recorded video opens up. The user can upload the video. Our website analysres the facial epressions and predictys whether the person is committed, single or dating. Facila models has been given and the prediction is done also on the basis of eye movememts, blinking rate,gaze stability and eye symmetry. The site gives the reason for its prediction and also atlast we can download our roast card. The site is built in sucvch a way that it gives reasons to peoplke in a roasting way.

# Additional Demos
[Add any extra demo materials/links]

## Team Contributions
- [Reema Rinu]:[Project, documentation]
u- [Ajmal.N]: [Project, documentation]

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)






