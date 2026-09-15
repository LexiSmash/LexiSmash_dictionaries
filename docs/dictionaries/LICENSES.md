# Fonti e licenze dei dizionari

Ogni file `<lingua>.json` in questa cartella è una lista `PAROLA: categoria` derivata (con pulizia, filtraggio ortografico e conversione in maiuscolo) da un lessico esterno. Nessuna parola è stata scritta a mano dal team.

## Francese — `fr.json`
- Fonte: **Lefff** (Lexique des Formes Fléchies du Français), Benoît Sagot / Alpage-INRIA.
- Licenza: LGPL-LR (Lesser General Public License For Linguistic Resources) — http://sanskrit.inria.fr/DATA/LGPLLR.html
- File originali: `lefff-3.4.mlex` + `lefff-3.4-addition.mlex`.

## Spagnolo — `es.json`
- Fonte: **FreeLing**, dizionario spagnolo (`data/es/dictionary`), sviluppato dall'Institut Universitari de Lingüística Aplicada (IULA) della Universitat Pompeu Fabra, estratto dallo Spanish Resource Grammar project.
- Licenza: LGPL-LR — vedi `LICENSES/LGPLLR.license` nel repository FreeLing (https://github.com/TALP-UPC/FreeLing).
- Nota: questo dizionario copre solo nomi comuni/verbi/aggettivi/altro — non contiene nomi propri (nessuna fonte di toponimi/antroponimi è stata individuata con licenza altrettanto chiara).

## Tedesco — `de.json`
- Fonte: **german-nouns** (github.com/gambolputty/german-nouns), dati compilati da WiktionaryDE.
- Licenza: dati derivati da Wiktionary → CC BY-SA (stessa licenza dei contenuti Wiktionary).
- Nota: copre **solo sostantivi**. Verbi e aggettivi tedeschi non sono ancora presenti — categoria `categories` in `config.json` riflette onestamente questo limite (`["nouns"]`).

## Olandese — `nl.json`
- Lista parole: **OpenTaal wordlist** (github.com/OpenTaal/opentaal-wordlist), Stichting OpenTaal — marchio "Keurmerk Spelling" della Taalunie (autorità ortografica ufficiale della lingua olandese). Licenza: Revised BSD License e/o CC BY 3.0.
- Categorie grammaticali: **dutch-pos-dict** di LanguageTool (github.com/languagetool-org/dutch-pos-dict). Licenza: Creative Commons Attribution 3.0 Unported oppure BSD (a scelta, come dichiarato dal progetto). I dati erano compilati in formato binario Morfologik — esportati in testo semplice con lo strumento `DictionaryExporter` di LanguageTool.
- Metodo: le 391.948 parole di OpenTaal sono state incrociate con i tag grammaticali di dutch-pos-dict (94,7% delle parole ha trovato un tag corrispondente: nomi, verbi, aggettivi o nomi propri). Il restante 5,3% resta in categoria `other`. Questo incrocio è stato necessario perché dutch-pos-dict da solo, prima del filtro, generava 5 milioni di voci (125 MB) — soprattutto composti nominali generati automaticamente (l'olandese permette comporre parole quasi all'infinito), troppi e troppo incerti per un dizionario di gioco.
- Limite noto: in un numero limitato di casi una parola comune e un cognome/nome proprio omografo (es. "Mooi", cognome olandese ma anche l'aggettivo "mooi" = bello) possono risultare categorizzati come "nomi propri" invece che nella categoria più comune. Non influisce sulla validità della parola in gioco, solo sull'eventuale filtro per categoria.

## Italiano — `it.json`
- Fonte: **Morph-it!**, lessico morfologico dell'italiano di Marco Baroni ed Eros Zanchetta (Università di Bologna) — https://docs.sslmit.unibo.it/doku.php?id=resources:morph-it
- Licenza: doppia licenza a scelta — **Creative Commons Attribution ShareAlike 2.0** oppure **GNU Lesser General Public License (LGPL)**. Copyright (C) 2004-2007 Marco Baroni e Eros Zanchetta.
- Nota: il punto di partenza è stato l'elenco di forme flesse di Morph-it!, poi corretto e curato a mano nel tempo dall'autore del progetto (parole mancanti aggiunte, voci errate rimosse, categorie riassegnate secondo lo schema a 6 categorie usato da LexiSmash).

## Inglese — `en.json`
- Fonte: **The SPECIALIST Lexicon**, lessico inglese della U.S. National Library of Medicine (NLM) / UMLS — https://www.nlm.nih.gov/research/umls/new_users/online_learning/LEX_001.html (progetto: https://lhncbc.nlm.nih.gov/LSG/Projects/lexicon/current/web/index.html)
- Licenza: **Pubblico dominio** (Public Domain), come dichiarato esplicitamente dalla NLM.
- Nota: il lessico originale include anche terminologia biomedica oltre alle parole comuni inglesi; è stato usato come punto di partenza, poi filtrato e curato a mano per adattarlo al gioco (rimozione dei termini specialistici non pertinenti, riassegnazione categorie).

## Regola comune di pulizia applicata a tutte le lingue
Sono state escluse dalle liste: forme con spazi, trattini, apostrofi o cifre (compatibilità Scrabble — nessuna parola composta o con trattino è valida), e marcatori strutturali/interni dei lessici sorgente (punteggiatura, tag tecnici) che non rappresentano parole reali.
