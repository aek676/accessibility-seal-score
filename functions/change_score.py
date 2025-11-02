from PIL import Image, ImageDraw, ImageFont
from decimal import Decimal
from functions.change_seat_color_to_black import change_seat_color_to_black

def change_score(new_score):
    x = 250
    if new_score > 10 or new_score < 0:
        raise ValueError("El puntaje debe estar entre 0 y 10.")
    
    if Decimal(str(new_score)).as_tuple().exponent < -2: # type: ignore
        raise ValueError("El puntaje debe tener solo dos decimales.")

    score_formated = f"{new_score:.2f}".replace('.', ',')

    seven_count = score_formated.count('7')
    one_count = score_formated.count('1')

    if seven_count > 0:
        x += 20 * seven_count

    if one_count > 0:
        x += 30 * one_count

    img = Image.open("./Sellos/Seal-1(sin score).png").convert("RGBA")

    txt_layer = Image.new("RGBA", img.size, (255, 255, 255, 0))

    draw = ImageDraw.Draw(txt_layer)
    font = ImageFont.truetype("./fonts/Oswald-Bold.ttf", 245)
    draw.text((x, 229), score_formated, font=font, fill=(255, 255, 255, 255))

    finalWhite = Image.alpha_composite(img, txt_layer)

    finalBlack = change_seat_color_to_black(finalWhite)

    return {"white_seal": finalWhite, "black_seal": finalBlack}