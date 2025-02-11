// APP TEXT
export const APP_TITLE = 'Sparta App';
export const APP_DESCRIPTION = 'Sparta App Description';
export const FOOTER_TEXT = `${new Date().getFullYear()}`;

export const PAGE_TITLE_HOME = 'Home';
export const PAGE_TITLE_DASHBOARD = 'Dashboard';

// UI CONSTANTS
export const FOOTER_HEIGHT = 30;
export const HEADER_HEIGHT = 60;
export const DRAWER_WIDTH = 250;

// APP THEME
export const DARK_MODE_THEME = 'dark';
export const LIGHT_MODE_THEME = 'light';

export const PORT = 3000;

//# Your test application public address
export const APP_URL = 'https://localhost:3000';

export const AUTH_AUTHORITY = 'https://ims.bentley.com';
//export const AUTH_AUTHORITY = 'https://ims.bentley.com/connect/authorize';
//export const ACCESS_TOKEN_URL = 'https://ims.bentley.com/connect/token';

//# Your application client ID and secret (Sparta)
export const AUTH_CLIENT_ID = 'spa-nmSEY4A9ShvRT6uCwoWeDlg6I';
export const AUTH_CLIENT_SCOPES = 'openid profile email itwin-platform';

export const AUTH_CLIENT_REDIRECT_URI = 'https://localhost:3000/signin-oidc';
export const AUTH_CLIENT_LOGOUT_URI = 'https://localhost:3000/signout-oidc';

//iModels

export const STATION_IMODELID = '669dde67-eb69-4e0b-bcf2-f722eee94746';
export const STATION_URI =
    'https://d143ryb2ii5d8n.cloudfront.net/48ae3f17-b614-47ca-bd15-49f07378f8f0/tileset.json?sv=2024-05-04&spr=https&se=2025-02-08T23%3A59%3A59Z&sr=c&sp=rl&sig=2uhHHr8Qzh08R%2FeSDxaE3ngZ58NI6ueEJ6afzltC50E%3D&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMTQzcnliMmlpNWQ4bi5jbG91ZGZyb250Lm5ldC80OGFlM2YxNy1iNjE0LTQ3Y2EtYmQxNS00OWYwNzM3OGY4ZjAvKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTczOTA1OTE5OX19fV19&Key-Pair-Id=K113QB06JS6XAB&Signature=UGotc0O6Kxjln71XVAfkrw1QDDCfNhlPlFvAbChVGuSvuTuYk-iDrneRoEy9SCowGA9xTEKSxz6saoD8vpbgKpVpzR5v4dK7RN3lMZWxlddjHom3-oD3YLZYqZiayIlv4r01bv-1v5w-Ug4OYe4xawYBOoCIOiV7nD71B2QX5CVoBeY-~Vjb2xs6hPnHzbmYKjWqkDdX19pIUQhjqgUZLAtVFvdHvhGRXvIJO7~DZv1vDVAzky6JHWlt7Up~P2-9~47DnegzBu50GxmhKDoCId6zO9Zhi3S6aRc0Y9RYUWO5IZL-7aNyls159wuGdpu1qArJCXhkOGv3IotkgCEPYg__';

export const OPENROADS_IMODELID = '78ce6371-e70a-45d8-b5c2-57d29a4325d8';
export const OPENROADS_TILESET_URI =
    'https://d143ryb2ii5d8n.cloudfront.net/35773d89-39cc-4532-9bda-507b75eec7fd/tileset.json?sv=2024-05-04&spr=https&se=2025-02-15T23%3A59%3A59Z&sr=c&sp=rl&sig=N8N1ce5kaZSbVA4oO4mgIq0ElZ5rytEqzzfBe9hhyys%3D&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMTQzcnliMmlpNWQ4bi5jbG91ZGZyb250Lm5ldC8zNTc3M2Q4OS0zOWNjLTQ1MzItOWJkYS01MDdiNzVlZWM3ZmQvKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTczOTY2Mzk5OX19fV19&Key-Pair-Id=K113QB06JS6XAB&Signature=rvsIrf1GFtHb9zW0edp7Zzwv2p3fUq0eC0-sKcjhyV5DDwmY4Y3byUuvvYfmASFD~XjtxqPldWNLeozcobTGuFM24fen4OTmbpISvP70ZzNad0b227ru8QFB1dqLUtFyDNMzKmc2xMFdM65G3ZRuGaUEbvzBWgjjh2HMii8mcnRPhkoNnBDJTOIPTCuMul4VJXgl77RFh0PwLYvNTQ7uhDHiTgI6Z0QJWWbQreSmpSt5lBmg0~xQQY2qfuTLjPyZKMEbxh7GBF4~LFLQNkD51KAwwNojhRyGPEmtz695~HpDFdUy2lAXw2CniYC4Q4Yd7SPhG~w3Q5uweaOFKGNg-w__';

