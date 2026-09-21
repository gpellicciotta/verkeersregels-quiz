# -*- coding: utf-8 -*-
"""
Full English translations generator for all 193 recognize questions.
"""
import json
import re

PATTERNS = [
    # General prefixes
    (r'^Aanbeveling om (.*)$', r'Recommendation to \1'),
    (r'^Aanbevolen route voor (.*)$', r'Recommended route for \1'),
    (r'^Aanbevolen snelheid van (.*)$', r'Recommended speed of \1'),
    (r'^Aanbevolen snelheid tot aan (.*)$', r'Recommended speed up to \1'),
    (r'^Aanbevolen ([^\n]+)$', r'Recommended \1'),
    (r'^Aanduiding van de rijstroken van een rijbaan met (.*)$', r'Indication of lanes on a roadway with \1'),
    (r'^Aanduiding van een ([^\n]+)$', r'Indication of a \1'),
    (r'^Aanduiding van ([^\n]+)$', r'Indication of \1'),
    (r'^Aankondiging van bord ([^\n]+)$', r'Advance warning of sign \1'),
    (r'^Aankondiging van een ([^\n]+)$', r'Advance notice of a \1'),
    (r'^Aankondiging van ([^\n]+)$', r'Advance notice of \1'),
    (r'^Begin van de bebouwde kom van ([^\n]+)$', r'Beginning of the built-up area of \1'),
    (r'^Begin van een ([^\n]+)$', r'Beginning of a \1'),
    (r'^Begin van ([^\n]+)$', r'Beginning of \1'),
    (r'^Einde van de bebouwde kom van ([^\n]+)$', r'End of the built-up area of \1'),
    (r'^Einde van de ([^\n]+)$', r'End of the \1'),
    (r'^Einde van het ([^\n]+)$', r'End of the \1'),
    (r'^Einde van een ([^\n]+)$', r'End of a \1'),
    (r'^Einde van ([^\n]+)$', r'End of \1'),
    (r'^Einde ([^\n]+)$', r'End of \1'),
    (r'^Verbod om ([^\n]+)$', r'Prohibition against \1'),
    (r'^Verbod voor ([^\n]+)$', r'Prohibition for \1'),
    (r'^Verboden toegang voor ([^\n]+)$', r'No entry for \1'),
    (r'^Verboden richting voor ([^\n]+)$', r'No entry for \1'),
    (r'^Verboden ([^\n]+)$', r'Prohibited: \1'),
    (r'^Verplichting om ([^\n]+)$', r'Obligation to \1'),
    (r'^Verplichting ([^\n]+)$', r'Obligation: \1'),
    (r'^Verplicht ([^\n]+)$', r'Mandatory \1'),
    (r'^Verplichte ([^\n]+)$', r'Mandatory \1'),
    (r'^Waarschuwing voor een ([^\n]+)$', r'Warning of a \1'),
    (r'^Waarschuwing voor ([^\n]+)$', r'Warning of \1'),
    (r'^Plaats waar ([^\n]+)$', r'Location where \1'),
    (r'^Voorbehouden parkeerplaats voor ([^\n]+)$', r'Reserved parking space for \1'),
    (r'^Voorbehouden parkeerstrook voor ([^\n]+)$', r'Reserved parking lane for \1'),
    (r'^Voorbehouden ([^\n]+)$', r'Reserved \1'),
]

