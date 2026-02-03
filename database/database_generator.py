import csv
import numpy as np
import requests
import json
from bs4 import BeautifulSoup
import random


OK = 0
HTTP_ERROR = 1
NOT_JSON = 2
PRODUCT_NOT_FOUND = 3
EMPTY_RESPONSE = 4
REQUEST_EXCEPTION = 5

def main():
    links = []
    prices = []
    departments = []

    ##get the UPC codes
    with open('./upccodes.csv', newline='') as csvfile:
       reader = csv.reader(csvfile)
       for row in reader:
          links.append(row[0])
         
    ##get the prices and item department
    with open('./smaller_dataset.csv', newline='') as csvfile:
        reader=csv.reader(csvfile)
        next(reader)
        for row in reader:
            prices.append(row[11])
            departments.append(row[3])
    
    ##generate new csv file
    with open('genai_dataset.csv', 'w', newline='') as csvfile:
        fieldnames = ['utc', 'product_name', 'department', 'price', 'quantity', 'ingredients', 'allergens', 'categories', 'labels', 'nutriscore', 'nova_group', 'diet_tags']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

        ## for each UPC code, fetch the data, also move along price and department vectors
        ##add the info to the CSV
        for upc,price,department in zip(links,prices,departments):

            product, err = get_json(upc)
            if err != OK:
                print(f"Skipping UPC {upc}, error code {err}")
                continue

            writer.writerow(({
                'utc': upc,
                'product_name': product.get("name"),
                'department': department,
                'price': price,
                'quantity': random.randint(5, 10),
                'ingredients': product.get("ingredients"),
                'allergens': product.get("allergens"),
                'categories': product.get("categories"),
                'labels': product.get("labels"),
                'nutriscore': product.get("nutriscore"),
                'nova_group': product.get("nova_group"),
                'diet_tags': product.get("diet_tags"),
                }))

## retrive information from OpenFoodFacts API using UPC codes
def get_json(upc):

    api_url = "https://world.openfoodfacts.org/api/v2/product/" + upc ## + ".json" 
    print(api_url)
    params = {
        'app_name': 'SASH',
        'app_version': '1.1',
        'app_uuid': 'xxxx',
        'fields': (
            "product_name,"
            "categories,"
            "labels,"
            "nutrition_grade_fr,"
            "ingredients_text,"
            "nova_group,"
            "allergens,allergens_tags,"
            "ingredients_analysis_tags"
        )
    }

    headers = {"User-Agent": "SASH/1.1"}

    try:
        response = requests.get(api_url, params=params, headers=headers, timeout=10)
    except requests.RequestException:
        return None, REQUEST_EXCEPTION

    if response.status_code != 200:
        return None, HTTP_ERROR

    if not response.text.strip():
        return None, EMPTY_RESPONSE

    try:
        data = response.json()
    except ValueError:
        return None, NOT_JSON

    if data.get("status") != 1:
        return None, PRODUCT_NOT_FOUND

    ## Save the information into product data
    p = data.get("product", {})
    return{
        "name": p.get("product_name"),
        "categories": p.get("categories"),
        "labels": p.get("labels"),
        "nutriscore": p.get("nutrition_grade_fr"),  # a–e
        "nova_group": p.get("nova_group"),          # 1–4
        "ingredients": p.get("ingredients_text"),
        "allergens": p.get("allergens"),
        "allergen_tags": p.get("allergens_tags"),
        "diet_tags": p.get("ingredients_analysis_tags")
    }, OK
    
if __name__ == "__main__": main()