import redis, json, uuid, traceback

from models.apimodels import *

rConnPool = redis.ConnectionPool(host='CloverpatchBasketDatabase', port=6379)


def changeItemQuantity(BID: str, QUANT: int, type: str, iid: str):
    try:

        # Replace '-' with '_' in the BID; Redis doesn't like the '-' character
        redisBID = BID.__str__().replace('-', '_')
        rConn = redis.Redis(connection_pool=rConnPool) # Connect to Redis Database

        # Get Items from the Database
        items_json = rConn.lrange(f'{redisBID}:{type}', 0, -1)

        # Deserialize items from JSON
        items = [json.loads(item) for item in items_json]
        print(items)

        # Step 2: Find and update the item quantity and price
        for item in items:
            print(item)
            if item['IID'] == iid:
                item['Price'] = (item['Price']/item['Quantity']) * QUANT  # Update the total price
                item['Quantity'] = QUANT
                break
        else:
            return {
                "success": False,
                "message": "Item not found in the basket."
            }

        # Step 3: Save the updated items back to Redis
        rConn.delete(f'{redisBID}:{type}')  # Clear the old list
        for item in items:
            rConn.rpush(f'{redisBID}:{type}', json.dumps(item))  # Push updated items back

        return {
            "success": True,
            "message": "Item quantity updated successfully."
        }

            
    except redis.ConnectionError as e:
        return {
            "success": False,
            "message": f"Error connecting to Redis: {e}"
        }
    except Exception as e:
        traceback.print_exception(e)
        return {
            "success": False,
            "message": f"An error occurred: {e}"
        }


def check_BasketExists(BID: str):
    try:
        rConn = redis.Redis(connection_pool=rConnPool, decode_responses=True) # Connect to Redis Database
        BASKET_EXISTS = rConn.exists(BID)

        return (BASKET_EXISTS == 1)
    except redis.ConnectionError as e:
        return {
            "success": False,
            "message": f"Error connecting to Redis: {e}"
        }
    except Exception as e:
        traceback.print_exception(e)
        return {
            "success": False,
            "message": f"An error occurred: {e}"
        }


def addItemToBasket(BID: str, item, type: str):  # BID is Basket ID, this will be the User's ID as it reduces need for extra data storage and saves load time.
    try:
        # Replace '-' with '_' in the BID; Redis doesn't like the '-' character
        redisBID = BID.__str__().replace('-', '_')

        rConn = redis.Redis(connection_pool=rConnPool) # Connect to Redis Database

        # Retrieve current items in the basket
        items_json = rConn.lrange(f'{redisBID}:{type}', 0, -1)

        if (type == "Flowers"):
            items = [Item.parse_raw(item) for item in items_json]
        elif (type == "Food"):
            items = [FoodItem.parse_raw(item) for item in items_json]

        print(f"Current Items: {items}")

        # Check if the item already exists
        existing_item = next((i for i in items if i.IID == item.IID), None)

        if existing_item:
            print(f"Already Existing Item: {existing_item.json()}")

            # Update the quantity of the existing item
            existing_item.Quantity += item.Quantity
            existing_item.Price += item.Price

            print(f"Updated Item: {existing_item.json()}")

            # Update the basket in Redis
            rConn.delete(f'{redisBID}:{type}')  # Clear existing items
            for it in items:
                rConn.rpush(f'{redisBID}:{type}', it.json())
            # rConn.rpush(f'{redisBID}:Items', existing_item.json())
        else:
            # Add the new item to the basket
            rConn.rpush(f'{redisBID}:{type}', item.json())


        return {
            'success' : True,
            'message' : f'Item added to {redisBID} Successfully',
            'basketId': f'{redisBID}'
        }
    except redis.ConnectionError as e:
        return {
            "success": False,
            "message": f"Error connecting to Redis: {e}"
        }
    except Exception as e:
        traceback.print_exception(e)
        return {
            "success": False,
            "message": f"An error occurred: {e}"
        }


# Retrieves the List of Items from the Basket
def getAllBaskets(BID: str):
    try:
        redisBID = BID.__str__().replace('-', '_')

        rConn = redis.Redis(connection_pool=rConnPool)

        # Get all elements from the list
        flower_strings = rConn.lrange(f'{redisBID}:Flowers', 0, rConn.llen(f'{redisBID}:Flowers'))
        food_strings = rConn.lrange(f'{redisBID}:Food', 0, rConn.llen(f'{redisBID}:Food'))

        print(flower_strings)
        print(food_strings)

        # Get Flower Basket
        flowers = []
        for json_str in flower_strings:
            print(json_str)
            item_dict = json.loads(json_str.decode('utf-8'))
            item = Item(**item_dict)
            flowers.append(item)

        # Get Food Basket
        food = []
        for json_str in food_strings:
            print(json_str)
            item_dict = json.loads(json_str.decode('utf-8'))
            item = FoodItem(**item_dict)
            food.append(item)

        return {
            "success": True,
            "message": f'Successful Grab from {redisBID}',
            "flowers": flowers,
            "food": food
        }
    except redis.ConnectionError as e:
        return {
            "success": False,
            "message": f"Error connecting to Redis: {e}"
        }
    except Exception as e:
        traceback.print_exception(e)
        return {
            "success": False,
            "message": f"An error occurred: {e}"
        }


def deleteItemFromBasket(BID: str, IID: str, type: str):
    try:
        redisBID = BID.__str__().replace('-', '_')

        rConn = redis.Redis(connection_pool=rConnPool)

        basketSTR = f'{redisBID}:{type}'

        # Get all elements from the list
        items = rConn.lrange(basketSTR, 0, rConn.llen(basketSTR))



        if items:
            # Decode to Python Dicts
            itemsDecoded = [item.decode('utf-8') for item in items]

            itemObjects = [json.loads(item) for item in itemsDecoded]

            #iterate through list to find then remove the item by checking item IID
            updatedItemObjects = [item for item in itemObjects if item.get('IID') != IID]

            if len(itemObjects) == len(updatedItemObjects):
                return {
                    "success": False,
                    "message": f"Could not find Item of IID : {IID}"
                }
            elif len(itemObjects) != len(updatedItemObjects):
                #encode back into strings for redis to use
                updatedItems = [json.dumps(item) for item in updatedItemObjects]

                #update redis data
                rConn.delete(f'{redisBID}:{type}')

                if (updatedItems.__len__() > 0):
                    rConn.rpush(f'{redisBID}:{type}', *updatedItems)

                return {
                    "success": True,
                    "message": f"\'{redisBID}\' updated successfully"
                }
        else:
            return {
                "success" : False,
                "message" : f"Could not find Basket of UID : {BID}"
            }
    except redis.ConnectionError as e:
        return {
            "success": False,
            "message": f"Error connecting to Redis: {e}"
        }
    except Exception as e:
        traceback.print_exception(e)
        return {
            "success": False,
            "message": f"An error occurred: {e}"
        }


def ClearBasket(BID: str, type: str):
    try:
        BID = BID.__str__().replace('-', '_')
        redisBID = f"{BID}"

        rConn = redis.Redis(connection_pool=rConnPool)
        rConn.delete(f'{redisBID}:{type}')
        return {
            "success" : True,
            "message" : f"Successful Deletion of {redisBID}"
        }
    except redis.ConnectionError as e:
        return {
            "success": False,
            "message": f"Error connecting to Redis: {e}"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"An error occurred: {e}"
        }