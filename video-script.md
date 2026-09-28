# SiteRecall: 3-Minute YouTube Demo Video Script

**Presenter Name:** [YOUR NAME]  
**Target Video Duration:** 3 minutes (180 seconds)  
**Style:** Screen recording + optional webcam talking head in bottom corner  
**Resolution:** 1080p minimum  

---

## 5 High-Performing YouTube Video Titles
1. **Why Your AI SRE Agent Is Dangerous Without Memory (And How We Fixed It)**
2. **I Replaced Our Incident On-Call Bot With Hindsight Graph Memory**
3. **Stateless LLMs vs. SiteRecall Memory: The 2 AM Outage Test**
4. **How Agent Memory Cut Our Production MTTR From 48 Mins to 34 Seconds**
5. **We Built an AI Incident War Room That Never Forgets an Outage**

---

## Video Script & Visual Cues

### Section 1: Quick Intro (0:00 - 0:30)
**[SCREEN CUE]**: Start on the full **SiteRecall War Room Dashboard** (`http://localhost:3000`). Show the dark-mode mission control UI, the red SEV-1 Swiggy outage alert pulsing, and the live telemetry metrics.

**[VOICEOVER]**:  
> *"Hey everyone! My name is [YOUR NAME], and today I want to show you SiteRecall—an autonomous incident intelligence war room built for engineering teams.  
> When production goes down in the middle of the night, every minute of downtime costs thousands of dollars. But when engineers turn to modern AI agents for help, they run into a huge problem: standard AI has zero long-term memory. It treats every single outage as if it was born five seconds ago. Today, we're fixing that using Hindsight graph memory and Gemini 3.8 Flash."*

---

### Section 2: The Problem: The Amnesiac Agent (0:30 - 1:00)
**[SCREEN CUE]**: Zoom in on the **Stateless Agent Card (Left Side of Comparison View)**. Highlight the red warning box.

**[VOICEOVER]**:  
> *"Here’s our scenario: Swiggy’s payment gateway is throwing HTTP 504 timeouts during the Friday dinner rush. 4,200 orders are failing per minute.  
> Look at what the standard, stateless AI suggests: 'Restart all payment pods and wipe the redis cache.'  
> In production, that generic advice is fatal! Restarting the pods kills in-flight banking locks, drops active carts, and causes double-billing disputes that take 45 minutes to untangle. The AI doesn't know this because it has no memory of our past post-mortems."*

---

### Section 3: The Live Demo: Hindsight Memory in Action (1:00 - 2:30)
**[SCREEN CUE]**: Pan to the **SiteRecall Card (Right Side)**, then scroll down to the **Hindsight Multi-Hop Entity Graph**.

**[VOICEOVER]**:  
> *"Now look at the right side: this is SiteRecall powered by Hindsight.  
> In sub-100 milliseconds, Hindsight ran a multi-hop traversal across our organizational memory graph. It found a 97% match with Incident #412 from 18 days ago, resolved by our principal SRE, Priya Sharma.  
> Notice two crucial things:  
> First, it flashes an immediate guardrail warning: 'DO NOT restart pods—this causes double charges.'  
> Second, it pulls up the exact verified runbook: `hot-bump-bank-timeout.sh`."*

**[SCREEN CUE]**: Click on the nodes in the **Memory Graph Visualizer** (`payment-gateway` -> `INC-412` -> `Priya Sharma` -> `Runbook`). Show how each entity reveals its context.

**[VOICEOVER]**:  
> *"Down here, you can see the actual entity graph that Hindsight built: connecting the microservice, the past outage, the engineer, and the safe command.  
> Now let's execute the fix."*

**[SCREEN CUE]**: Click the **[Execute Verified Runbook]** button. Show the embedded **Runbook Terminal** streaming live output, verifying the healthcheck, and the confetti celebration bursting as the status changes to **RESOLVED**.

**[VOICEOVER]**:  
> *"With one click, the runbook runs in our secure terminal, patches the sidecar connection ceiling, and verifies zero transaction drops.  
> And here’s the magic: SiteRecall calls `hindsight.retain()`, saving this post-mortem to the memory bank so the system gets even smarter for future incidents."*

---

### Section 4: Wrap-Up & Key Takeaway (2:30 - 3:00)
**[SCREEN CUE]**: Click on the **[Reflections]** button in the navbar to show the modal with systemic cross-incident patterns.

**[VOICEOVER]**:  
> *"What surprised me most while building this is that agent memory isn't just about search—it's about learning. When we click 'Reflections', Hindsight analyzes patterns across weeks of incidents to tell our architects where our systemic infrastructure debt actually is before the next alert fires.  
> You can check out the entire codebase, architecture docs, and live webhook API on our GitHub repo linked below. Thanks for watching!"*
