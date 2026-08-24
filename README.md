# Portfolio – Daniel Felizetti

Persönliche Portfolio-Website eines Frontend-Entwicklers. Die responsive One-Page-Anwendung stellt Kenntnisse, ausgewählte Projekte und Referenzen vor und bietet ein zweisprachiges Kontaktformular. Impressum und Datenschutzerklärung sind als eigene Seiten eingebunden.

## Funktionen

- responsives Layout für Desktop, Tablet und Smartphone
- Sprachumschaltung zwischen Deutsch und Englisch mit Speicherung der Auswahl im Browser
- Desktop-Navigation und zugängliches mobiles Menü
- Projektübersicht mit Live-Demos und GitHub-Repositories
- per Schaltflächen, Punkten und Tastatur bedienbarer Testimonial-Slider
- Kontaktformular mit client- und serverseitiger Validierung sowie Statusmeldungen
- eigene Seiten für Impressum und Datenschutzerklärung
- lokal eingebundene Schriftarten und Grafiken ohne Frontend-Abhängigkeiten
- reduzierte Animationen bei aktivierter Systemeinstellung `prefers-reduced-motion`

## Verwendete Technologien

- HTML5
- CSS3 mit Custom Properties, Flexbox, Grid und Media Queries
- Vanilla JavaScript
- PHP für den E-Mail-Versand des Kontaktformulars
- Git und GitHub

Das Projekt verwendet keinen Paketmanager, kein Framework und keinen Build-Prozess.

## Enthaltene Projekte

