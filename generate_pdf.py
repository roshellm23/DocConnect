import sys
import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 755, "DocConnect — Review 1 Presentation Script & Defense Guide")
            self.drawRightString(612 - 54, 755, "Speaker: Roshell Miranda (P1)")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 747, 612 - 54, 747)
        
        # Footer
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(612 - 54, 36, page_text)
        self.drawString(54, 36, "DocConnect DevOps Mini-Project | DBIT IT Dept")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 48, 612 - 54, 48)
        
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    primary_color = colors.HexColor("#1E3A8A")   # Deep Blue
    secondary_color = colors.HexColor("#0D9488") # Teal
    dark_text = colors.HexColor("#0F172A")       # Slate 900
    body_text_col = colors.HexColor("#334155")   # Slate 700
    callout_bg = colors.HexColor("#F8FAFC")      # Light Slate bg
    box_border = colors.HexColor("#E2E8F0")
    script_bg = colors.HexColor("#EFF6FF")       # Light Blue
    script_border = colors.HexColor("#3B82F6")   # Blue 500
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=primary_color,
        alignment=0,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=secondary_color,
        spaceAfter=15
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=secondary_color,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=body_text_col,
        spaceAfter=6
    )
    
    body_bold = ParagraphStyle(
        'Body_Bold_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13.5,
        textColor=dark_text,
        spaceAfter=6
    )
    
    script_style = ParagraphStyle(
        'Script_Text',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=dark_text
    )
    
    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=body_text_col
    )
    
    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.white
    )

    story = []
    
    # Header Banner
    story.append(Paragraph("DocConnect — First Review Guide & Script", title_style))
    story.append(Paragraph("<b>Speaker Role:</b> Roshell Miranda (P1 — Full Stack & Git Repository Owner)<br/><b>Focus Slides:</b> 4, 5, and 6 | Comprehensive Q&amp;A &amp; Slide-by-Slide Knowledge", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceAfter=12))
    
    # -------------------------------------------------------------
    # SECTION 1: SPEAKING SCRIPT (SLIDES 4, 5, 6)
    # -------------------------------------------------------------
    story.append(Paragraph("Part 1: Your Spoken Presentation Script (Slides 4 – 6)", h1_style))
    story.append(Paragraph("<i>Speak calmly at a steady pace. Use the exact words below for each slide.</i>", body_style))
    story.append(Spacer(1, 4))
    
    # Slide 4
    story.append(Paragraph("🎙️ Slide 4: Scope &amp; Expected Outcomes", h2_style))
    s4_text = """<b>Spoken Script:</b><br/>
"Good morning / afternoon respected panel members.<br/><br/>
Moving to the <b>Scope and Expected Outcomes</b> of DocConnect:<br/><br/>
On the <b>Scope</b> side:<br/>
• <b>Single Shared Repository:</b> We structured our codebase into four parallel modules: full-stack application, Docker containerization, Terraform cloud infrastructure, and Kubernetes orchestration.<br/>
• <b>Cloud Integration:</b> All four modules integrate into a single unified deployment on AWS Kubernetes.<br/>
• <b>Synthetic Demo Data:</b> We use realistic synthetic healthcare records so we can test booking workflows without privacy or compliance risks.<br/>
• <b>End-to-End Pipeline:</b> Our scope spans code commit → automated testing → container build → cloud deployment → horizontal autoscaling. Heavy clinical compliance like HIPAA is kept out of scope for this mini-project.<br/><br/>
On the <b>Expected Outcomes</b> side:<br/>
1. A live, responsive <b>DocConnect appointment portal</b> reachable end-to-end.<br/>
2. <b>Zero-touch CI/CD automation</b> via Jenkins triggering builds and tests on every commit.<br/>
3. <b>Visible Horizontal Pod Autoscaling (HPA)</b> spinning up extra backend replicas during simulated traffic spikes.<br/>
4. <b>Automatic self-healing</b>, where Kubernetes automatically detects and restarts failed pods in seconds."
"""
    t4 = Table([[Paragraph(s4_text, script_style)]], colWidths=[504])
    t4.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), script_bg),
        ('BOX', (0,0), (-1,-1), 1, script_border),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t4)
    story.append(Spacer(1, 10))
    
    # Slide 5
    story.append(Paragraph("🎙️ Slide 5: SDG Mapping &amp; Societal Impact", h2_style))
    s5_text = """<b>Spoken Script:</b><br/>
"Next, I will explain how DocConnect directly contributes to the <b>UN Sustainable Development Goals (SDGs)</b> and supports community healthcare:<br/><br/>
• <b>SDG 3 — Good Health &amp; Well-Being (Primary Goal):</b> Small clinics and rural centers often suffer from crashed servers and lost appointments. DocConnect ensures uninterrupted healthcare access and continuity of care through zero-downtime deployment.<br/>
• <b>SDG 9 — Industry, Innovation &amp; Infrastructure:</b> We provide a resilient, automated cloud infrastructure with CI/CD and self-healing, giving community healthcare providers enterprise-level reliability without requiring in-house DevOps staff.<br/>
• <b>SDG 12 — Responsible Consumption &amp; Production:</b> Instead of paying for oversized, always-on servers, Kubernetes autoscaling dynamically scales compute pods up during peak morning hours and scales down during quiet hours, reducing cloud energy waste and operational costs.<br/><br/>
<b>Societal Impact:</b> DocConnect is ideal for small clinics, NGO medical camps, and telehealth setups to prevent double-bookings, survive seasonal traffic spikes (like flu season), and run with zero maintenance overhead."
"""
    t5 = Table([[Paragraph(s5_text, script_style)]], colWidths=[504])
    t5.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), script_bg),
        ('BOX', (0,0), (-1,-1), 1, script_border),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t5)
    story.append(Spacer(1, 10))
    
    # Slide 6
    story.append(Paragraph("🎙️ Slide 6: Literature Review &amp; Research Gap", h2_style))
    s6_text = """<b>Spoken Script:</b><br/>
"Now looking at the <b>Literature Review</b>:<br/><br/>
We analyzed recent research papers in cloud-native healthcare and DevOps adoption:<br/>
1. <b>Cloud-native Healthcare (Salunkhe et al.):</b> Highlighted that Docker and Kubernetes improve deployment consistency and high availability.<br/>
   <i>• Research Gap:</i> Existing studies are mostly conceptual and lack an end-to-end practical DevOps lifecycle.<br/>
2. <b>DevOps in Telehealth (Vemuri &amp; Oluwaseyi):</b> Demonstrated that CI/CD and Infrastructure-as-Code eliminate deployment bottlenecks.<br/>
   <i>• Research Gap:</i> Very few practical implementations connect real appointment management systems with automated pipelines.<br/>
3. <b>Microservices Scalability (Akerele et al.):</b> Proved that modular microservices offer superior resource efficiency compared to monoliths.<br/>
   <i>• Research Gap:</i> Prior work focuses on architectural diagrams without automated infrastructure provisioning.<br/><br/>
<b>How DocConnect Fills the Gap:</b> We deliver both a working full-stack appointment application and an automated, reproducible cloud pipeline using Jenkins, Terraform, and AWS Kubernetes.<br/><br/>
<i>(Handover line):</i> Now, I would like to hand over to my teammate to present our Proposed System architecture."
"""
    t6 = Table([[Paragraph(s6_text, script_style)]], colWidths=[504])
    t6.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), script_bg),
        ('BOX', (0,0), (-1,-1), 1, script_border),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t6)
    
    story.append(PageBreak())
    
    # -------------------------------------------------------------
    # SECTION 2: SLIDE-BY-SLIDE CRASH COURSE
    # -------------------------------------------------------------
    story.append(Paragraph("Part 2: Complete Slide-by-Slide Crash Course (Slides 1 to 12)", h1_style))
    story.append(Paragraph("Know the entire deck so you can comfortably handle any question across the presentation.", body_style))
    story.append(Spacer(1, 6))
    
    slide_data = [
        [Paragraph("Slide", table_header), Paragraph("Slide Title", table_header), Paragraph("Summary & Key Takeaway (In Plain English)", table_header)],
        [Paragraph("1", table_cell), Paragraph("Title Slide", table_cell), Paragraph("<b>DocConnect: Healthcare Appointment System with DevOps Automation</b>. Team of 4 members: Simone, Shraddha, Roshell (You), Kalanidhi.", table_cell)],
        [Paragraph("2", table_cell), Paragraph("Problem Statement", table_cell), Paragraph("Small clinics deploy websites manually. When servers fail or traffic spikes during flu season, appointments break and recovery is slow due to lack of in-house DevOps staff.", table_cell)],
        [Paragraph("3", table_cell), Paragraph("Objectives", table_cell), Paragraph("5 goals: 1) Full-stack app (React, Node, Postgres), 2) Docker containers, 3) Jenkins CI/CD, 4) Terraform AWS IaC, 5) Kubernetes auto-scaling & self-healing.", table_cell)],
        [Paragraph("4", table_cell), Paragraph("Scope & Expected Outcomes <i>(Your Slide)</i>", table_cell), Paragraph("Shared repo, 4 workstreams, synthetic data, AWS deployment. Proves zero-touch CI/CD, HPA autoscaling, and pod self-healing.", table_cell)],
        [Paragraph("5", table_cell), Paragraph("SDG & Societal Impact <i>(Your Slide)</i>", table_cell), Paragraph("SDG 3 (Healthcare uptime), SDG 9 (Resilient infrastructure), SDG 12 (Cost & energy efficiency via HPA). Benefits small clinics & NGO camps.", table_cell)],
        [Paragraph("6", table_cell), Paragraph("Literature Review <i>(Your Slide)</i>", table_cell), Paragraph("Surveyed 4 papers. Identifies gap: existing research is theoretical; DocConnect provides the missing end-to-end practical cloud implementation.", table_cell)],
        [Paragraph("7", table_cell), Paragraph("Proposed System", table_cell), Paragraph("System architecture: Patient/Clinic &rarr; React &rarr; Express REST API &rarr; PostgreSQL RDS, managed with Jenkins, Docker, and AWS Kubernetes.", table_cell)],
        [Paragraph("8", table_cell), Paragraph("DevOps Toolchain", table_cell), Paragraph("The 6 tools: <b>Git/GitHub</b> (Source), <b>Jenkins</b> (CI/Build), <b>Docker</b> (Containers), <b>Terraform</b> (IaC), <b>AWS</b> (Cloud), <b>Kubernetes</b> (Orchestration).", table_cell)],
        [Paragraph("9", table_cell), Paragraph("Roadmap", table_cell), Paragraph("8-week execution plan dividing App, Docker/Jenkins, AWS/Terraform, and Kubernetes with progressive milestone checkpoints.", table_cell)],
        [Paragraph("10", table_cell), Paragraph("Group Organization", table_cell), Paragraph("Role division: <b>P1 Roshell</b> (Full Stack & Git), <b>P2 Kalanidhi</b> (Docker/Jenkins), <b>P3 Shraddha</b> (AWS/Terraform), <b>P4 Simone</b> (Kubernetes).", table_cell)],
        [Paragraph("11-12", table_cell), Paragraph("References & Thank You", table_cell), Paragraph("Academic citations for literature review, IEEE/SSRN papers, and closing slide.", table_cell)],
    ]
    
    t_slides = Table(slide_data, colWidths=[40, 120, 344])
    t_slides.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, box_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, callout_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_slides)
    
    story.append(Spacer(1, 14))
    
    # -------------------------------------------------------------
    # SECTION 3: FULL STACK CHEAT SHEET
    # -------------------------------------------------------------
    story.append(Paragraph("Part 3: Full Stack Developer Mastery (Your Role — P1)", h1_style))
    story.append(Paragraph("Since you built the entire application, here are your core implementation details:", body_style))
    story.append(Spacer(1, 4))
    
    tech_details = """
<b>1. React 19 Frontend (Vite):</b>
• Responsive booking interface, dynamic calendar/slot picker, appointment management table, cancellation confirmation modal.
• Modular architecture: <code>components/</code>, <code>pages/</code>, <code>services/api.js</code>.<br/><br/>
<b>2. Node.js &amp; Express REST API:</b>
• <code>GET /health</code>: Health probe verifying live PostgreSQL connectivity (used by Kubernetes liveness/readiness probes).
• <code>GET /appointments</code>: Lists booked appointments with filtering.
• <code>POST /appointments</code>: Schedules a new visit with input validation middleware.
• <code>PUT /appointments/:id</code> &amp; <code>DELETE /appointments/:id</code>: Update or cancel appointment status.<br/><br/>
<b>3. PostgreSQL Database Layer:</b>
• <code>pg.Pool</code> connection pooling to handle concurrent client requests smoothly.
• <b>Double-Booking Prevention:</b> Composite unique constraints on <code>(doctor_id, appointment_date, time_slot)</code>.
• <b>Security:</b> Fully parameterized SQL queries (<code>$1, $2...</code>) preventing SQL Injection.
"""
    t_tech = Table([[Paragraph(tech_details, body_style)]], colWidths=[504])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), callout_bg),
        ('BOX', (0,0), (-1,-1), 1, box_border),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t_tech)
    
    story.append(PageBreak())
    
    # -------------------------------------------------------------
    # SECTION 4: PANEL Q&A VIVA DEFENSE
    # -------------------------------------------------------------
    story.append(Paragraph("Part 4: Panel Q&amp;A &amp; Viva Defense Cheat Sheet", h1_style))
    story.append(Paragraph("Anticipated questions from the review panel and how to answer them confidently:", body_style))
    story.append(Spacer(1, 6))
    
    qas = [
        ("Q1: Why did you use synthetic data instead of real patient data (Slide 4)?",
         "Real clinical data requires strict HIPAA/GDPR compliance, data encryption at rest, and audit tracking, which is out of scope for this mini-project. Synthetic data lets us thoroughly test high-traffic booking, double-booking logic, and Kubernetes autoscaling safely."),
        
        ("Q2: What is the main research gap you identified in your Literature Review (Slide 6)?",
         "Existing academic papers discuss cloud-native healthcare or microservices conceptually, but lack practical, reproducible implementations. DocConnect bridges this gap by combining a complete full-stack appointment application with an end-to-end automated Jenkins CI/CD and AWS Kubernetes pipeline."),
         
        ("Q3: How does your backend integrate with Kubernetes (Slide 7 & P4's work)?",
         "I created a dedicated <code>/health</code> endpoint in Express. When deployed on Kubernetes, K8s periodically pings this endpoint as <b>Liveness and Readiness probes</b>. If database connectivity drops or Express hangs, Kubernetes detects it and automatically restarts the pod (self-healing)."),
         
        ("Q4: How do you prevent double-booking of doctors in your application?",
         "Double-booking is prevented at two layers: 1) At the database layer, PostgreSQL enforces a composite unique constraint on <code>(doctor_id, appointment_date, time_slot)</code>. 2) In Express backend, we check slot availability and return a <code>409 Conflict</code> status code if already booked."),
         
        ("Q5: Why did you select PostgreSQL instead of MongoDB?",
         "Healthcare appointment booking requires strict <b>ACID compliance</b> and relational data integrity between doctors, patients, and time slots. PostgreSQL guarantees that two concurrent booking requests for the exact same slot will never collide."),
         
        ("Q6: How does Kubernetes Horizontal Pod Autoscaling (HPA) work for your application?",
         "Our Express backend is completely stateless inside Docker containers. Kubernetes monitors CPU and memory usage via the Metrics Server. When appointment traffic surges, HPA scales backend pods from 2 to 5+ replicas automatically, distributing the load."),
         
        ("Q7: What is the purpose of Terraform in your project?",
         "Terraform is our <b>Infrastructure as Code (IaC)</b> tool. Instead of manually clicking buttons in the AWS console, Terraform provisions our AWS VPC networking, subnets, IAM roles, and EKS Kubernetes cluster in a repeatable, version-controlled script.")
    ]
    
    for q, a in qas:
        qa_content = f"<b>{q}</b><br/><b>Answer:</b> {a}"
        t_qa = Table([[Paragraph(qa_content, body_style)]], colWidths=[504])
        t_qa.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(t_qa)
        story.append(Spacer(1, 6))
        
    story.append(Spacer(1, 8))
    
    # -------------------------------------------------------------
    # SECTION 5: DELIVERY TIPS
    # -------------------------------------------------------------
    story.append(Paragraph("Part 5: Quick Tips for Presentation Day", h1_style))
    tips_text = """
• <b>Pacing &amp; Eye Contact:</b> Speak clearly at an easy pace. Slides 4 to 6 should take about <b>2 to 2.5 minutes</b>.<br/>
• <b>Ownership:</b> Show confidence because you wrote the entire full-stack application code.<br/>
• <b>Teamwork Handover:</b> When finishing Slide 6, smoothly pass the baton: <i>'Now, I would like to hand over to [Teammate Name] to walk us through the Proposed System.'</i>
"""
    t_tips = Table([[Paragraph(tips_text, body_style)]], colWidths=[504])
    t_tips.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0FDF4")), # Light green
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#22C55E")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_tips)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {filename}")

if __name__ == '__main__':
    out_pdf = os.path.abspath("DocConnect_First_Review_Preparation_Guide.pdf")
    build_pdf(out_pdf)
