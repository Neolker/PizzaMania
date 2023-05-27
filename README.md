# PizzaMania
## Důležité odkazy ke studiu / projektu
- [Zadání projektu](https://uuapp.plus4u.net/uu-dockit-maing02/4e68298f1658473e9bf5692272883290/document?documentId=63e66c5ad42df5003627e3d6) obsahuje všechny požadavky na projekt.
- [Projektový portál](https://uuapp.plus4u.net/uu-dockit-maing02/4e68298f1658473e9bf5692272883290/document?documentId=63e670ee46a3400036cf3231) workshopu, hodnocení, harmonogramu a týmů.
  - [Business Request](https://uuapp.plus4u.net/uu-bookkit-maing01/a994a2a988ee43d6ae7dcabf0d5b9f43/book/page?code=userStories) kniha (User Stories, Vize, atd.)
  - [Business Model](https://uuapp.plus4u.net/uu-bookkit-maing01/6a1fdf0c62714fd6ac143a8844f7495f/book/page?code=home) kniha (Actors, Use Cases, atd.)
  - [Application Model](https://uuapp.plus4u.net/uu-bookkit-maing01/d1b6a9636f904eca90ce86bb5258495d/book/page?code=home) kniha (TODO)
- [Stránka předmětu](https://unicornuniversity.net/cs/cloud-application-architecture) s materiály (učebnice, videa, příklady, atd.)
  - [Práce s Git](https://uuapp.plus4u.net/uu-bookkit-maing01/92f4b54768304fd8a1088fadab560d53/book/page?code=welcome) - učebnice
  - [Server Side JS](https://uuapp.plus4u.net/uu-bookkit-maing01/37bcb632a07543e58625add6221ffafd/book/page?code=home) - učebnice
  - [Pokročilý JavaScript](https://uuapp.plus4u.net/uu-bookkit-maing01/36a8aef298b44a5bb1f1be2389146e9b/book/page?code=home) - učebnice
  - [Základy ReactJS](https://uuapp.plus4u.net/uu-bookkit-maing01/861481b4b8974cda8569b998eefad53c/book/page?code=home) - učebnice
- Případová studie **uuJokes**:
  - [uuJokes](https://uuapp.plus4u.net/uu-jokes-maing01/4ef6a7b01b5942ecbfb925b249af987f/jokes) - Odkaz na aplikaci
  - uuJokes - [Business Requests](https://uuapp.plus4u.net/uu-bookkit-maing01/a04c8463649b425fb8b46076c0c5e5d0/book/page?code=home)
  - uuJokes - [Business Model](https://uuapp.plus4u.net/uu-bookkit-maing01/a129e74e3bcc4fe4a4a95f5e4bb494ed/book/page?code=home)
  - uuJokes - [Application Model](https://uuapp.plus4u.net/uu-bookkit-maing01/71f8d7b5cfdc4336b0abfe47b3cb237b/book/page?code=home)

## Instalace potřebného SW
- Visual Studio Code - https://code.visualstudio.com/Download
- Node.js - https://nodejs.org/en/download
- Git - https://git-scm.com/downloads
- Tester API serveru (GET/POST):
  - Postman - https://www.postman.com/downloads/
  - Insomnia - https://insomnia.rest/download

## Stažení a spuštění projektu
- Příkaz `git clone https://github.com/Neolker/PizzaMania` anebo pomocí GUI ve VSCode
- Otevřít si dva terminály, první pro **server**:
  - Ze složky serveru `cd .\server\`
  - Příkaz `npm install` nainstaluje všechny potřebné balíčky (Express.js apod.), stačí spustit jednou
  - **Server** potom spustíme příkazem `npm start`
  - Měl by potom **server** běžet na http://localhost:8000
  - Zastavit **server** jde potom klávesovou zkratkou `CTRL + C`, napsáním `Y` a potvrzením `ENTER`
  - Opětovné spuštění pomocí `npm start` - například po změně v kódu serveru (nezapomeňte uložit!) nebo si pomůžete `šipkou nahoru` v terminálu pro listování příkazů z historie
- V druhém terminálu si spustíme **client**:
  - Opět se přesuneme do složky clienta  `cd .\client\`
  - Příkaz `npm install` nainstaluje všechny potřebné balíčky (React.js apod.)
  - **Client** potom spustíme stejným příkazem `npm start`
  - **Client** by se měl spustit sám v prohlížeči na adrese: http://localhost:3000/
  - Ukončit **client** potom stejnou zkratkou `CTRL + C`

## Dokumentace k API PizzaMania

- **POST** požadavky předávají parametry v JSON formátu v **Body**, většinou jde o data z formulářů
- **GET** požadavky předávají parametry, které jsou součástí URL (route)

| API | http metoda | vstup | vystup |
| --- | ----------- | ----- | ------ |
| TBD | TBD         | TBD   | TBD    |
| TBD | TBD         | TBD   | TBD    |

## Příklady JSON databází
### recipes.json

```JSON
[
  {
    "id": "REC-e6823940",
    "name": "Pizza Margherita",
    "description": "Klasická pizza",
    "procedure": "Předehřejte troubu na 220 °C...",
    "ingredients": [
      {
        "id": "ING-239e0305",
        "amount": 50
      },
      {
        "id": "ING-7ecadb7b",
        "amount": 10
      }
    ]
  },
  {
    "id": "REC-1f1ddb76",
    "name": "Pizza XXX",
    "description": "Klasická pizza",
    "procedure": "Předehřejte troubu na 220 °C...",
    "ingredients": [
      {
        "id": "ING-239e0305",
        "amount": 25
      },
      {
        "id": "ING-6ff59e25",
        "amount": 20
      }
    ]
  },
  {
    "id": "REC-63c5eb4c",
    "name": "Pizza TEST",
    "description": "Klasická pizza",
    "procedure": "Předehřejte troubu na 220 °C...",
    "ingredients": [
      {
        "id": "ING-239e0305",
        "amount": 5
      },
      {
        "id": "ING-7c09dfa1",
        "amount": 15
      },
      {
        "id": "ING-6ff59e25",
        "amount": 10
      }
    ]
  }
]
```

### ingredients.json

```JSON
[
  {
    "id": "ING-239e0305",
    "name": "Sýr",
    "unit": "g"
  },
  {
    "id": "ING-7c09dfa1",
    "name": "Rajčatový protlak",
    "unit": "ml"
  },
  {
    "id": "ING-6ff59e25",
    "name": "Šunka",
    "unit": "g"
  },
  {
    "id": "ING-7ecadb7b",
    "name": "Salám",
    "unit": "ks"
  }
]
```
