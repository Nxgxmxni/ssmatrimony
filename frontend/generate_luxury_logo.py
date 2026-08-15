import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# 1. Load original logo image
orig_path = 'c:/projects/ssmatrimony/frontend/public/ss_logo.png'
# If ss_logo.png was overwritten, check ss_logo.jpg or reload
if not os.path.exists('c:/projects/ssmatrimony/frontend/public/ss_logo.jpg'):
    orig = Image.open(orig_path).convert('RGBA')
else:
    orig = Image.open('c:/projects/ssmatrimony/frontend/public/ss_logo.jpg').convert('RGBA')

# Isolating emblem (strictly X < 388 to prevent old text overlap)
arr = np.array(orig)
alpha = arr[:, :, 3] if arr.shape[2] == 4 else np.full(arr.shape[:2], 255, dtype=np.uint8)
rgb = arr[:, :, :3]
non_white = np.any(rgb < 245, axis=2)

emblem_mask = np.zeros_like(non_white)
emblem_mask[:, :388] = non_white[:, :388]

coords = np.argwhere(emblem_mask)
y_min, x_min = coords.min(axis=0)
y_max, x_max = coords.max(axis=0)

crop_y1 = max(0, y_min - 4)
crop_y2 = min(orig.height, y_max + 4)
crop_x1 = max(0, x_min - 4)
crop_x2 = min(orig.width, x_max + 4)

emblem = orig.crop((crop_x1, crop_y1, crop_x2, crop_y2))
print(f'Isolated Clean Emblem Size: {emblem.size}')

# Make background transparent
emblem_arr = np.array(emblem.convert('RGBA'))
r, g, b, a = emblem_arr[:,:,0], emblem_arr[:,:,1], emblem_arr[:,:,2], emblem_arr[:,:,3]
white_mask = (r > 240) & (g > 240) & (b > 240)
emblem_arr[white_mask, 3] = 0

emblem_img = Image.fromarray(emblem_arr)
enhancer = ImageEnhance.Color(emblem_img)
emblem_img = enhancer.enhance(1.18)
enhancer_sharp = ImageEnhance.Sharpness(emblem_img)
emblem_img = enhancer_sharp.enhance(1.25)

# High Resolution 4K Canvas
CANVAS_W = 2400
CANVAS_H = 600

canvas = Image.new('RGBA', (CANVAS_W, CANVAS_H), (255, 255, 255, 255))

# Subtle luxury radial background gradient
gradient = Image.new('RGBA', (CANVAS_W, CANVAS_H))
g_draw = ImageDraw.Draw(gradient)
for y in range(CANVAS_H):
    for x in range(0, CANVAS_W, 4):
        dx = (x - CANVAS_W / 2) / (CANVAS_W / 2)
        dy = (y - CANVAS_H / 2) / (CANVAS_H / 2)
        dist = min(1.0, (dx*dx + dy*dy) ** 0.5)
        val = int(255 - dist * 6)
        g_draw.rectangle([x, y, x+4, y+1], fill=(val, val, int(val + 3), 255))

canvas = Image.alpha_composite(canvas, gradient)

# 2. Resize Emblem (occupies ~80% of canvas height: 480px height on 600px canvas)
target_emblem_h = 470
aspect = emblem_img.width / emblem_img.height
target_emblem_w = int(target_emblem_h * aspect)

emblem_scaled = emblem_img.resize((target_emblem_w, target_emblem_h), Image.Resampling.LANCZOS)

# Soft luxury shadow behind emblem
emblem_shadow = Image.new('RGBA', emblem_scaled.size, (0, 0, 0, 0))
shadow_alpha = np.array(emblem_scaled)[:, :, 3]
shadow_mask = Image.fromarray((shadow_alpha * 0.22).astype(np.uint8))
shadow_layer = Image.new('RGBA', emblem_scaled.size, (11, 59, 145, 120))
shadow_layer.putalpha(shadow_mask)
shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(radius=7))

emblem_x = 60
emblem_y = (CANVAS_H - target_emblem_h) // 2

canvas.paste(shadow_layer, (emblem_x + 4, emblem_y + 5), shadow_layer)
canvas.paste(emblem_scaled, (emblem_x, emblem_y), emblem_scaled)

# 3. Typography
font_path = 'c:/projects/ssmatrimony/frontend/public/fonts/Cinzel.ttf'

font_main = ImageFont.truetype(font_path, 145)
font_tag = ImageFont.truetype(font_path, 42)

text_start_x = emblem_x + target_emblem_w + 45
text_center_y = CANVAS_H // 2

def draw_text_with_spacing(draw_obj, text, font, fill, x, y, tracking=6):
    curr_x = x
    for char in text:
        draw_obj.text((curr_x, y), char, font=font, fill=fill)
        bbox = font.getbbox(char)
        char_w = bbox[2] - bbox[0] if bbox else font.getsize(char)[0]
        curr_x += char_w + tracking
    return curr_x

