# SiteRecall: 3-Minute YouTube Demo Video Script

**Presenter Name:** Mohammed Abdul Kareem  
**Target Video Duration:** 3 minutes (180 seconds)  
**Style:** Screen recording (1080p) + optional webcam talking head in bottom-right corner  
**Application URL:** `http://localhost:3000`  
**GitHub Repository:** `https://github.com/Md-Abdul-Kareem/siterecall`  

---

## 5 High-Performing YouTube Video Titles
1. **Why Your AI SRE Agent Is Dangerous Without Memory (And How We Fixed It)** *(Recommended)*
2. **I Replaced Our Incident On-Call Bot With Hindsight Graph Memory**
3. **Stateless LLMs vs. SiteRecall Memory: The 2 AM Outage Test**
4. **How Agent Memory Cut Our Production MTTR From 48 Mins to 34 Seconds**
5. **We Built an AI Incident War Room That Never Forgets an Outage**

---

## Complete Video Script & Visual Cues

### Section 1: The Killer Hook (0:00 - 0:30)
**[SCREEN CUE]**:  
Full screen on the **SiteRecall War Room Dashboard** (`http://localhost:3000`).  
Close-up on the flashing red outage banner:  
`SEV-1 OUTAGE: 4,200 transactions/min failing. Estimated revenue loss: $18,500/min.`

**[VOICEOVER (0:00 - 0:10 - The Hook)]**:  
> *"If you paste a 2 AM production outage into standard ChatGPT or Claude, it will tell you to restart your servers. If you actually run that restart, you will terminate in-flight database transactions, drop 4,000 active customer carts, and turn a 2-minute glitch into a $90,000 disaster.*

**[VOICEOVER (0:10 - 0:30 - The Reveal)]**:  
> *Hey everyone! My name is Mohammed Abdul Kareem, and this is **SiteRecall**—an Autonomous SRE Incident War Room that gives AI a persistent memory graph.*  
> *Today, I'm showing you why standard AI is dangerously amnesiac during outages, and how we solved it using **Vectorize Hindsight** and **Google Gemini 3.8 Flash**."*

---

### Section 2: The Problem: The Stateless Amnesiac Agent (0:30 - 1:00)
**[SCREEN CUE]**:  
Zoom in on the **Stateless Agent Card (Left Side of Comparison View)**.  
Highlight the red warning box and the estimated downtime of 45 - 60 minutes.

**[VOICEOVER]**:  
> *"Here’s our scenario: Swiggy’s payment gateway is throwing HTTP 504 timeouts during the Friday dinner rush. Over 4,200 orders are failing every minute.*  
> *Look at what the standard, stateless AI suggests: 'Restart all payment pods and wipe the redis cache.'*  
> *In production, that generic advice is fatal! Restarting the pods kills in-flight banking locks, drops active carts, and causes double-billing disputes that take 45 minutes to untangle. The AI doesn't know this because it has no memory of our past post-mortems."*

---

### Section 3: The Live Demo: Hindsight Memory in Action (1:00 - 2:30)
**[SCREEN CUE]**:  
Pan smoothly to the **SiteRecall Card (Right Side)**.  
Highlight the 97% confidence badge and the sub-35 second estimated MTTR.

**[VOICEOVER]**:  
> *"Now look at the right side: this is SiteRecall powered by Hindsight Cloud.*  
> *In sub-100 milliseconds, Hindsight ran a multi-hop traversal across our organizational memory graph. It found a 97% match with Incident #412 from 18 days ago, resolved by our principal SRE, Priya Sharma.*  
> *Notice two crucial things:*  
> *First, it flashes an immediate guardrail warning: 'DO NOT restart pods—this causes double charges.'*  
> *Second, it pulls up the exact verified runbook: `hot-bump-bank-timeout.sh`."*

**[SCREEN CUE]**:  
Scroll down to the **Memory Graph Visualizer**. Click on individual nodes:  
`payment-gateway` ──> `INC-412` ──> `Priya Sharma` ──> `hot-bump-bank-timeout.sh` ──> `AVOID: Master Pod Restart`.  
Show how each node displays its relationships in real-time.

**[VOICEOVER]**:  
> *"Down here is the actual multi-hop entity graph Hindsight traverses in real time: linking the microservice, the past Sev-1 incident, the author engineer, the verified runbook, and the lethal antipattern.*  
> *Now let's execute the fix."*

**[SCREEN CUE]**:  
Click the glowing green **[Execute Safe Runbook]** button.  
The **Runbook Terminal** streams live execution lines, checks pod health, and confetti celebration explodes across the screen as the badge flips to **RESOLVED (35s MTTR)**.

**[VOICEOVER]**:  
> *"With one click, the runbook runs in our secure terminal, patches the sidecar connection ceiling, and verifies zero transaction drops.*  
> *And here’s the magic: SiteRecall calls `hindsight.retain()`, saving this post-mortem to the memory bank so the system gets even smarter for future incidents."*

---

### Section 4: Wrap-Up & Reflections (2:30 - 3:00)
**[SCREEN CUE]**:  
Click on the **[Reflections (3)]** button in the navbar.  
Show the modal with synthesized cross-incident patterns across payment, inventory, and sockets.

**[VOICEOVER]**:  
> *"What surprised me most while building this is that agent memory isn't just about search—it's about continuous learning. When we click 'Reflections', Hindsight analyzes patterns across weeks of incidents to tell our architects where our systemic infrastructure debt actually is before the next alert fires.*  
> *You can check out the entire open-source codebase, architecture docs, and live webhook API on our GitHub repo linked below. Thanks for watching!"*

---

## Recording Tips for Maximum Impact
1. **Resolution:** Record in full 1080p (1920x1080) at 60 FPS using OBS Studio or Loom.
2. **Audio:** Speak clearly with energy, especially on the 10-second opening hook.
3. **Cursor:** Use a clear mouse pointer with click highlight if available.
4. **Pacing:** Let the confetti celebration in Section 3 linger for 3-4 seconds—it's a great visual climax for the judges!
