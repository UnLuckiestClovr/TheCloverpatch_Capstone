import pymongo, json, uuid

from datetime import datetime
from pymongo import ReturnDocument
from models.apimodels import *


MongoClient = pymongo.MongoClient("mongodb://localhost:11002/") # Test Connection, Change to Containerized Connection string upon Deployment

objDatabase = MongoClient["CloverpatchProducts"]
foodColl = objDatabase["Food"]
drinkColl = objDatabase["Drink"]
dessertColl = objDatabase["Dessert"]

def FetchAll_Food_NonAdult():
    try:
        documents = foodColl.find({'IDRequired': False})

        food = [{key: value for key, value in document.items()} for document in documents]

        return {
            'success': True,
            'message': 'Fetch of Non-Adult Food Items Successful!',
            'food': json.dumps(food, default=str)
        }
    except Exception as e:
        return {
            'success': False,
            'message': f'We Ran Into an Issue while grabbing a list of Food : {e}'
        }


def Fetch_Food_Adult():
    try:
        documents = foodColl.find({'IDRequired': True})

        food = [{key: value for key, value in document.items()} for document in documents]

        return {
            'success': True,
            'message': 'Fetch of Adult Food Items Successful!',
            'food': json.dumps(food, default=str)
        }
    except Exception as e:
        return {
            'success': False,
            'message': f'We Ran Into an Issue while grabbing a list of Adult Food : {e}'
        }


def FetchAll_Drinks_NonAdult():
    try:
        documents = drinkColl.find({'IDRequired': False})

        drinks = [{key: value for key, value in document.items()} for document in documents]

        return {
            'success': True,
            'message': 'Fetch of Non-Adult Drink Items Successful!',
            'drinks': json.dumps(drinks, default=str)
        }
    except Exception as e:
        return {
            'success': False,
            'message': f'We Ran Into an Issue while grabbing a list of Drinks : {e}'
        }


def Fetch_Drinks_Adult():
    try:
        documents = drinkColl.find({'IDRequired': True})

        drinks = [{key: value for key, value in document.items()} for document in documents]

        return {
            'success': True,
            'message': 'Fetch of Adult Drink Items Successful!',
            'drinks': json.dumps(drinks, default=str)
        }
    except Exception as e:
        return {
            'success': False,
            'message': f'We Ran Into an Issue while grabbing a list of Adult Drinks : {e}'
        }


def Fetch_Food_ByID(id: str):
    try:
        document = foodColl.find_one({'_id': id})

        if (document != None):
            return {
                'success': True,
                'message': f'Fetching of Food Item {id} Successful!',
                'fooditem': json.dumps(document, default=str)
            }
        else:
            return {
                'success': False,
                'message': f'Fetching of Food Item {id} Unsuccessful!'
            }
    except Exception as e:
        return {
            'success': False,
            'message': f'We Ran Into an Issue while grabbing a Food Item : {e}'
        }


def Fetch_Drink_ByID(id: str):
    try:
        document = drinkColl.find_one({'_id': id})

        if (document != None):
            return {
                'success': True,
                'message': f'Fetching of Drink Item {id} Successful!',
                'fooditem': json.dumps(document, default=str)
            }
        else:
            return {
                'success': False,
                'message': f'Fetching of Drink Item {id} Unsuccessful!'
            }
    except Exception as e:
        return {
            'success': False,
            'message': f'We Ran Into an Issue while grabbing a Drink Item : {e}'
        }