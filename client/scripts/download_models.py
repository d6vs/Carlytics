import requests
import os

models = {
    'Swift': 'Suzuki_Swift',
    'Baleno': 'Suzuki_Baleno',
    'Wagon R': 'Suzuki_Wagon_R',
    'Dzire': 'Suzuki_Dzire',
    'Alto 800': 'Maruti_Alto',
    'Vitara Brezza': 'Suzuki_Vitara_Brezza',
    'Celerio': 'Suzuki_Celerio',
    'Ertiga': 'Suzuki_Ertiga',
    'S-Presso': 'Suzuki_S-Presso',
    'Ignis': 'Suzuki_Ignis',
    'Eeco': 'Suzuki_Eeco',
    'XL6': 'Suzuki_XL6'
}

os.makedirs('public/assets/models', exist_ok=True)

for model, wiki in models.items():
    try:
        headers = {'User-Agent': 'CarlyticsBot/1.0 (test@example.com)'}
        res = requests.get(f'https://en.wikipedia.org/api/rest_v1/page/summary/{wiki}', headers=headers).json()
        if 'thumbnail' in res:
            img = requests.get(res['thumbnail']['source'].replace('320px', '640px'), headers=headers).content
            with open(f"public/assets/models/{model.replace(' ', '_')}.jpg", 'wb') as f:
                f.write(img)
            print(f'Downloaded {model}')
        else:
            print(f'No thumbnail for {model}')
    except Exception as e:
        print(f'Error {model}: {e}')
