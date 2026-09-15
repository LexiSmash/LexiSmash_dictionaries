# Come contribuire

Grazie per voler migliorare i dizionari di LexiSmash! Ecco come proporre
una correzione.

## Prima di iniziare

- Ogni Pull Request viene rivista **a mano** da un manutentore umano prima
  di essere accettata — non aspettarti una fusione automatica o
  immediata.
- Le parole sono sempre in **MAIUSCOLO**, senza accenti sostituiti da
  apostrofi o altre normalizzazioni particolari: usa la stessa
  convenzione già presente nel file che stai modificando.
- Una Pull Request per motivo di modifica è preferibile a una Pull
  Request enorme con tante modifiche scollegate tra loro — più facile da
  rivedere, più probabile che venga accettata in fretta.

## Aggiungere una parola

1. Apri il file della lingua giusta dentro `docs/dictionaries/` (es.
   `docs/dictionaries/it.json` per l'italiano).
2. Aggiungi una nuova riga con la parola in MAIUSCOLO e la categoria
   corretta, mantenendo l'ordine alfabetico del file per rendere il diff
   leggibile:
   ```json
   "NUOVAPAROLA": "nouns",
   ```
3. Nella descrizione della Pull Request spiega **perché** la parola
   dovrebbe essere valida (es. "è un sostantivo comune, presente anche sul
   dizionario X").

## Rimuovere o correggere una parola

Stessa procedura: rimuovi la riga, o modifica la categoria assegnata,
spiegando il motivo nella descrizione della Pull Request (es. "questa non
è una parola valida in italiano", "la categoria corretta è aggettivo, non
sostantivo").

## Cosa NON verrà accettato

- Parole chiaramente inventate, offensive senza motivo linguistico reale,
  o aggiunte per scherzo.
- Pull Request che modificano più di una lingua contemporaneamente senza
  un motivo condiviso valido per entrambe.
- Modifiche al formato dei file (struttura JSON, nomi delle categorie):
  se pensi che il formato stesso vada cambiato, apri prima una Issue per
  discuterne, non una Pull Request diretta.

## Issue invece di una Pull Request

Se non sei sicuro di come formattare la correzione, o vuoi solo segnalare
un problema senza proporre tu la modifica, va benissimo aprire una Issue
descrivendo la parola e il problema — verrà gestita comunque a mano.
