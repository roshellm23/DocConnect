import os
from pptx import Presentation

pptx_path = r"C:\Users\Dell\.gemini\antigravity\brain\0bf34c86-aff5-46b3-8e8b-d5e17b57b2f6\.user_uploaded\media_1792345626916_507b3703.pptx"
prs = Presentation(pptx_path)

print(f"Total slides: {len(prs.slides)}")
print(f"Slide width: {prs.slide_width}, height: {prs.slide_height}")

for i, slide in enumerate(prs.slides):
    print(f"\n--- Slide {i+1} ---")
    for shape in slide.shapes:
        if shape.has_text_frame:
            for p in shape.text_frame.paragraphs:
                text = p.text.strip()
                if text:
                    print(f"  [Text]: {text}")
        elif shape.shape_type == 13: # picture
            print(f"  [Image]: {shape.name}, width={shape.width}, height={shape.height}")
