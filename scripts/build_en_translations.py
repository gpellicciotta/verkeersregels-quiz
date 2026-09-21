# -*- coding: utf-8 -*-
"""
Generate data/translations.en.json from data/questions.json
with accurate Belgian traffic rules terminology in British English.
"""
import json
import os

def main():
    questions_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'questions.json')
    out_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'translations.en.json')

    with open(questions_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    questions = data['questions']
    translations = {}

    # Import specialized translation mappings
    from translations_data import (
        TRANSLATIONS_IDENTIFY,
        TRANSLATIONS_SITUATION,
        TRANSLATIONS_RULE,
        TRANSLATIONS_RECOGNIZE,
    )

    for q in questions:
        qid = q['id']
        qtype = q['type']

        if qtype == 'identify':
            if qid in TRANSLATIONS_IDENTIFY:
                translations[qid] = TRANSLATIONS_IDENTIFY[qid]
            else:
                raise ValueError(f"Missing identify translation: {qid}")
        elif qtype == 'situation':
            if qid in TRANSLATIONS_SITUATION:
                translations[qid] = TRANSLATIONS_SITUATION[qid]
            else:
                raise ValueError(f"Missing situation translation: {qid}")
        elif qtype == 'rule':
            if qid in TRANSLATIONS_RULE:
                translations[qid] = TRANSLATIONS_RULE[qid]
            else:
                raise ValueError(f"Missing rule translation: {qid}")
        elif qtype == 'recognize':
            if qid in TRANSLATIONS_RECOGNIZE:
                translations[qid] = TRANSLATIONS_RECOGNIZE[qid]
            else:
                raise ValueError(f"Missing recognize translation: {qid}")

    assert len(translations) == len(questions), f"Expected {len(questions)} translations, got {len(translations)}"

    # Validate option lengths match
    for q in questions:
        qid = q['id']
        orig_len = len(q['options'])
        trans_len = len(translations[qid]['options'])
        assert orig_len == trans_len, f"Option count mismatch for {qid}: orig {orig_len} vs trans {trans_len}"

    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(translations, f, indent=2, ensure_ascii=False)

    print(f"Successfully generated {out_path} with {len(translations)} entries.")

if __name__ == '__main__':
    main()

