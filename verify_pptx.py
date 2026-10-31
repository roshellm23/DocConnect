import os
from pptx import Presentation

pptx_path = r"D:\desk\DocConnect\DocConnect_Final_Review_Presentation.pptx"
prs = Presentation(pptx_path)

print(f"Presentation has {len(prs.slides)} slides.")
for i, slide in enumerate(prs.slides):
    shapes_info = []
    for s in slide.shapes:
        if s.has_text_frame:
            for p in s.text_frame.paragraphs:
                txt = p.text.strip()
                if txt:
                    shapes_info.append(txt[:40])
        elif s.shape_type == 13:
            shapes_info.append(f"[IMG: {s.name}]")
    print(f"Slide {i+1}: {len(slide.shapes)} shapes | Samples: {shapes_info[:3]}")
