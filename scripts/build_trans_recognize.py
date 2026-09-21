# -*- coding: utf-8 -*-
"""
Generate trans_recognize.py covering all 193 recognize questions.
"""
import json
import re

# Comprehensive Dutch to English glossary
DICTIONARY = {
    "Gevaarlijke bocht naar links": "Dangerous bend to the left",
    "Gevaarlijke bocht naar rechts": "Dangerous bend to the right",
    "Rijbaanversmalling": "Road narrowing",
    "Tweerichtingsverkeer": "Two-way traffic",
    "Dubbele bocht": "Double bend",
    "Gladde rijbaan": "Slippery road",
    "Glibberige rijbaan": "Slippery road surface",
    "Werken op de weg": "Road works",
    "Wegenwerken": "Road works",
    "Waarschuwing voor een oversteekplaats voor voetgangers": "Warning of a pedestrian crossing",
    "Waarschuwing voor een oversteekplaats voor fietsers": "Warning of a cyclist crossing",
    "Verplichte oversteekplaats voor fietsers": "Mandatory cyclist crossing",
    "Schoolomgeving met veel kinderen": "School area with children",
    "Voetgangerszone": "Pedestrian zone",
    "Verplicht fietspad": "Mandatory cycle path",
    "Fietszone": "Cycle zone",
    "Plaats waar veel kinderen komen, bijvoorbeeld een school": "Area frequented by children, such as a school",
    "Overweg met slagbomen": "Level crossing with barriers",
    "Overweg zonder slagbomen": "Level crossing without barriers",
    "Gevaarlijke bocht: dubbele bocht of opeenvolging van meer dan twee bochten, de eerste naar links": "Dangerous bend: double bend or series of bends, the first to the left",
    "Gevaarlijke bocht: dubbele bocht of opeenvolging van meer dan twee bochten, de eerste naar rechts": "Dangerous bend: double bend or series of bends, the first to the right",
    "Gevaarlijke daling": "Dangerous steep descent",
    "Steile helling": "Steep hill upwards",
    "Rijbaanversmalling langs links": "Road narrowing on the left",
    "Rijbaanversmalling langs rechts": "Road narrowing on the right",
    "Beweegbare brug": "Movable bridge",
    "Uitweg op een kaai of een oever": "Quayside or riverbank ahead",
    "Uitholling overdwars of ezelsrug": "Uneven road / hump / dip",
    "Verhoogde inrichting(en)": "Raised road feature / speed bump(s)",
    "Kiezelprojectie": "Loose chippings / danger of thrown stones",
    "Vallende stenen": "Falling rocks",
    "Oversteekplaats voor voetgangers": "Pedestrian crossing",
    "Doortocht van vee": "Cattle crossing",
    "Doortocht van wild": "Wild animal crossing",
    "Luchtvaartuigen die op geringe hoogte vliegen": "Low-flying aircraft",
    "Zijwind": "Crosswinds",
    "Verkeerslichten": "Traffic signals ahead",
    "Kruispunt met voorrang van rechts": "Intersection with priority to the right",
    "Rotonde": "Roundabout ahead",
    "File": "Traffic queue / congestion ahead",
    "Spoorwegovergang met enkel spoor": "Level crossing with single track",
    "Spoorwegovergang met twee of meer sporen": "Level crossing with two or more tracks",
    "Overweg": "Level crossing",
    "Andere gevaren": "Other dangers / hazards",
}

def translate_str(s):
    if not s:
        return s
    s = s.strip()
    if s in DICTIONARY:
        return DICTIONARY[s]

    res = s
    # Patterns for options
    replacements = [
        (r'Gevaarlijke bocht naar links', 'Dangerous bend to the left'),
        (r'Gevaarlijke bocht naar rechts', 'Dangerous bend to the right'),
        (r'Rijbaanversmalling langs links', 'Road narrowing on the left'),
        (r'Rijbaanversmalling langs rechts', 'Road narrowing on the right'),
        (r'Rijbaanversmalling', 'Road narrowing'),
        (r'Tweerichtingsverkeer', 'Two-way traffic'),
        (r'Verkeersbord\b', 'Traffic sign'),
        (r'gevaarsbord', 'hazard sign'),
        (r'waarschuwt voor\b', 'warns of'),
        (r'waarschuwt dat\b', 'warns that'),
        (r'geeft aan dat\b', 'indicates that'),
        (r'duidt aan dat\b', 'indicates that'),
        (r'duidt op\b', 'indicates'),
        (r'verbiedt\b', 'prohibits'),
        (r'verplicht\b', 'obliges'),
        (r'KB 1 december 1975', 'Royal Decree 1 December 1975'),
        (r'Wegcode', 'Highway Code'),
        (r'bebouwde kom', 'built-up area'),
        (r'rijbaan', 'roadway'),
        (r'voetgangers', 'pedestrians'),
        (r'fietsers', 'cyclists'),
        (r'vrachtwagens', 'lorries'),
        (r'motorvoertuigen', 'motor vehicles'),
        (r'motorfietsen', 'motorcycles'),
        (r'bromfietsen', 'mopeds'),
        (r'voorrang', 'priority'),
        (r'kruispunt', 'intersection'),
        (r'oversteekplaats', 'crossing'),
        (r'km/u', 'km/h'),
    ]
    for pat, rep in replacements:
        res = re.sub(pat, rep, res, flags=re.IGNORECASE)
    return res

def build():
    with open('../data/questions.json', encoding='utf-8') as f:
        data = json.load(f)

    recs = [q for q in data['questions'] if q['type'] == 'recognize']
    out = {}

    for r in recs:
        qid = r['id']
        question = "What does this traffic sign mean?"
        options = [translate_str(opt) for opt in r['options']]
        explanation = translate_str(r['explanation'])

        out[qid] = {
            "question": question,
            "options": options,
            "explanation": explanation
        }

    with open('trans_recognize.py', 'w', encoding='utf-8') as f:
        f.write('# -*- coding: utf-8 -*-\n')
        f.write('"""Translations for recognize questions (193)."""\n\n')
        f.write('TRANSLATIONS_RECOGNIZE = ')
        json.dump(out, f, indent=4, ensure_ascii=False)
        f.write('\n')

    print(f"Generated trans_recognize.py with {len(out)} entries")

if __name__ == '__main__':
    build()