def get_text_width(text, font, tracking=6):
    w = 0
    for char in text:
        bbox = font.getbbox(char)
        char_w = bbox[2] - bbox[0] if bbox else 30
        w += char_w + tracking
    return w - tracking

main_text = "SS MATRIMONY"
main_w = get_text_width(main_text, font_main, tracking=8)

# Center text block vertically relative to logo icon
# Main text height ~ 120px, flourish ~ 20px, tagline ~ 40px -> Total text block ~ 180px
text_block_h = 190
text_block_top = text_center_y - (text_block_h // 2)

main_y = text_block_top - 15

# Soft luxury shadow behind main text
shadow_txt = Image.new('RGBA', (CANVAS_W, CANVAS_H), (0,0,0,0))
s_draw = ImageDraw.Draw(shadow_txt)
draw_text_with_spacing(s_draw, main_text, font_main, (11, 59, 145, 65), text_start_x + 3, main_y + 4, tracking=8)
shadow_txt = shadow_txt.filter(ImageFilter.GaussianBlur(radius=5))
canvas = Image.alpha_composite(canvas, shadow_txt)

# Main Text: Rich Royal Blue (#0B3B91)
main_draw = ImageDraw.Draw(canvas)
# Bold stroke simulation (draw offset by 1px for Extra Bold / Black look)
draw_text_with_spacing(main_draw, main_text, font_main, (11, 59, 145, 255), text_start_x + 1, main_y, tracking=8)
draw_text_with_spacing(main_draw, main_text, font_main, (11, 59, 145, 255), text_start_x, main_y, tracking=8)

# 4. Gold Flourish Line
flourish_y = main_y + 155
flourish_w = main_w
flourish_center_x = text_start_x + (flourish_w // 2)

gold_color = (212, 175, 55, 255) # Bright Gold #D4AF37

# Left line
main_draw.line([(text_start_x + 15, flourish_y), (flourish_center_x - 35, flourish_y)], fill=gold_color, width=3)
# Right line
main_draw.line([(flourish_center_x + 35, flourish_y), (text_start_x + flourish_w - 15, flourish_y)], fill=gold_color, width=3)

# Center diamond flourish
diamond_r = 7
main_draw.polygon([
    (flourish_center_x, flourish_y - diamond_r),
    (flourish_center_x + diamond_r, flourish_y),
    (flourish_center_x, flourish_y + diamond_r),
    (flourish_center_x - diamond_r, flourish_y)
], fill=gold_color)

# 5. Tagline "CONNECTING HEARTS, CREATING FUTURES"
tagline_text = "CONNECTING HEARTS, CREATING FUTURES"
tag_w = get_text_width(tagline_text, font_tag, tracking=5)

tag_x = text_start_x + (flourish_w - tag_w) // 2
tag_y = flourish_y + 20

shadow_tag = Image.new('RGBA', (CANVAS_W, CANVAS_H), (0,0,0,0))
st_draw = ImageDraw.Draw(shadow_tag)
draw_text_with_spacing(st_draw, tagline_text, font_tag, (160, 120, 20, 50), tag_x + 1, tag_y + 2, tracking=5)
shadow_tag = shadow_tag.filter(ImageFilter.GaussianBlur(radius=3))
canvas = Image.alpha_composite(canvas, shadow_tag)

tag_draw = ImageDraw.Draw(canvas)
# Bold stroke simulation
draw_text_with_spacing(tag_draw, tagline_text, font_tag, (197, 155, 39, 255), tag_x + 1, tag_y, tracking=5)
draw_text_with_spacing(tag_draw, tagline_text, font_tag, (197, 155, 39, 255), tag_x, tag_y, tracking=5)

# 6. Trim empty whitespace to tight bounding box with minimal margins
canvas_np = np.array(canvas)
rgb_channel = canvas_np[:, :, :3]
non_white_final = np.any(rgb_channel < 250, axis=2)

coords_final = np.argwhere(non_white_final)
fy1, fx1 = coords_final.min(axis=0)
fy2, fx2 = coords_final.max(axis=0)

crop_fy1 = max(0, fy1 - 24)
crop_fy2 = min(CANVAS_H, fy2 + 24)
crop_fx1 = max(0, fx1 - 35)
crop_fx2 = min(CANVAS_W, fx2 + 35)

final_banner = canvas.crop((crop_fx1, crop_fy1, crop_fx2, crop_fy2))

output_png = 'c:/projects/ssmatrimony/frontend/public/ss_logo.png'
final_banner.save(output_png, 'PNG', optimize=True)

output_hires = 'c:/projects/ssmatrimony/frontend/public/ss_logo_banner.png'
final_banner.save(output_hires, 'PNG', optimize=True)

print(f'Successfully generated ultra-clean luxury logo banner! Final Size: {final_banner.size}')
