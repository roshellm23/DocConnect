import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # Blank layout

    # Colors
    c_navy = RGBColor(15, 23, 42)       # Slate 900
    c_blue = RGBColor(30, 58, 138)      # Blue 900
    c_teal = RGBColor(13, 148, 136)     # Teal 600
    c_dark = RGBColor(30, 41, 59)       # Slate 800
    c_body = RGBColor(51, 65, 85)       # Slate 700
    c_muted = RGBColor(100, 116, 139)   # Slate 500
    c_card_bg = RGBColor(248, 250, 252) # Slate 50
    c_white = RGBColor(255, 255, 255)
    c_border = RGBColor(203, 213, 225)  # Slate 300
    c_green = RGBColor(22, 163, 74)     # Green 600
    c_amber = RGBColor(217, 119, 6)     # Amber 600
    c_card_blue = RGBColor(239, 246, 255)

    logo_path = r"D:\desk\DocConnect\presentation_assets\dbit_logo.png"
    arch_path = r"D:\desk\DocConnect\presentation_assets\architecture_diagram.png"
    img_dash = r"D:\desk\DocConnect\presentation_assets\screenshot_dashboard.jpg"
    img_book = r"D:\desk\DocConnect\presentation_assets\screenshot_booking.jpg"
    img_spec = r"D:\desk\DocConnect\presentation_assets\screenshot_specialists.jpg"

    def add_header(slide, title_text, category_text="DBIT/IT/V/25IT5CEP3/DevOps-MiniProject", slide_num=None):
        # DBIT Logo top-left
        if os.path.exists(logo_path):
            slide.shapes.add_picture(logo_path, Inches(0.6), Inches(0.35), width=Inches(1.0), height=Inches(0.88))
        
        # Category / Project code
        tb_cat = slide.shapes.add_textbox(Inches(1.75), Inches(0.35), Inches(8.5), Inches(0.3))
        p_cat = tb_cat.text_frame.paragraphs[0]
        p_cat.text = category_text
        p_cat.font.size = Pt(11)
        p_cat.font.name = 'Arial'
        p_cat.font.color.rgb = c_muted
        tb_cat.text_frame.margin_left = tb_cat.text_frame.margin_right = tb_cat.text_frame.margin_top = tb_cat.text_frame.margin_bottom = 0

        # Slide Title
        tb_title = slide.shapes.add_textbox(Inches(1.75), Inches(0.65), Inches(9.5), Inches(0.55))
        p_title = tb_title.text_frame.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(20)
        p_title.font.bold = True
        p_title.font.name = 'Arial'
        p_title.font.color.rgb = c_blue
        tb_title.text_frame.margin_left = tb_title.text_frame.margin_right = tb_title.text_frame.margin_top = tb_title.text_frame.margin_bottom = 0

        # Group 6 Badge (circle top right)
        circle = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(12.0), Inches(0.35), Inches(0.8), Inches(0.8))
        circle.fill.solid()
        circle.fill.fore_color.rgb = c_white
        circle.line.color.rgb = c_dark
        circle.line.width = Pt(1.5)
        p_circ = circle.text_frame.paragraphs[0]
        p_circ.text = "6"
        p_circ.font.size = Pt(16)
        p_circ.font.bold = True
        p_circ.font.color.rgb = c_dark
        p_circ.alignment = PP_ALIGN.CENTER

        # Slide Number bottom-right
        if slide_num:
            tb_num = slide.shapes.add_textbox(Inches(12.2), Inches(7.0), Inches(0.8), Inches(0.3))
            p_num = tb_num.text_frame.paragraphs[0]
            p_num.text = str(slide_num)
            p_num.font.size = Pt(10)
            p_num.font.color.rgb = c_muted
            p_num.alignment = PP_ALIGN.RIGHT

    def add_card(slide, left, top, width, height, title, body_bullets=None, bg_color=c_card_bg, border_color=c_border, title_color=c_blue):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1)

        tf = shape.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.2)
        tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.18)
        tf.margin_bottom = Inches(0.18)

        p0 = tf.paragraphs[0]
        p0.text = title
        p0.font.bold = True
        p0.font.size = Pt(13)
        p0.font.name = 'Arial'
        p0.font.color.rgb = title_color
        p0.space_after = Pt(8)

        if body_bullets:
            for b in body_bullets:
                p = tf.add_paragraph()
                p.text = b
                p.font.size = Pt(10.5)
                p.font.name = 'Arial'
                p.font.color.rgb = c_body
                p.space_after = Pt(4)
        return shape

    # =========================================================================
    # SLIDE 1: TITLE SLIDE
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    if os.path.exists(logo_path):
        s1.shapes.add_picture(logo_path, Inches(1.0), Inches(0.8), width=Inches(1.6), height=Inches(1.4))

    # Top Department Tag
    tb1_dept = s1.shapes.add_textbox(Inches(3.0), Inches(0.9), Inches(8.0), Inches(0.4))
    p = tb1_dept.text_frame.paragraphs[0]
    p.text = "DBIT / DEPARTMENT OF INFORMATION TECHNOLOGY / SEM V / 2026-2027"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = c_muted

    # Title & Subtitle
    tb1_title = s1.shapes.add_textbox(Inches(1.0), Inches(2.3), Inches(11.3), Inches(1.6))
    p1 = tb1_title.text_frame.paragraphs[0]
    p1.text = "DocConnect : Healthcare Appointment System\nwith DevOps Automation"
    p1.font.size = Pt(28)
    p1.font.bold = True
    p1.font.color.rgb = c_navy
    p1.space_after = Pt(10)

    p2 = tb1_title.text_frame.add_paragraph()
    p2.text = "SDG 3 (Good Health & Well-being)  •  SDG 9 (Industry, Innovation & Infrastructure)  •  SDG 12 (Responsible Consumption)"
    p2.font.size = Pt(12.5)
    p2.font.bold = True
    p2.font.color.rgb = c_teal

    # Team Members Box
    tm_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(4.3), Inches(11.333), Inches(2.2))
    tm_box.fill.solid()
    tm_box.fill.fore_color.rgb = c_card_bg
    tm_box.line.color.rgb = c_border
    tm_box.line.width = Pt(1)

    tf_tm = tm_box.text_frame
    tf_tm.margin_left = Inches(0.4)
    tf_tm.margin_top = Inches(0.2)
    p_th = tf_tm.paragraphs[0]
    p_th.text = "Project Team Members (Group 6):"
    p_th.font.size = Pt(13)
    p_th.font.bold = True
    p_th.font.color.rgb = c_blue
    p_th.space_after = Pt(10)

    members = [
        ("Roll 13", "Simone D’sa", "P4: Kubernetes Orchestration & Scaling"),
        ("Roll 18", "Shraddha Hebbar", "P3: AWS Cloud & Terraform IaC"),
        ("Roll 34", "Roshell Miranda", "P1: Full Stack Application & Git Repository Owner"),
        ("Roll 37", "Kalanidhi Namboothiri", "P2: Docker Containerization & Jenkins CI/CD")
    ]
    for roll, name, role in members:
        p_m = tf_tm.add_paragraph()
        p_m.text = f"•  {roll} — {name}  |  {role}"
        p_m.font.size = Pt(11)
        p_m.font.color.rgb = c_dark
        p_m.space_after = Pt(4)

    # Group Circle
    circ1 = s1.shapes.add_shape(MSO_SHAPE.OVAL, Inches(11.5), Inches(0.8), Inches(1.0), Inches(1.0))
    circ1.fill.solid()
    circ1.fill.fore_color.rgb = c_white
    circ1.line.color.rgb = c_dark
    circ1.line.width = Pt(1.5)
    p_c1 = circ1.text_frame.paragraphs[0]
    p_c1.text = "6"
    p_c1.font.size = Pt(20)
    p_c1.font.bold = True
    p_c1.font.color.rgb = c_dark
    p_c1.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 2: PROBLEM STATEMENT
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "Problem Statement", slide_num=2)

    c1 = add_card(s2, Inches(0.8), Inches(1.6), Inches(5.6), Inches(4.8), 
                  "Operational Challenges in Small Healthcare Clinics",
                  [
                      "• Manual & Paper-Based Workflows: Small healthcare providers and community clinics frequently rely on spreadsheets or uncoordinated manual systems, resulting in double-booking and appointment record loss.",
                      "• Absence of In-House DevOps: Most local clinics and NGOs lack dedicated IT or DevOps personnel, leading to slow, error-prone manual recovery whenever systems fail.",
                      "• Traffic Surges & Inelasticity: Patient bookings experience severe spikes during seasonal epidemics (e.g., flu season) and morning reservation hours. Static manual infrastructure cannot dynamically scale up to meet demand nor scale down to cut costs.",
                      "• Compromised Continuity of Care: Server downtime directly impacts patient access to specialists, increasing wait times and emergency room congestion."
                  ],
                  bg_color=c_card_bg, border_color=c_border, title_color=c_blue)

    c2 = add_card(s2, Inches(6.8), Inches(1.6), Inches(5.6), Inches(4.8), 
                  "Deployment Inefficiencies & Infrastructure Gaps",
                  [
                      "• Environment Inconsistency ('Works on my Machine'): Deploying backend and database services manually onto virtual machines introduces dependency mismatches and unpredictable runtime bugs.",
                      "• Absence of Automated CI/CD: Bug fixes and feature updates require manual terminal intervention, risking configuration drifts, faulty releases, and service interruption.",
                      "• Single Points of Failure: Traditional monolithic deployments lack automated liveness monitoring, leading to undetected outages until patients complain.",
                      "• The DocConnect Solution: A containerized, automated healthcare appointment system orchestrated via Kubernetes and Jenkins CI/CD to provide self-healing, elasticity, and zero-downtime maintenance."
                  ],
                  bg_color=c_card_blue, border_color=c_blue, title_color=c_navy)

    # =========================================================================
    # SLIDE 3: OBJECTIVES & OUTCOMES
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "Objectives & Outcomes", slide_num=3)

    obj_data = [
        ("01", "Full-Stack Healthcare Application", 
         "Develop a modular React 19, Express REST API, and PostgreSQL system for end-to-end appointment scheduling, specialist lookup, and status tracking.",
         "[IMPLEMENTED] Full-stack application functional with live database, validation & health probes."),
        ("02", "Docker Containerization", 
         "Package frontend and backend services into isolated, reproducible multi-stage Docker images to guarantee deployment parity across development and production.",
         "[IMPLEMENTED / PACKAGED] Dockerfile definitions configured for frontend and backend microservices."),
        ("03", "Automated Jenkins CI/CD Pipeline", 
         "Construct an automated pipeline triggered on code commit to execute test suites, build container images, and execute rolling cloud deployments without manual intervention.",
         "[PIPELINE DESIGNED] Pipeline stages (Checkout -> Test -> Build -> Deploy) scripted in Jenkinsfile."),
        ("04", "Terraform Cloud Provisioning (IaC)", 
         "Define and provision reproducible AWS cloud networking, IAM security roles, and managed compute/Kubernetes infrastructure as version-controlled code.",
         "[IaC ARCHITECTED] Terraform configuration blueprint structured for AWS cloud provisioning."),
        ("05", "Kubernetes Resilience & Autoscaling", 
         "Ensure high availability and fault tolerance through Horizontal Pod Autoscaler (HPA) during traffic spikes and self-healing pod recovery upon failure.",
         "[CONFIGURED / PROBES READY] Express /health probe integrated; K8s manifests configured.")
    ]

    top_y = 1.5
    for num, title, desc, outcome in obj_data:
        box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(top_y), Inches(11.733), Inches(0.95))
        box.fill.solid()
        box.fill.fore_color.rgb = c_card_bg
        box.line.color.rgb = c_border
        box.line.width = Pt(1)

        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.18)
        tf.margin_top = Inches(0.1)

        p = tf.paragraphs[0]
        p.text = f"{num}  |  {title}"
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = c_blue

        p_desc = tf.add_paragraph()
        p_desc.text = f"Objective: {desc}"
        p_desc.font.size = Pt(9.5)
        p_desc.font.color.rgb = c_dark

        p_out = tf.add_paragraph()
        p_out.text = f"Status & Outcome: {outcome}"
        p_out.font.size = Pt(9)
        p_out.font.bold = True
        p_out.font.color.rgb = c_green if "[IMPLEMENTED" in outcome else c_amber

        top_y += 1.05

    # =========================================================================
    # SLIDE 4: LITERATURE REVIEW (Part 1 - Papers 1 & 2)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "Literature Review — Cloud-Native Healthcare & Telehealth", slide_num=4)

    # Paper 1
    p1_box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.65), Inches(5.2))
    p1_box.fill.solid()
    p1_box.fill.fore_color.rgb = c_card_bg
    p1_box.line.color.rgb = c_border
    tf1 = p1_box.text_frame
    tf1.word_wrap = True
    tf1.margin_left = tf1.margin_right = Inches(0.25)
    tf1.margin_top = Inches(0.2)

    p = tf1.paragraphs[0]
    p.text = "Paper 01: Cloud Native Technologies for Healthcare Scalability"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = c_blue
    p.space_after = Pt(4)

    p = tf1.add_paragraph()
    p.text = "Citation: V. Salunkhe et al., 'The Impact of Cloud Native Technologies on Healthcare Application Scalability and Compliance,' IJPREMS, 2021. [1]"
    p.font.size = Pt(9)
    p.font.italic = True
    p.font.color.rgb = c_muted
    p.space_after = Pt(8)

    p = tf1.add_paragraph()
    p.text = "Overview: Investigates how cloud-native tooling (Docker, Kubernetes) addresses uptime, security compliance, and fluctuating patient demand in clinical applications."
    p.font.size = Pt(9.5)
    p.font.color.rgb = c_dark
    p.space_after = Pt(8)

    p = tf1.add_paragraph()
    p.text = "Key Findings & Metrics:\n• Containerization ensures deployment consistency across environments.\n• Kubernetes orchestration achieves automated horizontal scaling and high availability.\n• CI/CD pipeline integration significantly shortens release and patch cycles."
    p.font.size = Pt(9.5)
    p.font.color.rgb = c_body
    p.space_after = Pt(8)

    p = tf1.add_paragraph()
    p.text = "Research Gap & How DocConnect Addresses It:\nExisting research primarily provides conceptual frameworks for compliance and scalability but lacks an end-to-end, functional reference implementation. DocConnect provides a practical full-stack appointment system integrated with an automated DevOps toolchain."
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = c_navy

    # Paper 2
    p2_box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.5), Inches(5.65), Inches(5.2))
    p2_box.fill.solid()
    p2_box.fill.fore_color.rgb = c_card_bg
    p2_box.line.color.rgb = c_border
    tf2 = p2_box.text_frame
    tf2.word_wrap = True
    tf2.margin_left = tf2.margin_right = Inches(0.25)
    tf2.margin_top = Inches(0.2)

    p = tf2.paragraphs[0]
    p.text = "Paper 02: DevOps Adoption for Telehealth Services"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = c_blue
    p.space_after = Pt(4)

    p = tf2.add_paragraph()
    p.text = "Citation: N. Vemuri, 'DevOps for Telehealth Services: Accelerating Deployment and Scalability,' IJRITCC, 2024. [2]"
    p.font.size = Pt(9)
    p.font.italic = True
    p.font.color.rgb = c_muted
    p.space_after = Pt(8)

    p = tf2.add_paragraph()
    p.text = "Overview: Focuses on adopting automated CI/CD and Infrastructure-as-Code (IaC) to handle explosive user growth in modern telehealth platforms."
    p.font.size = Pt(9.5)
    p.font.color.rgb = c_dark
    p.space_after = Pt(8)

    p = tf2.add_paragraph()
    p.text = "Key Findings & Metrics:\n• Automated infrastructure provisioning reduces deployment bottlenecks.\n• Continuous integration accelerates zero-downtime maintenance.\n• Automated monitoring enables healthcare platforms to support expanded patient populations."
    p.font.size = Pt(9.5)
    p.font.color.rgb = c_body
    p.space_after = Pt(8)

    p = tf2.add_paragraph()
    p.text = "Research Gap & How DocConnect Addresses It:\nLiterature identifies a severe shortage of practical integrations combining real appointment booking workflows with declarative IaC (Terraform) and container CI/CD. DocConnect validates this integration with concrete REST APIs."
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = c_navy

    # =========================================================================
    # SLIDE 5: LITERATURE REVIEW (Part 2 - Papers 3 & 4)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "Literature Review — Deployment Efficiency & Microservices", slide_num=5)

    # Paper 3
    p3_box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.65), Inches(5.2))
    p3_box.fill.solid()
    p3_box.fill.fore_color.rgb = c_card_bg
    p3_box.line.color.rgb = c_border
    tf3 = p3_box.text_frame
    tf3.word_wrap = True
    tf3.margin_left = tf3.margin_right = Inches(0.25)
    tf3.margin_top = Inches(0.2)

    p = tf3.paragraphs[0]
    p.text = "Paper 03: Deployment Automation & Operational Reliability"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = c_blue
    p.space_after = Pt(4)

    p = tf3.add_paragraph()
    p.text = "Citation: J. Oluwaseyi, 'DevOps in the Context of Telehealth Services: Streamlining Deployment and Enabling Scalability,' SSRN Electronic Journal, 2023. [3]"
    p.font.size = Pt(9)
    p.font.italic = True
    p.font.color.rgb = c_muted
    p.space_after = Pt(8)

    p = tf3.add_paragraph()
    p.text = "Overview: Examines how automated testing, CI/CD pipelines, and health monitoring improve service reliability and reduce operational deployment friction."
    p.font.size = Pt(9.5)
    p.font.color.rgb = c_dark
    p.space_after = Pt(8)

    p = tf3.add_paragraph()
    p.text = "Key Findings & Metrics:\n• Automated pipelines drastically reduce human errors during production releases.\n• Comprehensive test suites prevent regression bugs in appointment workflows.\n• Proactive health monitoring lowers Mean Time to Recovery (MTTR)."
    p.font.size = Pt(9.5)
    p.font.color.rgb = c_body
    p.space_after = Pt(8)

    p = tf3.add_paragraph()
    p.text = "Research Gap & How DocConnect Addresses It:\nMost publications remain conceptual and omit live cloud orchestrator implementations. DocConnect incorporates health probes (/health) and automated Jest test suites into the deployment pipeline."
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = c_navy

    # Paper 4
    p4_box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.5), Inches(5.65), Inches(5.2))
    p4_box.fill.solid()
    p4_box.fill.fore_color.rgb = c_card_bg
    p4_box.line.color.rgb = c_border
    tf4 = p4_box.text_frame
    tf4.word_wrap = True
    tf4.margin_left = tf4.margin_right = Inches(0.25)
    tf4.margin_top = Inches(0.2)

    p = tf4.paragraphs[0]
    p.text = "Paper 04: Cloud-Based Microservices for Healthcare"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = c_blue
    p.space_after = Pt(4)

    p = tf4.add_paragraph()
    p.text = "Citation: J. I. Akerele et al., 'Improving Healthcare Application Scalability Through Microservices Architecture in the Cloud,' IJSRU, 2024. [4]"
    p.font.size = Pt(9)
    p.font.italic = True
    p.font.color.rgb = c_muted
    p.space_after = Pt(8)

    p = tf4.add_paragraph()
    p.text = "Overview: Compares monolithic vs. microservice healthcare software architectures under heavy patient load conditions."
    p.font.size = Pt(9.5)
    p.font.color.rgb = c_dark
    p.space_after = Pt(8)

    p = tf4.add_paragraph()
    p.text = "Key Findings & Metrics:\n• Microservice decoupling enables granular scaling of bottlenecked services.\n• Isolated service failures prevent complete clinical application outages.\n• Decoupled databases provide superior transactional isolation."
    p.font.size = Pt(9.5)
    p.font.color.rgb = c_body
    p.space_after = Pt(8)

    p = tf4.add_paragraph()
    p.text = "Research Gap & How DocConnect Addresses It:\nPrior literature concentrates on high-level architecture diagrams with minimal focus on automated provisioning. DocConnect decouples React frontend, Express API, and PostgreSQL with independent container lifecycle definitions."
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = c_navy

    # =========================================================================
    # SLIDE 6: SYSTEM ARCHITECTURE
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "DocConnect — System Architecture & Cloud Topology", slide_num=6)

    # Insert Architecture Diagram
    if os.path.exists(arch_path):
        s6.shapes.add_picture(arch_path, Inches(0.8), Inches(1.5), width=Inches(7.2), height=Inches(5.2))

    # Architecture Explanation Card on Right
    arch_card = add_card(s6, Inches(8.2), Inches(1.5), Inches(4.333), Inches(5.2),
                         "Architectural Highlights",
                         [
                             "1. User Presentation Layer (React 19 + Vite):\n• Clean client portal for booking, cancellation, and viewing doctor credentials.\n• Communicates over HTTP REST to Node.js backend.\n",
                             "2. Application Logic Layer (Express.js REST API):\n• Stateless backend handling appointment slots, authentication, and validation.\n• Exposes GET /health probe for Kubernetes liveness & readiness.\n",
                             "3. Data Persistence Layer (PostgreSQL Database):\n• Relational tables for users and appointments with ACID transaction guarantees.\n• Indexed queries preventing double-booking.\n",
                             "4. Automated DevOps & Deployment Plane:\n• GitHub repository triggers Jenkins CI/CD pipeline.\n• Terraform provisions AWS networking and EKS cluster.\n• Kubernetes orchestrates pods, HPA autoscaling, and self-healing."
                         ],
                         bg_color=c_card_bg, border_color=c_border, title_color=c_blue)

    # =========================================================================
    # SLIDE 7: DEVOPS TOOLCHAIN & WORKFLOW
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "DocConnect — DevOps Toolchain & Lifecycle Workflow", slide_num=7)

    tool_rows = [
        ("Tool", "DevOps Stage", "Project Role & Technical Implementation", "Status"),
        ("Git", "Version Control", "Tracks code revisions, branching strategy, and atomic commits across modules.", "IMPLEMENTED"),
        ("GitHub", "Code Repository", "Central repository hosting frontend, backend, database schema, and DevOps configs.", "IMPLEMENTED"),
        ("Jenkins", "CI/CD Automation", "Automates code checkout, Jest test execution, Docker build, and deployment triggers.", "CONFIGURED"),
        ("Docker", "Containerization", "Multi-stage Dockerfiles packaging React SPA and Node.js backend into slim images.", "IMPLEMENTED"),
        ("PostgreSQL", "Database Layer", "Relational persistence with connection pooling, indexes, and schema migrations.", "IMPLEMENTED"),
        ("Terraform", "Infrastructure as Code", "Declaratively provisions AWS VPC, subnets, security groups, and EKS cluster.", "CONFIGURED"),
        ("AWS (EKS/RDS)", "Cloud Infrastructure", "Enterprise cloud platform providing managed Kubernetes and managed PostgreSQL.", "CONFIGURED"),
        ("Kubernetes", "Container Orchestration", "Manages pod replicas, /health probes, service routing, and self-healing.", "CONFIGURED")
    ]

    table_shape = s7.shapes.add_table(len(tool_rows), 4, Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.1))
    table = table_shape.table
    table.columns[0].width = Inches(1.5)
    table.columns[1].width = Inches(2.2)
    table.columns[2].width = Inches(6.2)
    table.columns[3].width = Inches(1.833)

    for r_idx, row in enumerate(tool_rows):
        for c_idx, cell_text in enumerate(row):
            cell = table.cell(r_idx, c_idx)
            cell.text = cell_text
            p = cell.text_frame.paragraphs[0]
            p.font.name = 'Arial'
            if r_idx == 0:
                p.font.bold = True
                p.font.size = Pt(11)
                p.font.color.rgb = c_white
                cell.fill.solid()
                cell.fill.fore_color.rgb = c_navy
            else:
                p.font.size = Pt(9.5)
                cell.fill.solid()
                cell.fill.fore_color.rgb = c_card_bg if r_idx % 2 == 1 else c_white
                if c_idx == 0:
                    p.font.bold = True
                    p.font.color.rgb = c_blue
                elif c_idx == 3:
                    p.font.bold = True
                    p.font.color.rgb = c_green if "IMPLEMENTED" in cell_text else c_amber
                else:
                    p.font.color.rgb = c_body
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE

    # =========================================================================
    # SLIDE 8: PROCESS 1: AUTOMATED CLOUD CI/CD PIPELINE
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "Process 1: Automated Cloud CI/CD Pipeline Workflow", slide_num=8)

    pipeline_stages = [
        ("01", "Source Control", "GitHub Repository", "Developer pushes feature or bug fix commit to repository branch."),
        ("02", "CI Trigger", "Jenkins Automation", "Jenkins webhook detects push and initiates multi-stage Jenkinsfile pipeline."),
        ("03", "Automated Testing", "Jest & Supertest", "Runs backend test suites; halts pipeline if any test assertion or validation fails."),
        ("04", "Containerization", "Docker Image Build", "Builds optimized Docker container images for frontend and backend microservices."),
        ("05", "Registry Staging", "Docker Registry", "Tags images with commit SHA and pushes versioned artifacts to DockerHub."),
        ("06", "Continuous Deploy", "Kubernetes Rollout", "Executes kubectl apply rolling update to EKS cluster with zero downtime.")
    ]

    card_w = Inches(1.8)
    card_h = Inches(4.5)
    start_x = Inches(0.8)
    gap = Inches(0.18)

    for idx, (step, title, sub, desc) in enumerate(pipeline_stages):
        x = start_x + idx * (card_w + gap)
        c = add_card(s8, x, Inches(1.6), card_w, card_h,
                     f"{step}\n{title}",
                     [f"\nTool:\n{sub}\n", f"Workflow:\n{desc}"],
                     bg_color=c_card_bg, border_color=c_blue if idx >= 2 else c_border, title_color=c_navy)

    # Footer note
    fn = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.3), Inches(11.733), Inches(0.6))
    fn.fill.solid()
    fn.fill.fore_color.rgb = c_card_blue
    fn.line.color.rgb = c_blue
    tf_fn = fn.text_frame
    p_fn = tf_fn.paragraphs[0]
    p_fn.text = "Key Benefit: Guarantees deployment reproducibility — eliminates manual server configuration and ensures every production release is test-validated."
    p_fn.font.size = Pt(10)
    p_fn.font.bold = True
    p_fn.font.color.rgb = c_blue
    p_fn.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 9: PROCESS 2: LOCAL DEVELOPMENT & DEVOPS INTEGRATION
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "Process 2: Local Development, Verification & Staging Flow", slide_num=9)

    flow_stages = [
        ("01", "Full Stack Development", "Node.js & React 19", "Modular architecture with separated controllers, models, routes, and Vite frontend components."),
        ("02", "Database Setup", "PostgreSQL Migrations", "Database schema execution via schema.sql; seeded with synthetic healthcare records via seed.sql."),
        ("03", "Local Verification", "Jest Test Execution", "Automated API endpoint testing against mocked and live database connections (npm test)."),
        ("04", "Container Building", "Local Docker Builds", "Multi-stage Docker builds locally isolating dependencies, minimizing final image size."),
        ("05", "Health Probing", "/health Verification", "Direct verification of PostgreSQL pool connectivity via GET /health endpoint returning JSON status."),
        ("06", "Staging & Handover", "Git Version Control", "Clean code commits pushed to shared repository ready for Jenkins CI/CD pickup.")
    ]

    for idx, (step, title, sub, desc) in enumerate(flow_stages):
        x = start_x + idx * (card_w + gap)
        c = add_card(s9, x, Inches(1.6), card_w, card_h,
                     f"{step}\n{title}",
                     [f"\nComponent:\n{sub}\n", f"Process:\n{desc}"],
                     bg_color=c_card_bg, border_color=c_teal if idx < 3 else c_border, title_color=c_navy)

    fn2 = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.3), Inches(11.733), Inches(0.6))
    fn2.fill.solid()
    fn2.fill.fore_color.rgb = c_card_bg
    fn2.line.color.rgb = c_border
    tf_fn2 = fn2.text_frame
    p_fn2 = tf_fn2.paragraphs[0]
    p_fn2.text = "DevOps Principle: 'Shift-Left' quality assurance — bugs and database integration issues are caught locally before hitting cloud deployment."
    p_fn2.font.size = Pt(10)
    p_fn2.font.bold = True
    p_fn2.font.color.rgb = c_dark
    p_fn2.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 10: CONFIGURATION MANAGEMENT & DEPLOYMENT
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_header(s10, "Configuration Management & Deployment Architecture", slide_num=10)

    # Left: Configuration Management
    add_card(s10, Inches(0.8), Inches(1.5), Inches(5.65), Inches(4.5),
             "Configuration Management Best Practices",
             [
                 "1. Strict Environment Isolation (.env & ConfigMaps):\n• Database credentials, JWT secrets, and CORS origins isolated from source code.\n• Controlled via .env.example template for development and Kubernetes Secrets in production.\n",
                 "2. Parameterized Database Connection Pooling:\n• pg.Pool dynamically configured for max client connections, timeout thresholds, and SSL flags.\n• Seamless transition between local PostgreSQL and AWS RDS PostgreSQL.\n",
                 "3. Multi-Stage Container Packaging:\n• Frontend build stage executes npm run build; production stage serves static assets.\n• Backend Dockerfile locks node:20-alpine runtime to eliminate OS-level security risks.\n",
                 "4. Declarative Pipeline-as-Code:\n• Jenkinsfile centrally versioned in repository ensuring identical build steps across all runners."
             ],
             bg_color=c_card_bg, border_color=c_border, title_color=c_blue)

    # Right: Deployment Architecture
    add_card(s10, Inches(6.8), Inches(1.5), Inches(5.65), Inches(4.5),
             "Deployment Architecture & Traffic Routing",
             [
                 "1. External Ingress / Application Load Balancer:\n• Terminates incoming HTTPS traffic and forwards requests to cluster ingress.\n",
                 "2. Frontend Microservice Tier (ClusterIP Service):\n• Replicated React UI pods serving static assets and dynamic dashboard views.\n",
                 "3. Backend Microservice Tier (REST API Pods):\n• Stateless Express.js pods mounted behind internal ClusterIP service.\n• Horizontal Pod Autoscaler (HPA) monitors CPU/memory to scale from 2 to 5+ replicas.\n",
                 "4. Dedicated Health Monitoring & Probes:\n• Kubernetes Liveness Probe checks if process is responsive.\n• Readiness Probe queries GET /health ensuring DB pool is connected before routing traffic.\n",
                 "5. Managed Relational Storage (PostgreSQL RDS):\n• Persistent storage with ACID transactions, automated backups, and encrypted storage."
             ],
             bg_color=c_card_blue, border_color=c_blue, title_color=c_navy)

    # Bottom Benefits Bar
    b_bar = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.15), Inches(11.733), Inches(0.75))
    b_bar.fill.solid()
    b_bar.fill.fore_color.rgb = c_white
    b_bar.line.color.rgb = c_border
    tf_b = b_bar.text_frame
    p_b = tf_b.paragraphs[0]
    p_b.text = "Key Benefits:  ✓ Zero Configuration Drift    ✓ Instant Horizontal Elasticity    ✓ Zero-Downtime Rolling Updates    ✓ Self-Healing Resiliency"
    p_b.font.size = Pt(11)
    p_b.font.bold = True
    p_b.font.color.rgb = c_teal
    p_b.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 11: APPLICATION IMPLEMENTATION (Screenshots: Dashboard & Specialists)
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    add_header(s11, "Application Implementation — Dashboard & Specialist Directory", slide_num=11)

    # Top: Dashboard Screenshot
    if os.path.exists(img_dash):
        s11.shapes.add_picture(img_dash, Inches(0.8), Inches(1.5), width=Inches(7.2), height=Inches(2.55))

    # Bottom: Specialists Screenshot
    if os.path.exists(img_spec):
        s11.shapes.add_picture(img_spec, Inches(0.8), Inches(4.2), width=Inches(7.2), height=Inches(2.55))

    # Right Card: Implemented Features Breakdown
    add_card(s11, Inches(8.2), Inches(1.5), Inches(4.333), Inches(5.25),
             "Implemented Features (Application Layer)",
             [
                 "Status: [IMPLEMENTED & FUNCTIONAL]\n",
                 "1. Interactive Patient Dashboard (Top Screenshot):\n• Live metrics cards: Upcoming Consultations, Completed Visits, Cancelled Appointments, Total History Records.\n• Personalized greeting banner with patient name ('Om') and account role badge.\n• Upcoming appointment spotlight with direct scheduling shortcuts.\n",
                 "2. Lead Specialists Directory (Bottom Screenshot):\n• Credentialed doctor profiles: Dr. Ananya Mehta (General Medicine, 12 yrs exp), Dr. Rahul Shah (Cardiovascular Health, 15 yrs exp), Dr. Sara Fernandes (Dermatology, 9 yrs exp).\n• Star ratings, practice tags, and direct 'Book with Specialist' action button.\n",
                 "3. Modern React 19 Frontend:\n• Responsive SaaS design with modular components, dynamic modal dialogs, and instant state updates via React hooks."
             ],
             bg_color=c_card_bg, border_color=c_border, title_color=c_blue)

    # =========================================================================
    # SLIDE 12: APPLICATION IMPLEMENTATION (Interactive Booking & ACID Protection)
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    add_header(s12, "Application Implementation — Booking Modal & Data Integrity", slide_num=12)

    # Left: Booking Screenshot
    if os.path.exists(img_book):
        s12.shapes.add_picture(img_book, Inches(0.8), Inches(1.5), width=Inches(6.0), height=Inches(5.2))

    # Right: Technical implementation details
    add_card(s12, Inches(7.0), Inches(1.5), Inches(5.533), Inches(5.2),
             "Booking Workflow & Database Consistency",
             [
                 "Status: [IMPLEMENTED & TESTED]\n",
                 "1. Multi-Step Guided Booking Workflow (Live UI):\n• Step 1: Specialist Selection — dynamically renders practitioner's available clinic days (e.g. Mon - Fri).\n• Step 2: Interactive Calendar & Slot Picker — interactive monthly calendar (October 2026) with morning and afternoon consultation slots (09:00 AM, 09:45 AM, 10:30 AM...).\n• Step 3: Chief Complaint & Clinical Notes — input textarea capturing clinical symptoms prior to doctor review.\n",
                 "2. Double-Booking Prevention & ACID Transactions:\n• Database Unique Constraints: PostgreSQL enforces uniqueness on (doctor_name, appointment_date, appointment_time).\n• Concurrency Handling: Prevents race conditions when two patients simultaneously attempt to reserve the same time slot.\n",
                 "3. REST API & Validation Middleware:\n• Express.js middleware validates required fields, dates, and email syntax before database queries.\n• Returns clean HTTP 409 Conflict status if a slot collision occurs."
             ],
             bg_color=c_card_bg, border_color=c_border, title_color=c_blue)

    # =========================================================================
    # SLIDE 13: AUTOMATED TESTING & DEVOPS HEALTH PROBES
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    add_header(s13, "Automated Testing, Verification & Health Probes", slide_num=13)

    add_card(s13, Inches(0.8), Inches(1.5), Inches(5.65), Inches(5.2),
             "Automated Test Suites (Jest & Supertest)",
             [
                 "Status: [IMPLEMENTED IN BACKEND/TESTS]\n",
                 "1. API Endpoint Coverage (Supertest):\n• GET /health: Verifies server returns 200 OK and database connectivity status.\n• GET /appointments: Asserts array payload structure and filter parameters.\n• POST /appointments: Tests successful booking creation with valid payload.\n• Validation Failures: Verifies 400 Bad Request on missing patient email or invalid slot.\n",
                 "2. Test Execution Command:\n• Configured script in package.json: jest --runInBand --detectOpenHandles --forceExit\n• Isolated test environment preventing open handles on database connection pools.\n",
                 "3. Pipeline Integration:\n• Serves as the mandatory quality gate in the CI/CD pipeline — any failing test aborts container image build and rollout."
             ],
             bg_color=c_card_bg, border_color=c_border, title_color=c_blue)

    add_card(s13, Inches(6.8), Inches(1.5), Inches(5.65), Inches(5.2),
             "DevOps Health Probe & Verification Notes",
             [
                 "1. Dedicated /health Probe (server.js):\n• Endpoint: GET /health\n• Logic: Executes 'SELECT 1 as is_healthy' on PostgreSQL connection pool.\n• Response: Returns { service: 'docconnect-backend', status: 'healthy', database: 'connected', version: '2.0.0' }.\n• Kubernetes Role: Configured as Liveness Probe (restarts dead container) and Readiness Probe (routes traffic only when DB is up).\n",
                 "2. Verification & Demo Status Distinction:\n• [VERIFIED & WORKING]: Full-stack React app, Express API, PostgreSQL relational database, and /health probe.\n• [VERIFICATION PLACEHOLDER / LIVE DEMO]: Live Jenkins pipeline execution logs, AWS EKS cluster console output, and HPA load-test metrics to be demonstrated during presentation review."
             ],
             bg_color=c_card_blue, border_color=c_blue, title_color=c_navy)

    # =========================================================================
    # SLIDE 14: SOCIETAL IMPACT & SDG VALIDATION
    # =========================================================================
    s14 = prs.slides.add_slide(blank_layout)
    add_header(s14, "Societal Impact & SDG Alignment Validation", slide_num=14)

    add_card(s14, Inches(0.8), Inches(1.5), Inches(5.65), Inches(5.2),
             "Societal Impact on Healthcare Delivery",
             [
                 "1. Democratizing Access for Small Clinics & NGOs:\n• Small clinics, rural health centers, and NGO medical camps cannot afford dedicated DevOps teams. DocConnect provides an automated, self-healing system requiring zero server maintenance.\n",
                 "2. Eradicating Missed & Double-Booked Appointments:\n• Automated database constraints and digital confirmations prevent booking errors, reducing patient wait times and clinic friction.\n",
                 "3. High Availability During Peak Health Crises:\n• During seasonal flu outbreaks and morning booking windows, the system automatically scales out, guaranteeing uninterrupted appointment scheduling.\n",
                 "4. Extensible Open Community Framework:\n• Architecture easily extends to vaccination drives, blood donation camps, and community specialist visits."
             ],
             bg_color=c_card_bg, border_color=c_border, title_color=c_blue)

    add_card(s14, Inches(6.8), Inches(1.5), Inches(5.65), Inches(5.2),
             "Validation Against UN Sustainable Development Goals",
             [
                 "SDG 3: Good Health & Well-Being (Primary Focus)\n• Focus: Healthcare access & operational reliability.\n• Contribution: Eliminates appointment server outages and booking collisions; ensures continuous patient care and rapid specialist consultation access.\n",
                 "SDG 9: Industry, Innovation & Infrastructure\n• Focus: Resilient digital infrastructure & automation.\n• Contribution: Delivers modern CI/CD automation, containerization, and self-healing cloud infrastructure to healthcare providers lacking in-house technical staff.\n",
                 "SDG 12: Responsible Consumption & Production\n• Focus: Efficient cloud resource utilization.\n• Contribution: Kubernetes autoscaling (HPA) avoids expensive, permanently over-provisioned servers, dynamically scaling down compute resources during off-peak hours to conserve energy and costs."
             ],
             bg_color=c_card_blue, border_color=c_blue, title_color=c_navy)

    # =========================================================================
    # SLIDE 15: TEAM CONTRIBUTIONS & RESPONSIBILITIES
    # =========================================================================
    s15 = prs.slides.add_slide(blank_layout)
    add_header(s15, "Team Organization & Individual Contributions", slide_num=15)

    c_w = Inches(2.78)
    c_h = Inches(5.2)
    s_x = Inches(0.8)
    g = Inches(0.2)

    t_members = [
        ("01. Roshell Miranda", "Roll 34  |  P1", "Full Stack Development & Repository Owner",
         [
             "• Developed React 19 + Vite frontend (dashboard, booking modal, doctor catalog).",
             "• Built Node.js/Express REST API with input validation middleware.",
             "• Designed PostgreSQL schema, connection pooling, and double-booking constraints.",
             "• Implemented GET /health probe for Kubernetes liveness/readiness.",
             "• Configured repository structure and Git version control."
         ]),
        ("02. Kalanidhi Namboothiri", "Roll 37  |  P2", "Docker Containerization & Jenkins CI/CD",
         [
             "• Authored multi-stage Dockerfiles for frontend and backend microservices.",
             "• Designed Jenkins CI/CD pipeline automation (Checkout -> Test -> Build -> Deploy).",
             "• Configured container image versioning and DockerHub registry management.",
             "• Automated build validation triggers on code commit."
         ]),
        ("03. Shraddha Hebbar", "Roll 18  |  P3", "AWS Cloud Infrastructure & Terraform IaC",
         [
             "• Architected AWS cloud topology (VPC, public/private subnets, security groups).",
             "• Authored Terraform declarative Infrastructure-as-Code manifests.",
             "• Configured IAM roles and AWS managed Kubernetes (EKS) permissions.",
             "• Documented cloud infrastructure specifications and cost model."
         ]),
        ("04. Simone D’sa", "Roll 13  |  P4", "Kubernetes Orchestration & Scalability",
         [
             "• Authored Kubernetes Deployment, Service, and ConfigMap/Secret manifests.",
             "• Configured Horizontal Pod Autoscaler (HPA) for CPU-triggered scaling.",
             "• Integrated container liveness and readiness health probes.",
             "• Orchestrated rolling zero-downtime updates and self-healing pod recovery."
         ])
    ]

    for idx, (m_name, m_roll, m_role, duties) in enumerate(t_members):
        x = s_x + idx * (c_w + g)
        c = add_card(s15, x, Inches(1.5), c_w, c_h,
                     f"{m_name}\n{m_roll}\n{m_role}",
                     duties,
                     bg_color=c_card_bg, border_color=c_blue if idx == 0 else c_border, title_color=c_navy)

    # =========================================================================
    # SLIDE 16: REFERENCES
    # =========================================================================
    s16 = prs.slides.add_slide(blank_layout)
    add_header(s16, "References & Literature Citations", slide_num=16)

    refs = [
        ("[1]", "V. Salunkhe et al.", 
         "“The Impact of Cloud Native Technologies on Healthcare Application Scalability and Compliance,”", 
         "International Journal of Progressive Research in Engineering Management and Science (IJPREMS), 2021."),
        ("[2]", "N. Vemuri", 
         "“DevOps for Telehealth Services: Accelerating Deployment and Scalability,”", 
         "International Journal of Recent Trends in Engineering & Research (IJRITCC), 2024."),
        ("[3]", "J. Oluwaseyi", 
         "“DevOps in the Context of Telehealth Services: Streamlining Deployment and Enabling Scalability,”", 
         "SSRN Electronic Journal, 2023."),
        ("[4]", "J. I. Akerele et al.", 
         "“Improving Healthcare Application Scalability Through Microservices Architecture in the Cloud,”", 
         "International Journal of Scientific Research Updates (IJSRU), 2024.")
    ]

    ref_box = s16.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.2))
    ref_box.fill.solid()
    ref_box.fill.fore_color.rgb = c_card_bg
    ref_box.line.color.rgb = c_border
    tf_ref = ref_box.text_frame
    tf_ref.margin_left = tf_ref.margin_right = Inches(0.35)
    tf_ref.margin_top = Inches(0.3)

    p_rh = tf_ref.paragraphs[0]
    p_rh.text = "Academic & Industry Research Sources:"
    p_rh.font.bold = True
    p_rh.font.size = Pt(14)
    p_rh.font.color.rgb = c_blue
    p_rh.space_after = Pt(14)

    for num, authors, title, pub in refs:
        p = tf_ref.add_paragraph()
        p.text = f"{num}  {authors}, {title} {pub}"
        p.font.size = Pt(11)
        p.font.color.rgb = c_dark
        p.space_after = Pt(12)

    # =========================================================================
    # SLIDE 17: CONCLUSION & THANK YOU
    # =========================================================================
    s17 = prs.slides.add_slide(blank_layout)
    if os.path.exists(logo_path):
        s17.shapes.add_picture(logo_path, Inches(5.866), Inches(1.3), width=Inches(1.6), height=Inches(1.4))

    tb_end = s17.shapes.add_textbox(Inches(1.0), Inches(2.9), Inches(11.333), Inches(3.5))
    p_end = tb_end.text_frame.paragraphs[0]
    p_end.text = "THANK YOU!"
    p_end.font.bold = True
    p_end.font.size = Pt(36)
    p_end.font.color.rgb = c_navy
    p_end.alignment = PP_ALIGN.CENTER
    p_end.space_after = Pt(10)

    p_end2 = tb_end.text_frame.add_paragraph()
    p_end2.text = "DocConnect : Healthcare Appointment System with DevOps Automation\nDepartment of Information Technology  |  Don Bosco Institute of Technology, Mumbai"
    p_end2.font.size = Pt(13)
    p_end2.font.color.rgb = c_muted
    p_end2.alignment = PP_ALIGN.CENTER
    p_end2.space_after = Pt(18)

    p_end3 = tb_end.text_frame.add_paragraph()
    p_end3.text = "Open for Faculty Review, Evaluation & Questions (Q&A)"
    p_end3.font.bold = True
    p_end3.font.size = Pt(14)
    p_end3.font.color.rgb = c_teal
    p_end3.alignment = PP_ALIGN.CENTER

    out_pptx = r"D:\desk\DocConnect\DocConnect_Final_Review_Presentation.pptx"
    prs.save(out_pptx)
    print(f"Successfully generated PowerPoint presentation: {out_pptx}")
    print(f"Total slides generated: {len(prs.slides)}")

if __name__ == '__main__':
    create_deck()