| Projekt | Technologien | Live-Demo | Quellcode |
| --- | --- | --- | --- |
| Join | HTML, CSS, JavaScript, Firebase | [join.daniel-felizetti.de](https://join.daniel-felizetti.de) | [DaniGalvani/join_portfolio](https://github.com/DaniGalvani/join_portfolio) |
| Pollo Loco | HTML, CSS, JavaScript | [pollo-loco.daniel-felizetti.de](https://pollo-loco.daniel-felizetti.de) | [DaniGalvani/El_Pollo_Loco](https://github.com/DaniGalvani/El_Pollo_Loco) |

## Projektstruktur

```text
portfolio/
├── assets/
│   ├── icons/                 # Icons und Technologie-Grafiken
│   └── img/                   # Bilder, Hintergründe und Projektvorschauen
├── fonts/                     # Lokal eingebundene Poppins-Schriftarten
├── styles/
│   ├── base.css               # globale Styles, Variablen und Grundlayout
│   ├── header.css             # Header und Desktop-Navigation
│   ├── hero.css               # Einstiegsbereich
│   ├── about.css              # „About me“-Bereich
│   ├── skills.css             # Fähigkeiten
│   ├── portfolio.css          # Projekte und Testimonial-Slider
│   ├── contact.css            # Kontaktformular
│   ├── footer.css             # Footer
│   ├── legal-notice.css       # Rechtliche Unterseiten
│   └── responsive.css         # mobile Navigation und responsive Anpassungen
├── index.html                 # Hauptseite
├── legal-notice.html          # Impressum
├── privacy-policy.html        # Datenschutzerklärung
├── language.js                # Übersetzungen und Sprachumschaltung
├── script.js                  # Navigation, Slider und Formularlogik
└── contact.form.mail.php      # serverseitiger Mail-Endpunkt
```

## Lokal ausführen

### Nur das Frontend ansehen

Voraussetzung: Python 3 oder ein vergleichbarer lokaler Webserver.

```bash
git clone https://github.com/DaniGalvani/portfolio.git
cd portfolio
python3 -m http.server 8000
```

Anschließend `http://localhost:8000` im Browser öffnen.

Über diesen Startweg kann die Website vollständig angesehen werden. Das Kontaktformular kann jedoch keine Nachricht versenden, weil der Python-Server die PHP-Datei nicht ausführt.

### Website mit PHP-Endpunkt starten

Voraussetzung: PHP mit verfügbarer `mail()`-Funktion.

```bash
php -S 127.0.0.1:8000
```

Danach `http://127.0.0.1:8000` öffnen. Der PHP-Endpunkt lässt sich lokal aufrufen; ein erfolgreicher Mailversand benötigt zusätzlich einen korrekt eingerichteten Mailserver.

## Wichtige Anpassungspunkte

### Texte und Sprachen

Die Übersetzungen liegen in [`language.js`](./language.js). Elemente werden über folgende Attribute mit Übersetzungsschlüsseln verbunden:

- `data-i18n` für reinen Text
- `data-i18n-html` für Text mit bewusst enthaltenem HTML
- `data-i18n-aria-label` für zugängliche Bezeichnungen
- `data-i18n-placeholder` für Formular-Platzhalter
- `data-language-content` für vollständige sprachabhängige Inhaltsblöcke

Die gewählte Sprache wird unter dem Schlüssel `portfolio-language` in `localStorage` gespeichert. `language.js` muss deshalb weiterhin vor `script.js` geladen werden.

### Farben und Layout

Globale Designwerte befinden sich in [`styles/base.css`](./styles/base.css). Dazu gehören insbesondere:

```css
--primary-color: #70e61c;
--secondary-color: #9747ff;
--background-color: #141d2f;
--text-color: #ffffff;
--content-max-width: 1440px;
```

Bereichsspezifische Änderungen sollten in der jeweils zuständigen CSS-Datei vorgenommen werden. Bilder und Icons liegen in `assets/`.

### Kontaktformular

Das Formular sendet JSON per `POST` an [`contact.form.mail.php`](./contact.form.mail.php). Der Endpunkt:

- akzeptiert ausschließlich `POST`- und `OPTIONS`-Anfragen,
- prüft Name, E-Mail-Adresse, Nachricht und Datenschutzzustimmung,
- begrenzt die Eingabelängen,
- maskiert Nutzereingaben vor dem Einfügen in die HTML-Mail und
- antwortet mit JSON und einem passenden HTTP-Statuscode.

Vor einem Deployment müssen in der PHP-Datei folgende Werte geprüft und gegebenenfalls geändert werden:

```php
$recipientEmail = '...';
$senderEmail = '...';
```

Die Absenderadresse sollte zur Domain des Hostings gehören. Der Server muss PHP und den Mailversand über `mail()` unterstützen. Für ein produktives Formular sollten außerdem Spam-Schutz, Rate-Limiting und eine zum tatsächlichen Hosting passende CORS-Konfiguration berücksichtigt werden.

### Rechtliche Inhalte

Vor jeder Veröffentlichung müssen [`legal-notice.html`](./legal-notice.html) und [`privacy-policy.html`](./privacy-policy.html) auf Aktualität und Übereinstimmung mit Hosting, Formularverarbeitung und Kontaktdaten geprüft werden. Diese Hinweise ersetzen keine Rechtsberatung.

## Prüfung und Qualitätssicherung

Für die JavaScript- und PHP-Syntax können ohne zusätzliche Abhängigkeiten folgende Befehle verwendet werden:

```bash
node --check language.js
node --check script.js
php -l contact.form.mail.php
git diff --check
```

Zusätzlich sollten manuell geprüft werden:

- Darstellung bei großen und kleinen Viewports
- mobile Navigation per Maus, Tastatur und Escape-Taste
- deutsche und englische Inhalte sowie gespeicherte Sprachwahl
- Navigation zu allen Seitenabschnitten
- Testimonial-Slider mit Pfeiltasten und Bedienelementen
- alle Live- und GitHub-Links
- Formularvalidierung sowie Erfolgs- und Fehlermeldungen
- Mailversand in der produktiven Hosting-Umgebung
- Impressum und Datenschutzerklärung

Automatisierte Tests sind aktuell nicht eingerichtet.

## Deployment

Da kein Build-Schritt erforderlich ist, können die Dateien direkt auf einen Webserver kopiert werden. Für die vollständige Funktion werden benötigt:

1. ein Webserver mit PHP-Unterstützung,
2. eine funktionsfähige Mailkonfiguration für `mail()`,
3. HTTPS für die veröffentlichte Website und
4. unveränderte relative Pfade zwischen HTML, CSS, JavaScript und Assets.

Nach dem Upload sollten insbesondere der Mailversand, die rechtlichen Seiten, die Sprachwahl und alle externen Projektlinks in der produktiven Umgebung getestet werden.

## Kontakt

- GitHub: [DaniGalvani](https://github.com/DaniGalvani)
- E-Mail: [dfelizetti@gmx.de](mailto:dfelizetti@gmx.de)

## Lizenz

Dieses Repository enthält derzeit keine Lizenzdatei. Ohne ausdrückliche Lizenz wird keine Erlaubnis zur Weiterverwendung, Veränderung oder Verbreitung des Codes und der enthaltenen Medien erteilt.