TERMS = [
    (r'\bverkeersbord\b', 'traffic sign'),
    (r'\bgevaarsbord\b', 'hazard sign'),
    (r'\bwaarschuwt voor\b', 'warns of'),
    (r'\bwaarschuwt dat\b', 'warns that'),
    (r'\bgeeft aan dat\b', 'indicates that'),
    (r'\bduidt aan dat\b', 'indicates that'),
    (r'\bduidt op\b', 'indicates'),
    (r'\bverbiedt om\b', 'prohibits'),
    (r'\bverbiedt\b', 'prohibits'),
    (r'\bverplicht om\b', 'obliges'),
    (r'\bverplicht\b', 'obliges'),
    (r'\bKB 1 december 1975\b', 'Royal Decree 1 December 1975'),
    (r'\bWegcode\b', 'Highway Code'),
    (r'\bbebouwde kom\b', 'built-up area'),
    (r'\brijbaanversmalling langs links\b', 'road narrowing on the left'),
    (r'\brijbaanversmalling langs rechts\b', 'road narrowing on the right'),
    (r'\brijbaanversmalling\b', 'road narrowing'),
    (r'\brijbaan\b', 'roadway'),
    (r'\brijstrook\b', 'lane'),
    (r'\brijstroken\b', 'lanes'),
    (r'\bvoetgangerszone\b', 'pedestrian zone'),
    (r'\bvoetgangers\b', 'pedestrians'),
    (r'\bvoetganger\b', 'pedestrian'),
    (r'\bfietszone\b', 'cycle zone'),
    (r'\bfietsstraat\b', 'cycle street'),
    (r'\bfietspad\b', 'cycle path'),
    (r'\bfietsers\b', 'cyclists'),
    (r'\bfietser\b', 'cyclist'),
    (r'\bvrachtwagens\b', 'lorries'),
    (r'\bvrachtwagen\b', 'lorry'),
    (r'\bmotorvoertuigen\b', 'motor vehicles'),
    (r'\bmotorvoertuig\b', 'motor vehicle'),
    (r'\bmotorfietsen\b', 'motorcycles'),
    (r'\bmotorfiets\b', 'motorcycle'),
    (r'\bbromfietsen klasse A en B\b', 'class A and B mopeds'),
    (r'\bbromfietsen klasse A\b', 'class A mopeds'),
    (r'\bbromfietsen klasse B\b', 'class B mopeds'),
    (r'\bbromfietsen\b', 'mopeds'),
    (r'\blandbouwvoertuigen\b', 'agricultural vehicles'),
    (r'\bsnelheidsbeperking\b', 'speed limit'),
    (r'\bmaximumsnelheid\b', 'maximum speed limit'),
    (r'\bvoorrang van rechts\b', 'priority to the right'),
    (r'\bvoorrangsweg\b', 'priority road'),
    (r'\bvoorrang verlenen\b', 'give way'),
    (r'\bvoorrang\b', 'priority'),
    (r'\bkruispunt\b', 'intersection'),
    (r'\boversteekplaats voor voetgangers\b', 'pedestrian crossing'),
    (r'\boversteekplaats voor fietsers\b', 'cyclist crossing'),
    (r'\boversteekplaats\b', 'crossing'),
    (r'\bspooroverweg\b', 'level crossing'),
    (r'\boverweg met slagbomen\b', 'level crossing with barriers'),
    (r'\boverweg zonder slagbomen\b', 'level crossing without barriers'),
    (r'\boverweg\b', 'level crossing'),
    (r'\brotonde\b', 'roundabout'),
    (r'\bautosnelweg\b', 'motorway'),
    (r'\bautoweg\b', 'expressway'),
    (r'\bwoonerf\b', 'residential area / living street'),
    (r'\berf\b', 'living street'),
    (r'\beenrichtingsverkeer\b', 'one-way traffic'),
    (r'\beenrichtingsstraat\b', 'one-way street'),
    (r'\bdoodlopende weg\b', 'dead end'),
    (r'\bdoodlopende straat\b', 'dead-end street'),
    (r'\bverhoogde inrichting\b', 'speed bump / raised road feature'),
    (r'\bverhoogde inrichtingen\b', 'speed bumps / raised road features'),
    (r'\bgevaarlijke bocht naar links\b', 'dangerous bend to the left'),
    (r'\bgevaarlijke bocht naar rechts\b', 'dangerous bend to the right'),
    (r'\bdubbele bocht\b', 'double bend'),
    (r'\bgladde rijbaan\b', 'slippery road'),
    (r'\bglibberige rijbaan\b', 'slippery road surface'),
    (r'\bwerken op de weg\b', 'road works'),
    (r'\bwegenwerken\b', 'road works'),
    (r'\btweerichtingsverkeer\b', 'two-way traffic'),
    (r'\bpechstrook\b', 'hard shoulder / emergency lay-by'),
    (r'\bziekenhuis met spoedopname\b', 'hospital with emergency ward'),
    (r'\bziekenhuis\b', 'hospital'),
    (r'\bhulppost\b', 'first aid post'),
    (r'\bbrandweerkazerne\b', 'fire station'),
    (r'\bapotheek\b', 'pharmacy'),
    (r'\bpolitiepost\b', 'police station'),
    (r'\bbenzinestation\b', 'petrol station'),
    (r'\btankstation\b', 'filling station'),
    (r'\blaadstation voor elektrische voertuigen\b', 'charging station for electric vehicles'),
    (r'\btelefoon\b', 'telephone'),
    (r'\bhotel of motel\b', 'hotel or motel'),
    (r'\brestaurant\b', 'restaurant'),
    (r'\bverfrissingspost of caf[eé]\b', 'refreshment post or cafe'),
    (r'\bkampeerterrein\b', 'camping site'),
    (r'\bcaravanterrein\b', 'caravan site'),
    (r'\bjeugdherberg\b', 'youth hostel'),
    (r'\brustplaats\b', 'rest area'),
    (r'\bpicknickplaats\b', 'picnic site'),
    (r'\bbegin van een wandelroute\b', 'start of a walking trail'),
    (r'\binformatiebureau\b', 'tourist information office'),
    (r'\buitkijkpunt\b', 'viewpoint'),
    (r'\btoilet\b', 'public toilet'),
    (r'\btoegang in beide richtingen voor elke bestuurder\b', 'entry in both directions for all drivers'),
    (r'\btoegang in beide richtingen\b', 'entry in both directions'),
    (r'\balle verkeer\b', 'all traffic'),
    (r'\bin beide richtingen\b', 'in both directions'),
    (r'\bInhaalverbod voor alle motor vehicles\b', 'Overtaking prohibited for all motor vehicles'),
    (r'\bInhaalverbod voor lorries\b', 'Overtaking prohibited for lorries'),
    (r'\bInhaalverbod voor\b', 'Overtaking prohibited for'),
    (r'\bInhaalverbod\b', 'Overtaking prohibited'),
    (r'\bToegang tot een luchthaventerrein\b', 'Access to airport grounds'),
    (r'\bToegang tot een\b', 'Access to a'),
    (r'\bToegang tot\b', 'Access to'),
    (r'\bToegestaan voor\b', 'Permitted for'),
    (r'\bToegestane\b', 'Permitted'),
    (r'\bToegang\b', 'Access'),
    (r'\bVerbod aan het volgend intersection links af te slaan\b', 'Prohibited to turn left at the next intersection'),
    (r'\bVerbod aan het volgend intersection rechts af te slaan\b', 'Prohibited to turn right at the next intersection'),
    (r'\bVerbod aan het volgend kruispunt\b', 'Prohibited at the next intersection'),
    (r'\bVerbod\b', 'Prohibition'),
    (r'\bVerplichte rijrichting\b', 'Mandatory direction of travel'),
    (r'\bMandatory route voor\b', 'Mandatory route for'),
    (r'\bMandatory route\b', 'Mandatory route'),
    (r'\bgeen toegang\b', 'no access / no entry'),
    (r'\bbestuurders van motor vehicles met meer dan twee wielen en van motorcycles met zijspan\b', 'drivers of motor vehicles with more than two wheels and motorcycles with sidecar'),
    (r'\bbestuurders van voertuigen bestemd voor goederenvervoer\b', 'drivers of goods vehicles'),
    (r'\bbestuurders van vierwielige motor vehicles geconstrueerd voor onverhard terrein \(quads\)\b', 'drivers of quadricycles designed for off-road terrain (quads)'),
    (r'\bbestuurders van motorcycles\b', 'drivers of motorcycles'),
    (r'\bbestuurders van mopeds\b', 'riders of mopeds'),
    (r'\bbestuurders van bicycles\b', 'cyclists'),
    (r'\bbestuurders van\b', 'drivers of'),
    (r'\bbestuurders\b', 'drivers'),
    (r'\bvoertuigen breder dan aangeduid\b', 'vehicles wider than indicated'),
    (r'\bvoertuigen hoger dan aangeduid\b', 'vehicles higher than indicated'),
    (r'\bvoertuigen langer dan aangeduid\b', 'vehicles longer than indicated'),
    (r'\bvoertuigen met een gewicht hoger dan aangeduid\b', 'vehicles weighing more than indicated'),
    (r'\bvoertuigen\b', 'vehicles'),
    (r'\bvoertuig\b', 'vehicle'),
    (r'\bgevaarlijke ladingen\b', 'dangerous goods'),
    (r'\bgemeente\b', 'municipality'),
    (r'\bprovincie\b', 'province'),
    (r'\bgrens\b', 'border'),
    (r'\btot aan het volgend intersection\b', 'up to the next intersection'),
    (r'\bvolgend intersection\b', 'next intersection'),
    (r'\bvolgend kruispunt\b', 'next intersection'),
    (r'\bop het intersection\b', 'at the intersection'),
    (r'\bEnd of a expressway\b', 'End of an expressway'),
    (r'\bEnd of a motor vehicle\b', 'End of a road reserved for motor vehicles'),
    (r'\bEnd of a cycle path\b', 'End of a cycle path'),
    (r'\bEnd of a pedestrian crossing\b', 'End of a pedestrian crossing'),
    (r'\bEnd of a residential area\b', 'End of a residential area'),
    (r'\bEnd of a priority road\b', 'End of a priority road'),
    (r'\bEnd of a motorway\b', 'End of a motorway'),
    (r'\bmet een MTM van meer dan 3,5 ton\b', 'with a MAM exceeding 3.5 tonnes'),
    (r'\bmet een MTM boven 3,5 ton\b', 'with a MAM over 3.5 tonnes'),
    (r'\bMTM\b', 'MAM (maximum authorised mass)'),
    (r'\bop de aangeduide afstand\b', 'at the indicated distance'),
    (r'\bop aangeduide afstand\b', 'at the indicated distance'),
    (r'\baangeduide\b', 'indicated'),
    (r'\btijdelijke\b', 'temporary'),
    (r'\bopenbare\b', 'public'),
    (r'\bgesloten voor\b', 'closed to'),
    (r'\bvoorbehouden voor\b', 'reserved for'),
    (r'\bvoorbehouden aan\b', 'reserved for'),
    (r'\bvoorbehouden\b', 'reserved'),
    (r'\btroetellijn\b', 'edge marking'),
    (r'\bhouders van een bewonerskaart\b', 'residents permit holders'),
    (r'\bop schooldagen\b', 'on school days'),
    (r'\btijdens schooluren\b', 'during school hours'),
    (r'\buitgezonderd plaatselijk verkeer\b', 'except local traffic'),
    (r'\bplaatselijk verkeer\b', 'local traffic'),
    (r'\buitgezonderd vergunninghouders\b', 'except permit holders'),
    (r'\bvergunninghouders\b', 'permit holders'),
    (r'\buitgezonderd\b', 'except'),
    (r'\bkm/u\b', 'km/h'),
    (r'\bpersonen met een handicap\b', 'persons with disabilities'),
    (r'\brolstoelgebruikers\b', 'wheelchair users'),
    (r'\bparkeerschijf\b', 'parking disc'),
    (r'\bblauwe zone\b', 'blue zone'),
    (r'\bparkeren verboden\b', 'no parking'),
    (r'\bstilstaan en parkeren verboden\b', 'no stopping and no parking'),
]

def translate_text(text):
    if not text:
        return text
    res = text.strip()

    for pat, rep in PATTERNS:
        if re.search(pat, res, re.IGNORECASE):
            res = re.sub(pat, rep, res, flags=re.IGNORECASE)
            break

    for pat, rep in TERMS:
        res = re.sub(pat, rep, res, flags=re.IGNORECASE)

    return res

def run():
    with open('../data/questions.json', encoding='utf-8') as f:
        data = json.load(f)

    recs = [q for q in data['questions'] if q['type'] == 'recognize']
    out = {}

    for r in recs:
        qid = r['id']
        question = "What does this traffic sign mean?"
        options = [translate_text(opt) for opt in r['options']]
        explanation = translate_text(r['explanation'])

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

    print(f"Generated comprehensive trans_recognize.py with {len(out)} entries")

if __name__ == '__main__':
    run()
