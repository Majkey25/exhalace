# Úpravy webu bez programování

Web se upravuje přes **Pages CMS**, formuláře v prohlížeči. Programovat není potřeba.

## Přihlášení

1. Otevři **https://app.pagescms.org** a přihlas se přes GitHub.
2. Vyber repozitář **exhalace**.
3. Vlevo je menu: **Koncerty, Repertoár, Galerie, Sestava, O kapele, Videa, Nastavení webu**.

Každé uložení (**Save**) se na webu objeví zhruba za pár minut. Průběh je vidět na
https://github.com/Majkey25/exhalace/actions (zelená = hotovo).

## Co kde upravíš

| Sekce          | Co tam je                                                                          |
| -------------- | ---------------------------------------------------------------------------------- |
| Koncerty       | Datum, čas, místo, obec, odkaz na mapu, vstupenky, stav (zrušeno…), popis, plakát. |
| Repertoár      | Písně a interpreti. Web je seřadí sám podle abecedy.                               |
| Galerie        | Fotky: přidat, smazat, přetáhnout pořadí. Každá potřebuje krátký popis.            |
| Sestava        | Jméno, nástroj, kde dřív hrál, fotka na výšku.                                     |
| O kapele       | Úvodní věty, příběh po kapitolách (s rokem), rok vzniku, odkud jste.               |
| Videa          | Odkaz na YouTube, název, rok.                                                      |
| Nastavení webu | E-mail a telefon, slogan a obrázek na úvodu, sítě, info pro pořadatele, mapa.      |

## Nový koncert

1. **Koncerty** → dole **Add an item**.
2. Vyplň aspoň **datum** a **obec**, k tomu místo nebo název akce. Čas piš jako `20:00`.
3. **Save**. Koncert se sám zařadí mezi nadcházející a po datu se přesune do proběhlých.

Každý koncert má vlastní stránku s mapou a tlačítkem **Přidat do kalendáře**.
Pořadí v seznamu nehraje roli, web koncerty řadí podle data.

## Fotky

Nahrávej fotky rovnou z foťáku nebo mobilu, klidně velké. Web si je sám zmenší a převede do
rychlých formátů. Členy foť na výšku, ať mají v sestavě stejný tvar.

## Když se něco pokazí

Web před zveřejněním každou změnu zkontroluje. Když najde chybu (třeba špatné datum nebo
chybějící fotku), **nezveřejní se nic a web zůstane, jak byl**. Chybu opravíš ve stejném formuláři.

## Pro správce

- **Přidání člena kapely do CMS:** GitHub → repozitář → Settings → Collaborators → Add people,
  role **Write**. Pak se může přihlásit do Pages CMS.
- **Pages CMS** musí mít přístup k repozitáři: GitHub → Settings → Applications → Pages CMS →
  Configure → Repository access → přidat **exhalace**.
- **Kontaktní formulář** posílá zprávy přes FormSubmit na e-mail z Nastavení webu. Po první
  zprávě přijde na ten e-mail aktivační zpráva. Jednou na odkaz klikni, jinak zprávy chodit nebudou.
