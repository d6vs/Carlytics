import requests
import os
import time

brands = {
    'Maruti Suzuki': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Suzuki_Swift_1.2_Dualjet_Hybrid_Comfort_%28VI%2C_Facelift%29_%E2%80%93_f_14052021.jpg/640px-Suzuki_Swift_1.2_Dualjet_Hybrid_Comfort_%28VI%2C_Facelift%29_%E2%80%93_f_14052021.jpg',
    'Hyundai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/2020_Hyundai_i20_Premium_MHEV_1.0_Front.jpg/640px-2020_Hyundai_i20_Premium_MHEV_1.0_Front.jpg',
    'Honda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/2020_Honda_City_1.0_RS_Turbo_%28GN1%29_Front.jpg/640px-2020_Honda_City_1.0_RS_Turbo_%28GN1%29_Front.jpg',
    'Tata': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Tata_Nexon_at_Geneva_Motor_Show_2017.jpg/640px-Tata_Nexon_at_Geneva_Motor_Show_2017.jpg',
    'Mahindra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/2022_Mahindra_Scorpio-N_Z8L.jpg/640px-2022_Mahindra_Scorpio-N_Z8L.jpg',
    'Toyota': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Toyota_Innova_Crysta_2.4_V.jpg/640px-Toyota_Innova_Crysta_2.4_V.jpg',
    'Ford': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/2018_Ford_EcoSport_ST-Line_1.0.jpg/640px-2018_Ford_EcoSport_ST-Line_1.0.jpg',
    'Renault': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/2018_Renault_Kwid_%281%29.jpg/640px-2018_Renault_Kwid_%281%29.jpg',
    'Volkswagen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Volkswagen_Polo_Highline_1.2_TSI_%286C%29_%E2%80%93_Frontansicht%2C_8._Juni_2014%2C_Ratingen.jpg/640px-Volkswagen_Polo_Highline_1.2_TSI_%286C%29_%E2%80%93_Frontansicht%2C_8._Juni_2014%2C_Ratingen.jpg',
    'Kia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Kia_Seltos_SP2_%282020%29_Front_1.jpg/640px-Kia_Seltos_SP2_%282020%29_Front_1.jpg',
    'Nissan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/2021_Nissan_Magnite_Premium.jpg/640px-2021_Nissan_Magnite_Premium.jpg',
    'Skoda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Skoda_Slavia_Ambition_1.0_TSI_%28cropped%29.jpg/640px-Skoda_Slavia_Ambition_1.0_TSI_%28cropped%29.jpg'
}

os.makedirs('public/assets/makes', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

for brand, url in brands.items():
    try:
        img = requests.get(url, headers=headers).content
        with open(f"public/assets/makes/{brand.replace(' ', '_')}.jpg", 'wb') as f:
            f.write(img)
        print(f'Downloaded {brand}')
        time.sleep(0.5)
    except Exception as e:
        print(f'Error {brand}: {e}')