export const NUCLEAR_IMODELID = '214753a1-6fff-4155-b8de-79a773b73c97';
export const NUCLEAR_TILESET_URI =
    'https://d143ryb2ii5d8n.cloudfront.net/50c26b29-3fd4-424c-8c7b-523bb6763626/tileset.json?sv=2024-05-04&spr=https&se=2025-02-15T23%3A59%3A59Z&sr=c&sp=rl&sig=oJpN7Z8bnGGR%2BudFE%2BEaQ1fnHeLdJRwPaXXmvAjqmDo%3D&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMTQzcnliMmlpNWQ4bi5jbG91ZGZyb250Lm5ldC81MGMyNmIyOS0zZmQ0LTQyNGMtOGM3Yi01MjNiYjY3NjM2MjYvKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTczOTY2Mzk5OX19fV19&Key-Pair-Id=K113QB06JS6XAB&Signature=Ewt42L3vnQkViroWqDrQ5KamJMt-EECO1ZL~2OCnZWJFOWH5Ly2Ur2pxfLrM3qOYUjG~f2Z8L5ntdWPvOGlw4kj49ihUHvCcBQI3Ja3efcn1FC-MwfKoqPpk6WU6gG8jc4BKPRMV6Kk7nI2J~MUdkwSVGpy5uGcisXS44aS3RX9D25j7io4p9loJcye0g4Q44BGlq8ymWj7JI6L0q-WIf9YLnzL1XPKhvquFWUX4kMyoOM7M91jkdnLTOOHHkry0SO1vDnjoLpAY8J1UMhHfkFjVZ53Q16aA94oSPNe~Kq0FLHuJgt29Ihg1AWm5Xm~I6v9Z6GtOzoKtgPyDKJIVDA__';

export const NOVO_TILESET_URI =
    'https://d143ryb2ii5d8n.cloudfront.net/30cff62f-c03f-4546-8218-19654507b6a3/tileset.json?sv=2024-05-04&spr=https&se=2025-02-15T23%3A59%3A59Z&sr=c&sp=rl&sig=qgNsCAiPHFz%2B1CLJBdJ1YiZwLS1TVpiWr8Bw02kSfpo%3D&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMTQzcnliMmlpNWQ4bi5jbG91ZGZyb250Lm5ldC8zMGNmZjYyZi1jMDNmLTQ1NDYtODIxOC0xOTY1NDUwN2I2YTMvKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTczOTY2Mzk5OX19fV19&Key-Pair-Id=K113QB06JS6XAB&Signature=Dg7aE1QgipXxKnASzQae5w7ExEbMQ-bhW8aVQClZwB3U2JDP9ZyOThjkYabSuiIxBBacJlPfAdkBbpB1S8gpgfuQu8fKG2be4740vkmf8C4aKCwe5lJVqltKvqghSVox6gNvqPseOmNxO5I~H83xzlWwIJr5DPzUlIuRDDFHuCwyk1jVA4YKApr9wN9P6-T3CP6o27u3yW2j~8~hINKGqZZ4C2aY0655saqe1P3J~PnjrYMkkS2BTZX4jyq84NyrvVEIv7B8~QNLvFSgR6U2599PRMMf47EnrFSjmf7lztGtwbdHDVgOt2Si9S8rKb29CdVr1j9iePZLnnWpElRPOw__';

export const CESIUM_TOKEN_URI = 'https://api.cesium.com/itwin/token';
